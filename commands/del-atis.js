const Discord = require("discord.js");
const fs = require("fs");

module.exports = {
  name: "del-atis",
  aliases: ["usun-atis", "delete-atis", "remove-atis"],
  description: "Usuwa ATIS dla danego lotniska!",
  execute(message, args) {
    if (!args.length)
      return message.channel.send(
        "Enter the airport for which you want to delete ATIS!"
      );

    if (message.member.roles.cache.some((role) => role.name === "ATC")) {
      var argsOld = [...args];
      args.shift();
      const exampleEmbed = new Discord.MessageEmbed()
        .setColor("#0099ff")
        .setTitle(`:white_check_mark: Deleted ATIS ${argsOld[0]}`)
        .setTimestamp()
        .setFooter(
          `Executed by ${message.author.username}. Made with ❤️ by MarcinK50`
        );

      // write JSON string to a file
      fs.readFile("db.json", "utf-8", (err, data) => {
        if (err) {
          throw err;
        }
        var newParsedData;
        var parsedData = JSON.parse(data);

        try {
        parsedData.forEach((airportAtis) => {
          if (airportAtis.airport == argsOld[0]) {
            let index = parsedData.indexOf(airportAtis);
            newParsedData = parsedData.slice(index, index);
            console.log(parsedData);
          }
        });
        var stringifiedData = JSON.stringify(newParsedData);
        console.log("JSON data is saved.");
        fs.writeFile("db.json", stringifiedData, (err) => {
          if (err) {
            throw err;
          }
          message.channel.send(exampleEmbed);
        });
      } catch {
        const exampleEmbed = new Discord.MessageEmbed()
        .setColor("#f54336")
        .setTitle(`:x: ATIS for ${argsOld[0]} is not set currently`)
        .setTimestamp()
        .setFooter(
          `Executed by ${message.author.username}. Made with ❤️ by MarcinK50`
        );

        message.channel.send(exampleEmbed);
      }
      });
    } else {
      const exampleEmbed = new Discord.MessageEmbed()
        .setColor("#f54336")
        .setTitle(`:x: You are not ATC to remove ATIS`)
        .setTimestamp()
        .setFooter(
          `Executed by ${message.author.username}. Made with ❤️ by MarcinK50`
        );

      message.channel.send(exampleEmbed);
    }
  },
};
