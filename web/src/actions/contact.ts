"use server";

/**
 * Contact Server Actions
 *
 * Handles sending emails for:
 * - Contact form submissions
 * - Car inquiry forms
 *
 * Uses nodemailer to send emails.
 * In production, configure SMTP settings in environment variables.
 */

import nodemailer from "nodemailer";
import {
  contactFormSchema,
  inquiryFormSchema,
  type ContactFormData,
  type InquiryFormData,
} from "@/lib/validations/car";

/**
 * Create email transporter
 *
 * In development, you can use services like:
 * - Mailtrap (for testing)
 * - Gmail with app password
 * - Ethereal (fake SMTP)
 *
 * In production, use a proper email service:
 * - SendGrid
 * - Resend
 * - AWS SES
 */
function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: Number(process.env.EMAIL_SERVER_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  });
}

/**
 * Send contact form email
 */
export async function sendContactForm(data: ContactFormData) {
  // Validate input
  const validated = contactFormSchema.safeParse(data);
  if (!validated.success) {
    return {
      error: "Validation failed",
      details: validated.error.flatten().fieldErrors,
    };
  }

  const { name, email, phone, subject, message } = validated.data;
  const recipient = process.env.CONTACT_EMAIL || process.env.EMAIL_SERVER_USER;

  if (!recipient) {
    console.error("No recipient email configured");
    return { error: "Email configuration error" };
  }

  try {
    const transporter = getTransporter();

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || email,
      to: recipient,
      replyTo: email,
      subject: `[Website Contact] ${subject}`,
      text: `
New contact form submission from Authentic Motorcars website:

Name: ${name}
Email: ${email}
Phone: ${phone || "Not provided"}

Subject: ${subject}

Message:
${message}
      `.trim(),
      html: `
<h2>New Contact Form Submission</h2>
<p><strong>Name:</strong> ${name}</p>
<p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
<p><strong>Phone:</strong> ${phone || "Not provided"}</p>
<p><strong>Subject:</strong> ${subject}</p>
<h3>Message:</h3>
<p>${message.replace(/\n/g, "<br>")}</p>
      `.trim(),
    });

    return { success: true };
  } catch (error) {
    console.error("Error sending contact email:", error);
    return { error: "Failed to send email. Please try again later." };
  }
}

/**
 * Send car inquiry email
 */
export async function sendInquiry(data: InquiryFormData) {
  // Validate input
  const validated = inquiryFormSchema.safeParse(data);
  if (!validated.success) {
    return {
      error: "Validation failed",
      details: validated.error.flatten().fieldErrors,
    };
  }

  const { name, email, phone, comments, carId, carTitle } = validated.data;
  const recipient = process.env.CONTACT_EMAIL || process.env.EMAIL_SERVER_USER;

  if (!recipient) {
    console.error("No recipient email configured");
    return { error: "Email configuration error" };
  }

  // Build car URL for easy access
  const siteUrl = process.env.NEXTAUTH_URL || "https://www.authenticmotorcars.com";
  const carUrl = `${siteUrl}/car/${carId}`;

  try {
    const transporter = getTransporter();

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || email,
      to: recipient,
      replyTo: email,
      subject: `[Car Inquiry] ${carTitle}`,
      text: `
New car inquiry from Authentic Motorcars website:

Vehicle: ${carTitle}
View Vehicle: ${carUrl}

Customer Information:
Name: ${name}
Email: ${email}
Phone: ${phone || "Not provided"}

Comments:
${comments || "No additional comments"}
      `.trim(),
      html: `
<h2>New Car Inquiry</h2>
<p><strong>Vehicle:</strong> ${carTitle}</p>
<p><a href="${carUrl}">View Vehicle →</a></p>

<h3>Customer Information</h3>
<p><strong>Name:</strong> ${name}</p>
<p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
<p><strong>Phone:</strong> ${phone || "Not provided"}</p>

<h3>Comments</h3>
<p>${comments ? comments.replace(/\n/g, "<br>") : "No additional comments"}</p>
      `.trim(),
    });

    return { success: true };
  } catch (error) {
    console.error("Error sending inquiry email:", error);
    return { error: "Failed to send inquiry. Please try again later." };
  }
}
