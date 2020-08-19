module.exports.run = async (client, message, args) => {
  try {
    const { EligibleRoles } = require('../database/dbObjects')

    // Import globals
    let globalVars = require('../events/ready');
    let member = message.member;
    let arguments = args;

    if (message.mentions.members.first()) {
      if (!message.member.hasPermission("MANAGE_ROLES")) return message.reply(globalVars.lackPerms);
      member = message.mentions.members.first();
      arguments.pop();
    };

    const requestRole = arguments.join(' ');

    if (requestRole.length < 1) return message.channel.send(`> Please provide a role, use \`${client.config.prefix}role help\` to see the available roles, ${message.author}.`);

    const db = await EligibleRoles.findAll();
    const roles = db.map(role => role.role_id);

    if (roles.length < 1) return message.channel.send(`> There are no eligible roles to assign to yourself in this server, ${message.author}.`);
    if (requestRole.toLowerCase() === 'help') {
      let roleText = []
      member.guild.roles.cache.each(role => {
        if (roles.includes(role.id)) {
          roleText.push(role)
        }
      });

      roleText.sort((r, r2) => r2.position - r.position).join(", ");
      roleText = roleText.map(role => role.name)
      return message.channel.send(`> **List of available roles:** 
> ${roleText.join(', ')}`)
    };

    const role = message.member.guild.roles.cache.find(role => role.name.toLowerCase() === requestRole.toLowerCase());

    if (!role) return message.channel.send(`> That role does not exist, ${message.author}.`);
    if (!roles.includes(role.id)) return message.channel.send(`> Invalid role, use \`${client.config.prefix}role help\` to see the available roles, ${message.author}.`);
    if (role.managed == true) return message.channel.send(`> I can't manage the **${role.name}** role because it is being automatically managed by an integration, ${message.author}.`);
    if (message.guild.me.roles.highest.comparePositionTo(role) <= 0) return message.channel.send(`> I can't manage the **${role.name}** role because it is above my highest role, ${message.author}.`);

    if (member.roles.cache.has(role.id)) {
      await member.roles.remove(role);
      return message.channel.send(`> You no longer have the **${role.name}** role, ${member}. *booo*`);
    } else {
      await member.roles.add(role);
      return message.channel.send(`> You now have the **${role.name}** role, ${member}! Yay!`);
    };

  } catch (e) {
    // log error
    console.log(e);

    // return confirmation
    return message.channel.send(`> An error has occurred trying to run the command, please report this as an issue on the Github page or send a message to the bot owner. For links and other information use ${client.config.prefix}info.`);

  };
};