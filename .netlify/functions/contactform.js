require('dotenv').config(); // Load environment variables from .env

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST",
};

const sgMail = require('@sendgrid/mail');

const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed", headers };
  }

  try {
    const { name, email, message } = JSON.parse(event.body || "{}");

    if (!name || !email || !message) {
      throw new Error("Please provide all required fields: name, email, message");
    }

    // Use the API key from environment variables
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const senderEmail = "shazib.amjad@gmail.com";

    const msg = {
      to: "adam.kunz+inft@durhamcollege.ca",
      from: senderEmail,
      subject: "New Contact Form Submission",
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };

    await sgMail.send(msg);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Thanks for reaching out! We'll get back to you soon." }),
      headers,
    };
  } catch (error) {
    console.error("Error:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
      headers,
    };
  }
};

module.exports = { handler };
