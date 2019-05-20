const StatusTracker = require('../lib/StatusTracker');

const config = require('../../config');

const send = (client, result) => {
  if (result) {
    return client.guilds.get(config.bot.guild).channels.get(config.custom.StatusTracker.channel).send(result);
  }
};

const Worker = (client) => {
  if (config.custom.StatusTracker) {
    setInterval(async () => {
      try {
        const tracker = new StatusTracker();
        const result = await tracker.track();
        send(client, result);
      } catch (err) {
        send(client, ':warning: Something bad happened.');
      }
    }, 60 * 60 * 1000 * config.custom.StatusTracker.refreshInterval);
  }
};

module.exports = Worker;
