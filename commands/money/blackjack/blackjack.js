

exports.run = async (client, message) => {
    // Import globals
    let globalVars = require('../../../events/ready');
    try {
        const roulette = require('../../../affairs/roulette');
        const { bank } = require('../../../database/bank');
        const Discord = require("discord.js");
        let process = null;

        let avatar = null;
        if (client.user.avatarURL()) avatar = client.user.avatarURL({ format: "png" });

        return;


    } catch (e) {
        // log error
        console.log(e);

        // return confirmation
        return message.channel.send(`> An error has occurred trying to run the command, please report this as an issue on the Github page or send a message to the bot owner. For links and other information use ${globalVars.prefix}info.`);
    };
};

