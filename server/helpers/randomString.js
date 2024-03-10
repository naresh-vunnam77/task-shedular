const generateRandomString = (length = 8) => Math.random().toString(20).substr(2, length);

module.exports = generateRandomString;
