# My Custom Directives for Thimble Bot

https://thimble-bot.vercel.app

## what this

This repository contains the custom commands, libraries, and workers used in my own instance of Thimble Bot. It also serves as an example of how to use the custom directives feature of the bot.

## Currently Available Directives

  - **StatusTracker** (command, library, and onReady handler) - notifies you if one of the provided websites are not functioning properly.
  - **MovieTracker** (command, library, and onReady handler) - sends you daily notifications about movies that are airing on TV on that particular day.

## Setup

Replace your `custom.json` file in Thimble Bot's `config` folders with the `custom.example.json` file (or just append the directives to it).

To install the extra dependencies, run `npm install`.

## License

MIT.
