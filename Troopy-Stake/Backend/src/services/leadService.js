const Lead = require("../models/Lead");
const FollowUp = require("../models/FollowUp");
const BaseService = require("./baseService");

class LeadService extends BaseService {
  constructor() {
    super(Lead);
  }

  async createWithFollowUp(data) {
    const lead = await Lead.create(data);

    if (data.followUpDate) {
      await FollowUp.create({
        title: `Follow-up for ${data.studentName}`,
        description: data.notes || "",
        relatedType: "Lead",
        relatedId: lead._id,
        userName: data.studentName,
        userEmail: data.email,
        status: "Pending",
        followUpDate: new Date(data.followUpDate),
        priority: data.priority || "Medium",
        createdBy: data.counsellor || "System",
      });
    }

    return lead;
  }

  async updateWithFollowUp(id, data) {
    const lead = await Lead.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!lead) return null;

    if (data.followUpDate) {
      const existing = await FollowUp.findOne({
        relatedType: "Lead",
        relatedId: id,
      });

      if (existing) {
        await FollowUp.findByIdAndUpdate(existing._id, {
          followUpDate: new Date(data.followUpDate),
          status: "Pending",
          priority: data.priority || "Medium",
        });
      } else {
        await FollowUp.create({
          title: `Follow-up for ${lead.studentName}`,
          description: data.notes || "",
          relatedType: "Lead",
          relatedId: lead._id,
          userName: lead.studentName,
          userEmail: lead.email,
          status: "Pending",
          followUpDate: new Date(data.followUpDate),
          priority: data.priority || "Medium",
          createdBy: data.counsellor || "System",
        });
      }
    }

    return lead;
  }
}

module.exports = new LeadService();
