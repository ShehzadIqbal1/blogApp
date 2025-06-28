const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async ({ to, subject, html }) => {
  const msg = {
    to,
    from: process.env.FROM_EMAIL,
    subject,
    html,
  };
  console.log(">>>>>>>>", msg);
  

  try {
    await sgMail.send(msg);
    console.log(" Email sent");
  } catch (error) {
    console.error(" SendGrid error:", error);
    if (error.response) console.error(error.response.body);
  }
};

module.exports = sendEmail;
