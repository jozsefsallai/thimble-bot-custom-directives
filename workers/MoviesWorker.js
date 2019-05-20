const tracker = require('../lib/MovieTracker');
const schedule = require('node-schedule');

const config = require('../../config');

const getTime = (t) => {
  return {
    hour: t.split(':')[0],
    minute: t.split(':')[1],
    second: 0
  };
};

const send = (client, results) => {
  if (results && results.length) {
    results.forEach(result => {
      return client.guilds.get(config.bot.guild).channels.get(config.custom.MovieTracker.channel).send(result);
    });
  }
};

const Worker = (client) => {
  if (config.custom.MovieTracker) {
    schedule.scheduleJob(getTime(config.custom.MovieTracker.time), async () => {
      const results = await tracker();
      send(client, results);
    });
  }
};

module.exports = Worker;
