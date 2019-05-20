const { Command } = require('../../../lib/CustomCommand');

class BeepCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'beep',
      memberName: 'beep',
      description: 'Test command.',
      guilds: [
        '481267216386621440'
      ],
      args: [
        {
          key: 'test',
          type: 'string',
          prompt: 'Please do thing'
        }
      ]
    });
  }

  runCommand(message, { test }) {
    return message.say(`Boop: ${test}`);
  }
};

module.exports = BeepCommand;
