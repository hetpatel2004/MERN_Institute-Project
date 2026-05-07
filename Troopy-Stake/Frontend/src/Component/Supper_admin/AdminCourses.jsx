import React, { useEffect, useState } from "react";
import axios from "axios";

function AdminCourses() {
  const API = "http://localhost:3000/courses";

  const emptyTopic = {
    topicName: "",
    sessionClass: "",
    quiz: [
      {
        question: "",
        option1: "",
        option2: "",
        option3: "",
        option4: "",
        correctAnswer: "",
      },
    ],
    article: {
      text: "",
      file: "",
    },
    recordedClass: {
      title: "",
      videoUrl: "",
    },
    assignments: [{ question: "" }],
    referenceMaterial: {
      text: "",
      file: "",
      link: "",
    },
    tasks: [{ taskQuestion: "" }],
    videoAssignment: {
      question: "",
      studentUploadSpace: "Student will upload video from student panel",
    },
  };

  const emptyCourse = {
    name: "",
    duration: "",
    fees: "",
    description: "",
    modules: [
      {
        moduleName: "",
        periodDays: "",
        topics: [emptyTopic],
      },
    ],
  };

  const [courses, setCourses] = useState([]);
  const [course, setCourse] = useState(emptyCourse);

  const getCourses = async () => {
    const res = await axios.get(API);
    setCourses(res.data);
  };

  useEffect(() => {
    getCourses();
  }, []);

  const updateCourseField = (e) => {
    setCourse({ ...course, [e.target.name]: e.target.value });
  };

  const updateModuleField = (moduleIndex, e) => {
    const updated = [...course.modules];
    updated[moduleIndex][e.target.name] = e.target.value;
    setCourse({ ...course, modules: updated });
  };

  const updateTopicName = (moduleIndex, topicIndex, e) => {
    const updated = [...course.modules];
    updated[moduleIndex].topics[topicIndex][e.target.name] = e.target.value;
    setCourse({ ...course, modules: updated });
  };

  const updateNestedObject = (moduleIndex, topicIndex, section, field, value) => {
    const updated = [...course.modules];
    updated[moduleIndex].topics[topicIndex][section][field] = value;
    setCourse({ ...course, modules: updated });
  };

  const updateQuiz = (moduleIndex, topicIndex, quizIndex, e) => {
    const updated = [...course.modules];
    updated[moduleIndex].topics[topicIndex].quiz[quizIndex][e.target.name] =
      e.target.value;
    setCourse({ ...course, modules: updated });
  };

  const updateAssignment = (moduleIndex, topicIndex, assignmentIndex, value) => {
    const updated = [...course.modules];
    updated[moduleIndex].topics[topicIndex].assignments[
      assignmentIndex
    ].question = value;
    setCourse({ ...course, modules: updated });
  };

  const updateTask = (moduleIndex, topicIndex, taskIndex, value) => {
    const updated = [...course.modules];
    updated[moduleIndex].topics[topicIndex].tasks[taskIndex].taskQuestion =
      value;
    setCourse({ ...course, modules: updated });
  };

  const addModule = () => {
    setCourse({
      ...course,
      modules: [
        ...course.modules,
        {
          moduleName: "",
          periodDays: "",
          topics: [JSON.parse(JSON.stringify(emptyTopic))],
        },
      ],
    });
  };

  const addTopic = (moduleIndex) => {
    const updated = [...course.modules];
    updated[moduleIndex].topics.push(JSON.parse(JSON.stringify(emptyTopic)));
    setCourse({ ...course, modules: updated });
  };

  const addQuiz = (moduleIndex, topicIndex) => {
    const updated = [...course.modules];
    updated[moduleIndex].topics[topicIndex].quiz.push({
      question: "",
      option1: "",
      option2: "",
      option3: "",
      option4: "",
      correctAnswer: "",
    });
    setCourse({ ...course, modules: updated });
  };

  const addAssignment = (moduleIndex, topicIndex) => {
    const updated = [...course.modules];
    updated[moduleIndex].topics[topicIndex].assignments.push({ question: "" });
    setCourse({ ...course, modules: updated });
  };

  const addTask = (moduleIndex, topicIndex) => {
    const updated = [...course.modules];
    updated[moduleIndex].topics[topicIndex].tasks.push({ taskQuestion: "" });
    setCourse({ ...course, modules: updated });
  };

  const saveCourse = async (e) => {
    e.preventDefault();

    if (!course.name || !course.duration || !course.fees) {
      alert("Please fill course name, duration and fees");
      return;
    }

    await axios.post(API, course);
    alert("Course added successfully");

    setCourse(JSON.parse(JSON.stringify(emptyCourse)));
    getCourses();
  };

  const deleteCourse = async (id) => {
    await axios.delete(`${API}/${id}`);
    getCourses();
  };

  return (
    <div style={pageStyle}>
      <div style={formCard}>
        <h2>Add Course</h2>
        <p style={{ color: "#64748b" }}>
          Course → Modules → Topics → Quiz / Article / Class / Assignment / Task
        </p>

        <form onSubmit={saveCourse}>
          <div style={grid3}>
            <input
              name="name"
              value={course.name}
              onChange={updateCourseField}
              placeholder="Course Name"
              style={inputStyle}
            />
            <input
              name="duration"
              value={course.duration}
              onChange={updateCourseField}
              placeholder="Course Duration e.g. 6 Months"
              style={inputStyle}
            />
            <input
              name="fees"
              value={course.fees}
              onChange={updateCourseField}
              placeholder="Course Fees"
              style={inputStyle}
            />
          </div>

          <textarea
            name="description"
            value={course.description}
            onChange={updateCourseField}
            placeholder="Course Description"
            style={{ ...inputStyle, height: "80px", marginTop: "12px" }}
          />

          {course.modules.map((module, moduleIndex) => (
            <div key={moduleIndex} style={moduleBox}>
              <h3>Module {moduleIndex + 1}</h3>

              <div style={grid2}>
                <input
                  name="moduleName"
                  value={module.moduleName}
                  onChange={(e) => updateModuleField(moduleIndex, e)}
                  placeholder="Module Name e.g. HTML"
                  style={inputStyle}
                />
                <input
                  name="periodDays"
                  value={module.periodDays}
                  onChange={(e) => updateModuleField(moduleIndex, e)}
                  placeholder="Approx Period Days e.g. 15 Days"
                  style={inputStyle}
                />
              </div>

              {module.topics.map((topic, topicIndex) => (
                <div key={topicIndex} style={topicBox}>
                  <h4>Topic {topicIndex + 1}</h4>

                  <div style={grid2}>
                    <input
                      name="topicName"
                      value={topic.topicName}
                      onChange={(e) =>
                        updateTopicName(moduleIndex, topicIndex, e)
                      }
                      placeholder="Topic Name"
                      style={inputStyle}
                    />
                    <input
                      name="sessionClass"
                      value={topic.sessionClass}
                      onChange={(e) =>
                        updateTopicName(moduleIndex, topicIndex, e)
                      }
                      placeholder="Session / Class"
                      style={inputStyle}
                    />
                  </div>

                  <div style={sectionBox}>
                    <h5>Quiz</h5>
                    {topic.quiz.map((quiz, quizIndex) => (
                      <div key={quizIndex} style={innerBox}>
                        <input
                          name="question"
                          value={quiz.question}
                          onChange={(e) =>
                            updateQuiz(
                              moduleIndex,
                              topicIndex,
                              quizIndex,
                              e
                            )
                          }
                          placeholder="Quiz Question"
                          style={inputStyle}
                        />

                        <div style={grid2}>
                          <input
                            name="option1"
                            value={quiz.option1}
                            onChange={(e) =>
                              updateQuiz(
                                moduleIndex,
                                topicIndex,
                                quizIndex,
                                e
                              )
                            }
                            placeholder="Option 1"
                            style={inputStyle}
                          />
                          <input
                            name="option2"
                            value={quiz.option2}
                            onChange={(e) =>
                              updateQuiz(
                                moduleIndex,
                                topicIndex,
                                quizIndex,
                                e
                              )
                            }
                            placeholder="Option 2"
                            style={inputStyle}
                          />
                          <input
                            name="option3"
                            value={quiz.option3}
                            onChange={(e) =>
                              updateQuiz(
                                moduleIndex,
                                topicIndex,
                                quizIndex,
                                e
                              )
                            }
                            placeholder="Option 3"
                            style={inputStyle}
                          />
                          <input
                            name="option4"
                            value={quiz.option4}
                            onChange={(e) =>
                              updateQuiz(
                                moduleIndex,
                                topicIndex,
                                quizIndex,
                                e
                              )
                            }
                            placeholder="Option 4"
                            style={inputStyle}
                          />
                        </div>

                        <input
                          name="correctAnswer"
                          value={quiz.correctAnswer}
                          onChange={(e) =>
                            updateQuiz(
                              moduleIndex,
                              topicIndex,
                              quizIndex,
                              e
                            )
                          }
                          placeholder="Correct Answer"
                          style={inputStyle}
                        />
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => addQuiz(moduleIndex, topicIndex)}
                      style={smallBtn}
                    >
                      + Add Quiz
                    </button>
                  </div>

                  <div style={sectionBox}>
                    <h5>Article</h5>
                    <textarea
                      value={topic.article.text}
                      onChange={(e) =>
                        updateNestedObject(
                          moduleIndex,
                          topicIndex,
                          "article",
                          "text",
                          e.target.value
                        )
                      }
                      placeholder="Article Text"
                      style={{ ...inputStyle, height: "90px" }}
                    />
                    <input
                      value={topic.article.file}
                      onChange={(e) =>
                        updateNestedObject(
                          moduleIndex,
                          topicIndex,
                          "article",
                          "file",
                          e.target.value
                        )
                      }
                      placeholder="Article File Link / PDF Link"
                      style={inputStyle}
                    />
                  </div>

                  <div style={sectionBox}>
                    <h5>Recorded Class</h5>
                    <input
                      value={topic.recordedClass.title}
                      onChange={(e) =>
                        updateNestedObject(
                          moduleIndex,
                          topicIndex,
                          "recordedClass",
                          "title",
                          e.target.value
                        )
                      }
                      placeholder="Recorded Class Title"
                      style={inputStyle}
                    />
                    <input
                      value={topic.recordedClass.videoUrl}
                      onChange={(e) =>
                        updateNestedObject(
                          moduleIndex,
                          topicIndex,
                          "recordedClass",
                          "videoUrl",
                          e.target.value
                        )
                      }
                      placeholder="Recorded Class Video URL"
                      style={inputStyle}
                    />
                  </div>

                  <div style={sectionBox}>
                    <h5>Assignments</h5>
                    {topic.assignments.map((assignment, assignmentIndex) => (
                      <input
                        key={assignmentIndex}
                        value={assignment.question}
                        onChange={(e) =>
                          updateAssignment(
                            moduleIndex,
                            topicIndex,
                            assignmentIndex,
                            e.target.value
                          )
                        }
                        placeholder="Assignment Question"
                        style={inputStyle}
                      />
                    ))}

                    <button
                      type="button"
                      onClick={() => addAssignment(moduleIndex, topicIndex)}
                      style={smallBtn}
                    >
                      + Add Assignment
                    </button>
                  </div>

                  <div style={sectionBox}>
                    <h5>Tasks</h5>
                    {topic.tasks.map((task, taskIndex) => (
                      <input
                        key={taskIndex}
                        value={task.taskQuestion}
                        onChange={(e) =>
                          updateTask(
                            moduleIndex,
                            topicIndex,
                            taskIndex,
                            e.target.value
                          )
                        }
                        placeholder="Task Question"
                        style={inputStyle}
                      />
                    ))}

                    <button
                      type="button"
                      onClick={() => addTask(moduleIndex, topicIndex)}
                      style={smallBtn}
                    >
                      + Add Task
                    </button>
                  </div>

                  <div style={sectionBox}>
                    <h5>Reference Material</h5>
                    <input
                      value={topic.referenceMaterial.text}
                      onChange={(e) =>
                        updateNestedObject(
                          moduleIndex,
                          topicIndex,
                          "referenceMaterial",
                          "text",
                          e.target.value
                        )
                      }
                      placeholder="Reference Text"
                      style={inputStyle}
                    />
                    <input
                      value={topic.referenceMaterial.file}
                      onChange={(e) =>
                        updateNestedObject(
                          moduleIndex,
                          topicIndex,
                          "referenceMaterial",
                          "file",
                          e.target.value
                        )
                      }
                      placeholder="Reference File Link"
                      style={inputStyle}
                    />
                    <input
                      value={topic.referenceMaterial.link}
                      onChange={(e) =>
                        updateNestedObject(
                          moduleIndex,
                          topicIndex,
                          "referenceMaterial",
                          "link",
                          e.target.value
                        )
                      }
                      placeholder="Reference Website / URL"
                      style={inputStyle}
                    />
                  </div>

                  <div style={sectionBox}>
                    <h5>Video Assignment</h5>
                    <input
                      value={topic.videoAssignment.question}
                      onChange={(e) =>
                        updateNestedObject(
                          moduleIndex,
                          topicIndex,
                          "videoAssignment",
                          "question",
                          e.target.value
                        )
                      }
                      placeholder="Video Assignment Question"
                      style={inputStyle}
                    />
                    <div style={studentUploadBox}>
                      Student video upload space will show in student panel.
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() => addTopic(moduleIndex)}
                style={smallBtn}
              >
                + Add Topic
              </button>
            </div>
          ))}

          <button type="button" onClick={addModule} style={greenBtn}>
            + Add Module
          </button>

          <button type="submit" style={blueBtn}>
            Save Course
          </button>
        </form>
      </div>

      <div style={formCard}>
        <h2>Added Courses</h2>

        {courses.length === 0 ? (
          <p>No course added yet.</p>
        ) : (
          courses.map((item) => (
            <div key={item.id || item._id} style={courseCard}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <h3>{item.name}</h3>
                  <p>
                    <b>Duration:</b> {item.duration} | <b>Fees:</b> {item.fees}
                  </p>
                  <p>{item.description}</p>
                </div>

                <button
                  onClick={() => deleteCourse(item.id || item._id)}
                  style={deleteBtn}
                >
                  Delete
                </button>
              </div>

              {item.modules?.map((mod, i) => (
                <div key={i} style={moduleShowBox}>
                  <h4>
                    Module {i + 1}: {mod.moduleName}
                  </h4>
                  <p>
                    <b>Period Days:</b> {mod.periodDays}
                  </p>

                  {mod.topics?.map((top, j) => (
                    <div key={j} style={topicShowBox}>
                      <h5>
                        Topic {j + 1}: {top.topicName}
                      </h5>
                      <p>
                        <b>Session/Class:</b> {top.sessionClass}
                      </p>

                      <p>
                        <b>Quiz:</b> {top.quiz?.length || 0} questions
                      </p>
                      <p>
                        <b>Assignments:</b> {top.assignments?.length || 0}
                      </p>
                      <p>
                        <b>Tasks:</b> {top.tasks?.length || 0}
                      </p>
                      <p>
                        <b>Article:</b> {top.article?.text || top.article?.file || "No article"}
                      </p>
                      <p>
                        <b>Recorded Class:</b>{" "}
                        {top.recordedClass?.videoUrl || "No video"}
                      </p>
                      <p>
                        <b>Reference:</b>{" "}
                        {top.referenceMaterial?.link ||
                          top.referenceMaterial?.file ||
                          top.referenceMaterial?.text ||
                          "No reference"}
                      </p>
                      <p>
                        <b>Video Assignment:</b>{" "}
                        {top.videoAssignment?.question || "No question"}
                      </p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const pageStyle = {
  padding: "30px",
  background: "#f4f7fb",
  minHeight: "100vh",
};

const formCard = {
  background: "#fff",
  padding: "25px",
  borderRadius: "18px",
  boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
  marginBottom: "25px",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid #cbd5e1",
  outline: "none",
  marginBottom: "10px",
};

const grid2 = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "12px",
};

const grid3 = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr",
  gap: "12px",
};

const moduleBox = {
  background: "#f8fafc",
  padding: "18px",
  borderRadius: "14px",
  border: "1px solid #e2e8f0",
  marginBottom: "18px",
  marginTop: "20px",
};

const topicBox = {
  background: "#ffffff",
  padding: "18px",
  borderRadius: "12px",
  border: "1px solid #e5e7eb",
  marginBottom: "16px",
};

const sectionBox = {
  background: "#f8fafc",
  padding: "15px",
  borderRadius: "12px",
  border: "1px solid #e2e8f0",
  marginTop: "15px",
};

const innerBox = {
  background: "#fff",
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid #e5e7eb",
  marginBottom: "12px",
};

const studentUploadBox = {
  marginTop: "10px",
  padding: "15px",
  borderRadius: "10px",
  border: "1px dashed #94a3b8",
  color: "#475569",
  background: "#fff",
};

const courseCard = {
  background: "#f8fafc",
  padding: "18px",
  borderRadius: "14px",
  border: "1px solid #e2e8f0",
  marginBottom: "18px",
};

const moduleShowBox = {
  background: "#eef2ff",
  padding: "14px",
  borderRadius: "12px",
  marginTop: "12px",
};

const topicShowBox = {
  background: "#fff",
  padding: "12px",
  borderRadius: "10px",
  marginTop: "10px",
};

const blueBtn = {
  background: "#4f46e5",
  color: "#fff",
  border: "none",
  padding: "12px 20px",
  borderRadius: "10px",
  marginLeft: "10px",
};

const greenBtn = {
  background: "#bbf7d0",
  color: "#166534",
  border: "none",
  padding: "12px 20px",
  borderRadius: "10px",
};

const smallBtn = {
  background: "#e0e7ff",
  color: "#3730a3",
  border: "none",
  padding: "9px 14px",
  borderRadius: "8px",
  marginTop: "8px",
};

const deleteBtn = {
  background: "#ef4444",
  color: "#fff",
  border: "none",
  padding: "8px 14px",
  borderRadius: "8px",
  height: "40px",
};

export default AdminCourses;