"use strict";
const nodemailer = require("nodemailer");
const contactUs = async (req, res) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_ID,
            pass: process.env.EMAIL_PASS,
        },
    });
    const { name, email, description } = req.body;
    if (!name || !email || !description) {
        return res.status(400).send({ message: "all fields are required !" });
    }
    try {
        await transporter.sendMail({
            from: `"${name}" <${email}>`,
            to: "tusharsoni014@gmail.com",
            subject: `From Craftura AI: ${email}`,
            text: `From: ${email} \n ${description}`,
            html: `<p><b>From: ${email}</b></p></br><p>${description}</p>`,
        });
        await transporter.sendMail({
            from: `"Craftura AI" <tusharproject00@gmail.com>`,
            to: email,
            subject: `Craftura AI Contact Form`,
            text: `Thank you for reaching out to us. We'll get back to you shortly.`,
            html: `<p>Thank you for reaching out to us. We'll get back to you shortly.</p>`,
        });
        return res.status(200).send({ message: "Email message sent successfully" });
    }
    catch (error) {
        return res.status(500).send({ message: "Error sending email" });
    }
};
module.exports = { contactUs };
