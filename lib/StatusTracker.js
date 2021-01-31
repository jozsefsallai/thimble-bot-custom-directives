const axios = require('axios');

class StatusTracker {
  /**
   * @typedef StatusTrackerOpts
   * @property {boolean} userInitialized
   * @property {IThimbleBot} client
   */
  /**
   * @constructor
   * @param {StatusTrackerOpts} opts
   */
  constructor(opts) {
    this.config = opts.client.config.custom && opts.client.config.custom.StatusTracker;

    this.domains = this.config && this.config.domains;
    this.timeout = this.config && this.config.timeout;
    this.down = [];
    this.badStatus = [];
    this.userInitialized = (opts && opts.userInitialized) || false;
  }

  /**
   * Creates an asynchronous loop through an array.
   * @param {array} arr
   * @param {function} callback
   */
  async asyncLoop(arr, callback) {
    for (let i = 0; i < arr.length; i++) {
      await callback(arr[i], i, arr);
    }
  }

  /**
   * Checks whether a given URL is accessible.
   * @param {string} url
   * @returns {Promise}
   */
  getStatus(url) {
    return new Promise((resolve, reject) => {
      return axios.get(url, { timeout: this.timeout * 1000 })
        .then(() => resolve('OK'))
        .catch(err => err.response ? reject('BAD_STATUS') : reject('UNREACHABLE'));
    });
  }

  /**
   * Loops through an array of domains and performs a check.
   */
  async checkDomains() {
    return this.asyncLoop(this.domains, async (domain) => {
      try {
        await this.getStatus(domain);
      } catch (err) {
        switch (err) {
          case 'BAD_STATUS':
            return this.badStatus.push(domain);
          case 'UNREACHABLE':
            return this.down.push(domain);
          default:
            throw new Error(err);
        }
      }
    });
  }

  /**
   * Turns an array of strings into a list.
   * @param {array} arr
   * @returns {string}
   */
  makeList(arr) {
    return ` • ${arr.join('\n • ')}`;
  }

  /**
   * Creates a Discord embed based on the given options.
   * @param {object} opts
   * @returns {object}
   */
  generateEmbed(opts) {
    const {
      fields,
      description,
      icon,
      color
    } = opts;

    return {
      embed: {
        title: 'Server Status Tracker',
        description,
        fields,
        thumbnail: {
          url: icon
        },
        color,
        timestamp: new Date(),
        footer: {
          text: '<3'
        }
      }
    };
  }

  /**
   * Initiates the process of checking.
   * @returns {Promise}
   */
  track() {
    return new Promise((resolve, reject) => {
      return this
        .checkDomains()
        .then(() => {
          const fields = [];

          if (this.badStatus && this.badStatus.length) {
            fields.push({
              name: 'The following websites return a bad status code:',
              value: this.makeList(this.badStatus)
            });
          }

          if (this.down && this.down.length) {
            fields.push({
              name: 'The following websites are inaccessible:',
              value: this.makeList(this.down)
            });
          }

          const description = fields && fields.length
            ? 'There are some issues with one or more websites.'
            : 'Woo-hoo, all websites are perfectly functional!';

          const icon = fields && fields.length
            ? 'https://thimble-bot.vercel.app/assets/serverstatus/server_error.png'
            : 'https://thimble-bot.vercel.app/assets/serverstatus/server_ok.png';

          const color = fields && fields.length
            ? 0xd72828
            : 0x41ad49;

          const embed = this.generateEmbed({
            fields,
            description,
            icon,
            color
          });

          return !fields.length && this.config.quiet && !this.userInitialized
            ? resolve(null)
            : resolve(embed);
        })
        .catch(err => reject(err));
    });
  }
};

module.exports = StatusTracker;
