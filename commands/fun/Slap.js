const { Command } = require('../../../lib/CustomCommand');

const meta = {
  name: 'slap',
  description: 'Slap command for Romana'
};

class SlapCommand extends Command {
  constructor(client) {
    super(client, {
      ...meta,
      memberName: 'slap',
      guilds: [
        '542843399032537098'
      ],
      args: [
        {
          key: 'user',
          prompt: 'Who do you want to slap?',
          type: 'user'
        }
      ]
    });
  }

  runCommand(message, { user }) {
    if (user.id === message.author.id) {
      return message.say('Slapping yourself is not a very healthy thing...');
    }

    if (user.id === this.client.user.id) {
      return message.say('Ouch.');
    }

    const endings = [
      'That is not very nice...',
      'I mean they kinda deserved it.',
      `Now ${user.toString()} is hurt.`,
      '<:negative_one:613176665660719105>',
      'Press F to pay respects.',
      'I\'m gonna sue.',
      `${user.toString()} promised revenge...`
    ];

    const ending = endings[Math.floor(Math.random() * endings.length)];

    return message.say(`:clap: ${message.author.toString()} slapped ${user.toString()}. ${ending}`)
  }
};

module.exports = SlapCommand;
module.exports.meta = meta;
