const sendGrid = require('@sendgrid/mail');
const { SENDGRID_API_KEY, SENDGRID_FROM, } = process.env;

sendGrid.setApiKey(SENDGRID_API_KEY);

const sendEmail = async (data, from = SENDGRID_FROM) => {
    try {
        const email = { ...data, from };
        await sendGrid.send(email);
        return true;
    } catch (error) {
        return false
    }
};

module.exports = sendEmail;