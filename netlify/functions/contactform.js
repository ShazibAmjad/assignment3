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
    const { name, email, phone, subject, message } = JSON.parse(event.body || "{}");

    // Validate required fields
    if (!name || !email || !message) {
      throw new Error("Please provide all required fields: name, email, message");
    }

    // Set SendGrid API key from environment variables
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const senderEmail = "shazib.amjad@gmail.com"; // Ensure this email is verified in SendGrid

    // Define subject prefix
    const subjectPrefix = "[Auto-Message] ";

    // Define email to yourself
    const msgToSelf = {
      to: senderEmail,
      from: senderEmail,
      subject: `${subjectPrefix}${subject}`,
      text: `You have received a new contact form submission:\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nSubject: ${subject}\nMessage: ${message}`,
    };

    // Define email to Adam
    const msgToAdam = {
      to: "adam.kunz+inft@durhamcollege.ca",
      from: senderEmail,
      subject: `${subjectPrefix}${subject}`,
      text: `You have received a new contact form submission:\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nSubject: ${subject}\nMessage: ${message}`,
    };

    // Send both emails
    await sgMail.send(msgToSelf);
    await sgMail.send(msgToAdam);

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
