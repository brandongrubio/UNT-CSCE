// Importing required modules
const functions = require("firebase-functions");
const admin = require("firebase-admin"); // Required to use firebase services like firestore, auth, realtime databse.
const { google } = require("googleapis"); // This is a library that provides Gmail API
const nodemailer = require("nodemailer"); // Required to send emails from the application

admin.initializeApp(); // Initializing the Firebase Admin SDK which gives access to the Firebase Services
const db = admin.firestore(); // Sets the existing firabse database to interact with it.

// Gmail API credentials
const CLIENT_ID =
  "1026184317396-m5jmgfp2miq0kdt96p8jbrse05a4nm0s.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REFRESH_TOKEN =
  "1//04hAKczZB7KtZCgYIARAAGAQSNwF-L9IrXVI4MvBbTq_hY35c3thUc-CW4gNi6WzZRbd0brp0zrtVIMuIsicJP3JqpVKupD8BRjw";
const REDIRECT_URI = "https://developers.google.com/oauthplayground";

// Initializing OAuth2 client for authentication and authorization
const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN }); //Setting the crdentials needed for authentication which is the access token to the client
// The refresh token enables the function to get new access token automatically.
// Function to send email using Gmail API
async function sendEmail(recipient, subject, message) {
  try {
    const accessToken = await oAuth2Client.getAccessToken(); //Stores a new access token

    //Creating a nodemailer transporter which handles the emails to be sent
    const transport = nodemailer.createTransport({
      service: "gmail", // type of email
      //All the required credentials for sending emails through the Gmail API
      auth: {
        type: "OAuth2",
        user: "timewise02@gmail.com",
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    //Options of the email containing the content
    const email = {
      from: "TimeWise <timewise02@gmail.com>",
      to: `${recipient}`,
      subject: `${subject}`,
      text: `${message}`,
      html: `<h1>${message}</h1>`,
    };

    const result = await transport.sendMail(email); //Sends the email and waits for completion
    return result;
  } catch (error) {
    console.error("Error sending email:", error.message);
  }
}

// Firebase function
exports.sendTaskReminders = functions.https.onRequest(async (req, res) => {
  try {
    const usersSnapshot = await db.collection("users").get(); //Takes a snapshot of the users collection
    const currentDate = new Date().toISOString().split("T")[0]; //Gets the current dat to compare

    for (const userDoc of usersSnapshot.docs) {
      const userId = userDoc.id; //retrieves the user ID to retrieve the user email

      const userRecord = await admin.auth().getUser(userId);
      const email = userRecord.email; // Gets the user emails from the uid

      if (!email) {
        console.warn(`No email found for user with UID: ${userId}`);
        continue;
      }

      const tasksSnapshot = await db.collection(`users/${userId}/tasks`).get(); //takes a snapshot of the task collection
      if (!tasksSnapshot.empty) {
        console.log(`Tasks fetched for user: ${email}`);
      } else {
        console.log(`No tasks found for user: ${email}`);
      }
      const dueTasks = tasksSnapshot.docs
        .map((taskDoc) => taskDoc.data())
        .filter((task) => task.dueDate === currentDate); //Creates an objects of  all the tasks which due date is the current date

      if (dueTasks.length > 0) {
        const taskList = dueTasks
          .map((task) => `- ${task.title} (Due: ${task.dueDate})`)
          .join("\n");

        const subject = "Task Reminder";
        const message = `Hello, here are your tasks due today:\n\n${taskList}`;
        await sendEmail(email, subject, message);
      } else {
        console.log(`No tasks due today for user with email: ${email}`);
      }
    }

    console.log("Task reminders processed successfully.");
    res.status(200).send("Task reminders processed successfully.");
  } catch (error) {
    console.error("Error sending task reminders:", error);
    res.status(500).send("Error sending task reminders.");
  }
});
