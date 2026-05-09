import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Row,
  Col,
  Card,
  Form,
  Button,
  Table,
  Badge,
} from "react-bootstrap";

function Users() {
  const [users, setUsers] = useState([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [status, setStatus] = useState("Active");

  const [menuAccess, setMenuAccess] = useState([]);
  const [editId, setEditId] = useState(null);

  const accessMenus = [
    "Dashboard",
    "Institute",
    "Course",
    "Company",
    "Students",
    "Reports",
    "Settings",
    "Attendance",
    "Exams",
    "Certificates",
  ];

  const getUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users");
      setUsers(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const handleAccess = (menu) => {
    if (menuAccess.includes(menu)) {
      setMenuAccess(menuAccess.filter((item) => item !== menu));
    } else {
      setMenuAccess([...menuAccess, menu]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newUser = {
      name,
      email,
      password,
      role,
      status,
      menuAccess,
    };

    try {
      if (editId) {
        await axios.put(`http://localhost:5000/api/users/${editId}`, newUser);
        alert("User Updated");
      } else {
        await axios.post("http://localhost:5000/api/users", newUser);
        alert("User Added");
      }

      resetForm();
      getUsers();
    } catch (error) {
      alert(error.response?.data?.message || "Operation failed");
    }
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setName(item.name || "");
    setEmail(item.email || "");
    setPassword("");
    setRole(item.role || "student");
    setStatus(item.status || "Active");
    setMenuAccess(item.menuAccess || []);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`);
      alert("User Deleted");
      getUsers();
    } catch (error) {
      console.log(error);
    }
  };

  const handleBlockUser = async (id) => {
    const confirmBlock = window.confirm("Are you sure you want to block this user?");
    if (!confirmBlock) return;

    try {
      await axios.patch(`http://localhost:5000/api/users/${id}/block`);
      alert("User Blocked");
      getUsers();
    } catch (error) {
      alert(error.response?.data?.message || "Block failed");
    }
  };

  const handleUnblockUser = async (id) => {
    const confirmUnblock = window.confirm("Are you sure you want to unblock this user?");
    if (!confirmUnblock) return;

    try {
      await axios.patch(`http://localhost:5000/api/users/${id}/unblock`);
      alert("User Unblocked");
      getUsers();
    } catch (error) {
      alert(error.response?.data?.message || "Unblock failed");
    }
  };

  const resetForm = () => {
    setEditId(null);
    setName("");
    setEmail("");
    setPassword("");
    setRole("student");
    setStatus("Active");
    setMenuAccess([]);
  };

  const getStatusBadge = (userStatus) => {
    if (userStatus === "Blocked") return "danger";
    if (userStatus === "Inactive") return "warning";
    return "success";
  };

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold">Users Management</h2>
          <p className="text-muted">Manage all platform users</p>
        </div>
      </div>

      <Row className="mb-4">
        <Col md={3}>
          <Card className="shadow-sm border-0 rounded-4 p-3">
            <h6>Total Users</h6>
            <h2>{users.length}</h2>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="shadow-sm border-0 rounded-4 p-3">
            <h6>Branch Admins</h6>
            <h2>{users.filter((u) => u.role === "branchadmin").length}</h2>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="shadow-sm border-0 rounded-4 p-3">
            <h6>Students</h6>
            <h2>{users.filter((u) => u.role === "student").length}</h2>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="shadow-sm border-0 rounded-4 p-3">
            <h6>Blocked Users</h6>
            <h2>{users.filter((u) => u.status === "Blocked").length}</h2>
          </Card>
        </Col>
      </Row>

      <Card className="shadow-sm border-0 rounded-4 p-4 mb-4">
        <h4 className="fw-bold mb-4">{editId ? "Edit User" : "Add User"}</h4>

        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Full Name</Form.Label>

                <Form.Control
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>

                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Password {editId && <small className="text-muted">(leave blank to keep old)</small>}
                </Form.Label>

                <Form.Control
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required={!editId}
                />
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Role</Form.Label>

                <Form.Select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="superadmin">Super Admin</option>
                  <option value="branchadmin">Branch Admin</option>
                  <option value="companyadmin">Company Admin</option>
                  <option value="student">Student</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>

                <Form.Select value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Blocked">Blocked</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <div className="mb-4">
            <h5 className="fw-bold mb-3">Menu Access</h5>

            <div className="d-flex flex-wrap gap-3">
              {accessMenus.map((menu, index) => (
                <Form.Check
                  key={index}
                  type="checkbox"
                  label={menu}
                  checked={menuAccess.includes(menu)}
                  onChange={() => handleAccess(menu)}
                />
              ))}
            </div>
          </div>

          <Button type="submit">{editId ? "Update User" : "Add User"}</Button>

          {editId && (
            <Button variant="secondary" className="ms-2" onClick={resetForm}>
              Cancel
            </Button>
          )}
        </Form>
      </Card>

      <Card className="shadow-sm border-0 rounded-4 p-3">
        <h4 className="fw-bold mb-3">Users List</h4>

        <Table responsive hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Access</th>
              <th>Status</th>
              <th style={{ minWidth: "260px" }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((item) => (
              <tr key={item._id}>
                <td>{item.name}</td>

                <td>{item.email}</td>

                <td>
                  <Badge bg="primary">{item.role}</Badge>
                </td>

                <td>{item.menuAccess?.length || 0} Menus</td>

                <td>
                  <Badge bg={getStatusBadge(item.status)}>
                    {item.status || "Active"}
                  </Badge>
                </td>

                <td>
                  <Button size="sm" variant="warning" onClick={() => handleEdit(item)}>
                    Edit
                  </Button>

                  {item.status === "Blocked" ? (
                    <Button
                      size="sm"
                      variant="success"
                      className="ms-2"
                      onClick={() => handleUnblockUser(item._id)}
                    >
                      Unblock
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="dark"
                      className="ms-2"
                      onClick={() => handleBlockUser(item._id)}
                    >
                      Block
                    </Button>
                  )}

                  <Button
                    size="sm"
                    variant="danger"
                    className="ms-2"
                    onClick={() => handleDelete(item._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}

export default Users;