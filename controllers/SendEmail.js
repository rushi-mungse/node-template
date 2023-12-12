const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
    },
});

class SendEmail {
    async sendEmail(req, res, next) {
        const { subject, html, to, from } = req.body;
        if (!subject || !html || !to || !from) return res.json({ ok: false });

        try {
            let info = await transporter.sendMail({
                from: `Rushi <${from}>`,
                to: to,
                subject: subject,
                text: "Hello ✔",
                html: html,
            });

            return res.json({ info, ok: true });
        } catch (error) {
            console.error(error);
        }
        return res.json({ ok: false });
    }
}

module.exports = new SendEmail();
