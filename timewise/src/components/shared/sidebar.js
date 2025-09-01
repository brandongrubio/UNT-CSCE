import React from "react";

const Sidebar = ({ activeSection, setActiveSection }) => {
  return (
    <div>
      <h5 className="mb-4">Settings</h5>
      <ul className="list-unstyled">
        <li
          className={`mb-3 ${
            activeSection === "ProfileSettings" ? "fw-bold text-primary" : "text-dark"
          }`}
          onClick={() => setActiveSection("ProfileSettings")}
          style={{ cursor: "pointer" }}
        >
          Profile Settings
        </li>
        <li
          className={`mb-3 ${
            activeSection === "AccountSettings" ? "fw-bold text-primary" : "text-dark"
          }`}
          onClick={() => setActiveSection("AccountSettings")}
          style={{ cursor: "pointer" }}
        >
          Account Settings
        </li>
        <li
          className={`mb-3 ${
            activeSection === "Notifications" ? "fw-bold text-primary" : "text-dark"
          }`}
          onClick={() => setActiveSection("Notifications")}
          style={{ cursor: "pointer" }}
        >
          Notifications
        </li>
        <li
          className={`mb-3 ${
            activeSection === "ProAccount" ? "fw-bold text-primary" : "text-dark"
          }`}
          onClick={() => setActiveSection("ProAccount")}
          style={{ cursor: "pointer" }}
        >
          PRO Account
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;