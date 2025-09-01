// Home.js
import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import preLoginBar from "./components/preLoginBar";

function LandingPage() {
  return (
    <>
      <preLoginBar />
      <Container
        fluid
        className="d-flex justify-content-center align-items-center"
        style={{
          backgroundImage: "url('/background.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "100vh",
        }}
      >
        This is the landing page
      </Container>
    </>
  );
}

export default LandingPage;
