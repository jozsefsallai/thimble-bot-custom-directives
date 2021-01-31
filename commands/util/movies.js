const { Command } = require('../../../dist/command');
const tracker = require('../../lib/MovieTracker');

class MovieTrackerCommand extends Command {
  constructor() {
    super('movietracker', {
      aliases: [ 'movies', 'movietracker' ],
      description: 'Get a list of the movies that are airing today on the Romanian/Hungarian TV.',
      ownerOnly: true
    });
  }

  async exec(message) {
    const config = this.client.config.custom && this.client.config.custom.MovieTracker;

    if (!config || (message.channel.name && message.channel.id !== config.channel)) {
      return;
    }

    try {
      const results = await tracker(config);

      if (results && results.length) {
        for (const result of results) {
          await this.say(message, result);
        }
      } else {
        return this.say(message, 'There are no movies based on you criteria.');
      }
    } catch (err) {
      console.error(err);
      return this.error(message, 'Something bad happeed.');
    }
  }
};

module.exports = MovieTrackerCommand;
