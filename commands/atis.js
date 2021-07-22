const Discord = require("discord.js");
const fs = require("fs");

module.exports = {
  name: "atis",
  description: "Wyświetla ATIS dla danego lotniska!",
  execute(message, args) {
    if (!args.length)
      return message.channel.send(
        "Enter airport ICAO code!"
      );
    fs.readFile("db.json", "utf-8", (err, data) => {
      if (err) {
        throw err;
      }
      var dontCheck
      var parsedData = JSON.parse(data);
      parsedData.forEach((airportAtis) => {
        if (airportAtis.airport == args[0]) {
          const exampleEmbed = new Discord.MessageEmbed()
            .setColor("#0099ff")
            .setTitle(`:white_check_mark: ATIS for ${args[0]}`)
            .addFields({
              name: "ATIS",
              value: `:small_blue_diamond: \`${airportAtis.atis}\``,
            })
            .setTimestamp()
            .setFooter(
              `Executed by ${message.author.username}. Made with ❤️ by MarcinK50`
            );
          dontCheck = true
          message.channel.send(exampleEmbed);
        } else if(!dontCheck){
          const exampleEmbed = new Discord.MessageEmbed()
            .setColor("#f54336")
            .setTitle(`:x: Can't find ATIS for ${args[0]}`)
            .addFields({
              name: "ATIS",
              value: `:small_blue_diamond: Ask ATC to set ATIS`,
            })
            .setTimestamp()
            .setFooter(
              `Executed by ${message.author.username}. Made with ❤️ by MarcinK50`
            );

          message.channel.send(exampleEmbed);
        }
      });
    });
  },
};
