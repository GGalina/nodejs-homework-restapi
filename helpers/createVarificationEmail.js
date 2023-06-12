const { BASE_URL, PORT } = process.env;

const createVarificationEmail = (verificationToken, email) => {
    const verifyLink = `${BASE_URL}:${PORT}/users/verify/${verificationToken}`;

    return {
        to: email,
        subject: "Verification",
        html: verifyLink,
    }
};

module.exports = createVarificationEmail;