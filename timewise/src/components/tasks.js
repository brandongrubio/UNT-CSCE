import React, { useState, useEffect } from "react";
import { Container, Card, Row, Col, Button } from "react-bootstrap";
import TaskList from "./taskList"; // Ensure proper capitalization for imports
import AddTaskModal from "./addTaskModal"; // Ensure proper capitalization for imports
import { getAuth, onAuthStateChanged } from "firebase/auth";

function Tasks() {
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null); // Holds the task being edited

  // Fetch authenticated user
  useEffect(() => {
    const auth = getAuth();
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setUser(user || null);
    });
    return () => unsubscribeAuth();
  }, []);

  // Handle adding a task (open modal in add mode)
  const handleAddTask = () => {
    setTaskToEdit(null); // Clear the taskToEdit state for a new task
    setShowModal(true); // Open the modal
  };

  // Handle editing a task (open modal in edit mode)
  const handleEditTask = (task) => {
    setTaskToEdit(task); // Set the task to be edited
    setShowModal(true); // Open the modal
  };

  return (
    <Container fluid className="pt-5">
      <Row className="justify-content-center">
        <Col xs={12} md={10} lg={8}>
          <Card className="text-center p-3 shadow">
            <Card.Body>
              <Card.Title>My Tasks</Card.Title>
              {/* Pass user and edit handler to TaskList */}
              <TaskList user={user} onEditTask={handleEditTask} />
              <Button variant="primary" onClick={handleAddTask}>
                Add Task
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* AddTaskModal: Used for both adding and editing tasks */}
      {showModal && (
        <AddTaskModal
          user={user}
          showModal={showModal}
          setShowModal={setShowModal}
          taskToEdit={taskToEdit} // Pass the task to edit, if any
        />
      )}
    </Container>
  );
}

export default Tasks;
