exports.run = (client, message, args) => {
  // Import globals
  let globalVars = require('../../events/ready');
  try {
    if (message.author.id !== client.config.ownerID) {
      return message.channel.send(globalVars.lackPerms)
    };

    if (!args || args.length < 1) return message.channel.send(`> Must provide a command name to reload, ${message.author}.`);
    const commandName = args[0];

    // Check if the command exists and is valid
    if (!client.commands.has(commandName)) {
      return message.channel.send(`> That command does not exist, ${message.author}.`);
    };

    delete require.cache[require.resolve(`./${commandName}.js`)];

    // Delete and reload the command from the client.commands Enmap
    client.commands.delete(commandName);
    const props = require(`./${commandName}.js`);
    client.commands.set(commandName, props);
    return message.channel.send(`> The command "${globalVars.prefix}${commandName}" has been reloaded, ${message.author}.`);

  } catch (e) {
    // log error
    console.log(e);

    // return confirmation
    return message.channel.send(`> An error has occurred trying to run the command, please report this as an issue on the Github page or send a message to the bot owner. For links and other information use ${globalVars.prefix}info.`);
  };
};