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
    // Configure transporter (Gmail App Password)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 📨 1️⃣ Email to Admin (you)
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

    const adminHtml = `
      <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <div style="background-color: #007BFF; color: white; padding: 16px; font-size: 18px;">
            📩 New Contact Form Submission
          </div>
          <table style="width: 100%; border-collapse: collapse;">
            ${tableRows}
          </table>
          <div style="padding: 12px; text-align: center; font-size: 12px; color: #777;">
            Sent automatically from your website contact form
          </div>
        </div>
      </div>
    `;

    const adminMailOptions = {
      from: `"G360 Contact Form" <${process.env.EMAIL_USER}>`,
      to: "dhanush.questk2@gmail.com",
      subject: `New Contact Form Submission from ${formData.name}`,
      html: adminHtml,
    };

    await transporter.sendMail(adminMailOptions);

    // 💌 2️⃣ Auto-Reply Email to the User
    const userHtml = `
      <div style="font-family: Arial, sans-serif; background: #f3f6fa; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="background-color: #0056b3; color: white; padding: 18px; font-size: 20px; text-align: center;">
            G360 Technologies
          </div>
          <div style="padding: 20px; line-height: 1.6; color: #333;">
            <p>Hi <strong>${formData.name}</strong>,</p>
            <p>Thank you for contacting <strong>G360 Technologies</strong>! 🎉</p>
            <p>We’ve received your message and our team will reach out to you shortly.  
            Here’s a quick summary of your submission:</p>

            <table style="width: 100%; border-collapse: collapse; margin: 10px 0;">
              ${tableRows}
            </table>

            <p style="margin-top: 15px;">If your inquiry is urgent, please email us directly at  
            <a href="mailto:contact@g360technologies.com">contact@g360technologies.com</a>.</p>

            <p>We look forward to connecting with you!</p>

            <p>Warm regards,<br>
            <strong>Team G360 Technologies</strong><br>
            <a href="https://g360technologies.com">g360technologies.com</a></p>
          </div>
          <div style="background-color: #f0f0f0; padding: 10px; text-align: center; font-size: 12px; color: #777;">
            © ${new Date().getFullYear()} G360 Technologies. All rights reserved.
          </div>
        </div>
      </div>
    `;

    const userMailOptions = {
      from: `"G360 Technologies" <${process.env.EMAIL_USER}>`,
      to: formData.email,
      subject: "Thank you for contacting G360 Technologies!",
      html: userHtml,
    };

    await transporter.sendMail(userMailOptions);

    res.status(200).json({ success: true, message: "Emails sent successfully" });
  } catch (err) {
    console.error("Error sending email:", err);
    res.status(500).json({ error: "Failed to send emails" });
  }
}
