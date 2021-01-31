const iro = require('node-iro').default;
const { bold, bgCyan, bgGreen, bgBlue, bgRed, red } = require('node-iro');

const PortHuCrawler = require('./PortHuCrawler');
const CinemagiaCrawler = require('./CinemagiaCrawler');

let config = {};

/**
 * Logs a string if debug mode is enabled.
 * @param {string} str
 */
const log = str => {
  if (config.debug) {
    console.log(str);
  }
};

/**
 * Turns the result into a Discord Embed.
 * @param {object} result
 * @returns {object}
 */
const generateEmbed = result => {
  const fields = [
    {
      name: 'Title',
      value: result.title
    },
    {
      name: 'Channel',
      value: result.channel
    },
    {
      name: 'Time',
      value: result.time
    }
  ];

  return {
    embed: {
      title: `:flag_${result.language}: Found movie!`,
      fields
    }
  };
};

/**
 * Creates a big array of results and returns it.
 * @returns {(array|null)}
 */
const MovieTracker = async (movieTrackerConfig) => {
  if (!movieTrackerConfig) {
    return;
  }

  config = movieTrackerConfig;

  const port = new PortHuCrawler({
    channels: config.portdothu.channels,
    genres: config.portdothu.genres
  });

  const cinemagia = new CinemagiaCrawler({
    channels: config.cinemagia.channels,
    genre: config.cinemagia.genre
  });

  let results = [];

  log(iro(`${iro('PORT.HU', bgCyan)} - Fetching information...`, bold));
  log(`${iro('Fetch URL:', bold)} ${port.getFetchUrl()}`);

  try {
    const portData = await port.init();

    if (portData) {
      log(iro(`${iro('SUCCESS', bgGreen)} Returned data:`, bold));
      log(portData);

      results = [...portData];
    } else {
      log(iro(`${iro('INFO', bgBlue)} The result set is empty.`, bold));
    }
  } catch (err) {
    log(iro(`${iro('ERROR', bgRed)} ${iro('Something bad happened...', red)}`, bold));
    log(err);
  }

  log('\n');

  log(iro(`${iro('CINEMAGIA.RO', bgCyan)} - Fetching information...`, bold));
  log(`${iro('Fetch URL:', bold)} ${cinemagia.getFetchUrl()}`);

  try {
    const cinemagiaData = await cinemagia.init();

    if (cinemagiaData) {
      log(iro(`${iro('SUCCESS', bgGreen)} Returned data:`, bold));
      log(cinemagiaData);

      results = [...results, ...cinemagiaData];
    } else {
      log(iro(`${iro('INFO', bgBlue)} The result set is empty.`, bold));
    }
  } catch (err) {
    log(iro(`${iro('ERROR', bgRed)} ${iro('Something bad happened...', red)}`, bold));
    log(err);
  }

  log('\n');

  if (results.length) {
    log(iro('FINAL RESULT SET', bold, bgGreen));
    log(results);

    return results.map(r => generateEmbed(r));
  } else {
    log(iro('Final result set is empty.', bold, bgBlue));
    return null;
  }
};

module.exports = MovieTracker;
