// controllers/contactController.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const sendContactMail = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Configure transporter for Gmail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    // Email content
    const mailOptions = {
      from: `"SAT Scorer Contact" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER, // admin email
      subject: `📩 New Contact Form Message - ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f8f8f8;">
          <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
            <div style="background-color: #f97316; color: white; padding: 15px; border-radius: 8px 8px 0 0;">
              <h2 style="margin: 0;">SAT Scorer - Contact Form</h2>
            </div>
            <div style="padding: 20px;">
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Subject:</strong> ${subject}</p>
              <p><strong>Message:</strong></p>
              <p style="white-space: pre-wrap; background: #f4f4f4; padding: 10px; border-radius: 5px;">${message}</p>
            </div>
            <div style="background-color: #f3f3f3; padding: 10px; text-align: center; border-top: 1px solid #ddd;">
              <p style="margin: 0; color: #777;">Sent via SAT Scorer Contact Form</p>
            </div>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending contact mail:", error);
    res.status(500).json({ message: "Failed to send email", error: error.message });
  }
};
