const cooldown = new Set();

exports.run = (client, message) => {
    // Import globals
    let globalVars = require('../../events/ready');
    try {
        if (cooldown.has(message.author.id)) {
            return message.channel.send(`> You are currently on cooldown from using this command, ${message.author}.`);
        } else {
            const { bank } = require('../../database/bank');
            let currency = globalVars.currency
            let balance = bank.currency.getBalance(message.author.id);
            const input = message.content.split(` `, 2);
            let inputText = "";
            if (input[1]) inputText = input[1].toLowerCase();
            if (inputText == "half") input[1] = balance / 2;
            if (inputText == "all") input[1] = balance;
            amount = input[1];

            if (!amount || isNaN(amount)) return message.channel.send(`> You need to specify a valid number to gamble, ${message.author}.`);
            amount = Math.floor(amount);
            if (balance <= 0) return message.channel.send(`> Please enter an amount that's equal to or larger than 1, ${message.author}.`);

            if (amount > balance) {
                return message.channel.send(`> You only have ${Math.floor(balance)}${currency}, ${message.author}.`);
            };

            let returnString = `> Congratulations, ${message.author}, you flipped **heads** and won ${amount}${currency}.`;

            // Coinflip randomization
            if (Math.random() >= 0.5) {
                returnString = `> Sorry, ${message.author}, you flipped **tails** and lost ${amount}${currency}.`;
                amount = Math.abs(amount) * -1;
            };

            bank.currency.add(message.author.id, amount);
            message.channel.send(returnString);

            cooldown.add(message.author.id);

            return setTimeout(() => {
                cooldown.delete(message.author.id);
            }, 1500);
        };

    } catch (e) {
        // log error
        console.log(e);

        // return confirmation
        return message.channel.send(`> An error has occurred trying to run the command, please report this as an issue on the Github page or send a message to the bot owner. For links and other information use ${globalVars.prefix}info.`);
    };
};
