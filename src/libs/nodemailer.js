import nodemailer from 'nodemailer'
import { MAIL_PASSWORD } from '../../config.js';

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'naturessence23@gmail.com',
      pass: MAIL_PASSWORD,
    },
  });
  
export default transporter;