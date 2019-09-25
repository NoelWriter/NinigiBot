exports.run = (client, message, args) => {
    try {
        // Split off command
        let reportMessage = message.content.slice(8);
        if (reportMessage.length < 1) {
            return message.channel.send(`> You need to specify something to report, <@${message.author.id}>.`);
        }
        // send msg to owner
        let members = message.channel.members;
        let owner = members.find('id', client.config.ownerID);
        owner.send(`> **Report by <@${message.member.user.id}> in <#${message.channel.id}>:**
> ${reportMessage}`);

        // return confirmation
        return message.channel.send(`> Report successfully sent, <@${message.author.id}>.`);

    } catch (e) {
        // send msg to owner
        let members = message.channel.members;
        let owner = members.find('id', client.config.ownerID);
        owner.send(`> An error occurred while <@${message.member.user.id}> tried to use a command in <#${message.channel.id}>, check console for more information.`);

        // log error
        console.log(e);

        // return confirmation
        return message.channel.send(`> An error has occurred trying to run the command, <@${message.author.id}>, please use "${client.config.prefix}report" to report the issue.`);
    };
};

module.exports.help = {
    name: "Report",
    description: "Reports a complaint or bug you have, please only use in case it's usefull and be specific about your issue.",
    usage: `Report [text]`
};