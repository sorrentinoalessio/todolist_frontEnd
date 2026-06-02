import 'dotenv/config'; 
 // legge automaticamente il .env
export const mailConfig = {
    sender: process.env.MAIL_USER,
    password: process.env.MAIL_PASSWORD
}

