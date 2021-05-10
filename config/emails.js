const { prototype } = require("nodemailer/lib/dkim");
require('dotenv').config({ path: 'variables.env' });

module.exports = {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
    host:"smtp.mailtrap.io",
    port: '2525',
}