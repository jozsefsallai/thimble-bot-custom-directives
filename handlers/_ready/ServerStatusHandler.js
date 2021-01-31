const StatusTracker = require('../../lib/StatusTracker');

const send = (client, config, result) => {
  if (!result) {
    return;
  }

  return client.guilds.cache
    .get(config.guild)
    .channels.cache
    .get(config.channel)
    .send(result);
};

const Handler = (client) => {
  const config = client.config.custom && client.config.custom.StatusTracker;
  if (!config) {
    return;
  }

  setInterval(async () => {
    try {
      const tracker = new StatusTracker({ client });
      const result = await tracker.track();
      await send(client, config, result);
    } catch (err) {
      console.error(err);
      await send(client, config, ':x: Something bad happened.');
    }
  }, 60 * 60 * 1000 * config.refreshInterval);
};

module.exports = Handler;
