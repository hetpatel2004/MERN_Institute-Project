import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Plus,
  Trash2,
  Edit,
  RefreshCcw,
  BookOpen,
  Search,
  BadgeIndianRupee,
} from "lucide-react";

function AdminCourses() {
  const emptyFaq = {
    question: "",
    answer: "",
  };

  const emptyReview = {
    name: "",
    review: "",
  };

  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    category_name: "",
    title: "",
    slug: "",
    type: "online",
    status: "draft",
    duration_value: "",
    duration_unit: "month",
    short_description: "",
    description: "",
    goals: [""],
    faqs: [{ ...emptyFaq }],
    reviews: [{ ...emptyReview }],
    certificate_enabled: true,
    base_price: "",
    registration_fee: "",
    emi_allowed: true,
    default_emi_months: "",
    min_monthly_emi: "",
    max_discount_percent: "",
    tax_percentage: "",
    max_installments: "",
  });

  const getCourses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/courses");
      setCourses(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCourses();
  }, []);

  const createSlug = (value) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "title") {
      setFormData({
        ...formData,
        title: value,
        slug: createSlug(value),
      });
      return;
    }

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleGoalChange = (index, value) => {
    const updatedGoals = [...formData.goals];
    updatedGoals[index] = value;

    setFormData({
      ...formData,
      goals: updatedGoals,
    });
  };

  const addGoal = () => {
    setFormData({
      ...formData,
      goals: [...formData.goals, ""],
    });
  };

  const removeGoal = (index) => {
    const updatedGoals = formData.goals.filter((_, i) => i !== index);

    setFormData({
      ...formData,
      goals: updatedGoals.length > 0 ? updatedGoals : [""],
    });
  };

  const handleFaqChange = (index, field, value) => {
    const updatedFaqs = [...formData.faqs];
    updatedFaqs[index][field] = value;

    setFormData({
      ...formData,
      faqs: updatedFaqs,
    });
  };

  const addFaq = () => {
    setFormData({
      ...formData,
      faqs: [...formData.faqs, { ...emptyFaq }],
    });
  };

  const removeFaq = (index) => {
    const updatedFaqs = formData.faqs.filter((_, i) => i !== index);

    setFormData({
      ...formData,
      faqs: updatedFaqs.length > 0 ? updatedFaqs : [{ ...emptyFaq }],
    });
  };

  const handleReviewChange = (index, field, value) => {
    const updatedReviews = [...formData.reviews];
    updatedReviews[index][field] = value;

    setFormData({
      ...formData,
      reviews: updatedReviews,
    });
  };

  const addReview = () => {
    setFormData({
      ...formData,
      reviews: [...formData.reviews, { ...emptyReview }],
    });
  };

  const removeReview = (index) => {
    const updatedReviews = formData.reviews.filter((_, i) => i !== index);

    setFormData({
      ...formData,
      reviews: updatedReviews.length > 0 ? updatedReviews : [{ ...emptyReview }],
    });
  };

  const resetForm = () => {
    setEditId(null);

    setFormData({
      category_name: "",
      title: "",
      slug: "",
      type: "online",
      status: "draft",
      duration_value: "",
      duration_unit: "month",
      short_description: "",
      description: "",
      goals: [""],
      faqs: [{ ...emptyFaq }],
      reviews: [{ ...emptyReview }],
      certificate_enabled: true,
      base_price: "",
      registration_fee: "",
      emi_allowed: true,
      default_emi_months: "",
      min_monthly_emi: "",
      max_discount_percent: "",
      tax_percentage: "",
      max_installments: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.category_name || !formData.title || !formData.slug) {
      alert("Please fill Category, Title and Slug");
      return;
    }

    try {
      if (editId) {
        await axios.put(`http://localhost:5000/api/courses/${editId}`, formData);
        alert("Course updated successfully");
      } else {
        await axios.post("http://localhost:5000/api/courses", formData);
        alert("Course created successfully");
      }

      resetForm();
      getCourses();
    } catch (error) {
      alert(error.response?.data?.message || "Course operation failed");
    }
  };

  const handleEdit = (course) => {
    setEditId(course._id);

    setFormData({
      category_name: course.category_name || "",
      title: course.title || "",
      slug: course.slug || "",
      type: course.type || "online",
      status: course.status || "draft",
      duration_value: course.duration_value || "",
      duration_unit: course.duration_unit || "month",
      short_description: course.short_description || "",
      description: course.description || "",
      goals: course.goals?.length > 0 ? course.goals : [""],
      faqs: course.faqs?.length > 0 ? course.faqs : [{ ...emptyFaq }],
      reviews: course.reviews?.length > 0 ? course.reviews : [{ ...emptyReview }],
      certificate_enabled: course.certificate_enabled ?? true,
      base_price: course.base_price || "",
      registration_fee: course.registration_fee || "",
      emi_allowed: course.emi_allowed ?? true,
      default_emi_months: course.default_emi_months || "",
      min_monthly_emi: course.min_monthly_emi || "",
      max_discount_percent: course.max_discount_percent || "",
      tax_percentage: course.tax_percentage || "",
      max_installments: course.max_installments || "",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this course?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/courses/${id}`);
      alert("Course deleted successfully");
      getCourses();
    } catch (error) {
      alert(error.response?.data?.message || "Delete failed");
    }
  };

  const filteredCourses = courses.filter((course) => {
    return (
      course.title?.toLowerCase().includes(search.toLowerCase()) ||
      course.category_name?.toLowerCase().includes(search.toLowerCase()) ||
      course.slug?.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <p className="text-muted mb-1">SUPER ADMIN / COURSES</p>
          <h2 className="fw-bold">Course Management</h2>
          <p className="text-muted">
            Create courses according to your CSV structure.
          </p>
        </div>

        <button className="btn btn-success">
          <Plus size={17} /> Add Course
        </button>
      </div>

      <div className="card shadow-sm border-0 rounded-4 p-4 mb-4">
        <form onSubmit={handleSubmit}>
          <h4 className="fw-bold mb-4">
            {editId ? "Edit Course" : "Add Course"}
          </h4>

          <div className="row">
            <div className="col-md-4 mb-3">
              <label>Category Name</label>
              <input
                type="text"
                className="form-control"
                name="category_name"
                value={formData.category_name}
                onChange={handleChange}
                placeholder="Web Development"
              />
            </div>

            <div className="col-md-4 mb-3">
              <label>Course Title</label>
              <input
                type="text"
                className="form-control"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="HTML"
              />
            </div>

            <div className="col-md-4 mb-3">
              <label>Slug</label>
              <input
                type="text"
                className="form-control"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                placeholder="html"
              />
            </div>

            <div className="col-md-3 mb-3">
              <label>Type</label>
              <select
                className="form-control"
                name="type"
                value={formData.type}
                onChange={handleChange}
              >
                <option value="online">Online</option>
                <option value="offline">Offline</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>

            <div className="col-md-3 mb-3">
              <label>Status</label>
              <select
                className="form-control"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="col-md-3 mb-3">
              <label>Duration Value</label>
              <input
                type="number"
                className="form-control"
                name="duration_value"
                value={formData.duration_value}
                onChange={handleChange}
                placeholder="1"
              />
            </div>

            <div className="col-md-3 mb-3">
              <label>Duration Unit</label>
              <select
                className="form-control"
                name="duration_unit"
                value={formData.duration_unit}
                onChange={handleChange}
              >
                <option value="day">Day</option>
                <option value="week">Week</option>
                <option value="month">Month</option>
                <option value="year">Year</option>
              </select>
            </div>

            <div className="col-md-12 mb-3">
              <label>Short Description</label>
              <input
                type="text"
                className="form-control"
                name="short_description"
                value={formData.short_description}
                onChange={handleChange}
                placeholder="Learn HTML fundamentals"
              />
            </div>

            <div className="col-md-12 mb-3">
              <label>Description</label>
              <textarea
                className="form-control"
                rows="3"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Complete HTML course covering structure, tags, forms and media."
              />
            </div>
          </div>

          <hr />

          <h5 className="fw-bold mb-3">Course Goals</h5>

          {formData.goals.map((goal, index) => (
            <div className="d-flex gap-2 mb-2" key={index}>
              <input
                type="text"
                className="form-control"
                value={goal}
                onChange={(e) => handleGoalChange(index, e.target.value)}
                placeholder="Understand HTML structure"
              />

              <button
                type="button"
                className="btn btn-danger"
                onClick={() => removeGoal(index)}
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}

          <button
            type="button"
            className="btn btn-outline-primary btn-sm mb-4"
            onClick={addGoal}
          >
            <Plus size={15} /> Add Goal
          </button>

          <hr />

          <h5 className="fw-bold mb-3">FAQs</h5>

          {formData.faqs.map((faq, index) => (
            <div className="row mb-2" key={index}>
              <div className="col-md-5">
                <input
                  type="text"
                  className="form-control"
                  value={faq.question}
                  onChange={(e) =>
                    handleFaqChange(index, "question", e.target.value)
                  }
                  placeholder="What is HTML?"
                />
              </div>

              <div className="col-md-6">
                <input
                  type="text"
                  className="form-control"
                  value={faq.answer}
                  onChange={(e) =>
                    handleFaqChange(index, "answer", e.target.value)
                  }
                  placeholder="Markup Language"
                />
              </div>

              <div className="col-md-1">
                <button
                  type="button"
                  className="btn btn-danger w-100"
                  onClick={() => removeFaq(index)}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            className="btn btn-outline-primary btn-sm mb-4"
            onClick={addFaq}
          >
            <Plus size={15} /> Add FAQ
          </button>

          <hr />

          <h5 className="fw-bold mb-3">Reviews</h5>

          {formData.reviews.map((review, index) => (
            <div className="row mb-2" key={index}>
              <div className="col-md-5">
                <input
                  type="text"
                  className="form-control"
                  value={review.name}
                  onChange={(e) =>
                    handleReviewChange(index, "name", e.target.value)
                  }
                  placeholder="John"
                />
              </div>

              <div className="col-md-6">
                <input
                  type="text"
                  className="form-control"
                  value={review.review}
                  onChange={(e) =>
                    handleReviewChange(index, "review", e.target.value)
                  }
                  placeholder="Excellent course"
                />
              </div>

              <div className="col-md-1">
                <button
                  type="button"
                  className="btn btn-danger w-100"
                  onClick={() => removeReview(index)}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            className="btn btn-outline-primary btn-sm mb-4"
            onClick={addReview}
          >
            <Plus size={15} /> Add Review
          </button>

          <hr />

          <h5 className="fw-bold mb-3">Pricing & EMI Settings</h5>

          <div className="row">
            <div className="col-md-3 mb-3">
              <label>Base Price</label>
              <input
                type="number"
                className="form-control"
                name="base_price"
                value={formData.base_price}
                onChange={handleChange}
                placeholder="10000"
              />
            </div>

            <div className="col-md-3 mb-3">
              <label>Registration Fee</label>
              <input
                type="number"
                className="form-control"
                name="registration_fee"
                value={formData.registration_fee}
                onChange={handleChange}
                placeholder="2000"
              />
            </div>

            <div className="col-md-3 mb-3">
              <label>Default EMI Months</label>
              <input
                type="number"
                className="form-control"
                name="default_emi_months"
                value={formData.default_emi_months}
                onChange={handleChange}
                placeholder="3"
              />
            </div>

            <div className="col-md-3 mb-3">
              <label>Minimum Monthly EMI</label>
              <input
                type="number"
                className="form-control"
                name="min_monthly_emi"
                value={formData.min_monthly_emi}
                onChange={handleChange}
                placeholder="3000"
              />
            </div>

            <div className="col-md-3 mb-3">
              <label>Max Discount %</label>
              <input
                type="number"
                className="form-control"
                name="max_discount_percent"
                value={formData.max_discount_percent}
                onChange={handleChange}
                placeholder="20"
              />
            </div>

            <div className="col-md-3 mb-3">
              <label>Tax %</label>
              <input
                type="number"
                className="form-control"
                name="tax_percentage"
                value={formData.tax_percentage}
                onChange={handleChange}
                placeholder="18"
              />
            </div>

            <div className="col-md-3 mb-3">
              <label>Max Installments</label>
              <input
                type="number"
                className="form-control"
                name="max_installments"
                value={formData.max_installments}
                onChange={handleChange}
                placeholder="3"
              />
            </div>

            <div className="col-md-3 mb-3 d-flex align-items-center gap-4">
              <label>
                <input
                  type="checkbox"
                  name="certificate_enabled"
                  checked={formData.certificate_enabled}
                  onChange={handleChange}
                />{" "}
                Certificate
              </label>

              <label>
                <input
                  type="checkbox"
                  name="emi_allowed"
                  checked={formData.emi_allowed}
                  onChange={handleChange}
                />{" "}
                EMI
              </label>
            </div>
          </div>

          <div className="d-flex gap-2 mt-3">
            <button type="button" className="btn btn-secondary" onClick={resetForm}>
              <RefreshCcw size={16} /> Clear
            </button>

            <button type="submit" className="btn btn-success">
              {editId ? "Update Course" : "Save Course"}
            </button>
          </div>
        </form>
      </div>

      <div className="card shadow-sm border-0 rounded-4 p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="fw-bold">Created Courses</h4>

          <div className="input-group" style={{ maxWidth: "320px" }}>
            <span className="input-group-text">
              <Search size={16} />
            </span>

            <input
              type="text"
              className="form-control"
              placeholder="Search course"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="row">
          {filteredCourses.map((course) => (
            <div className="col-md-4 mb-4" key={course._id}>
              <div className="card h-100 border-0 shadow-sm rounded-4">
                <div
                  style={{
                    height: "120px",
                    borderRadius: "14px 14px 0 0",
                    background:
                      "linear-gradient(135deg, #0f172a, #0f766e)",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "800",
                    fontSize: "22px",
                  }}
                >
                  {course.title}
                </div>

                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 className="fw-bold mb-0">{course.title}</h5>

                    <span
                      className={`badge ${
                        course.status === "published"
                          ? "bg-success"
                          : course.status === "draft"
                            ? "bg-warning"
                            : "bg-danger"
                      }`}
                    >
                      {course.status}
                    </span>
                  </div>

                  <p className="text-muted small">{course.short_description}</p>

                  <p className="mb-1">
                    <BookOpen size={15} /> {course.category_name}
                  </p>

                  <p className="mb-1">
                    Duration: {course.duration_value} {course.duration_unit}
                  </p>

                  <p className="mb-1">
                    <BadgeIndianRupee size={15} /> {course.base_price}
                  </p>

                  <p className="mb-3">
                    EMI: {course.emi_allowed ? "Allowed" : "Not Allowed"}
                  </p>

                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => handleEdit(course)}
                    >
                      <Edit size={14} /> Edit
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(course._id)}
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredCourses.length === 0 && (
            <div className="col-12 text-center text-muted py-4">
              No courses found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminCourses;