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
        user: "dhanush.questk2@gmail.com",
        pass: "ujhw vtjs lscy lill", // your Gmail app password
      },
    });

    // Generate HTML table automatically from fields
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

    const htmlContent = `
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

    const mailOptions = {
      from: `"Contact Form" <${formData.email}>`,
      to: "dhanush.questk2@gmail.com",
      subject: `New Contact Form Submission from ${formData.name}`,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Error sending email:", err);
    res.status(500).json({ error: "Failed to send email" });
  }
}
