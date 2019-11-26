const { Command } = require('../../../lib/CustomCommand');

const meta = {
  name: 'randomrat',
  description: 'rat',
  aliases: [ 'rat' ]
};

class RatCommand extends Command {
  constructor(client) {
    super(client, {
      ...meta,
      memberName: 'rat',
      guilds: [
        '542843399032537098'
      ]
    });
  }

  runCommand(message) {
    return message.say('', { file: { attachment: 'https://cdn.discordapp.com/attachments/549318992410574896/638088812802867225/avatar.png', name: 'rat.png' } });
  }
};

module.exports = RatCommand;
module.exports.meta = meta;
