import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  CalendarDays,
  Clock,
  GraduationCap,
  IndianRupee,
  Layers,
  Plus,
  Save,
  Users,
} from "lucide-react";
import "./Batches.css";

const API_URL = "http://localhost:5000/api/batches";

function Batches() {
  const [batches, setBatches] = useState([]);
  const [form, setForm] = useState({
    batchName: "",
    batchCode: "",
    courseName: "",
    batchType: "Regular",
    learningMode: "Offline",
    level: "Beginner",
    startDate: "",
    classesPerWeek: 5,
    classDurationMinutes: 90,
    totalClasses: 60,
    holidays: 0,
    startTime: "",
    endTime: "",
    fee: 0,
    discount: 0,
    registrationFee: 0,
    maxCapacity: 30,
    minCapacity: 5,
    instructor: "",
    location: "",
    description: "",
  });

  const duration = useMemo(() => {
    const totalClasses = Number(form.totalClasses || 0);
    const classesPerWeek = Number(form.classesPerWeek || 1);
    const holidays = Number(form.holidays || 0);

    const weeks = Math.ceil(totalClasses / classesPerWeek);
    const totalDays = weeks * 7 + holidays;
    const months = Math.ceil(totalDays / 30);

    let endDate = "";
    if (form.startDate) {
      const date = new Date(form.startDate);
      date.setDate(date.getDate() + totalDays);
      endDate = date.toISOString().split("T")[0];
    }

    return { weeks, totalDays, months, endDate };
  }, [form]);

  const finalFee =
    Number(form.fee || 0) -
    Number(form.discount || 0) +
    Number(form.registrationFee || 0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const getBatches = async () => {
    const res = await axios.get(API_URL);
    setBatches(res.data);
  };

  useEffect(() => {
    getBatches();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      estimatedWeeks: duration.weeks,
      estimatedDays: duration.totalDays,
      estimatedMonths: duration.months,
      estimatedEndDate: duration.endDate,
      finalFee,
    };

    await axios.post(API_URL, payload);
    alert("Batch created successfully");
    getBatches();
  };

  return (
    <div className="batch-page">
      <div className="batch-header">
        <div>
          <p className="batch-tag">ACADEMIC MANAGEMENT</p>
          <h1>Create New Batch</h1>
          <span>Create batches and auto-estimate duration</span>
        </div>

        <button className="batch-primary-btn" onClick={handleSubmit}>
          <Save size={18} />
          Save Batch
        </button>
      </div>

      <div className="batch-grid">
        <form className="batch-form" onSubmit={handleSubmit}>
          <section className="batch-card">
            <h3>
              <Layers size={20} /> Batch Details
            </h3>

            <div className="batch-input-grid">
              <label>
                Batch Name *
                <input
                  name="batchName"
                  value={form.batchName}
                  onChange={handleChange}
                  placeholder="Web Development Batch - May 2026"
                  required
                />
              </label>

              <label>
                Batch Code *
                <input
                  name="batchCode"
                  value={form.batchCode}
                  onChange={handleChange}
                  placeholder="WD-MAY-2026"
                  required
                />
              </label>

              <label>
                Course Name *
                <input
                  name="courseName"
                  value={form.courseName}
                  onChange={handleChange}
                  placeholder="Full Stack Development"
                  required
                />
              </label>

              <label>
                Batch Type
                <select name="batchType" value={form.batchType} onChange={handleChange}>
                  <option>Regular</option>
                  <option>Fast Track</option>
                  <option>Weekend</option>
                  <option>Crash Course</option>
                </select>
              </label>

              <label>
                Learning Mode
                <select
                  name="learningMode"
                  value={form.learningMode}
                  onChange={handleChange}
                >
                  <option>Offline</option>
                  <option>Online</option>
                  <option>Hybrid</option>
                </select>
              </label>

              <label>
                Level
                <select name="level" value={form.level} onChange={handleChange}>
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </label>
            </div>

            <label className="batch-full">
              Description
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Enter batch description"
              />
            </label>
          </section>

          <section className="batch-card">
            <h3>
              <CalendarDays size={20} /> Schedule & Duration
            </h3>

            <div className="batch-input-grid">
              <label>
                Start Date *
                <input
                  type="date"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Classes Per Week *
                <input
                  type="number"
                  name="classesPerWeek"
                  value={form.classesPerWeek}
                  onChange={handleChange}
                  min="1"
                  required
                />
              </label>

              <label>
                Total Classes *
                <input
                  type="number"
                  name="totalClasses"
                  value={form.totalClasses}
                  onChange={handleChange}
                  min="1"
                  required
                />
              </label>

              <label>
                Class Duration Minutes
                <input
                  type="number"
                  name="classDurationMinutes"
                  value={form.classDurationMinutes}
                  onChange={handleChange}
                />
              </label>

              <label>
                Start Time
                <input
                  type="time"
                  name="startTime"
                  value={form.startTime}
                  onChange={handleChange}
                />
              </label>

              <label>
                End Time
                <input
                  type="time"
                  name="endTime"
                  value={form.endTime}
                  onChange={handleChange}
                />
              </label>

              <label>
                Holidays / Break Days
                <input
                  type="number"
                  name="holidays"
                  value={form.holidays}
                  onChange={handleChange}
                />
              </label>
            </div>
          </section>

          <section className="batch-card">
            <h3>
              <IndianRupee size={20} /> Fees & Capacity
            </h3>

            <div className="batch-input-grid">
              <label>
                Course Fee
                <input type="number" name="fee" value={form.fee} onChange={handleChange} />
              </label>

              <label>
                Discount
                <input
                  type="number"
                  name="discount"
                  value={form.discount}
                  onChange={handleChange}
                />
              </label>

              <label>
                Registration Fee
                <input
                  type="number"
                  name="registrationFee"
                  value={form.registrationFee}
                  onChange={handleChange}
                />
              </label>

              <label>
                Max Capacity
                <input
                  type="number"
                  name="maxCapacity"
                  value={form.maxCapacity}
                  onChange={handleChange}
                />
              </label>

              <label>
                Min Capacity
                <input
                  type="number"
                  name="minCapacity"
                  value={form.minCapacity}
                  onChange={handleChange}
                />
              </label>
            </div>
          </section>

          <section className="batch-card">
            <h3>
              <GraduationCap size={20} /> Other Details
            </h3>

            <div className="batch-input-grid">
              <label>
                Instructor / Faculty
                <input
                  name="instructor"
                  value={form.instructor}
                  onChange={handleChange}
                  placeholder="Faculty name"
                />
              </label>

              <label>
                Location
                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Branch / Classroom"
                />
              </label>
            </div>
          </section>
        </form>

        <aside className="batch-side">
          <div className="batch-card batch-estimate">
            <h3>
              <Clock size={20} /> Duration Estimation
            </h3>

            <div className="estimate-box">
              <h2>{duration.totalDays}</h2>
              <p>Days Estimated</p>
            </div>

            <div className="batch-summary-row">
              <span>Weeks</span>
              <b>{duration.weeks}</b>
            </div>

            <div className="batch-summary-row">
              <span>Months</span>
              <b>{duration.months}</b>
            </div>

            <div className="batch-summary-row">
              <span>Estimated End Date</span>
              <b>{duration.endDate || "-"}</b>
            </div>
          </div>

          <div className="batch-card">
            <h3>
              <Users size={20} /> Batch Summary
            </h3>

            <div className="batch-summary-row">
              <span>Batch</span>
              <b>{form.batchName || "-"}</b>
            </div>

            <div className="batch-summary-row">
              <span>Course</span>
              <b>{form.courseName || "-"}</b>
            </div>

            <div className="batch-summary-row">
              <span>Mode</span>
              <b>{form.learningMode}</b>
            </div>

            <div className="batch-summary-row">
              <span>Capacity</span>
              <b>{form.maxCapacity}</b>
            </div>

            <div className="batch-summary-row">
              <span>Final Fee</span>
              <b>₹{finalFee}</b>
            </div>
          </div>

          <div className="batch-card">
            <h3>Created Batches</h3>

            {batches.length === 0 ? (
              <p className="batch-empty">No batch created yet.</p>
            ) : (
              batches.slice(0, 5).map((batch) => (
                <div className="created-batch" key={batch._id}>
                  <b>{batch.batchName}</b>
                  <span>
                    {batch.courseName} • {batch.estimatedDays} days
                  </span>
                </div>
              ))
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Batches;