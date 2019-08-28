const config = require('../../config');
const axios = require('axios');
const cheerio = require('cheerio');

const path = require('path');
const fs = require('fs');
const schedule = require('node-schedule');

const MANIFEST_STORAGE_PATH = path.join(__dirname, '..', 'storage', 'OkunaAPITracker.manifest.json');

const getHTML = () => {
  return new Promise((resolve, reject) => {
    return axios
      .get(config.custom.OkunaAPITracker.path)
      .then(({ data }) => resolve(data))
      .catch((err) => reject(err));
  });
};

const getChanges = (old, current) => {
  const output = [];

  current.forEach(obj => {
    const oldElement = old.find(o => o.name === obj.name);

    if (!oldElement || (obj.commit !== oldElement.commit)) {
      return output.push(obj.name);
    }
  });

  return output;
};

const init = async () => {
  try {
    const html = await getHTML();
    const $ = cheerio.load(html);
    const elements = $('.files tbody tr');

    const files = [];

    elements.each((idx, element) => {
      const $$ = cheerio.load(element);
      const content = $$('.content a');

      const name = $(content).attr('href');

      if (!name || !name.includes('_api.dart')) {
        return;
      }

      const message = $$('.message a');

      const commit = $(message).attr('href').split('/').pop();

      files.push({
        name: name.split('/').pop(),
        commit
      });
    });

    if (!fs.existsSync(MANIFEST_STORAGE_PATH)) {
      fs.writeFileSync(MANIFEST_STORAGE_PATH, JSON.stringify(files, null, 2), { encoding: 'utf8' });
      return null;
    }

    const manifest = fs.readFileSync(MANIFEST_STORAGE_PATH, { encoding: 'utf8' });
    const oldData = JSON.parse(manifest);

    const changes = getChanges(oldData, files);

    if (changes && changes.length) {
      fs.writeFileSync(MANIFEST_STORAGE_PATH, JSON.stringify(files, null, 2), { encoding: 'utf8' });
      return changes;
    }

    return null;
  } catch (err) {
    throw new Error(err);
  }
};

const getTime = (t) => {
  return {
    hour: t.split(':')[0],
    minute: t.split(':')[1],
    second: 0
  };
};

const Worker = async (client) => {
  if (config.custom.OkunaAPITracker) {
    schedule.scheduleJob(getTime(config.custom.OkunaAPITracker.time), async () => {
      const data = await init();

      if (!data) {
        return;
      }

      const files = data.map(f => `:small_blue_diamond: ${f.split('.')[0]}\n`).join('');

      const message = `**Hey, <@${config.bot.owner}>! The following Okuna APIs have been updated:**\n${files}`;

      return client.guilds.get(config.bot.guild).channels.get(config.custom.OkunaAPITracker.channel).send(message);
    });
  }
};

module.exports = Worker;
