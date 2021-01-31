const tracker = require('../../lib/MovieTracker');
const schedule = require('node-schedule');

const getTime = t => {
  return {
    hour: t.split(':')[0],
    minute: t.split(':')[1],
    second: 0
  };
};

const send = async (client, config, results) => {
  if (!results || !results.length) {
    return;
  }

  for (const result of results) {
    await client.guilds.cache
      .get(config.guild)
      .channels.cache
      .get(config.channel)
      .send(result);
  }
};

const Handler = client => {
  const config = client.config.custom && client.config.custom.MovieTracker;
  if (!config) {
    return;
  }

  try {
    schedule.scheduleJob(getTime(config.time), async () => {
      const results = await tracker(config);
      await send(client, config, results);
    });
  } catch (err) {
    console.error(err);
  }
};

module.exports = Handler;
