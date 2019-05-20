const { Command } = require('../../../lib/CustomCommand');
const StatusTracker = require('../../lib/StatusTracker');
const config = require('../../../config').custom.StatusTracker;

class ServerStatus extends Command {
  constructor(client) {
    super(client, {
      name: 'serverstatus',
      aliases: [ 'ss' ],
      memberName: 'serverstatus',
      description: 'Checks whether all of my websites are up and running.',
      guarded: true,
      ownerOnly: true,
      guilds: config.guilds
    });
  }

  async runCommand(message) {
    if (message.channel.name && message.channel.id !== config.channel) {
      return;
    }

    const checkingMsg = await message.say('Okay, checking!');

    const tracker = new StatusTracker({ userInitialized: true });

    try {
      const result = await tracker.track();
      checkingMsg.delete();
      return message.say(result);
    } catch (err) {
      checkingMsg.delete();
      return message.say(':warning: Something bad happened.');
    }
  }
};

module.exports = ServerStatus;
