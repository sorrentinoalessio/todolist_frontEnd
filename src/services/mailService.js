import mailer from 'nodemailer';
import { mailConfig } from '../constants/mailConfig.js';
import { host, port } from '../../server.js';

const transport = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: mailConfig.sender,
        pass: mailConfig.password
    }


}

class MailService {
    async sendRegistrationMail(user) {
        const link = `http://127.0.0.1:3001/user/${user._id}/confirm/${encodeURIComponent(user.registrationToken)}`;
        const mailData = {
            from: `'todolist service' <${mailConfig.sender}>`,
            to: user.email,
            subject: 'Conferma il tuo indirizzo email',
            text: `Ciao ${user.name}, clicca sul seguente link per confermare il tuo indirizzo email: ${link}`,
            html: ''
        }
        return await mailer.createTransport(transport).sendMail(mailData);
    }

   async sendActivityOverdueMail(to, payload) {
        const list = payload.map(a => `- ${a.name} (ID: ${a.activityId})`).join('\n');
        const mailData = {
            from: `'todolist service' <${mailConfig.sender}>`,
            to: to,
            subject: 'Lista delle tue activity scadute',
            text: `Ciao ecco la lista delle tue activity scadute \n ${list}.`
         };

        return await mailer.createTransport(transport).sendMail(mailData);
    }

}


export default new MailService();