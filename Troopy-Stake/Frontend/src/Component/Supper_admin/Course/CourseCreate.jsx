import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const API_URL = "http://localhost:5000/api/courses";

function CourseCreate() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    title: "",
    slug: "",
    type: "",
    status: "Draft",
    tagline: "",
    durationValue: "",
    durationType: "Month",
    price: "",
    thumbnail: "",
    teaserVideoUrl: "",
  });

  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [videoPreview, setVideoPreview] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);

  useEffect(() => {
    if (id) {
      axios
        .get(`${API_URL}/${id}`)
        .then((res) => {
          const data = res.data;

          setForm({
            title: data.title || "",
            slug: data.slug || "",
            type: data.type || "",
            status: data.status || "Draft",
            tagline: data.tagline || "",
            durationValue: data.durationValue || "",
            durationType: data.durationType || "Month",
            price: data.price || "",
            thumbnail: data.thumbnail || "",
            teaserVideoUrl: data.teaserVideoUrl || "",
          });

          setThumbnailPreview(
            data.thumbnail ? `http://localhost:5000${data.thumbnail}` : ""
          );

          setVideoPreview(
            data.teaserVideoUrl
              ? `http://localhost:5000${data.teaserVideoUrl}`
              : ""
          );
        })
        .catch((error) => {
          console.log(error);
          alert("Failed to load course");
        });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
      slug:
        name === "title"
          ? value.toLowerCase().trim().replaceAll(" ", "-")
          : prev.slug,
    }));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
  };

  const resetForm = () => {
    setForm({
      title: "",
      slug: "",
      type: "",
      status: "Draft",
      tagline: "",
      durationValue: "",
      durationType: "Month",
      price: "",
      thumbnail: "",
      teaserVideoUrl: "",
    });

    setThumbnailPreview("");
    setVideoPreview("");
    setThumbnailFile(null);
    setVideoFile(null);
  };

  const handleSubmit = async (e, createAnother = false) => {
    e.preventDefault();

    if (!form.title || !form.slug || !form.type || !form.status) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("title", form.title);
      formData.append("slug", form.slug);
      formData.append("type", form.type);
      formData.append("status", form.status);
      formData.append("tagline", form.tagline);
      formData.append("durationValue", form.durationValue);
      formData.append("durationType", form.durationType);
      formData.append(
        "duration",
        `${form.durationValue} ${form.durationType}`
      );
      formData.append("price", form.price);

      if (thumbnailFile) {
        formData.append("thumbnail", thumbnailFile);
      }

      if (videoFile) {
        formData.append("teaserVideo", videoFile);
      }

      if (id) {
        await axios.put(`${API_URL}/${id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        alert("Course updated successfully");
      } else {
        await axios.post(API_URL, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        alert("Course created successfully");
      }

      if (createAnother) {
        resetForm();
      } else {
        navigate("/superadmin/course");
      }
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Course save failed");
    }
  };

  return (
    <div
      className="container-fluid px-4 py-4"
      style={{
        background: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      <p className="text-muted mb-1" style={{ fontSize: "13px" }}>
        Super Admin / Courses / {id ? "Edit" : "Create"}
      </p>

      <h2 className="fw-bold mb-1">{id ? "Edit Course" : "Create Course"}</h2>

      <p className="text-muted mb-4">Add a new course to the system</p>

      <form
        onSubmit={(e) => handleSubmit(e, false)}
        className="card border-0 shadow-sm"
        style={{
          borderRadius: "18px",
          overflow: "hidden",
        }}
      >
        <div className="card-body p-4">
          <h5 className="fw-bold mb-4">Basic Course Information</h5>

          <div className="row g-4">
            <div className="col-md-6">
              <label className="form-label fw-semibold">Title *</label>
              <input
                type="text"
                name="title"
                className="form-control"
                placeholder="Enter course title"
                value={form.title}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Slug *</label>
              <input
                type="text"
                name="slug"
                className="form-control"
                placeholder="Enter slug"
                value={form.slug}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Type *</label>
              <select
                name="type"
                className="form-select"
                value={form.type}
                onChange={handleChange}
              >
                <option value="">Select type</option>
                <option value="Online">Online</option>
                <option value="Offline">Offline</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Status *</label>
              <select
                name="status"
                className="form-select"
                value={form.status}
                onChange={handleChange}
              >
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
              </select>
            </div>

            <div className="col-md-7">
              <label className="form-label fw-semibold">Course Tagline</label>
              <textarea
                name="tagline"
                className="form-control"
                placeholder="Enter course tagline"
                rows="5"
                value={form.tagline}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-5">
              <label className="form-label fw-semibold">
                Thumbnail Upload
              </label>

              <input
                type="file"
                accept="image/*"
                className="form-control"
                onChange={handleThumbnailChange}
              />

              <div
                className="border rounded d-flex align-items-center justify-content-center mt-3"
                style={{
                  height: "130px",
                  overflow: "hidden",
                  background: "#f8fafc",
                }}
              >
                {thumbnailPreview ? (
                  <img
                    src={thumbnailPreview}
                    alt="thumbnail"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div className="text-center text-muted">
                    Click to upload thumbnail
                    <br />
                    <small>PNG, JPG up to 2MB</small>
                  </div>
                )}
              </div>
            </div>

            <div className="col-md-12">
              <label className="form-label fw-semibold">
                Upload Promotional / Teaser Video
              </label>

              <input
                type="file"
                accept="video/*"
                className="form-control"
                onChange={handleVideoChange}
              />

              {videoPreview && (
                <video
                  controls
                  className="mt-3 rounded"
                  style={{
                    width: "100%",
                    maxHeight: "300px",
                    objectFit: "cover",
                  }}
                >
                  <source src={videoPreview} />
                </video>
              )}
            </div>

            <div className="col-md-3">
              <label className="form-label fw-semibold">Duration Value</label>
              <input
                type="number"
                name="durationValue"
                className="form-control"
                placeholder="Example: 1"
                value={form.durationValue}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label fw-semibold">Duration Type</label>
              <select
                name="durationType"
                className="form-select"
                value={form.durationType}
                onChange={handleChange}
              >
                <option value="Day">Day</option>
                <option value="Month">Month</option>
                <option value="Year">Year</option>
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Price</label>
              <input
                type="number"
                name="price"
                className="form-control"
                placeholder="Example: 10000"
                value={form.price}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="card-footer bg-white border-0 p-4 d-flex gap-3">
          <button
            type="submit"
            className="btn text-white"
            style={{
              background: "linear-gradient(135deg,#ff9d00,#ff6b00)",
              fontWeight: "600",
              borderRadius: "10px",
              padding: "10px 18px",
            }}
          >
            {id ? "Update Course" : "Create Course"}
          </button>

          {!id && (
            <button
              type="button"
              onClick={(e) => handleSubmit(e, true)}
              className="btn btn-outline-secondary"
              style={{
                borderRadius: "10px",
              }}
            >
              Create & create another
            </button>
          )}

          <button
            type="button"
            onClick={() => navigate("/superadmin/course")}
            className="btn btn-outline-secondary"
            style={{
              borderRadius: "10px",
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default CourseCreate;