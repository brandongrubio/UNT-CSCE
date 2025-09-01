import React from "react";
import { Card, Form } from "react-bootstrap";

const AccountSettings = () => {
  return (
    <Card className="p-4 shadow-sm">
      <h5 className="mb-4">Account Settings</h5>
      <Form>
        <h6 className="mb-3">Platform Settings</h6>
        <Form.Check
          type="switch"
          id="invite-accept-notifications"
          label="Email me when someone accepts my invite"
        />
        <Form.Check
          type="switch"
          id="invite-notifications"
          label="Email me when invites me to a task/event"
        />
        <h6 className="mt-4 mb-3">Application Settings</h6>
        <Form.Check
          type="switch"
          id="launch-updates"
          label="New launches and projects"
        />
        <Form.Check
          type="switch"
          id="product-updates"
          label="Monthly product updates"
        />
        <Form.Check
          type="switch"
          id="newsletter"
          label="Subscribe to newsletter"
        />
      </Form>
    </Card>
  );
};

export default AccountSettings;