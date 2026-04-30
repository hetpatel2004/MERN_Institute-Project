import React, { useEffect, useState } from "react";
import axios from "axios";

function SuperAdmin() {
  const [institutes, setInstitutes] = useState([]);
  const [courses, setCourses] = useState([]);

  const [instName, setInstName] = useState("");
  const [instLoc, setInstLoc] = useState("");

  const [courseTitle, setCourseTitle] = useState("");
  const [duration, setDuration] = useState("");

  // FETCH DATA
  useEffect(() => {
    fetchInstitutes();
    fetchCourses();
  }, []);

  const fetchInstitutes = async () => {
    const res = await axios.get("http://localhost:5000/api/institute");
    setInstitutes(res.data);
  };

  const fetchCourses = async () => {
    const res = await axios.get("http://localhost:5000/api/course");
    setCourses(res.data);
  };

  // ADD INSTITUTE
  const addInstitute = async () => {
    await axios.post("http://localhost:5000/api/institute", {
      name: instName,
      location: instLoc,
    });
    fetchInstitutes();
  };

  // ADD COURSE
  const addCourse = async () => {
    await axios.post("http://localhost:5000/api/course", {
      title: courseTitle,
      duration: duration,
    });
    fetchCourses();
  };

  return (
    <div className="d-flex">

      {/* SIDEBAR */}
      <div style={{ width: "250px", height: "100vh", background: "#1e293b", color: "white", padding: "20px" }}>
        <h4>Super Admin</h4>
        <p>Dashboard</p>
        <p>Institutes</p>
        <p>Courses</p>
      </div>

      {/* MAIN CONTENT */}
      <div className="container p-4">

        <h2>Super Admin Dashboard</h2>

        {/* ADD INSTITUTE */}
        <div className="card p-3 mb-4 shadow">
          <h4>Add Institute</h4>
          <input placeholder="Name" onChange={(e)=>setInstName(e.target.value)} className="form-control mb-2"/>
          <input placeholder="Location" onChange={(e)=>setInstLoc(e.target.value)} className="form-control mb-2"/>
          <button className="btn btn-success" onClick={addInstitute}>Add</button>
        </div>

        {/* ADD COURSE */}
        <div className="card p-3 mb-4 shadow">
          <h4>Add Course</h4>
          <input placeholder="Title" onChange={(e)=>setCourseTitle(e.target.value)} className="form-control mb-2"/>
          <input placeholder="Duration" onChange={(e)=>setDuration(e.target.value)} className="form-control mb-2"/>
          <button className="btn btn-primary" onClick={addCourse}>Add</button>
        </div>

        {/* LIST */}
        <div className="row">
          <div className="col-md-6">
            <h5>Institutes</h5>
            {institutes.map((i)=>(
              <div key={i._id} className="card p-2 mb-2">{i.name} - {i.location}</div>
            ))}
          </div>

          <div className="col-md-6">
            <h5>Courses</h5>
            {courses.map((c)=>(
              <div key={c._id} className="card p-2 mb-2">{c.title} - {c.duration}</div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default SuperAdmin;