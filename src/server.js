import 'dotenv/config';
import express from 'express';

const app = express();

const { UserControllers } = require('./app/controllers/User');

app.use(express.json());

app.post('/users', UserControllers.register);

app.listen(3333, () => console.log('api port: 33333'));
