import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Trash2, Search } from "lucide-react";

function Institutes() {
  const INSTITUTE_API = "http://localhost:3000/institutes";
  const COURSE_API = "http://localhost:3000/courses";

  const [institutes, setInstitutes] = useState([]);
  const [coursesList, setCoursesList] = useState([]);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    code: "",
    city: "",
    admin: "",
    email: "",
    phone: "",
    courses: 1,
    students: 0,
    faculty: 0,
    revenue: "0L",
    status: "Active",
    interestedCourses: [],
  });

  const getInstitutes = async () => {
    try {
      const res = await axios.get(INSTITUTE_API);
      setInstitutes(res.data);
    } catch (error) {
      console.log(error);
      alert("Institutes API not connected");
    }
  };

  const getCourses = async () => {
    try {
      const res = await axios.get(COURSE_API);
      setCoursesList(res.data);
    } catch (error) {
      console.log(error);
      alert("Courses API not connected");
    }
  };

  useEffect(() => {
    getInstitutes();
    getCourses();
  }, []);

  const handleCourseInterest = (courseName) => {
    if (form.interestedCourses.includes(courseName)) {
      setForm({
        ...form,
        interestedCourses: form.interestedCourses.filter(
          (item) => item !== courseName
        ),
      });
    } else {
      setForm({
        ...form,
        interestedCourses: [...form.interestedCourses, courseName],
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.code || !form.city || !form.admin) {
      alert("Please fill Institute Name, Code, City and Institute Admin");
      return;
    }

    try {
      if (editId) {
        await axios.put(`${INSTITUTE_API}/${editId}`, form);
        setEditId(null);
      } else {
        await axios.post(INSTITUTE_API, form);
      }

      clearForm();
      getInstitutes();
    } catch (error) {
      console.log(error);
      alert("Something went wrong while saving institute");
    }
  };

  const editInstitute = (item) => {
    setForm({
      name: item.name || "",
      code: item.code || "",
      city: item.city || "",
      admin: item.admin || "",
      email: item.email || "",
      phone: item.phone || "",
      courses: item.courses || 1,
      students: item.students || 0,
      faculty: item.faculty || 0,
      revenue: item.revenue || "0L",
      status: item.status || "Active",
      interestedCourses: item.interestedCourses || [],
    });

    setEditId(item.id);
  };

  const deleteInstitute = async (id) => {
    try {
      await axios.delete(`${INSTITUTE_API}/${id}`);
      getInstitutes();
    } catch (error) {
      console.log(error);
      alert("Delete failed");
    }
  };

  const clearForm = () => {
    setForm({
      name: "",
      code: "",
      city: "",
      admin: "",
      email: "",
      phone: "",
      courses: 1,
      students: 0,
      faculty: 0,
      revenue: "0L",
      status: "Active",
      interestedCourses: [],
    });

    setEditId(null);
  };

  const filteredInstitutes = institutes.filter((item) =>
    item.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="sa-header">
        <div>
          <p className="sa-tag">SUPER ADMIN CONTROL</p>
          <h1>Institute Management</h1>
        </div>
      </div>

      <div className="institute-page-grid">
        {/* LEFT SIDE LIST */}
        <div className="institute-list-card">
          <div className="institute-list-header">
            <div>
              <h2>Institutes</h2>
              <p>Add, update, remove and monitor institute accounts.</p>
            </div>

            <div className="institute-search">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search institute"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="institute-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Institute</th>
                  <th>Admin</th>
                  <th>Courses</th>
                  <th>Students</th>
                  <th>Status</th>
                  <th>Interested Courses</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredInstitutes.length === 0 ? (
                  <tr>
                    <td colSpan="7">No institute records match your search.</td>
                  </tr>
                ) : (
                  filteredInstitutes.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <b>{item.name}</b>
                        <br />
                        <small>{item.city}</small>
                      </td>

                      <td>{item.admin}</td>
                      <td>{item.courses}</td>
                      <td>{item.students}</td>

                      <td>
                        <span className="sa-status">{item.status}</span>
                      </td>

                      <td>
                        {item.interestedCourses?.length > 0
                          ? item.interestedCourses.join(", ")
                          : "No courses selected"}
                      </td>

                      <td>
                        <button
                          className="sa-icon-btn edit"
                          onClick={() => editInstitute(item)}
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          className="sa-icon-btn delete"
                          onClick={() => deleteInstitute(item.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT SIDE FORM */}
        <div className="institute-form-card">
          <div className="institute-form-head">
            <h2>{editId ? "Update Institute" : "Add Institute"}</h2>
            <p>Create a new campus workspace.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="institute-form-grid">
              <div>
                <label>Institute Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                />
              </div>

              <div>
                <label>Code</label>
                <input
                  type="text"
                  value={form.code}
                  onChange={(e) =>
                    setForm({ ...form, code: e.target.value })
                  }
                />
              </div>

              <div>
                <label>City</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) =>
                    setForm({ ...form, city: e.target.value })
                  }
                />
              </div>

              <div>
                <label>Institute Admin</label>
                <input
                  type="text"
                  value={form.admin}
                  onChange={(e) =>
                    setForm({ ...form, admin: e.target.value })
                  }
                />
              </div>

              <div>
                <label>Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                />
              </div>

              <div>
                <label>Phone</label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) =>
                    setForm({ ...form, phone: e.target.value })
                  }
                />
              </div>

              <div>
                <label>Courses</label>
                <input
                  type="number"
                  value={form.courses}
                  onChange={(e) =>
                    setForm({ ...form, courses: e.target.value })
                  }
                />
              </div>

              <div>
                <label>Students</label>
                <input
                  type="number"
                  value={form.students}
                  onChange={(e) =>
                    setForm({ ...form, students: e.target.value })
                  }
                />
              </div>

              <div>
                <label>Faculty</label>
                <input
                  type="number"
                  value={form.faculty}
                  onChange={(e) =>
                    setForm({ ...form, faculty: e.target.value })
                  }
                />
              </div>

              <div>
                <label>Revenue</label>
                <input
                  type="text"
                  value={form.revenue}
                  onChange={(e) =>
                    setForm({ ...form, revenue: e.target.value })
                  }
                />
              </div>

              <div className="full-width">
                <label>Status</label>
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm({ ...form, status: e.target.value })
                  }
                >
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>

              <div className="full-width">
                <label>Interested Courses</label>

                <div className="course-access-box">
                  {coursesList.length === 0 ? (
                    <p>No courses available. First add courses.</p>
                  ) : (
                    coursesList.map((course) => (
                      <label className="course-check" key={course.id}>
                        <input
                          type="checkbox"
                          checked={form.interestedCourses.includes(
                            course.name
                          )}
                          onChange={() => handleCourseInterest(course.name)}
                        />
                        <span>{course.name}</span>
                      </label>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="institute-form-actions">
              <button type="button" className="clear-btn" onClick={clearForm}>
                Clear
              </button>

              <button className="sa-primary-btn">
                {editId ? "Update Institute" : "Create Institute"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Institutes;