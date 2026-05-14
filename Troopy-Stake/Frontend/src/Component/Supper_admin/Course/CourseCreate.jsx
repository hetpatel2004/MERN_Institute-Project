import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const API_URL = "http://localhost:5000/api/courses";

function CourseCreate() {
  const navigate = useNavigate();
  const { id } = useParams();

  const THEME = "#0f172a";

  const [form, setForm] = useState({
    title: "",
    slug: "",
    type: "",
    status: "Draft",
    tagline: "",
    durationValue: "",
    durationType: "Month",
    price: "",
    thumbnailUrl: "",
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
            thumbnailUrl: data.thumbnailUrl || data.thumbnail || "",
            teaserVideoUrl: data.teaserVideoUrl || "",
          });

          if (data.thumbnailUrl) {
            setThumbnailPreview(data.thumbnailUrl);
          } else if (data.thumbnail) {
            setThumbnailPreview(
              data.thumbnail.startsWith("http")
                ? data.thumbnail
                : `http://localhost:5000${data.thumbnail}`
            );
          }

          if (data.teaserVideoUrl) {
            setVideoPreview(
              data.teaserVideoUrl.startsWith("http")
                ? data.teaserVideoUrl
                : `http://localhost:5000${data.teaserVideoUrl}`
            );
          }
        })
        .catch((error) => {
          console.log(error);
          alert("Failed to load course");
        });
    }
  }, [id]);

  const inputStyle = {
    height: "46px",
    borderRadius: "12px",
    border: "1px solid #dbe3ef",
    boxShadow: "none",
  };

  const labelStyle = {
    fontWeight: "600",
    color: "#334155",
    marginBottom: "7px",
  };

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

  const handleThumbnailUrlChange = (e) => {
    const value = e.target.value;

    setForm((prev) => ({
      ...prev,
      thumbnailUrl: value,
    }));

    setThumbnailFile(null);
    setThumbnailPreview(value);
  };

  const handleVideoUrlChange = (e) => {
    const value = e.target.value;

    setForm((prev) => ({
      ...prev,
      teaserVideoUrl: value,
    }));

    setVideoFile(null);
    setVideoPreview(value);
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setThumbnailFile(file);
    setForm((prev) => ({
      ...prev,
      thumbnailUrl: "",
    }));
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setVideoFile(file);
    setForm((prev) => ({
      ...prev,
      teaserVideoUrl: "",
    }));
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
      thumbnailUrl: "",
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
      formData.append("duration", `${form.durationValue} ${form.durationType}`);
      formData.append("price", form.price);

      formData.append("thumbnailUrl", form.thumbnailUrl || "");
      formData.append("teaserVideoUrl", form.teaserVideoUrl || "");

      if (thumbnailFile) {
        formData.append("thumbnail", thumbnailFile);
      }

      if (videoFile) {
        formData.append("teaserVideo", videoFile);
      }

      if (id) {
        await axios.put(`${API_URL}/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        alert("Course updated successfully");
      } else {
        await axios.post(API_URL, formData, {
          headers: { "Content-Type": "multipart/form-data" },
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
      style={{ background: "#f5f7fb", minHeight: "100vh" }}
    >
      <div
        className="mb-4 p-4"
        style={{
          background: `linear-gradient(135deg, ${THEME}, #1e293b)`,
          borderRadius: "22px",
          color: "#fff",
          boxShadow: "0 14px 35px rgba(15,23,42,0.18)",
        }}
      >
        <p style={{ color: "#cbd5e1", marginBottom: "8px" }}>
          Super Admin / Courses / {id ? "Edit Course" : "Create Course"}
        </p>

        <h2 className="fw-bold mb-2">
          {id ? "Edit Course" : "Create New Course"}
        </h2>

        <p className="mb-0" style={{ color: "#e2e8f0" }}>
          Add course details, thumbnail, video, duration and price.
        </p>
      </div>

      <form onSubmit={(e) => handleSubmit(e, false)}>
        <div className="row g-4">
          <div className="col-lg-8">
            <div
              className="card border-0"
              style={{
                borderRadius: "22px",
                boxShadow: "0 12px 30px rgba(15,23,42,0.08)",
              }}
            >
              <div className="card-body p-4">
                <h5 className="fw-bold mb-4" style={{ color: THEME }}>
                  Basic Course Information
                </h5>

                <div className="row g-4">
                  <div className="col-md-6">
                    <label style={labelStyle}>Course Title *</label>
                    <input
                      type="text"
                      name="title"
                      className="form-control"
                      placeholder="Enter course title"
                      value={form.title}
                      onChange={handleChange}
                      style={inputStyle}
                    />
                  </div>

                  <div className="col-md-6">
                    <label style={labelStyle}>Slug *</label>
                    <input
                      type="text"
                      name="slug"
                      className="form-control"
                      placeholder="course-slug"
                      value={form.slug}
                      onChange={handleChange}
                      style={inputStyle}
                    />
                  </div>

                  <div className="col-md-6">
                    <label style={labelStyle}>Course Type *</label>
                    <select
                      name="type"
                      className="form-select"
                      value={form.type}
                      onChange={handleChange}
                      style={inputStyle}
                    >
                      <option value="">Select type</option>
                      <option value="Online">Online</option>
                      <option value="Offline">Offline</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label style={labelStyle}>Status *</label>
                    <select
                      name="status"
                      className="form-select"
                      value={form.status}
                      onChange={handleChange}
                      style={inputStyle}
                    >
                      <option value="Draft">Draft</option>
                      <option value="Published">Published</option>
                    </select>
                  </div>

                  <div className="col-md-12">
                    <label style={labelStyle}>Course Tagline</label>
                    <textarea
                      name="tagline"
                      className="form-control"
                      rows="5"
                      placeholder="Write short course tagline..."
                      value={form.tagline}
                      onChange={handleChange}
                      style={{
                        borderRadius: "14px",
                        border: "1px solid #dbe3ef",
                        boxShadow: "none",
                      }}
                    />
                  </div>

                  <div className="col-md-4">
                    <label style={labelStyle}>Duration Value</label>
                    <input
                      type="number"
                      name="durationValue"
                      className="form-control"
                      placeholder="1"
                      value={form.durationValue}
                      onChange={handleChange}
                      style={inputStyle}
                    />
                  </div>

                  <div className="col-md-4">
                    <label style={labelStyle}>Duration Type</label>
                    <select
                      name="durationType"
                      className="form-select"
                      value={form.durationType}
                      onChange={handleChange}
                      style={inputStyle}
                    >
                      <option value="Day">Day</option>
                      <option value="Month">Month</option>
                      <option value="Year">Year</option>
                    </select>
                  </div>

                  <div className="col-md-4">
                    <label style={labelStyle}>Price</label>
                    <input
                      type="number"
                      name="price"
                      className="form-control"
                      placeholder="10000"
                      value={form.price}
                      onChange={handleChange}
                      style={inputStyle}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div
              className="card border-0 mb-4"
              style={{
                borderRadius: "22px",
                boxShadow: "0 12px 30px rgba(15,23,42,0.08)",
              }}
            >
              <div className="card-body p-4">
                <h5 className="fw-bold mb-3" style={{ color: THEME }}>
                  Thumbnail
                </h5>

                <label style={labelStyle}>Image URL</label>
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Paste image URL"
                  value={form.thumbnailUrl}
                  onChange={handleThumbnailUrlChange}
                  style={inputStyle}
                />

                <div className="text-center text-muted mb-2">OR</div>

                <label style={labelStyle}>Choose From PC</label>
                <input
                  type="file"
                  accept="image/*"
                  className="form-control"
                  onChange={handleThumbnailChange}
                  style={inputStyle}
                />

                <div
                  className="mt-3 d-flex align-items-center justify-content-center"
                  style={{
                    height: "180px",
                    borderRadius: "18px",
                    border: "2px dashed #cbd5e1",
                    background: "#f8fafc",
                    overflow: "hidden",
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
                      Paste URL or upload image
                      <br />
                      <small>PNG / JPG</small>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div
              className="card border-0"
              style={{
                borderRadius: "22px",
                boxShadow: "0 12px 30px rgba(15,23,42,0.08)",
              }}
            >
              <div className="card-body p-4">
                <h5 className="fw-bold mb-3" style={{ color: THEME }}>
                  Promotional Video
                </h5>

                <label style={labelStyle}>Video URL</label>
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Paste video URL"
                  value={form.teaserVideoUrl}
                  onChange={handleVideoUrlChange}
                  style={inputStyle}
                />

                <div className="text-center text-muted mb-2">OR</div>

                <label style={labelStyle}>Choose From PC</label>
                <input
                  type="file"
                  accept="video/*"
                  className="form-control"
                  onChange={handleVideoChange}
                  style={inputStyle}
                />

                {videoPreview ? (
                  <video
                    controls
                    className="mt-3"
                    style={{
                      width: "100%",
                      maxHeight: "220px",
                      borderRadius: "18px",
                      objectFit: "cover",
                    }}
                  >
                    <source src={videoPreview} />
                  </video>
                ) : (
                  <div
                    className="mt-3 d-flex align-items-center justify-content-center text-muted"
                    style={{
                      height: "140px",
                      borderRadius: "18px",
                      border: "2px dashed #cbd5e1",
                      background: "#f8fafc",
                    }}
                  >
                    Paste URL or upload video
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div
          className="mt-4 p-3 d-flex gap-3 justify-content-end"
          style={{
            background: "#fff",
            borderRadius: "18px",
            boxShadow: "0 8px 25px rgba(15,23,42,0.06)",
          }}
        >
          <button
            type="button"
            onClick={() => navigate("/superadmin/course")}
            className="btn"
            style={{
              border: "1px solid #cbd5e1",
              color: THEME,
              borderRadius: "12px",
              padding: "10px 18px",
              fontWeight: "600",
            }}
          >
            Cancel
          </button>

          {!id && (
            <button
              type="button"
              onClick={(e) => handleSubmit(e, true)}
              className="btn"
              style={{
                background: "#e2e8f0",
                color: THEME,
                borderRadius: "12px",
                padding: "10px 18px",
                fontWeight: "600",
              }}
            >
              Create & Add Another
            </button>
          )}

          <button
            type="submit"
            className="btn"
            style={{
              background: THEME,
              color: "#fff",
              borderRadius: "12px",
              padding: "10px 22px",
              fontWeight: "700",
              boxShadow: "0 8px 20px rgba(15,23,42,0.25)",
            }}
          >
            {id ? "Update Course" : "Create Course"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CourseCreate;