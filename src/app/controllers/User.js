import Queue from '../lib/Queue';

export const UserControllers = {
  async register(req, res) {
    const { name, email, pass } = req.body;
    const user = {
      name,
      email,
      pass,
    };

    await Queue.add('displayConsoleLog', { user });

    return res.status(200).json(user);
  },
};
