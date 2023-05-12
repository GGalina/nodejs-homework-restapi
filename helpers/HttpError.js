const messages = {
    404: "Not Found"
};

const HttpError = (status, message = messages[status]) => {
    const error = new Error(message);
    error.status = status;
    return error;
};

module.exports = HttpError;