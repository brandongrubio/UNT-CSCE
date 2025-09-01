import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Alert,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { doSignInWithEmailAndPassword, doSignInWithGoogle } from "./auth";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (!isSigningIn) {
        setIsSigningIn(true);
        await doSignInWithEmailAndPassword(email, password);
        navigate("/home");
      }
      alert("Logged in successfully!");
    } catch (error) {
      setError("Failed to log in: " + error.message);
      setIsSigningIn(false);
    }
  };

  const onGoogleSignIn = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setIsSigningIn(true);
      await doSignInWithGoogle();
      navigate("/home");
      alert("Logged in successfully!"); // Navigate to the home page or a specific page after successful login
    } catch (error) {
      setError("Google Sign-In failed: " + error.message);
      setIsSigningIn(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Row className="w-100 justify-content-center">
        <Col md={6} lg={4}>
          <Card className="p-4 shadow">
            <Card.Body>
              <h2 className="text-center mb-4">Login</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
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
                  />
                </Form.Group>
                <Button type="submit" variant="primary" className="w-100 mb-3">
                  Login
                </Button>
              </Form>
              <Button
                onClick={onGoogleSignIn}
                variant="outline-danger"
                className="w-100"
                disabled={isSigningIn}
              >
                Sign in with Google
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
