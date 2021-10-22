import 'dotenv/config';
import express from 'express';
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';

const app = express();
const { UserControllers } = require('./app/controllers/User');

Sentry.init({
  dsn: 'https://53d266713917464584bccf8cb56cd866@o1048514.ingest.sentry.io/6029369',
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Tracing.Integrations.Express({ app }),
  ],
  tracesSampleRate: 1.0,
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());
app.use(Sentry.Handlers.errorHandler());
app.use(express.json());

app.use(function onError(err, req, res, next) {
  // The error id is attached to `res.sentry` to be returned
  // and optionally displayed to the user for support.
  res.statusCode = 500;
  res.end(res.sentry + '\n');
});

app.get('/debug-sentry', function mainHandler(req, res) {
  try {
    throw new Error('My first Sentry error!');
  } catch (error) {
    Sentry.captureMessage('this is a debug message', 'debug');
  }
});
app.post('/users', UserControllers.register);

app.listen(3333, () => console.log('api port: 33333'));
