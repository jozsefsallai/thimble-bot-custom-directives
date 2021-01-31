const { Command } = require('../../../dist/command');
const StatusTracker = require('../../lib/StatusTracker');

class ServerStatusCommand extends Command {
  constructor() {
    super('serverstatus', {
      aliases: [ 'serverstatus', 'ss' ],
      description: 'Checks whether all of my websites are up and running.',
      ownerOnly: true
    });
  }

  async exec(message) {
    const config = this.client.config.custom && this.client.config.custom.StatusTracker;

    if (!config || (message.channel.name && message.channel.id !== config.channel)) {
      return;
    }

    const checkingMessage = await this.say(message, 'Okay, checking...');

    const tracker = new StatusTracker({
      userInitialized: true,
      client: this.client
    });

    try {
      const result = await tracker.track();
      await checkingMessage.delete();
      return this.say(message, result);
    } catch (err) {
      await checkingMessage.delete();
      return this.error(message, 'Something bad happened.');
    }
  }
};

module.exports = ServerStatusCommand;
