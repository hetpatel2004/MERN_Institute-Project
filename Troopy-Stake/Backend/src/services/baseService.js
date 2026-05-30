const ApiError = require("../utils/ApiError");

class BaseService {
  constructor(model) {
    this.model = model;
  }

  async getAll(filter = {}, options = {}) {
    const { page = 1, limit = 20, sort = { createdAt: -1 }, populate } = options;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.model.find(filter).sort(sort).skip(skip).limit(limit).populate(populate),
      this.model.countDocuments(filter),
    ]);

    return {
      data,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  async getById(id, populateFields) {
    const query = this.model.findById(id);
    if (populateFields) query.populate(populateFields);
    const doc = await query;
    if (!doc) throw ApiError.notFound(`${this.model.modelName} not found`);
    return doc;
  }

  async create(data) {
    return this.model.create(data);
  }

  async update(id, data, populateFields) {
    const doc = await this.model.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!doc) throw ApiError.notFound(`${this.model.modelName} not found`);
    if (populateFields) await doc.populate(populateFields);
    return doc;
  }

  async delete(id) {
    const doc = await this.model.findById(id);
    if (!doc) throw ApiError.notFound(`${this.model.modelName} not found`);
    await this.model.findByIdAndDelete(id);
    return doc;
  }
}

module.exports = BaseService;
