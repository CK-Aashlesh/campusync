const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY || 'mock_key');

const sendEmail = async (options) => {
  const fallbackMockLog = () => {
    console.log('\n================== MOCK EMAIL (FALLBACK) ==================');
    console.log(`To: ${options.to}`);
    console.log(`Subject: ${options.subject}`);
    console.log(`Body:\n${options.html.replace(/<[^>]+>/g, '')}`); 
    console.log('===========================================================\n');
  };

  // If no real API key is provided, just log to console
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 'mock_key') {
    fallbackMockLog();
    return true;
  }

  try {
    // In sandbox mode, Resend only allows sending to the verified owner's email.
    // Set TEST_EMAIL_TO in your .env to override the recipient during testing.
    const toAddress = process.env.TEST_EMAIL_TO || options.to;

    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'CampuSync <onboarding@resend.dev>',
      to: toAddress,
      subject: options.subject,
      html: options.html
    });

    if (error) {
      console.warn('\n[Resend API Warning]:', error.message);
      console.warn('Falling back to mock email logging so the application flow does not break.\n');
      fallbackMockLog();
      return true; // Return true so the calling function (like admitStudent) succeeds
    }

    return data;
  } catch (error) {
    console.error('\n[Resend Exception]:', error.message);
    console.warn('Falling back to mock email logging.\n');
    fallbackMockLog();
    return true; // Return true to prevent crashing
  }
};

module.exports = sendEmail;
