exports.run = (client, message) => {
    // Import globals
    let globalVars = require('../../events/ready');
    try {
        let split = message.content.split(` `, 3);
        let conversionType = split[1];
        let conversionValue = split[2];

        if (!conversionValue) return message.channel.send(`> You need to provide a number to calculate, ${message.author}.`);
        if (isNaN(conversionValue)) return message.channel.send(`> What you provided isn't a number, ${message.author}.`);
        parseFloat(conversionValue);

        conversionType = conversionType.toLowerCase();

        switch (conversionType) {
            case "fahrenheit":
                conversionReturn = (conversionValue - 32) * 5 / 9;
                typeCapitalized = "degrees Fahrenheit";
                typeReturn = "degrees Celsius"
                break;
            case "feet":
                conversionReturn = conversionValue / 3.28084;
                typeCapitalized = "feet";
                typeReturn = "meters";
                break;
            case "lbs":
                conversionReturn = conversionValue * 0.453592;
                typeCapitalized = "lbs";
                typeReturn = "kilos";
                break;
            default:
                return message.channel.send(`> You didn't return a supported conversion type, the currently supported types are Fahrenheit, feet and lbs, ${message.author}.`);
        };
        conversionReturn = Math.round(conversionReturn * 100) / 100;

        return message.channel.send(`> ${conversionValue} ${typeCapitalized} equals ${conversionReturn} ${typeReturn}, ${message.author}.`);

    } catch (e) {
        // log error
        const logger = require('../../util/logger');

        logger(e, client, message);
    };
};