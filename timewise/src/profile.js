import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { auth, db } from "./firebase"; // Import auth and db from your firebase config
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom"; // Import useNavigate from React Router

const UserProfile = () => {
  const [user, setUser] = useState({
    fullName: "John Doe", // Placeholder if no data is available
    email: "johndoe@example.com", // Placeholder if no data is available
    mobile: "(123) 456-7890", // Placeholder if no data is available
    location: "USA", // Placeholder if no data is available
    bio: "Hi, I'm John. Decisions shape our future, and I’m here to make meaningful ones.", // Placeholder if no data is available
    profilePicture: "", // Placeholder for profile picture
  });

  const navigate = useNavigate(); // Initialize the navigate function

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          // Fetch user data from Firestore
          const userDocRef = doc(db, "users", currentUser.uid);
          const userSnapshot = await getDoc(userDocRef);

          if (userSnapshot.exists()) {
            const userData = userSnapshot.data();
            setUser((prev) => ({
              ...prev,
              ...userData, // Merge Firestore data
              profilePicture: currentUser.photoURL || prev.profilePicture, // Fallback to Google photo
              email: currentUser.email || prev.email, // Fallback to Google email
              fullName: currentUser.displayName || prev.fullName, // Fallback to Google name
            }));
          } else {
            // If no Firestore data, use Google data
            setUser((prev) => ({
              ...prev,
              profilePicture: currentUser.photoURL || prev.profilePicture,
              email: currentUser.email || prev.email,
              fullName: currentUser.displayName || prev.fullName,
            }));
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="bg-light" style={{ minHeight: "100vh", padding: "0" }}>
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={6}>
            <Card className="shadow-sm text-center p-4">
              <div className="d-flex flex-column align-items-center">
                {user.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt="Profile"
                    className="rounded-circle"
                    style={{
                      width: "150px",
                      height: "150px",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div
                    className="rounded-circle bg-secondary text-white d-flex justify-content-center align-items-center"
                    style={{
                      width: "150px",
                      height: "150px",
                      fontSize: "40px",
                    }}
                  >
                    {user.fullName.charAt(0).toUpperCase()}
                  </div>
                )}
                <h5 className="mt-3 mb-0">{user.fullName}</h5>
                <p className="text-muted mb-1">{user.email}</p>
                <p className="text-muted mb-1">
                  <strong>Location:</strong> {user.location}
                </p>
                <p className="text-muted mb-3">
                  <strong>Mobile:</strong> {user.phoneNumber}
                </p>
                <p className="text-muted">{user.bio}</p>
                <Button
                  variant="primary"
                  className="mt-3 w-100"
                  onClick={() => navigate("/settings")} // Redirect to settings page
                >
                  Edit Profile
                </Button>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default UserProfile;