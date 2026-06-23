import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const sendWelcomeEmail = async (subscriberEmail) => {
  const host = process.env.EMAIL_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.EMAIL_PORT || '587');
  const user = process.env.EMAIL_USER || 'parthgelani08@gmail.com';
  const pass = process.env.EMAIL_PASS;

  if (!pass) {
    console.warn('[Mailer] EMAIL_PASS is not configured in .env. Skipping welcome email to ' + subscriberEmail);
    return false;
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });

  const mailOptions = {
    from: `"Attraz Perfumes" <${user}>`,
    to: subscriberEmail,
    subject: 'Welcome to the Attraz Fragrance Family!',
    html: `
      <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5d5b7; background-color: #faf8f5; color: #2c2520;">
        <div style="text-align: center; border-bottom: 2px solid #8b6914; padding-bottom: 15px; margin-bottom: 20px;">
          <h1 style="color: #8b6914; font-size: 24px; margin: 0; letter-spacing: 2px;">ATTRAZ PERFUMES</h1>
          <p style="font-style: italic; font-size: 11px; margin: 5px 0 0 0; color: #6e5d53; letter-spacing: 1px;">The Soul of Pure Fragrance</p>
        </div>
        <p>Dear Fragrance Lover,</p>
        <p>Welcome to our inner circle. We are thrilled to welcome you to the <strong>Fragrance Family</strong>.</p>
        <p>At Attraz Perfumes, we preserve the traditional hydro-distillation techniques of Kannauj to craft the most premium, pure, and raw floral oils.</p>
        <p>As a gesture of our appreciation, here is your welcome gift: <strong>10% OFF</strong> your first order.</p>
        <div style="text-align: center; margin: 30px 0; padding: 15px; background-color: #8b6914; color: #ffffff; font-size: 20px; font-weight: bold; border-radius: 8px; letter-spacing: 2px;">
          WELCOME10
        </div>
        <p style="font-size: 12px; color: #6e5d53; text-align: center;">Simply enter this code during checkout or mention it when placing your order on WhatsApp.</p>
        <div style="border-top: 1px solid #e5d5b7; padding-top: 15px; margin-top: 30px; font-size: 11px; color: #8e7a6e; text-align: center; line-height: 1.5;">
          <p>You received this email because you subscribed to the Attraz Perfumes newsletter.</p>
          <p>&copy; 2026 Attraz Perfumes. Kannauj, Uttar Pradesh, India.</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`[Mailer] Welcome email successfully sent to ${subscriberEmail}`);
    return true;
  } catch (error) {
    console.error('[Mailer] Error sending welcome email to ' + subscriberEmail + ':', error);
    return false;
  }
};

export const sendAdminNotificationEmail = async (subscriberEmail) => {
  const host = process.env.EMAIL_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.EMAIL_PORT || '587');
  const user = process.env.EMAIL_USER || 'parthgelani08@gmail.com';
  const pass = process.env.EMAIL_PASS;

  if (!pass) {
    console.warn('[Mailer] EMAIL_PASS is not configured in .env. Skipping admin notification email.');
    return false;
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });

  const mailOptions = {
    from: `"Attraz Perfumes Alert" <${user}>`,
    to: 'parthgelani08@gmail.com',
    subject: 'New Fragrance Family Subscriber - Attraz Perfumes!',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ccc; background-color: #ffffff; color: #333333;">
        <h2>New Newsletter Subscription</h2>
        <p>Hello Parth,</p>
        <p>You have a new subscriber to your newsletter!</p>
        <p><strong>Email Address:</strong> ${subscriberEmail}</p>
        <p><strong>Subscribed At:</strong> ${new Date().toLocaleString()}</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 11px; color: #999;">Attraz Perfumes System Notification</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`[Mailer] Admin notification email sent successfully.`);
    return true;
  } catch (error) {
    console.error('[Mailer] Error sending admin notification email:', error);
    return false;
  }
};

export const sendInvoiceEmail = async (customerEmail, customerName, invoiceId, items, total, date, paymentMethod = 'UPI', paymentStatus = 'Pending') => {
  const host = process.env.EMAIL_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.EMAIL_PORT || '587');
  const user = process.env.EMAIL_USER || 'parthgelani08@gmail.com';
  const pass = process.env.EMAIL_PASS;

  if (!pass) {
    console.warn('[Mailer] EMAIL_PASS is not configured in .env. Skipping automated invoice email to ' + customerEmail);
    return false;
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });

  let paymentInstructionsHtml = '';
  let attachments = [];
  
  if (paymentMethod === 'UPI') {
    paymentInstructionsHtml = `
      <p><strong>Payment Instructions:</strong></p>
      <p>Please scan the UPI QR code below using any UPI app (GPay, PhonePe, Paytm, BHIM) to complete your payment of <strong>₹${total.toLocaleString('en-IN')}</strong>.</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <img src="cid:qrcode" alt="Payment QR Code" style="max-width: 230px; border: 1px solid #ccc; padding: 10px; border-radius: 8px;" />
        <p style="font-size: 12px; color: #6e5d53; margin: 5px 0 0 0; font-family: monospace;">UPI ID: parthgelani08-1@okaxis</p>
      </div>
      
      <p>Once payment is completed, please reply to this email or send a screenshot of the payment on WhatsApp to complete your order dispatch.</p>
    `;
    attachments = [
      {
        filename: 'qr_code.png',
        path: path.join(__dirname, '../uploads/qr_code.png'),
        cid: 'qrcode'
      }
    ];
  } else {
    paymentInstructionsHtml = `
      <p><strong>Payment Instructions:</strong></p>
      <p>Your order has been placed via <strong>Cash on Delivery (COD)</strong>. Please prepare cash in the amount of <strong>₹${total.toLocaleString('en-IN')}</strong> to complete the payment when your package is delivered.</p>
    `;
  }

  const mailOptions = {
    from: `"Attraz Perfumes" <${user}>`,
    to: customerEmail,
    subject: `Your Invoice ${invoiceId} - Attraz Perfumes`,
    html: `
      <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5d5b7; background-color: #faf8f5; color: #2c2520;">
        <div style="text-align: center; border-bottom: 2px solid #8b6914; padding-bottom: 15px; margin-bottom: 20px;">
          <h1 style="color: #8b6914; font-size: 24px; margin: 0; letter-spacing: 2px;">ATTRAZ PERFUMES</h1>
          <p style="font-style: italic; font-size: 11px; margin: 5px 0 0 0; color: #6e5d53; letter-spacing: 1px;">The Soul of Pure Fragrance</p>
        </div>
        
        <h2 style="color: #2c2520; font-family: 'Playfair Display', serif;">Thank you for your order!</h2>
        <p>Dear ${customerName},</p>
        <p>Your order has been received. Below is your invoice summary:</p>
        
        <div style="border: 1px solid #e5d5b7; padding: 20px; border-radius: 8px; margin-bottom: 20px; background-color: #ffffff;">
          <p style="margin: 0 0 8px 0;"><strong>Invoice ID:</strong> ${invoiceId}</p>
          <p style="margin: 0 0 8px 0;"><strong>Date:</strong> ${date}</p>
          <p style="margin: 0 0 8px 0;"><strong>Payment Method:</strong> ${paymentMethod}</p>
          <p style="margin: 0 0 15px 0;"><strong>Payment Status:</strong> ${paymentStatus === 'Paid' ? 'Paid (Verified)' : 'Pending (Cash on Delivery / Pending QR Verification)'}</p>
          
          <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-top: 10px;">
            <thead>
              <tr style="border-bottom: 1px solid #e5d5b7; text-align: left; color: #8b6914;">
                <th style="padding: 8px 0;">Item</th>
                <th style="padding: 8px 0; text-align: center;">Qty</th>
                <th style="padding: 8px 0; text-align: right;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${items.map(item => `
                <tr style="border-bottom: 1px solid #f5ede0;">
                  <td style="padding: 8px 0;">${item.name} (${item.volume || '12ml'})</td>
                  <td style="padding: 8px 0; text-align: center;">${item.qty}</td>
                  <td style="padding: 8px 0; text-align: right;">₹${(item.price * item.qty).toLocaleString('en-IN')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <p style="text-align: right; font-size: 16px; font-weight: bold; color: #8b6914; margin: 15px 0 0 0;">
            Total Payable: ₹${total.toLocaleString('en-IN')}
          </p>
        </div>
        
        ${paymentInstructionsHtml}
        
        <div style="border-top: 1px solid #e5d5b7; padding-top: 15px; margin-top: 30px; font-size: 11px; color: #8e7a6e; text-align: center;">
          <p>&copy; 2026 Attraz Perfumes. Kannauj, Uttar Pradesh, India.</p>
        </div>
      </div>
    `,
    attachments
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`[Mailer] Invoice email successfully sent to ${customerEmail}`);
    return true;
  } catch (error) {
    console.error('[Mailer] Error sending invoice email to ' + customerEmail + ':', error);
    return false;
  }
};

export const sendResetKeyEmail = async (email, key) => {
  const host = process.env.EMAIL_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.EMAIL_PORT || '587');
  const user = process.env.EMAIL_USER || 'parthgelani08@gmail.com';
  const pass = process.env.EMAIL_PASS;

  if (!pass) {
    console.warn('[Mailer] EMAIL_PASS is not configured in .env. Skipping sendResetKeyEmail.');
    return false;
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });

  const mailOptions = {
    from: `"Attraz Perfumes Security" <${user}>`,
    to: email,
    subject: '[Attraz Perfumes] Security Reset Key',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5d5b7; background-color: #faf8f5; color: #2c2520;">
        <h2 style="color: #8b6914; border-bottom: 2px solid #8b6914; padding-bottom: 10px;">Security Access Recovery</h2>
        <p>A request was received to reset your Attraz Perfumes Admin credentials.</p>
        <p>Please use the security recovery key below to reset your password in the admin panel:</p>
        <div style="text-align: center; margin: 30px 0; padding: 15px; background-color: #8b6914; color: #ffffff; font-size: 24px; font-weight: bold; border-radius: 8px; letter-spacing: 4px; font-family: monospace;">
          ${key}
        </div>
        <p style="font-size: 11px; color: #8e7a6e;">This key is temporary and will expire shortly. If you did not request this, please verify your server security immediately.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`[Mailer] Reset key email successfully sent to ${email}`);
    return true;
  } catch (error) {
    console.error('[Mailer] Error sending reset key email:', error);
    return false;
  }
};
