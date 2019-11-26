const config = require('../../../config');
const log = require('../../../lib/Logger');

const Worker = (client, message) => {
  const targetUserId = config.custom.Sleeptime.user;

  if (message.author.id === targetUserId) {
    const dateString = new Date(message.createdTimestamp)
      .toLocaleString(config.custom.Sleeptime.language, {
        timeZone: config.custom.Sleeptime.timeZone
      });

    const currentHour = new Date(dateString).getHours();

    if (currentHour > config.custom.Sleeptime.latestHour ||
        currentHour < config.custom.Sleeptime.earliestHour) {
      const messages = config.custom.Sleeptime.messages;

      client.users.get(message.author.id).send(messages[Math.floor(Math.random() * messages.length)]);
      log(client, message, 'Sleeptime Logger');
    }
  }
};

module.exports = Worker;
