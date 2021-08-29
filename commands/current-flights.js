const Discord = require("discord.js");
const mysql = require("mysql");
const fetch = require('node-fetch')

module.exports = {
  name: "current-flights",
  aliases: ["loty", "aktualne-loty", "actual-flights"],
  description:
    "Shows current flights registered by the Evolving Airlines flight tracking system.",
  execute(message) {
    fetch('http://marcink50.ddns.net:3000/getCurrentFlights')
    .then(response => response.json())
    .then(data => {
      const exampleEmbed = new Discord.MessageEmbed()
        .setColor("#0099ff")
        .setTitle(`:small_blue_diamond: Current flights`)
        .setTimestamp()
        .setFooter(
          `Executed by ${message.author.username}. Made with ❤️ by MarcinK50`
        );
      if (data.flights.length == 0) {
        exampleEmbed.setDescription(
          `:small_blue_diamond: Currently, nobody flying`
        );
      } else {
        data.flights.forEach((flight) => {
          exampleEmbed.addField(
            `:small_blue_diamond: ${flight.pilotNick}`,
            `At ${flight.altitude}ft, with heading ${flight.heading} and speed ${flight.speed}kt`
          );
        });
      }
      message.channel.send(exampleEmbed);
    })
  },
};
