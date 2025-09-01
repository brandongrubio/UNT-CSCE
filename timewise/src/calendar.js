import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Modal } from "react-bootstrap";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";
import { getAuth } from "firebase/auth";

function Calendar() {
  const [date, setDate] = useState(new Date());
  const [tasks, setTasks] = useState([]); // State for tasks
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.error("No user is authenticated.");
      return;
    }

    const tasksCollection = collection(db, "users", user.uid, "tasks");
    const unsubscribe = onSnapshot(tasksCollection, (snapshot) => {
      const tasksData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        priority: doc.data().priority || "Low", 
      }));
      setTasks(tasksData);
      console.log("Fetched tasks:", tasksData); // Debugging log
    });

    return () => unsubscribe();
  }, []);

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const getDaysInMonth = (month, year) =>
    new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month, year) =>
    new Date(year, month, 1).getDay();

  const currentMonth = date.getMonth();
  const currentYear = date.getFullYear();
  const today = new Date();

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDayOfMonth = getFirstDayOfMonth(currentMonth, currentYear);

  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null); // Empty cells before the first day
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day); // Add days of the current month
  }
  while (calendarDays.length % 7 !== 0) {
    calendarDays.push(null); // Fill remaining cells to complete the last week
  }

  const weeks = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7));
  }

  const handlePrevMonth = () => {
    setDate(new Date(currentYear, currentMonth - 1));
  };

  const handleNextMonth = () => {
    setDate(new Date(currentYear, currentMonth + 1));
  };

  const getTasksForDay = (day) => {
    if (!day) return [];
    const formattedDay = new Date(currentYear, currentMonth, day)
      .toISOString()
      .split("T")[0]; // Format as YYYY-MM-DD

    return tasks.filter((task) => task.dueDate === formattedDay);
  };

  const getDayColor = (dayTasks) => {
    console.log("Tasks for coloring:", dayTasks);
    if (dayTasks.some((task) => task.priority === "High")) {
      console.log("Returning color: #ff9999");
      return "#ff9999"; // Light red for high-priority tasks
    }
    if (dayTasks.some((task) => task.priority === "Normal")) {
      console.log("Returning color: #ffff99");
      return "#ffff99"; // Light yellow for normal-priority tasks
    }
    if (dayTasks.some((task) => task.priority === "Low")) {
      console.log("Returning color: #99ff99");
      return "#99ff99"; // Light green for low-priority tasks
    }
    console.log("Returning color: #ffffff");
    return "#ffffff"; // Default white for no tasks
  };

  const handleDayClick = (day) => {
    if (!day) return;
    const tasksForDay = getTasksForDay(day);
    setSelectedDate(new Date(currentYear, currentMonth, day).toDateString());
    setSelectedTasks(tasksForDay);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedDate(null);
    setSelectedTasks([]);
  };

  return (
    <Container
      fluid
      className="min-vh-40 d-flex flex-column p-4 bg-light"
    >
      {/* Navigation */}
      <Row className="my-3 justify-content-between align-items-center">
        <Col xs="auto">
          <Button onClick={handlePrevMonth} variant="outline-primary">
            Previous
          </Button>
        </Col>
        <Col className="text-center">
          <h4 className="fw-bold">
            {date.toLocaleString("default", { month: "long", year: "numeric" })}
          </h4>
        </Col>
        <Col xs="auto">
          <Button onClick={handleNextMonth} variant="outline-primary">
            Next
          </Button>
        </Col>
      </Row>

      {/* Days of the Week */}
      <Row className="text-center fw-bold">
        {daysOfWeek.map((day) => (
          <Col key={day} className="border p-2 bg-light">
            {day}
          </Col>
        ))}
      </Row>

      {/* Calendar Grid */}
      <div className="bg-white rounded shadow d-flex flex-column mt-2">
        {weeks.map((week, index) => (
          <Row key={index} className="flex-fill text-center">
            {week.map((day, idx) => {
              const isToday =
                day === today.getDate() &&
                currentMonth === today.getMonth() &&
                currentYear === today.getFullYear();

              const dayTasks = getTasksForDay(day); // Get tasks for this day
              const cellBackgroundColor = day ? getDayColor(dayTasks) : "#ffffff";

              return (
                <Col
                  key={idx}
                  className="border p-2 d-flex flex-column align-items-center justify-content-center"
                  style={{
                    height: "50px",
                    backgroundColor: isToday ? "#f0f8ff" : cellBackgroundColor, // Set cell color
                    cursor: day ? "pointer" : "default",
                  }}
                  onClick={() => handleDayClick(day)}
                >
                  <span className="fw-bold">{day || ""}</span>
                  {dayTasks.length > 0 && (
                    <small
                      className="text-primary mt-1"
                      style={{ fontSize: "12px" }}
                    >
                      {dayTasks.length} task{dayTasks.length > 1 ? "s" : ""}
                    </small>
                  )}
                </Col>
              );
            })}
          </Row>
        ))}
      </div>

      {/* Modal for displaying tasks */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Tasks for {selectedDate}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTasks.length > 0 ? (
            selectedTasks.map((task) => (
              <div
                key={task.id}
                className="mb-3 p-2"
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  backgroundColor: "#f9f9f9",
                }}
              >
                <h6 className="mb-1">{task.title}</h6>
                <p className="mb-0">{task.description || "No description"}</p>
                <small className="text-muted">
                  Due: {task.dueTime || "All day"}
                </small>
              </div>
            ))
          ) : (
            <p className="text-center text-muted">No tasks for this day.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Calendar;
