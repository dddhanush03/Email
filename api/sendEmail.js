import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, phone, company, job, hearAbout, message } = req.body;

  if (!name || !email || !phone || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
    //   auth: {
    //     user: "dhanush.questk2@gmail.com",
    //     pass: "ujhw vtjs lscy lill", // your app password
    //   },
    auth: {
  user: process.env.EMAIL_USER,
  pass: process.env.EMAIL_PASS,
},

    });

    const mailOptions = {
      from: `"Contact Form" <${email}>`,
      to: "dhanush.questk2@gmail.com",
      subject: `New Contact Form Submission from ${name}`,
      text: `
Name: ${name}
Email: ${email}
Phone: ${phone}
Company: ${company}
Job Title: ${job}
Heard About: ${hearAbout}
Message: ${message}
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Error sending email:", err);
    res.status(500).json({ error: "Failed to send email" });
  }
}
