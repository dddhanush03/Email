import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const formData = req.body;

  if (!formData.name || !formData.email || !formData.message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const tableRows = Object.entries(formData)
      .map(
        ([key, value]) => `
          <tr>
            <td style="padding: 8px; font-weight: bold; text-transform: capitalize;">${key}</td>
            <td style="padding: 8px;">${value || "-"}</td>
          </tr>
        `
      )
      .join("");

    // Admin mail
    const adminHtml = `
      <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <div style="background-color: #007BFF; color: white; padding: 16px; font-size: 18px;">
            📩 New Contact Form Submission
          </div>
          <table style="width: 100%; border-collapse: collapse;">
            ${tableRows}
          </table>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"G360 Contact Form" <${process.env.EMAIL_USER}>`,
      to: "dhanush.questk2@gmail.com",
      subject: `New Contact Form Submission from ${formData.name}`,
      html: adminHtml,
      replyTo: formData.email,
    });
    console.log("✅ Admin email sent");

    // User mail
    const userHtml = `
      <div style="font-family: Arial, sans-serif; background: #f3f6fa; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="background-color: #0056b3; color: white; padding: 18px; font-size: 20px; text-align: center;">
            G360 Technologies
          </div>
          <div style="padding: 20px; line-height: 1.6; color: #333;">
            <p>Hi <strong>${formData.name}</strong>,</p>
            <p>Thank you for contacting <strong>G360 Technologies</strong>! 🎉</p>
            <p>We’ve received your message and our team will reach out to you shortly.</p>
            <p>Warm regards,<br>
            <strong>Team G360 Technologies</strong><br>
            <a href="https://g360technologies.com">g360technologies.com</a></p>
          </div>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"G360 Technologiess" <${process.env.EMAIL_USER}>`,
      to: formData.email,
      subject: "Thank you for contacting G360 Technologies!",
      html: userHtml,
    });
    console.log("✅ User email sent to:", formData.email);

    res.status(200).json({ success: true, message: "Emails sent successfully" });
  } catch (err) {
    console.error("❌ Error sending email:", err);
    res.status(500).json({ error: "Failed to send emails" });
  }
}
