import nodemailer from 'nodemailer';
import { nodeMailerConfigs } from '../config/mail';

export default nodemailer.createTransport(nodeMailerConfigs);
