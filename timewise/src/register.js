import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
} from "react-bootstrap";
import { Navigate, Link, useNavigate } from "react-router-dom";
import { useAuth } from "./authContext";
import { doCreateUserWithEmailAndPassword } from "./auth";

const Register = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { userLoggedIn } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    setIsRegistering(true);
    try {
      await doCreateUserWithEmailAndPassword(email, password);
      navigate("/login");
    } catch (error) {
      setErrorMessage(error.message);
      setIsRegistering(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      {userLoggedIn && <Navigate to={"/home"} replace={true} />}
      <Row className="w-100 justify-content-center">
        <Col md={6} lg={4}>
          <Card className="p-4 shadow">
            <Card.Body>
              <h2 className="text-center mb-4">Create a New Account</h2>
              {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
              <Form handleSubmit={handleSubmit}>
                <Form.Group controlId="formEmail" className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="formPassword" className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isRegistering}
                  />
                </Form.Group>

                <Form.Group controlId="formConfirmPassword" className="mb-3">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={isRegistering}
                  />
                </Form.Group>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-100"
                  disabled={isRegistering}
                >
                  {isRegistering ? "Signing Up..." : "Sign Up"}
                </Button>

                <div className="text-center mt-3">
                  Already have an account?{" "}
                  <Link to="/login" className="fw-bold">
                    Continue
                  </Link>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
