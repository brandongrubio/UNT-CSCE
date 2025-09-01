import React, { useState, useEffect } from "react";
import { Card, Form, Button, Row, Col } from "react-bootstrap";
import { auth, db } from "../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { FaPen } from "react-icons/fa";

const ProfileSettings = () => {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    location: "",
    username: "",
    bio: "",
    phoneNumber: "",
    profilePicture: "https://via.placeholder.com/150",
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const userDocRef = doc(db, "users", currentUser.uid);
          const userSnapshot = await getDoc(userDocRef);
          if (userSnapshot.exists()) {
            const userData = userSnapshot.data();
            setUser((prev) => ({
              ...prev,
              ...userData,
              profilePicture: currentUser.photoURL || prev.profilePicture,
              email: currentUser.email || prev.email,
            }));
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid);
        await setDoc(userDocRef, {
          firstName: user.firstName,
          lastName: user.lastName,
          location: user.location,
          username: user.username,
          bio: user.bio,
          phoneNumber: user.phoneNumber,
        });
        alert("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Error saving user data:", error);
      alert("Failed to save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditPicture = () => {
    alert("Edit profile picture functionality is coming soon!");
    // You can add file input or a modal for uploading a new profile picture here
  };

  return (
    <Card className="p-4 shadow-sm">
      <h5 className="mb-4">Profile Settings</h5>
      <div className="d-flex align-items-center mb-4">
        {/* Profile Picture Section */}
        <div style={{ position: "relative" }}>
          <img
            src={user.profilePicture}
            alt="Profile"
            className="rounded-circle"
            style={{
              width: "180px", // Increased size
              height: "180px",
              objectFit: "cover",
            }}
          />
          {/* Edit Icon */}
          <FaPen
            style={{
              position: "absolute",
              bottom: "10px",
              right: "10px", // Positioned properly relative to the profile picture
              cursor: "pointer",
              backgroundColor: "white",
              borderRadius: "50%",
              padding: "8px",
              fontSize: "20px", // Increased icon size
              color: "black",
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
            }}
            onClick={handleEditPicture}
            title="Edit Profile Picture"
          />
        </div>
      </div>
      <Form>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                name="firstName"
                value={user.firstName}
                onChange={handleInputChange}
                placeholder="Enter your first name"
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                name="lastName"
                value={user.lastName}
                onChange={handleInputChange}
                placeholder="Enter your last name"
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col>
            <Form.Group>
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                name="phoneNumber"
                value={user.phoneNumber}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col>
            <Form.Group>
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                name="location"
                value={user.location}
                onChange={handleInputChange}
                placeholder="Enter your location"
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={user.email}
                disabled
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col>
            <Form.Group>
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={user.username}
                onChange={handleInputChange}
                placeholder="Enter your username"
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col>
            <Form.Group>
              <Form.Label>Bio</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="bio"
                value={user.bio}
                onChange={handleInputChange}
                placeholder="Write a short bio about yourself"
              />
            </Form.Group>
          </Col>
        </Row>

        <Button
          variant="primary"
          className="mt-3"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </Form>
    </Card>
  );
};

export default ProfileSettings;
