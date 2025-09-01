import React, { useState, useEffect } from "react";
import PomodoroTimer from "./components/pomodoro";
import { auth } from "./firebase";
import { Container, Row, Col, Card } from "react-bootstrap";
import Tasks from "./components/tasks";
import Calendar from "./calendar";

function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Firebase Auth listener to get the current user
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        const firstName = currentUser.displayName
          ? currentUser.displayName.split(" ")[0]
          : "User";
        setUser({
          name: firstName,
          photoURL: currentUser.photoURL || "default-profile.png",
        });
      } else {
        setUser(null); // User is signed out
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <Container
      fluid
      className="mt-0"
      style={{
        paddingTop: "40px",
        backgroundColor: "grey", // Set background to white
        minHeight: "100vh", // Ensure it covers the full viewport
      }}
    >
      <Row className="justify-content-center text-center">
        <Col xs={12}>
          {user && (
            <h1 style={{ color: "white" }}>
              Welcome to Your Dashboard, {user.name}!
            </h1>
          )}
          <p style={{ color: "white" }} className="lead">
            Manage your time and tasks efficiently with TimeWise
          </p>
        </Col>
      </Row>

      <Container style={{ marginTop: "20px" }}>
        <Row>
          <Col md={4}>
            <div className="timer-container">
              <PomodoroTimer />
            </div>
          </Col>

          <Col md={4}>
            <Card className="shadow-sm mb-4" style={{ minHeight: "30vh" }}>
              <Card.Body>
                <Calendar />
              </Card.Body>
            </Card>
          </Col>

          <Col md={4} style={{ marginTop: "60px" }}>
            <div className="tasks-container">
              <Tasks />
            </div>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

export default Home;
