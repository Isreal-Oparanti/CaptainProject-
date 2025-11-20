"use client";
import { useState, useEffect } from "react";
import { getEmployees, saveEmployees } from "@/data/attendanceStore";

export default function EmployeesPage() {
  const defaultEmployees = [
    { id: 1, name: "Gabriel John", department: "ICT", position: "Manager" },
    {
      id: 2,
      name: "Amara Okoro",
      department: "Administration",
      position: "Supervisor",
    },
    {
      id: 3,
      name: "James Adelakun",
      department: "Finance",
      position: "Cashier",
    },
    { id: 4, name: "Sophia Ibrahim", department: "HR", position: "HR" },
    {
      id: 5,
      name: "Chioma Nwosu",
      department: "Academics",
      position: "Intern",
    },
    {
      id: 6,
      name: "Nathan Umeh",
      department: "Security",
      position: "Quality Control",
    },
    { id: 7, name: "Fatima Sule", department: "Library", position: "PRO" },
  ];

  const [employeeList, setEmployeeList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Add Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    department: "",
    position: "",
  });

  // Edit Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editEmployee, setEditEmployee] = useState({
    id: null,
    name: "",
    department: "",
    position: "",
  });

  useEffect(() => {
    const stored = getEmployees() || [];

    // Merge default employees with stored ones without duplicates
    const merged = [...stored];

    defaultEmployees.forEach((defEmp) => {
      const exists = stored.some((e) => e.id === defEmp.id);
      if (!exists) {
        merged.push(defEmp);
      }
    });

    setEmployeeList(merged);
    saveEmployees(merged);
  }, []);

  // // Add new employee
  // const handleAddEmployee = () => {
  //   const { name, department, position } = newEmployee;
  //   if (!name || !department || !position) {
  //     alert("Please fill all fields");
  //     return;
  //   }

  //   const newId = employeeList.length
  //     ? employeeList[employeeList.length - 1].id + 1
  //     : 1;

  //   const updatedList = [
  //     ...employeeList,
  //     { id: newId, name, department, position },
  //   ];

  //   setEmployeeList(updatedList);
  //   saveEmployees(updatedList);

  //   setNewEmployee({ name: "", department: "", position: "" });
  //   setShowAddModal(false);
  // };

  // Add new employee
  const handleAddEmployee = () => {
    const { name, department, position } = newEmployee;

    if (!name || !department || !position) {
      alert("Please fill all fields");
      return;
    }

    // Confirmation before adding
    const confirmAdd = window.confirm(
      `Add new employee:\n\nName: ${name}\nDepartment: ${department}\nPosition: ${position}\n\nAre you sure?`
    );
    if (!confirmAdd) return; // Cancel add

    const updated = [
      ...employeeList,
      {
        id: Date.now(),
        name,
        department,
        position,
      },
    ];

    setEmployeeList(updated);
    saveEmployees(updated);

    // Reset form fields
    setNewEmployee({ name: "", department: "", position: "" });
  };

  // Open edit modal with selected employee
  const openEditModal = (emp) => {
    setEditEmployee(emp);
    setShowEditModal(true);
  };

  // Save edited employee
  const handleSaveEdit = () => {
    const confirmSave = window.confirm(
      "Are you sure you want to save changes to this employee?"
    );
    if (!confirmSave) return; // Cancel save

    const updated = employeeList.map((emp) =>
      emp.id === editEmployee.id ? editEmployee : emp
    );

    setEmployeeList(updated);
    saveEmployees(updated);
    setShowEditModal(false);
  };

  // Delete employee
  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this employee?"
    );
    if (!confirmDelete) return; // Cancel delete

    const updated = employeeList.filter((emp) => emp.id !== id);
    setEmployeeList(updated);
    saveEmployees(updated);
  };

  const filteredEmployees = employeeList.filter((emp) =>
    emp.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="dashboard-page">
      <div className="employee-content">
        <div className="employee-content_head">
          <h1>Employee Management</h1>
        </div>

        <div className="employee-main">
          <div className="employee-search">
            <input
              type="text"
              placeholder="Search employee name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-input"
            />
            <button
              className="add-employee-btn"
              onClick={() => setShowAddModal(true)}
            >
              Add Employee
            </button>
          </div>

          <table className="Employee-Sheet">
            <thead>
              <tr>
                <th>S/N</th>
                <th>Name</th>
                <th>Department</th>
                <th>Position</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredEmployees.map((emp, index) => (
                <tr key={emp.id}>
                  <td>{index + 1}.</td>
                  <td>{emp.name}</td>
                  <td>{emp.department}</td>
                  <td>{emp.position}</td>
                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => openEditModal(emp)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(emp.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {filteredEmployees.length === 0 && (
                <tr>
                  <td colSpan="5" className="no-data">
                    No employees found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ADD EMPLOYEE MODAL */}
        {showAddModal && (
          <div className="modal-backdrop">
            <div className="modal">
              <h2>Add Employee</h2>

              <input
                type="text"
                placeholder="Name"
                value={newEmployee.name}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, name: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="Department"
                value={newEmployee.department}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, department: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="Position"
                value={newEmployee.position}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, position: e.target.value })
                }
              />

              <div className="modal-buttons">
                <button className="save-btn" onClick={handleAddEmployee}>
                  Save
                </button>
                <button
                  className="cancel-btn"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* EDIT EMPLOYEE MODAL */}
        {showEditModal && (
          <div className="modal-backdrop">
            <div className="modal">
              <h2>Edit Employee</h2>

              <input
                type="text"
                value={editEmployee.name}
                onChange={(e) =>
                  setEditEmployee({ ...editEmployee, name: e.target.value })
                }
              />

              <input
                type="text"
                value={editEmployee.department}
                onChange={(e) =>
                  setEditEmployee({
                    ...editEmployee,
                    department: e.target.value,
                  })
                }
              />

              <input
                type="text"
                value={editEmployee.position}
                onChange={(e) =>
                  setEditEmployee({ ...editEmployee, position: e.target.value })
                }
              />

              <div className="modal-buttons">
                <button className="save-btn" onClick={handleSaveEdit}>
                  Save
                </button>
                <button
                  className="cancel-btn"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
