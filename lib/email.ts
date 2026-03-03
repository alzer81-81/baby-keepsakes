import nodemailer from "nodemailer";

type OrderEmail = {
  orderId: number;
  customerName: string;
  customerEmail: string;
  country: string;
  theme: string;
  pdfPath: string;
};

function hasSmtpConfig(): boolean {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_USER && process.env.SMTP_PASS);
}

export async function sendAdminOrderEmail(payload: OrderEmail): Promise<void> {
  if (!process.env.ADMIN_EMAIL) {
    console.warn("ADMIN_EMAIL not configured; skipping admin email.");
    return;
  }

  if (!hasSmtpConfig()) {
    console.warn("SMTP not configured; email stub:", payload);
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: process.env.ADMIN_EMAIL,
    subject: `New Birth Poster Order #${payload.orderId}`,
    text: [
      `Order ID: ${payload.orderId}`,
      `Name: ${payload.customerName}`,
      `Email: ${payload.customerEmail}`,
      `Country: ${payload.country}`,
      `Theme: ${payload.theme}`,
      `PDF: ${payload.pdfPath}`
    ].join("\n")
  });
}
