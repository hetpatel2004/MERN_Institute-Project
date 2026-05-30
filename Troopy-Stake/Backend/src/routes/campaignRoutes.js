const express = require("express");
const Campaign = require("../models/Campaign");
const Lead = require("../models/Lead");
const Counsellor = require("../models/Counsellor");
const Admission = require("../models/Admission");
const Branch = require("../models/Branch");
const Institute = require("../models/Institute");

const router = express.Router();

// ─── GET /stats ────────────────────────────────────────────────────────────
router.get("/stats", async (req, res) => {
  try {
    const campaigns = await Campaign.find();
    const total = campaigns.length;
    const active = campaigns.filter((c) => c.status === "Active").length;
    const completed = campaigns.filter((c) => c.status === "Completed").length;
    const paused = campaigns.filter((c) => c.status === "Paused").length;

    const campaignIds = campaigns.map((c) => c._id);

    const leads = await Lead.find({ campaignId: { $in: campaignIds } });
    const totalLeads = leads.length;
    const interestedLeads = leads.filter(
      (l) => l.status === "Interested" || l.status === "Follow-up" || l.status === "Admitted" || l.status === "Converted"
    ).length;
    const followUpLeads = leads.filter((l) => l.status === "Follow-up").length;

    const admittedLeadIds = leads
      .filter((l) => l.status === "Converted" || l.status === "Admitted")
      .map((l) => l._id);

    const admissions = await Admission.find({ leadId: { $in: admittedLeadIds } });
    const totalAdmissions = admissions.length;

    const conversionRate = totalLeads > 0 ? ((totalAdmissions / totalLeads) * 100).toFixed(1) : 0;

    const totalCampaignCost = campaigns.reduce((sum, c) => sum + (c.budget || 0), 0);
    const totalRevenue = admissions.reduce((sum, a) => sum + (a.paidAmount || 0), 0);
    const profitLoss = totalRevenue - totalCampaignCost;

    res.json({
      total,
      active,
      completed,
      paused,
      totalLeads,
      interestedLeads,
      followUpLeads,
      totalAdmissions,
      conversionRate,
      totalCampaignCost,
      totalRevenue,
      profitLoss,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to load campaign stats", error: error.message });
  }
});

// ─── GET /analytics ─────────────────────────────────────────────────────────
router.get("/analytics", async (req, res) => {
  try {
    const campaigns = await Campaign.find().sort({ createdAt: -1 });

    const leadsPerCampaign = [];
    const conversionRates = [];
    const revenueVsCost = [];
    const performanceData = [];

    for (const campaign of campaigns) {
      const leads = await Lead.find({ campaignId: campaign._id });
      const totalLeads = leads.length;
      const convertedOrAdmitted = leads.filter(
        (l) => l.status === "Converted" || l.status === "Admitted"
      );
      const admittedLeadIds = convertedOrAdmitted.map((l) => l._id);

      const admissions = await Admission.find({ leadId: { $in: admittedLeadIds } });
      const admissionCount = admissions.length;
      const revenue = admissions.reduce((sum, a) => sum + (a.paidAmount || 0), 0);
      const conversionRate = totalLeads > 0 ? +((admissionCount / totalLeads) * 100).toFixed(1) : 0;
      const profitLoss = revenue - (campaign.budget || 0);

      leadsPerCampaign.push({ name: campaign.name, leads: totalLeads });
      conversionRates.push({ name: campaign.name, rate: conversionRate, admissions: admissionCount });
      revenueVsCost.push({
        name: campaign.name,
        revenue,
        cost: campaign.budget || 0,
        profitLoss,
      });
      performanceData.push({
        name: campaign.name,
        leads: totalLeads,
        admissions: admissionCount,
        revenue,
        cost: campaign.budget || 0,
        conversionRate,
        profitLoss,
      });
    }

    res.json({ leadsPerCampaign, conversionRates, revenueVsCost, performanceData });
  } catch (error) {
    res.status(500).json({ message: "Failed to load analytics", error: error.message });
  }
});

// ─── GET / (paginated + filtered) ───────────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      type,
      instituteId,
      branchId,
      counsellorId,
      status,
      dateFrom,
      dateTo,
      search,
    } = req.query;

    const filter = {};

    if (type) filter.type = type;
    if (instituteId) filter.instituteId = instituteId;
    if (branchId) filter.branchId = branchId;
    if (counsellorId) filter.counsellorId = counsellorId;
    if (status) filter.status = status;
    if (dateFrom || dateTo) {
      filter.startDate = {};
      if (dateFrom) filter.startDate.$gte = new Date(dateFrom);
      if (dateTo) filter.startDate.$lte = new Date(dateTo);
    }
    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    const skip = (page - 1) * limit;
    const total = await Campaign.countDocuments(filter);
    const campaigns = await Campaign.find(filter)
      .populate("instituteId", "name")
      .populate("branchId", "branchName")
      .populate("counsellorId", "name email phone")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    // Enrich each campaign with computed stats
    const enriched = await Promise.all(
      campaigns.map(async (campaign) => {
        const leads = await Lead.find({ campaignId: campaign._id });
        const totalLeads = leads.length;
        const interestedLeads = leads.filter(
          (l) => l.status === "Interested" || l.status === "Follow-up" || l.status === "Admitted" || l.status === "Converted"
        ).length;
        const followUpLeads = leads.filter((l) => l.status === "Follow-up").length;

        const convertedOrAdmitted = leads.filter(
          (l) => l.status === "Converted" || l.status === "Admitted"
        );
        const admittedLeadIds = convertedOrAdmitted.map((l) => l._id);
        const admissions = await Admission.find({ leadId: { $in: admittedLeadIds } });
        const admissionCount = admissions.length;
        const conversionRate = totalLeads > 0 ? +((admissionCount / totalLeads) * 100).toFixed(1) : 0;
        const revenue = admissions.reduce((sum, a) => sum + (a.paidAmount || 0), 0);
        const profitLoss = revenue - (campaign.budget || 0);

        return {
          ...campaign.toObject(),
          totalLeads,
          interestedLeads,
          followUpLeads,
          admissions: admissionCount,
          conversionRate,
          revenueGenerated: revenue,
          profitLoss,
        };
      })
    );

    res.json({
      campaigns: enriched,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch campaigns", error: error.message });
  }
});

// ─── GET /:id ───────────────────────────────────────────────────────────────
router.get("/:id", async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id)
      .populate("instituteId", "name")
      .populate("branchId", "branchName")
      .populate("counsellorId", "name email phone profileImage");

    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    // Get linked leads
    const leads = await Lead.find({ campaignId: campaign._id }).sort({ createdAt: -1 });

    // Get admissions from converted leads
    const convertedLeadIds = leads
      .filter((l) => l.status === "Converted" || l.status === "Admitted")
      .map((l) => l._id);
    const admissions = await Admission.find({ leadId: { $in: convertedLeadIds } }).sort({ createdAt: -1 });

    // Compute stats
    const totalLeads = leads.length;
    const interestedLeads = leads.filter(
      (l) => l.status === "Interested" || l.status === "Follow-up" || l.status === "Admitted" || l.status === "Converted"
    ).length;
    const followUpLeads = leads.filter((l) => l.status === "Follow-up").length;
    const admissionCount = admissions.length;
    const conversionRate = totalLeads > 0 ? +((admissionCount / totalLeads) * 100).toFixed(1) : 0;
    const revenue = admissions.reduce((sum, a) => sum + (a.paidAmount || 0), 0);
    const profitLoss = revenue - (campaign.budget || 0);

    // Timeline: combine lead creation, status changes, and admission dates
    const timeline = [
      ...leads.map((l) => ({
        type: "lead",
        date: l.createdAt,
        label: `Lead created: ${l.studentName}`,
        detail: l.status,
      })),
      ...admissions.map((a) => ({
        type: "admission",
        date: a.createdAt,
        label: `Admission: ${a.studentName}`,
        detail: `₹${a.paidAmount || 0} paid`,
      })),
    ].sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json({
      campaign,
      leads,
      admissions,
      stats: {
        totalLeads,
        interestedLeads,
        followUpLeads,
        admissions: admissionCount,
        conversionRate,
        revenueGenerated: revenue,
        profitLoss,
      },
      timeline,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch campaign details", error: error.message });
  }
});

// ─── POST / ─────────────────────────────────────────────────────────────────
router.post("/", async (req, res) => {
  try {
    const campaign = await Campaign.create(req.body);
    res.status(201).json(campaign);
  } catch (error) {
    res.status(400).json({ message: "Failed to create campaign", error: error.message });
  }
});

// ─── PUT /:id ───────────────────────────────────────────────────────────────
router.put("/:id", async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }
    res.json(campaign);
  } catch (error) {
    res.status(400).json({ message: "Failed to update campaign", error: error.message });
  }
});

// ─── DELETE /:id ────────────────────────────────────────────────────────────
router.delete("/:id", async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndDelete(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }
    // Unlink leads from this campaign
    await Lead.updateMany({ campaignId: campaign._id }, { $set: { campaignId: null } });
    res.json({ message: "Campaign deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete campaign", error: error.message });
  }
});

module.exports = router;
