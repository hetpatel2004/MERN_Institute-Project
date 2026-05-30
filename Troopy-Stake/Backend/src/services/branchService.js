const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Branch = require("../models/Branch");
const BaseService = require("./baseService");
const ApiError = require("../utils/ApiError");

class BranchService extends BaseService {
  constructor() {
    super(Branch);
  }

  async getEnrichedBranches(filter = {}, options = {}) {
    const result = await this.getAll(filter, {
      ...options,
      populate: ["instituteId", "adminId"],
    });

    const enriched = await Promise.all(
      result.data.map(async (branch) => {
        const [studentCount, admissionCount, leadCount, counsellorCount] =
          await Promise.all([
            this._countModel("Student", { branch_id: branch._id }),
            this._countModel("Admission", { branchId: branch._id }),
            this._countModel("Lead", { branchId: branch._id }),
            this._countModel("Counsellor", { branch: branch._id }),
          ]);

        return {
          ...branch.toObject(),
          studentCount,
          admissionCount,
          leadCount,
          counsellorCount,
        };
      })
    );

    return { ...result, data: enriched };
  }

  async createWithAdmin(data) {
    const { adminName, adminEmail, adminPhone, adminPassword, ...branchData } =
      data;

    if (branchData.branchCode) {
      const existing = await Branch.findOne({ branchCode: branchData.branchCode });
      if (existing) throw ApiError.conflict("Branch code already exists");
    }

    if (adminEmail) {
      const existingUser = await User.findOne({
        email: adminEmail.toLowerCase(),
      });
      if (existingUser) throw ApiError.conflict("Admin email already exists");
    }

    let adminId = null;
    if (adminName && adminEmail && adminPassword) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      const adminUser = await User.create({
        name: adminName,
        email: adminEmail.toLowerCase(),
        phone: adminPhone || "",
        password: hashedPassword,
        role: "branchadmin",
        institute_id: branchData.instituteId,
        status: "Active",
      });
      adminId = adminUser._id;
    }

    const branch = await Branch.create({ ...branchData, adminId });

    if (adminId) {
      await User.findByIdAndUpdate(adminId, { branch_id: branch._id });
    }

    return Branch.findById(branch._id)
      .populate("instituteId", "name code city")
      .populate("adminId", "name email phone status");
  }

  async _countModel(name, filter) {
    try {
      const Model = require(`../models/${name}`);
      return await Model.countDocuments(filter);
    } catch {
      return 0;
    }
  }
}

module.exports = new BranchService();
