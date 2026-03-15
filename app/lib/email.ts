import { Resend } from 'resend';

// Lazy initialization — Resend requires API key at construction time
let _resend: Resend | null = null;
function getResend(): Resend {
  if (!_resend) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not set');
    }
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}

// Domain verified on Resend (2026-03-11) — DKIM + SPF confirmed
const FROM_EMAIL = process.env.FROM_EMAIL || 'AI-Assist <noreply@aiassistsmes.co.uk>';
const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || 'hxssxn772@gmail.com';

// ── Email Templates ─────────────────────────────────────────────

function baseTemplate(content: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background: #f5f7fa; color: #1a1a2e; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
    .header { background: linear-gradient(135deg, #2563eb, #1d4ed8); padding: 32px 24px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; }
    .body { padding: 32px 24px; line-height: 1.6; }
    .body h2 { margin-top: 0; color: #1a1a2e; font-size: 20px; }
    .body p { color: #4a5568; margin: 12px 0; }
    .btn { display: inline-block; background: #2563eb; color: #ffffff !important; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: 600; margin: 16px 0; }
    .footer { padding: 20px 24px; text-align: center; background: #f8fafc; border-top: 1px solid #e2e8f0; }
    .footer p { color: #94a3b8; font-size: 12px; margin: 4px 0; }
    .footer a { color: #2563eb; text-decoration: none; }
    .divider { height: 1px; background: #e2e8f0; margin: 20px 0; }
    .info-box { background: #f0f4ff; border-left: 4px solid #2563eb; padding: 16px; border-radius: 0 8px 8px 0; margin: 16px 0; }
    .info-box p { margin: 4px 0; color: #1e40af; }
  </style>
</head>
<body>
  <div style="padding: 20px;">
    <div class="container">
      <div class="header">
        <h1>AI-Assist for SMEs</h1>
      </div>
      <div class="body">
        ${content}
      </div>
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} AI-Assist for SMEs Ltd. All rights reserved.</p>
        <p>Birmingham, United Kingdom</p>
        <p><a href="https://aiassistsmes.co.uk/unsubscribe">Unsubscribe</a> &middot; <a href="https://aiassistsmes.co.uk/privacy">Privacy Policy</a></p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

// ── Send Functions ───────────────────────────────────────────────

export async function sendWelcomeEmail(to: string, name: string) {
  const html = baseTemplate(`
    <h2>Welcome to AI-Assist, ${name}! 🎉</h2>
    <p>Thank you for creating your account. You've taken the first step towards automating your business with AI.</p>
    <p>Here's what you can do next:</p>
    <div class="info-box">
      <p><strong>1.</strong> Complete your onboarding to personalise your experience</p>
      <p><strong>2.</strong> Add your first client or lead</p>
      <p><strong>3.</strong> Set up your first automation</p>
      <p><strong>4.</strong> Explore our AI chat assistant</p>
    </div>
    <p style="text-align:center;">
      <a href="https://aiassistsmes.co.uk/dashboard" class="btn">Go to Dashboard</a>
    </p>
    <p>If you have any questions, reply to this email or visit our <a href="https://aiassistsmes.co.uk/support">Support Centre</a>.</p>
    <p>Best regards,<br><strong>The AI-Assist Team</strong></p>
  `);

  return getResend().emails.send({
    from: FROM_EMAIL,
    to,
    subject: 'Welcome to AI-Assist for SMEs',
    html,
  });
}

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  const html = baseTemplate(`
    <h2>Reset Your Password</h2>
    <p>We received a request to reset your password. Click the button below to create a new one.</p>
    <p style="text-align:center;">
      <a href="${resetUrl}" class="btn">Reset Password</a>
    </p>
    <p>This link will expire in <strong>1 hour</strong>.</p>
    <div class="divider"></div>
    <p style="font-size: 13px; color: #94a3b8;">If you didn't request this, you can safely ignore this email. Your password will remain unchanged.</p>
  `);

  return getResend().emails.send({
    from: FROM_EMAIL,
    to,
    subject: 'Reset your AI-Assist password',
    html,
  });
}

export async function sendContactFormNotification(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
  company?: string;
}) {
  const html = baseTemplate(`
    <h2>New Contact Form Submission</h2>
    <div class="info-box">
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      ${data.phone ? `<p><strong>Phone:</strong> ${data.phone}</p>` : ''}
      ${data.company ? `<p><strong>Company:</strong> ${data.company}</p>` : ''}
      <p><strong>Subject:</strong> ${data.subject}</p>
    </div>
    <p><strong>Message:</strong></p>
    <p>${data.message.replace(/\n/g, '<br>')}</p>
    <div class="divider"></div>
    <p style="font-size: 13px;">Reply directly to this email to respond to the customer.</p>
  `);

  return getResend().emails.send({
    from: FROM_EMAIL,
    to: SUPPORT_EMAIL,
    replyTo: data.email,
    subject: `Contact Form: ${data.subject}`,
    html,
  });
}

export async function sendContactFormConfirmation(to: string, name: string) {
  const html = baseTemplate(`
    <h2>We received your message, ${name}</h2>
    <p>Thank you for getting in touch with AI-Assist for SMEs. We've received your enquiry and will respond within <strong>24 hours</strong> during business days.</p>
    <p>In the meantime, you might find these helpful:</p>
    <div class="info-box">
      <p><a href="https://aiassistsmes.co.uk/services">Our Services</a> — See what we offer</p>
      <p><a href="https://aiassistsmes.co.uk/plans">Pricing Plans</a> — Find the right plan</p>
      <p><a href="https://aiassistsmes.co.uk/blog">Blog</a> — AI automation tips for SMEs</p>
    </div>
    <p>Best regards,<br><strong>The AI-Assist Team</strong></p>
  `);

  return getResend().emails.send({
    from: FROM_EMAIL,
    to,
    subject: 'We received your message — AI-Assist for SMEs',
    html,
  });
}

export async function sendSubscriptionConfirmation(to: string, name: string, plan: string, amount: string) {
  const html = baseTemplate(`
    <h2>Subscription Confirmed! 🎉</h2>
    <p>Hi ${name},</p>
    <p>Your <strong>${plan}</strong> subscription is now active.</p>
    <div class="info-box">
      <p><strong>Plan:</strong> ${plan}</p>
      <p><strong>Amount:</strong> ${amount}/month</p>
      <p><strong>Billing:</strong> Monthly, starting today</p>
    </div>
    <p>You now have full access to all ${plan} features. Head to your dashboard to start building automations.</p>
    <p style="text-align:center;">
      <a href="https://aiassistsmes.co.uk/dashboard" class="btn">Go to Dashboard</a>
    </p>
    <p>Manage your subscription anytime from <a href="https://aiassistsmes.co.uk/dashboard/billing">Billing Settings</a>.</p>
    <p>Best regards,<br><strong>The AI-Assist Team</strong></p>
  `);

  return getResend().emails.send({
    from: FROM_EMAIL,
    to,
    subject: `Your ${plan} plan is active — AI-Assist`,
    html,
  });
}

export async function sendPaymentFailedEmail(to: string, name: string) {
  const html = baseTemplate(`
    <h2>Payment Issue</h2>
    <p>Hi ${name},</p>
    <p>We were unable to process your latest subscription payment. Your access may be affected if this isn't resolved.</p>
    <p>Please update your payment method to continue using AI-Assist without interruption.</p>
    <p style="text-align:center;">
      <a href="https://aiassistsmes.co.uk/dashboard/billing" class="btn">Update Payment Method</a>
    </p>
    <p>If you believe this is an error, please contact us at <a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a>.</p>
    <p>Best regards,<br><strong>The AI-Assist Team</strong></p>
  `);

  return getResend().emails.send({
    from: FROM_EMAIL,
    to,
    subject: 'Action required: Payment issue — AI-Assist',
    html,
  });
}

export async function sendAppointmentReminderEmail(to: string, clientName: string, data: {
  appointment_date: string;
  appointment_time: string;
  service?: string;
  duration?: number;
  businessName?: string;
}) {
  const dateFormatted = new Date(data.appointment_date).toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });
  const html = baseTemplate(`
    <h2>Appointment Reminder</h2>
    <p>Hi ${clientName},</p>
    <p>This is a friendly reminder about your upcoming appointment.</p>
    <div class="info-box">
      <p><strong>Date:</strong> ${dateFormatted}</p>
      <p><strong>Time:</strong> ${data.appointment_time}</p>
      ${data.service ? `<p><strong>Service:</strong> ${data.service}</p>` : ''}
      ${data.duration ? `<p><strong>Duration:</strong> ${data.duration} minutes</p>` : ''}
      ${data.businessName ? `<p><strong>With:</strong> ${data.businessName}</p>` : ''}
    </div>
    <p>If you need to reschedule or cancel, please get in touch as soon as possible.</p>
    <p style="text-align:center;">
      <a href="https://aiassistsmes.co.uk/dashboard/appointments" class="btn">View Appointments</a>
    </p>
    <p>Best regards,<br><strong>The AI-Assist Team</strong></p>
  `);

  return getResend().emails.send({
    from: FROM_EMAIL,
    to,
    subject: `Appointment Reminder — ${dateFormatted} at ${data.appointment_time}`,
    html,
  });
}

export async function sendSubscriptionCancelledEmail(to: string, name: string, endDate: string) {
  const html = baseTemplate(`
    <h2>Subscription Cancelled</h2>
    <p>Hi ${name},</p>
    <p>Your AI-Assist subscription has been cancelled. You'll continue to have access until <strong>${endDate}</strong>.</p>
    <p>We're sorry to see you go. If there's anything we could have done better, we'd love to hear from you.</p>
    <p style="text-align:center;">
      <a href="https://aiassistsmes.co.uk/plans" class="btn">Resubscribe Anytime</a>
    </p>
    <p>Best regards,<br><strong>The AI-Assist Team</strong></p>
  `);

  return getResend().emails.send({
    from: FROM_EMAIL,
    to,
    subject: 'Your subscription has been cancelled — AI-Assist',
    html,
  });
}
