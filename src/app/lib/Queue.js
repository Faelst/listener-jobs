import Queue from 'bull/lib/queue';
import redisConfig from '../config/redis';

import * as jobs from '../jobs';

import Sentry from 'sentry';

const queues = Object.values(jobs).map((job) => ({
  bull: new Queue(job.key, redisConfig),
  name: job.key,
  handle: job.handle,
}));

export default {
  queues,
  add(jobName, data) {
    const queue = this.queues.find((queue) => queue.name === jobName);
    return queue.bull.add(data);
  },
  process() {
    return this.queues.forEach((queue) => {
      queue.bull.process(queue.handle);

      queue.bull.on('failed', (job, err) => {
        Sentry.captureException(err);
        console.log(job);
      });
    });
  },
};

// import { RegistrationMail } from '../jobs/index';

// const mailQueue = new Queue(RegistrationMail.key, redisConfig);

// mailQueue.on('failed', (job) => console.log(job));

// export default mailQueue;
