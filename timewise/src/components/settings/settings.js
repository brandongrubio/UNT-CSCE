import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Sidebar from "../shared/sidebar";
import ProfileSettings from "./profileSettings";
import AccountSettings from "./accountSettings";
import Notifications from "./notifications";
import ProAccount from "./proAccount";

const Settings = () => {
  const [activeSection, setActiveSection] = useState("ProfileSettings");

  const renderSection = () => {
    switch (activeSection) {
      case "ProfileSettings":
        return <ProfileSettings />;
      case "AccountSettings":
        return <AccountSettings />;
      case "Notifications":
        return <Notifications />;
      case "ProAccount":
        return <ProAccount />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-light" style={{ minHeight: "100vh", padding: "30px" }}>
      <Container>
        <Row>
          <Col md={3}>
            <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
          </Col>
          <Col md={9}>{renderSection()}</Col>
        </Row>
      </Container>
    </div>
  );
};

export default Settings;