import React, { useEffect, useState } from "react";
import "./AdminCourses.css";
import { createCourse, getCourses as fetchCourses } from "../../services/superAdminService";

function AdminCourses() {
  const [courses, setCourses] = useState([]);

  const [course, setCourse] = useState({
    name: "",
    duration: "",
    fees: "",
    description: "",
    modules: [
      {
        moduleName: "",
        topics: [""],
      },
    ],
  });

  const getCourses = async () => {
    const res = await fetchCourses();
    setCourses(res.data);
  };

  useEffect(() => {
    getCourses();
  }, []);

  const handleChange = (e) => {
    setCourse({
      ...course,
      [e.target.name]: e.target.value,
    });
  };

  const handleModuleChange = (moduleIndex, value) => {
    const updatedModules = [...course.modules];
    updatedModules[moduleIndex].moduleName = value;

    setCourse({
      ...course,
      modules: updatedModules,
    });
  };

  const handleTopicChange = (moduleIndex, topicIndex, value) => {
    const updatedModules = [...course.modules];
    updatedModules[moduleIndex].topics[topicIndex] = value;

    setCourse({
      ...course,
      modules: updatedModules,
    });
  };

  const addModule = () => {
    setCourse({
      ...course,
      modules: [
        ...course.modules,
        {
          moduleName: "",
          topics: [""],
        },
      ],
    });
  };

  const removeModule = (moduleIndex) => {
    const updatedModules = course.modules.filter(
      (_, index) => index !== moduleIndex
    );

    setCourse({
      ...course,
      modules: updatedModules,
    });
  };

  const addTopic = (moduleIndex) => {
    const updatedModules = [...course.modules];
    updatedModules[moduleIndex].topics.push("");

    setCourse({
      ...course,
      modules: updatedModules,
    });
  };

  const removeTopic = (moduleIndex, topicIndex) => {
    const updatedModules = [...course.modules];

    updatedModules[moduleIndex].topics = updatedModules[
      moduleIndex
    ].topics.filter((_, index) => index !== topicIndex);

    setCourse({
      ...course,
      modules: updatedModules,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await createCourse(course);

    alert("Course Added Successfully");

    setCourse({
      name: "",
      duration: "",
      fees: "",
      description: "",
      modules: [
        {
          moduleName: "",
          topics: [""],
        },
      ],
    });

    getCourses();
  };

  return (
    <div className="course-page">
      <div className="course-form-box">
        <h2>Add Course</h2>
        <p>Create course with modules and multiple topics</p>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <input
              type="text"
              name="name"
              placeholder="Course Name"
              value={course.name}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="duration"
              placeholder="Duration"
              value={course.duration}
              onChange={handleChange}
              required
            />

            <input
              type="number"
              name="fees"
              placeholder="Fees"
              value={course.fees}
              onChange={handleChange}
              required
            />
          </div>

          <textarea
            name="description"
            placeholder="Course Description"
            value={course.description}
            onChange={handleChange}
            required
          ></textarea>

          <h3 className="section-title">Modules</h3>

          {course.modules.map((module, moduleIndex) => (
            <div className="module-box" key={moduleIndex}>
              <div className="module-header">
                <h4>Module {moduleIndex + 1}</h4>

                {course.modules.length > 1 && (
                  <button
                    type="button"
                    className="remove-module-btn"
                    onClick={() => removeModule(moduleIndex)}
                  >
                    Remove Module
                  </button>
                )}
              </div>

              <input
                type="text"
                placeholder="Module Name e.g. HTML"
                value={module.moduleName}
                onChange={(e) =>
                  handleModuleChange(moduleIndex, e.target.value)
                }
                required
              />

              <h5>Topics</h5>

              {module.topics.map((topic, topicIndex) => (
                <div className="topic-row" key={topicIndex}>
                  <input
                    type="text"
                    placeholder={`Topic ${topicIndex + 1}`}
                    value={topic}
                    onChange={(e) =>
                      handleTopicChange(
                        moduleIndex,
                        topicIndex,
                        e.target.value
                      )
                    }
                    required
                  />

                  {module.topics.length > 1 && (
                    <button
                      type="button"
                      className="remove-topic-btn"
                      onClick={() => removeTopic(moduleIndex, topicIndex)}
                    >
                      X
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                className="add-topic-btn"
                onClick={() => addTopic(moduleIndex)}
              >
                + Add Topic
              </button>
            </div>
          ))}

          <div className="button-group">
            <button type="button" className="add-module-btn" onClick={addModule}>
              + Add Module
            </button>

            <button type="submit" className="save-btn">
              Save Course
            </button>
          </div>
        </form>
      </div>

      <div className="course-list-box">
        <h2>Added Courses</h2>

        {courses.length === 0 ? (
          <p className="empty-text">No course added yet.</p>
        ) : (
          courses.map((item) => (
            <div className="course-card" key={item.id}>
              <h3>{item.name}</h3>

              <p>
                <b>Duration:</b> {item.duration}
              </p>

              <p>
                <b>Fees:</b> ₹{item.fees}
              </p>

              <p>{item.description}</p>

              <h4>Modules</h4>

              {item. modules ?.map((mod, index) => (
                <div className="saved-module" key={index}>
                  <h5>{mod.moduleName}</h5>

                  <ul>
                    {mod.topics?.map((topic, i) => (
                      <li key={i}>{topic}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AdminCourses;