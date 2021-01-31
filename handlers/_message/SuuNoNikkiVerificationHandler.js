const SERVER_ID = '647887622395396117';
const VERIFICATION_CHANNEL_ID = '648209801536471070';

const Handler = async (client, message) => {
  if (!message.guild) {
    return;
  }

  if (message.guild.id !== SERVER_ID) {
    return;
  }

  if (message.channel.id !== VERIFICATION_CHANNEL_ID) {
    return;
  }

  if (!message.content.includes(message.author.discriminator)) {
    return;
  }

  const guild = client.guilds.cache.get(SERVER_ID);

  const role = guild.roles.cache.find(r => r.name === 'member');
  const author = guild.members.cache.find(m => m.id === message.author.id);
  author.addRole(role);
  await message.delete();
};

module.exports = Handler;
