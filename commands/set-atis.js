const Discord = require("discord.js");
const fs = require("fs");

module.exports = {
  name: "set-atis",
  aliases: ["ustaw-atis"],
  description: "Ustawia ATIS dla danego lotniska!",
  execute(message, args) {
    if (!args.length)
      return message.channel.send(
        "Provide ATIS! Example !set-atis <airport> `<ATIS>`"
      );

    if (message.member.roles.cache.some((role) => role.name === "ATC")) {
      var argsOld = [...args];
      args.shift();
      const exampleEmbed = new Discord.MessageEmbed()
        .setColor("#0099ff")
        .setTitle(`:white_check_mark: Successfully set up ATIS for ${argsOld[0]}`)
        .addFields({
          name: "ATIS",
          value: `:small_blue_diamond: \`${args.join(" ")}\``,
        })
        .setTimestamp()
        .setFooter(
          `Executed by ${message.author.username}. Made with ❤️ by MarcinK50`
        );

      var atis = {
        airport: argsOld[0],
        atis: args.join(" "),
      };

      // write JSON string to a file
      fs.readFile("db.json", "utf-8", (err, data) => {
        if (err) {
          throw err;
        }

        var parsedData = JSON.parse(data);
        parsedData.push(atis);
        var stringifiedData = JSON.stringify(parsedData);
        console.log("JSON data is saved.");
        fs.writeFile("db.json", stringifiedData, (err) => {
          if (err) {
            throw err;
          }
        });
      });

      message.channel.send(exampleEmbed);
    } else {
      const exampleEmbed = new Discord.MessageEmbed()
        .setColor("#f54336")
        .setTitle(`:x: You are not ATC to set ATIS`)
        .setTimestamp()
        .setFooter(
          `Executed by ${message.author.username}. Made with ❤️ by MarcinK50`
        );

      message.channel.send(exampleEmbed);
    }
  },
};
