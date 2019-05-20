const { Command } = require('../../../lib/CustomCommand');
const tracker = require('../../lib/MovieTracker');
const config = require('../../../config').custom.MovieTracker;

class MovieTracker extends Command {
  constructor(client) {
    super(client, {
      name: 'movies',
      memberName: 'movies',
      description: 'Get a list of the movies that are airing today on the Romanian/Hungarian TV.',
      guarded: true,
      ownerOnly: true,
      guilds: config.guilds
    });
  }

  async runCommand(message) {
    if (message.channel.name && message.channel.id !== config.channel) {
      return null;
    }

    const results = await tracker();

    if (results && results.length) {
      results.forEach(result => message.say(result));
      return null;
    } else {
      return message.say('There are no movies for today based on your criteria!');
    }
  }
};

module.exports = MovieTracker;
