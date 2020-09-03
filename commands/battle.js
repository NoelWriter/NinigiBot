const { Users } = require('../database/dbObjects');
const ShinxBattle = require('../shinx/shinxBattle')
const colors = ['green', 'yellow', 'orange', 'red', 'purple']

module.exports.run = async (client, message) => {
    // Import globals
    let globalVars = require('../events/ready');
    try {
        const Canvas = require('canvas');
        const hp = require('../util/getHP');
        const { bank } = require('../database/bank');
        const Discord = require("discord.js");
        const input = message.content.slice(1).trim();
        const [, , biography] = input.match(/(\w+)\s*([\s\S]*)/);
        if(biography.length<1) return message.channel.send('Please specify a user to battle.')
        const trainers = [message.author, message.mentions.users.first()]
        shinxes = []
        for(let i = 0; i < 2; i++) {
            const shinx = await bank.currency.getShinx(trainers[i].id)
            shinx.see();
            if(shinx.sleeping) return message.channel.send('At least one of the participants is asleep.');
            const user = await Users.findOne({ where: { user_id: trainers[i].id } });
            const equipments = await user.getEquipments();
            shinxes.push(new ShinxBattle(trainers[i], shinx, equipments))
        } 
        const avatars = [trainers[0].displayAvatarURL({ format: 'jpg' }), trainers[1].displayAvatarURL({ format: 'jpg' })]
        
        let canvas = Canvas.createCanvas(240, 71);
        let ctx = canvas.getContext('2d');
        let background = await Canvas.loadImage('./assets/vs.png');
        ctx.drawImage(background, 0, 0);
        ctx.beginPath();
        for(let i = 0; i < 2; i++) ctx.arc(47+147*i, 36, 29, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.clip();
        for(let i = 0; i < 2; i++) {
            const avatar = await Canvas.loadImage(avatars[i]);
            ctx.drawImage(avatar, 18+147*i, 7, 58, 58);
        }
        await message.channel.send(new Discord.MessageAttachment(canvas.toBuffer()));
    
	
        canvas = Canvas.createCanvas(240, 168);
        ctx = canvas.getContext('2d');
        background = await Canvas.loadImage('./assets/battleUI.png');
        ctx.drawImage(background, 0, 0);
        ctx.font = 'normal bolder 14px Arial';
        ctx.fillStyle = '#FFFFFF';
        for(let i = 0; i < 2; i++) ctx.fillText(trainers[i].username, 53+49*i, 49+79*i);
        
        
        const battleSprite = await Canvas.loadImage('./assets/battleSprite.png');
        
        for(let i = 0; i < 2; i++) if(shinxes[i].shiny) ctx.drawImage(battleSprite, 39*i, 0, 39, 26, (12+177*i), 24+79*i, 39, 26 );
        const nicks = []
        const prevColors = [0, 0]
        for(let i = 0; i < 2; i++) shinxes[i].nick.trim().toLowerCase()==='shinx'? nicks.push(`${shinxes[i].owner.username}'s shinx`):nicks.push(shinxes[i].nick) 
        const geasson = await Canvas.loadImage('./assets/geasson.png');
        const geassoff =await Canvas.loadImage('./assets/geassoff.png');
        for(let i = 0; i<2; i++){
            if(shinxes[i].supergeass||shinxes[i].geass>0){
                await message.channel.send(`**...?**\nThe power of love remains!\n**${nicks[i]} entered geass mode!**`)
                ctx.drawImage(geasson, 52+35*i, 20+79*i);
                ctx.font = 'normal bolder 14px Arial';
                ctx.fillStyle = '#fc03c2';
                ctx.fillText(trainers[i].username, 53+49*i, 49+79*i);
            }
        }
        while(true){
            const hps = [hp(shinxes[0].percent), hp(shinxes[1].percent)]
            for(let i = 0; i<2; i++){
                if(!isNaN(hps[i][0])){
                    const color = hps[i][0]
                    if(color>2&& prevColors[i]<=color-1){
                        ctx.fillStyle = colors[color-1];
                        ctx.fillRect(38+90*i, 58+78*i, 96, 4)
                    }
                    ctx.fillStyle = colors[color];
                    ctx.fillRect(38+90*i, 58+78*i, hps[i][1], 4)
                    prevColors[i] = color
                }
                if(shinxes[i].geassMode()){
                    await message.channel.send(`**...?**\nThe power of love remains!\n**${nicks[i]} entered geass mode!**`)
                    ctx.drawImage(geasson, 52+35*i*i, 20+79*i);
                    ctx.font = 'normal bolder 14px Arial';
                    ctx.fillStyle = '#fc03c2';
                    ctx.fillText(trainers[i].username, 53+49*i, 49+79*i);
                } 
                if(shinxes[i].reduceGeass()) {
                    await message.channel.send(`**${nicks[i]} no longer has geass mode!**`)
                    ctx.drawImage(geassoff, 52+35*i*i, 20+79*i);
                    ctx.font = 'normal bolder 14px Arial';
                    ctx.fillStyle = '#ffffff';
                    ctx.fillText(trainers[i].username, 53+49*i, 49+79*i);
                }
                if(shinxes[i].applyRegen()){
                    await message.channel.send(`${nicks[i]} recovered some health!`)
                }
            }

            await message.channel.send(new Discord.MessageAttachment(canvas.toBuffer()));
            for(let i = 0; i < 2; i++){
                

                const attackMove = shinxes[i].attack();
                await message.channel.send(`${nicks[i]} uses ${attackMove[0]}!`)
                const result = shinxes[(i+1)%2].takeDamage(attackMove)
                if(result===-1){
                    message.channel.send(`${nicks[i]} lost his shield by blocking a critical hit!`)
                }else if (result){
                    canvas = Canvas.createCanvas(240, 130);
                    ctx = canvas.getContext('2d');
                    background = await Canvas.loadImage('./assets/results.png');
                    ctx.drawImage(background, 0, 0);
                    ctx.beginPath();
                    for(let i = 0; i < 2; i++) ctx.arc(58+134*i, 83, 40, 0, Math.PI * 2, false);
                    ctx.closePath();
                    ctx.clip();
                    for(let i = 0; i < 2; i++) {
                        const avatar = await Canvas.loadImage(avatars[(i+1)%2]);
                        ctx.drawImage(avatar, 18+134*i, 43, 80, 80);
                    }
                    message.channel.send(`${nicks[(i+1)%2]} fainted!`)
                    if(shinxes[i].gainExperience(shinxes[(i+1)%2].level)) {
                        message.channel.send(`${nicks[i]} grew to level ${shinxes[i].level}!`)
                        const reward = await require('../shinx/levelRewards')(shinxes[i]);
                        if(reward) message.channel.send(`You got a new ${reward[0]}: ${reward[1]}!`)
                    }
                    for(let i = 0; i < 2; i++) await bank.currency.updateShinx(shinxes[i])
                    return  message.channel.send(new Discord.MessageAttachment(canvas.toBuffer()))
                } 
            
            }
        }
    } catch (e) {
        // log error
        console.log(e);

        // return confirmation
        return message.channel.send(`> An error has occurred trying to run the command, please report this as an issue on the Github page or send a message to the bot owner. For links and other information use ${globalVars.prefix}info.`);
    };
};