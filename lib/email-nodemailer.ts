import nodemailer from "nodemailer";

// Create transporter using Gmail
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER, // Your Gmail address
      pass: process.env.GMAIL_APP_PASSWORD, // Your Gmail App Password (not regular password)
    },
  });
};

export async function sendEmailNodemailer(
  email: string,
  categories: string,
  article_count: number,
  newsletter_content: string
) {
  try {
    // Check if Gmail credentials are available
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      throw new Error(
        "Gmail credentials not set. Please set GMAIL_USER and GMAIL_APP_PASSWORD environment variables"
      );
    }

    // Build a simple, inline-styled, table-based template to improve deliverability
    const today = new Date();
    const dateStr = today.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const unsubscribeMailto = `mailto:${process.env.GMAIL_USER}?subject=${encodeURIComponent(
      "Unsubscribe"
    )}&body=${encodeURIComponent(`Please unsubscribe ${email} from InboxAI newsletters.`)}`;

    // Plain-text fallback (simple strip to keep it readable)
    const textContent =
      `InboxAI – ${categories} (${dateStr})\n${article_count} articles\n\n` +
      newsletter_content
        .replace(/<style[\s\S]*?<\/style>/gi, "")
        .replace(/<script[\s\S]*?<\/script>/gi, "")
        .replace(/<br\s*\/?>(?=\s*<)/gi, "\n")
        .replace(/<\/(p|div|h\d|li)>/gi, "\n\n")
        .replace(/<li>/gi, "- ")
        .replace(/<[^>]+>/g, "")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .trim();

    const emailTemplate = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>InboxAI Newsletter</title>
  </head>
  <body style="margin:0;padding:0;background:#ffffff;color:#111111;">
    <!-- Preheader (hidden) -->
    <div style="display:none!important;visibility:hidden;opacity:0;color:transparent;height:0;width:0;overflow:hidden;">
      ${categories} · ${article_count} articles · ${dateStr}
    </div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;font-family:Arial,Helvetica,sans-serif;">
            <tr>
              <td style="padding:16px 20px;">
                <div style="font-size:18px;font-weight:700;line-height:1.4;">InboxAI</div>
                <div style="font-size:12px;color:#555;margin-top:4px;">${categories} · ${article_count} articles · ${dateStr}</div>
              </td>
            </tr>
            <tr><td style="height:1px;background:#e5e7eb;line-height:1px;font-size:0;">&nbsp;</td></tr>
            <tr>
              <td style="padding:16px 20px;font-size:14px;line-height:1.6;">
                ${newsletter_content}
              </td>
            </tr>
            <tr><td style="height:1px;background:#e5e7eb;line-height:1px;font-size:0;">&nbsp;</td></tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

    console.log(`Sending email to: ${email}`);
    console.log(`Email categories: ${categories}`);
    console.log(`Article count: ${article_count}`);

    const transporter = createTransporter();

    const mailOptions: nodemailer.SendMailOptions = {
      from: `"InboxAI" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: `Your ${categories} newsletter – ${dateStr}`,
      html: emailTemplate,
      text: textContent,
      headers: {
        // Simple List-Unsubscribe header to reduce spam likelihood
        "List-Unsubscribe": `<${unsubscribeMailto}>`,
      },
      replyTo: process.env.GMAIL_USER,
    };

    const result = await transporter.sendMail(mailOptions);

    console.log("Email sent successfully:", result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("Failed to send email:", error);
    console.error("Error details:", {
      name: error instanceof Error ? error.name : "Unknown",
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : "No stack trace",
    });
    throw error;
  }
}
