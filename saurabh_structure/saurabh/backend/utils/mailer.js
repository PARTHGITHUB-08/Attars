import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** Shared transporter factory — reads env vars each call so .env changes are picked up */
function createTransporter() {
  const host = process.env.EMAIL_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.EMAIL_PORT || '587');
  const user = process.env.EMAIL_USER || 'parthgelani08@gmail.com';
  const pass = process.env.EMAIL_PASS;
  if (!pass) return null;
  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

function senderAddress() {
  return process.env.EMAIL_USER || 'parthgelani08@gmail.com';
}

export const sendWelcomeEmail = async (subscriberEmail) => {
  const transporter = createTransporter();
  if (!transporter) {
    console.warn('[Mailer] EMAIL_PASS not configured. Skipping welcome email to ' + subscriberEmail);
    return false;
  }
  const user = senderAddress();
  try {
    await transporter.sendMail({
      from: `"Saurabh Perfumes" <${user}>`,
      to: subscriberEmail,
      subject: 'Welcome to the Saurabh Fragrance Family!',
      html: `
        <div style="font-family:'Georgia',serif;max-width:600px;margin:0 auto;padding:20px;border:1px solid #e5d5b7;background-color:#faf8f5;color:#2c2520;">
          <div style="text-align:center;border-bottom:2px solid #8b6914;padding-bottom:15px;margin-bottom:20px;">
            <h1 style="color:#8b6914;font-size:24px;margin:0;letter-spacing:2px;">SAURABH PERFUMES</h1>
            <p style="font-style:italic;font-size:11px;margin:5px 0 0;color:#6e5d53;letter-spacing:1px;">The Soul of Pure Fragrance</p>
          </div>
          <p>Dear Fragrance Lover,</p>
          <p>Welcome to our inner circle. We are thrilled to welcome you to the <strong>Fragrance Family</strong>.</p>
          <p>At Saurabh Perfumes, we preserve the traditional hydro-distillation techniques of Kannauj to craft the most premium, pure, and raw floral oils.</p>
          <p>As a gesture of our appreciation, here is your welcome gift: <strong>10% OFF</strong> your first order.</p>
          <div style="text-align:center;margin:30px 0;padding:15px;background-color:#8b6914;color:#ffffff;font-size:20px;font-weight:bold;border-radius:8px;letter-spacing:2px;">WELCOME10</div>
          <p style="font-size:12px;color:#6e5d53;text-align:center;">Simply mention this code when placing your order on WhatsApp.</p>
          <div style="border-top:1px solid #e5d5b7;padding-top:15px;margin-top:30px;font-size:11px;color:#8e7a6e;text-align:center;line-height:1.5;">
            <p>&copy; 2026 Saurabh Perfumes. Gujarat, India.</p>
          </div>
        </div>
      `,
    });
    console.log('[Mailer] Welcome email sent to', subscriberEmail);
    return true;
  } catch (err) {
    console.error('[Mailer] Welcome email error:', err.message);
    return false;
  }
};

export const sendAdminNotificationEmail = async (subscriberEmail) => {
  const transporter = createTransporter();
  if (!transporter) return false;
  const user = senderAddress();
  try {
    await transporter.sendMail({
      from: `"Saurabh Perfumes Alert" <${user}>`,
      to: 'parthgelani08@gmail.com',
      subject: 'New Fragrance Family Subscriber - Saurabh Perfumes!',
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px;border:1px solid #ccc;background:#fff;color:#333;">
          <h2>New Newsletter Subscription</h2>
          <p>Hello Parth,</p>
          <p>You have a new subscriber: <strong>${subscriberEmail}</strong></p>
          <p>Subscribed at: ${new Date().toLocaleString('en-IN')}</p>
          <hr style="border:0;border-top:1px solid #eee;margin:20px 0;" />
          <p style="font-size:11px;color:#999;">Saurabh Perfumes System Notification</p>
        </div>
      `,
    });
    console.log('[Mailer] Admin notification sent');
    return true;
  } catch (err) {
    console.error('[Mailer] Admin notification error:', err.message);
    return false;
  }
};

export const sendInvoiceEmail = async (customerEmail, customerName, invoiceId, items, total, date, paymentMethod = 'UPI', paymentStatus = 'Pending') => {
  const transporter = createTransporter();
  if (!transporter) {
    console.warn('[Mailer] EMAIL_PASS not configured. Skipping invoice email to ' + customerEmail);
    return false;
  }
  const user = senderAddress();

  const qrPath = path.join(__dirname, '../uploads/qr_code.png');
  const isUpi = paymentMethod === 'UPI';

  const paymentHtml = isUpi ? `
    <p><strong>Payment Instructions:</strong></p>
    <p>Please scan the UPI QR code below using any UPI app (GPay, PhonePe, Paytm, BHIM) to complete your payment of <strong>₹${total.toLocaleString('en-IN')}</strong>.</p>
    <div style="text-align:center;margin:30px 0;">
      <img src="cid:qrcode" alt="UPI QR Code" style="max-width:230px;border:1px solid #ccc;padding:10px;border-radius:8px;" />
      <p style="font-size:12px;color:#6e5d53;margin:5px 0 0;font-family:monospace;">UPI ID: parthgelani08-1@okaxis</p>
    </div>
    <p>Once payment is done, send a screenshot on WhatsApp to confirm dispatch.</p>
  ` : `
    <p><strong>Payment Method:</strong> Cash on Delivery</p>
    <p>Please keep cash of <strong>₹${total.toLocaleString('en-IN')}</strong> ready when the package is delivered.</p>
  `;

  const attachments = isUpi ? [{ filename: 'qr_code.png', path: qrPath, cid: 'qrcode' }] : [];

  const itemRows = items.map(item =>
    `<tr style="border-bottom:1px solid #f5ede0;">
      <td style="padding:8px 0;">${item.name} (${item.volume || '12ml'})</td>
      <td style="padding:8px 0;text-align:center;">${item.qty}</td>
      <td style="padding:8px 0;text-align:right;">₹${(item.price * item.qty).toLocaleString('en-IN')}</td>
    </tr>`
  ).join('');

  try {
    await transporter.sendMail({
      from: `"Saurabh Perfumes" <${user}>`,
      to: customerEmail,
      subject: `Your Invoice ${invoiceId} — Saurabh Perfumes`,
      html: `
        <div style="font-family:'Georgia',serif;max-width:600px;margin:0 auto;padding:20px;border:1px solid #e5d5b7;background-color:#faf8f5;color:#2c2520;">
          <div style="text-align:center;border-bottom:2px solid #8b6914;padding-bottom:15px;margin-bottom:20px;">
            <h1 style="color:#8b6914;font-size:24px;margin:0;letter-spacing:2px;">SAURABH PERFUMES</h1>
            <p style="font-style:italic;font-size:11px;margin:5px 0 0;color:#6e5d53;letter-spacing:1px;">The Soul of Pure Fragrance</p>
          </div>
          <h2 style="color:#2c2520;">Thank you for your order, ${customerName}!</h2>
          <div style="border:1px solid #e5d5b7;padding:20px;border-radius:8px;margin-bottom:20px;background:#fff;">
            <p style="margin:0 0 8px;"><strong>Invoice ID:</strong> ${invoiceId}</p>
            <p style="margin:0 0 8px;"><strong>Date:</strong> ${date}</p>
            <p style="margin:0 0 15px;"><strong>Payment:</strong> ${paymentMethod} — ${paymentStatus === 'Paid' ? 'Verified ✓' : 'Pending'}</p>
            <table style="width:100%;border-collapse:collapse;font-size:14px;">
              <thead>
                <tr style="border-bottom:1px solid #e5d5b7;color:#8b6914;">
                  <th style="padding:8px 0;text-align:left;">Item</th>
                  <th style="padding:8px 0;text-align:center;">Qty</th>
                  <th style="padding:8px 0;text-align:right;">Price</th>
                </tr>
              </thead>
              <tbody>${itemRows}</tbody>
            </table>
            <p style="text-align:right;font-size:16px;font-weight:bold;color:#8b6914;margin:15px 0 0;">Total: ₹${total.toLocaleString('en-IN')}</p>
          </div>
          ${paymentHtml}
          <p style="font-size:12px;color:#6e5d53;text-align:center;">Track your order at: <a href="https://yourdomain.com/track-order?id=${invoiceId}" style="color:#8b6914;">${invoiceId}</a></p>
          <div style="border-top:1px solid #e5d5b7;padding-top:15px;margin-top:30px;font-size:11px;color:#8e7a6e;text-align:center;">
            <p>&copy; 2026 Saurabh Perfumes. Gujarat, India.</p>
          </div>
        </div>
      `,
      attachments,
    });
    console.log('[Mailer] Invoice email sent to', customerEmail);
    return true;
  } catch (err) {
    console.error('[Mailer] Invoice email error:', err.message);
    return false;
  }
};

export const sendResetKeyEmail = async (email, key) => {
  const transporter = createTransporter();
  if (!transporter) {
    console.warn('[Mailer] EMAIL_PASS not configured. Skipping reset email.');
    return false;
  }
  const user = senderAddress();
  try {
    await transporter.sendMail({
      from: `"Saurabh Perfumes Security" <${user}>`,
      to: email,
      subject: '[Saurabh Perfumes] Admin Password Reset Key',
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px;border:1px solid #e5d5b7;background-color:#faf8f5;color:#2c2520;">
          <h2 style="color:#8b6914;border-bottom:2px solid #8b6914;padding-bottom:10px;">Security Access Recovery</h2>
          <p>A password reset was requested for Saurabh Perfumes Admin.</p>
          <p>Enter this 6-digit key in the admin panel (expires in 15 minutes):</p>
          <div style="text-align:center;margin:30px 0;padding:15px;background-color:#8b6914;color:#fff;font-size:32px;font-weight:bold;border-radius:8px;letter-spacing:8px;font-family:monospace;">${key}</div>
          <p style="font-size:11px;color:#8e7a6e;">If you did not request this, please secure your admin account immediately.</p>
        </div>
      `,
    });
    console.log('[Mailer] Reset key email sent to', email);
    return true;
  } catch (err) {
    console.error('[Mailer] Reset key email error:', err.message);
    return false;
  }
};
