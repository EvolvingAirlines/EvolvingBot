const Discord = require('discord.js');
const axios = require('axios');

var responseGlobal = ""

module.exports = {
	name: 'metar',
	description: 'Wyświetla czysty METAR dla danego lotniska!',
	execute(message, args) {
		if (!args.length) return message.channel.send("Enter airport's ICAO code!")
        
        // Make a request for a user with a given ID
        axios.get(`https://avwx.rest/api/metar/${args[0]}?token=5KZMQbG7X9iN2HR45G5t0KgLA4Y02DRH4YF-u2jB3UA`)
        .then(function (response) {
            responseGlobal = response
            const exampleEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle(`:white_sun_cloud: Weather for ${args[0]}`)
            .addFields(
                { name: 'METAR', value: `:small_blue_diamond: ${responseGlobal.data.raw}` },
            )
            .setTimestamp()
            .setFooter(`Executed by ${message.author.username}. Made with ❤️ by MarcinK50`);
            message.channel.send(exampleEmbed)
        })
        .catch(function (error) {
            // handle error
            message.channel.send("An error has occurred :(");
            console.log(error)
        })
	},
};