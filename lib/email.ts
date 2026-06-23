import { sendEmailNodemailer } from "./email-nodemailer";

// Use Nodemailer as the primary email service
export async function sendEmail(
  email: string,
  categories: string,
  article_count: number,
  newsletter_content: string
) {
  return sendEmailNodemailer(
    email,
    categories,
    article_count,
    newsletter_content
  );
}
