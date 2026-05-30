const Institute = require("../models/Institute");
const Branch = require("../models/Branch");
const BaseService = require("./baseService");

class InstituteService extends BaseService {
  constructor() {
    super(Institute);
  }

  async getEnrichedInstitutes(filter = {}, options = {}) {
    const result = await this.getAll(filter, options);

    const enriched = await Promise.all(
      result.data.map(async (inst) => {
        const [totalBranches, totalStudents, totalAdmissions, totalRevenue] =
          await Promise.all([
            Branch.countDocuments({ instituteId: inst._id, status: "Active" }),
            this._countModel("Student", { institute_id: inst._id }),
            this._countModel("Admission", { instituteId: inst._id }),
            this._sumRevenue(inst._id),
          ]);

        return {
          ...inst.toObject(),
          totalBranches,
          totalStudents,
          totalAdmissions,
          totalRevenue,
        };
      })
    );

    return { ...result, data: enriched };
  }

  async getStats() {
    const [totalInstitutes, totalBranches, totalStudents, totalAdmissions] =
      await Promise.all([
        Institute.countDocuments(),
        Branch.countDocuments(),
        this._countModel("Student", {}),
        this._countModel("Admission", {}),
      ]);

    let totalRevenue = 0;
    try {
      const Admission = require("../models/Admission");
      const rev = await Admission.aggregate([
        { $group: { _id: null, total: { $sum: "$paidAmount" } } },
      ]);
      totalRevenue = rev.length > 0 ? rev[0].total : 0;
    } catch {}

    return {
      totalInstitutes,
      totalBranches,
      totalStudents,
      totalAdmissions,
      totalRevenue,
    };
  }

  async _countModel(name, filter) {
    try {
      const Model = require(`../models/${name}`);
      return await Model.countDocuments(filter);
    } catch {
      return 0;
    }
  }

  async _sumRevenue(instituteId) {
    try {
      const Admission = require("../models/Admission");
      const rev = await Admission.aggregate([
        { $match: { instituteId: require("mongoose").Types.ObjectId.createFromHexString(instituteId) } },
        { $group: { _id: null, total: { $sum: "$paidAmount" } } },
      ]);
      return rev.length > 0 ? rev[0].total : 0;
    } catch {
      return 0;
    }
  }
}

module.exports = new InstituteService();
