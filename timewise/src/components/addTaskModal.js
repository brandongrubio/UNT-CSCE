import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

function AddTaskModal({ user, showModal, setShowModal, taskToEdit }) {
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    dueDate: "",
    dueTime: "",
    category: "",
    priority: "Normal",
  });

  // Pre-fill the modal with the taskToEdit data when it changes
  useEffect(() => {
    if (taskToEdit) {
      setTaskData(taskToEdit);
    } else {
      setTaskData({
        title: "",
        description: "",
        dueDate: "",
        dueTime: "",
        category: "",
        priority: "Normal",
      });
    }
  }, [taskToEdit]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveTask = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      if (taskToEdit) {
        // Edit existing task
        const taskDoc = doc(db, "users", user.uid, "tasks", taskToEdit.id);
        await updateDoc(taskDoc, taskData);
      } else {
        // Add new task
        await addDoc(collection(db, "users", user.uid, "tasks"), {
          ...taskData,
          completed: false,
        });
      }
      setShowModal(false); // Close modal
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  return (
    <Modal
      show={showModal}
      onHide={() => setShowModal(false)}
      centered
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>{taskToEdit ? "Edit Task" : "Add Task"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSaveTask}>
          <Form.Group className="mb-3">
            <Form.Label>Task Name</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={taskData.title || ""}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              value={taskData.description || ""}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Due Date</Form.Label>
            <Form.Control
              type="date"
              name="dueDate"
              value={taskData.dueDate || ""}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Specific Time</Form.Label>
            <Form.Control
              type="time"
              name="dueTime"
              value={taskData.dueTime || ""}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Control
              type="text"
              name="category"
              value={taskData.category || ""}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Priority</Form.Label>
            <Form.Select
              name="priority"
              value={taskData.priority || ""}
              onChange={handleInputChange}
            >
              <option value="High">High</option>
              <option value="Normal">Normal</option>
              <option value="Low">Low</option>
            </Form.Select>
          </Form.Group>
          <Button type="submit" variant="success" className="me-2">
            {taskToEdit ? "Save Changes" : "Add Task"}
          </Button>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default AddTaskModal;