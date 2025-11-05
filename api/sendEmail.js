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
    // Configure transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // your company Gmail (e.g. g360tech@gmail.com)
        pass: process.env.EMAIL_PASS,
      },
    });

    // ============================
    // 1️⃣ Send to ADMIN
    // ============================
    const adminTable = Object.entries(formData)
      .map(
        ([key, value]) => `
          <tr>
            <td style="padding: 8px; font-weight: bold; text-transform: capitalize;">${key}</td>
            <td style="padding: 8px;">${value || "-"}</td>
          </tr>
        `
      )
      .join("");

    const adminHtml = `
      <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <div style="background-color: #007BFF; color: white; padding: 16px; font-size: 18px;">
            📩 New Contact Form Submission
          </div>
          <table style="width: 100%; border-collapse: collapse;">
            ${adminTable}
          </table>
          <div style="padding: 12px; text-align: center; font-size: 12px; color: #777;">
            Sent automatically from your website contact form.
          </div>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"G360 Contact Form" <${process.env.EMAIL_USER}>`,
      to: "dhanush.questk2@gmail.com",
      subject: `New Inquiry from ${formData.name}`,
      html: adminHtml,
    });

    console.log("✅ Admin email sent successfully");

    // ============================
    // 2️⃣ Send THANK-YOU email to USER
    // ============================
    const userHtml = `
      <div style="font-family: Arial, sans-serif; background: #f3f4f6; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); text-align: center;">
          <div style="background-color: #007BFF; color: white; padding: 20px;">
            <h2 style="margin: 0;">Thank You for Contacting G360 Technologies!</h2>
          </div>
          <div style="padding: 20px; color: #333;">
            <p>Dear <strong>${formData.name}</strong>,</p>
            <p>Thank you for reaching out to <strong>G360 Technologies</strong>. We’ve received your message and our team will get back to you soon.</p>
            <p style="margin-top: 20px;">Here’s a copy of your message:</p>
            <blockquote style="font-style: italic; background: #f9fafb; padding: 10px; border-left: 4px solid #007BFF;">
              ${formData.message}
            </blockquote>
            <p>Meanwhile, feel free to explore more about us at <a href="https://g360technologies.com" target="_blank">g360technologies.com</a>.</p>
            <p style="margin-top: 20px;">Best regards,<br/><strong>The G360 Technologies Team</strong></p>
          </div>
          <div style="background-color: #f3f4f6; padding: 10px; font-size: 12px; color: #666;">
            © ${new Date().getFullYear()} G360 Technologies. All rights reserved.
          </div>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"G360 Technologies" <${process.env.EMAIL_USER}>`,
      to: formData.email,
      subject: "Thank You for Contacting G360 Technologies!",
      html: userHtml,
    });

    console.log("✅ Thank-you email sent to user:", formData.email);

    // Final response
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("❌ Error sending email:", err);
    res.status(500).json({ error: "Failed to send email" });
  }
}
