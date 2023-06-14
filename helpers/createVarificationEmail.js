const { BASE_URL, PORT } = process.env;

const createVarificationEmail = (verificationToken, email) => {
    const verifyLink = `${BASE_URL}:${PORT}/users/verify/${verificationToken}`;

    return {
        to: email,
        subject: "Verification",
        html: `<p>Dear User,</p>
            <p>Thank you for registering with our platform. To complete your account setup, please click on the following link to verify your email:</p>
            <a href="${verifyLink}" target="_blank">${verifyLink}</a>
            <p>Thank you</p>`
    }
};

module.exports = createVarificationEmail;