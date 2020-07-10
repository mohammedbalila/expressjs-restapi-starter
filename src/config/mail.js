const nodemailer = require('nodemailer');

/**
 * @description mail config
 */

const transporter = nodemailer.createTransport({
  host: '',
  port: 0,
  auth: {
    user: '',
    pass: '',
  },
});

module.exports = {
  confirm: async (email, hash) => {
    const info = await transporter.sendMail({
      to: email,
      subject: 'Confirm your email',
      text: `Please verify your email by visiting 
            https://domain.com/api/users/confirm/${hash}/`,
      html: `<b> Please verify your email by clicking 
            <a href='https://domain.com/api/users/confirm/${hash}/'>here</a>
            </b>`,
    });

    // eslint-disable-next-line no-console
    console.log('Message sent: %s', info.messageId);
  },
};
