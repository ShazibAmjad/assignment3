const sgMail = require('@sendgrid/mail');

// Define CORS headers
const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST",
};

// Handler function
const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed", headers };
  }

  try {
    // Parse the request body
    const { name, email, message } = JSON.parse(event.body || "{}");

    // Validate required fields
    if (!name || !email || !message) {
      throw new Error("Please provide all required fields: name, email, message");
    }

    // Set SendGrid API key from environment variables
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const senderEmail = "shazib.amjad@gmail.com"; // Ensure this email is verified in SendGrid

    const msg = {
      to: "adam.kunz+inft@durhamcollege.ca", // Replace with your desired recipient
      from: senderEmail,
      subject: "New Contact Form Submission",
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };

    // Send the email
    await sgMail.send(msg);

    // Return success response
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Thanks for reaching out! We'll get back to you soon." }),
      headers,
    };
  } catch (error) {
    console.error("Error:", error);

    // If SendGrid provides an error response, log it for more details
    if (error.response && error.response.body) {
      console.error("SendGrid Error Response:", error.response.body);
    }

    // Return a generic error message to the client
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error sending message. Please try again later." }),
      headers,
    };
  }
};

module.exports = { handler };
