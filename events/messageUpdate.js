module.exports = async (client, message, oldMessage) => {
    try {
        const Discord = require("discord.js");

        const log = message.guild.channels.cache.find(channel => channel.name === "log");

        if (!log) return;

        // Import totals
        let globalVars = require('./ready');

        if (message.content == "") return;
        if (message.content === oldMessage.content) return;
        if (message.channel.id == "549220763341815808") return; //Glazesdump

        if (!log) return;

        let messageImage = null;
        if (message.attachments.size > 0) messageImage = message.attachments.first().url;

        const updateEmbed = new Discord.MessageEmbed()
            .setColor("#219DCD")
            .setAuthor(`Message edited ⚒️`, message.author.avatarURL())
            .setDescription(`Message sent by ${message.author} edited in <#${message.channel.id}>.`)
            //Why does oldMessage return the newMessage, does newMessage not exist and does message return the old message?
            .addField(`Before:`, message.content, false)
            .addField(`After:`, oldMessage.content, false)
            .addField(`Jump to message:`, `[Link](${message.url})`, false)
            .setImage(messageImage)
            .setFooter(`Edited by ${message.author.tag} at`)
            .setTimestamp();

        globalVars.totalLogs += 1;
        return log.send(updateEmbed);

    } catch (e) {
        // log error
        console.log(e);
    };
};