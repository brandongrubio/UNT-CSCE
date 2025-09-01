import React, { useState, useEffect } from "react";
import {
  Button,
  Container,
  Row,
  Col,
  ProgressBar,
  Card,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function PomodoroTimer() {
  const [time, setTime] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isWork, setIsWork] = useState(true);
  const [workDuration, setWorkDuration] = useState(25 * 60);
  const [breakDuration, setBreakDuration] = useState(5 * 60);

  useEffect(() => {
    let timer;
    if (isRunning && time > 0) {
      timer = setInterval(() => setTime((prev) => prev - 1), 1000);
    } else if (time === 0) {
      setIsWork(!isWork);
      setTime(isWork ? breakDuration : workDuration);
    }
    return () => clearInterval(timer);
  }, [isRunning, time, isWork, workDuration, breakDuration]);

  const handleStartPause = () => setIsRunning(!isRunning);
  const handleReset = () => {
    setIsRunning(false);
    setIsWork(true);
    setTime(workDuration);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <Container className="d-flex justify-content-center mt-5 ">
      <Card
        style={{ width: "24rem" }}
        className="card-bg text-center p-3 shadow"
      >
        <Card.Body>
          <Card.Title>Pomodoro Timer</Card.Title>
          <Card.Subtitle className="mb-3 text-muted">
            {isWork ? "Work Time" : "Break Time"}
          </Card.Subtitle>
          <div className="display-4">{formatTime(time)}</div>
          <ProgressBar
            now={
              (((isWork ? workDuration : breakDuration) - time) /
                (isWork ? workDuration : breakDuration)) *
              100
            }
            striped
            variant={isWork ? "primary" : "success"}
            className="my-3"
          />
          <Row className="mt-4">
            <Col>
              <Button variant="primary" onClick={handleStartPause}>
                {isRunning ? "Pause" : "Start"}
              </Button>{" "}
              <Button variant="secondary" onClick={handleReset}>
                Reset
              </Button>
            </Col>
          </Row>
          <Row className="mt-4">
            <Col>
              <label>Work Duration: </label>
              <input
                type="number"
                value={workDuration / 60}
                onChange={(e) => setWorkDuration(e.target.value * 60)}
                className="form-control"
              />
            </Col>
            <Col>
              <label>Break Duration: </label>
              <input
                type="number"
                value={breakDuration / 60}
                onChange={(e) => setBreakDuration(e.target.value * 60)}
                className="form-control"
              />
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default PomodoroTimer;
