const Discord = require("discord.js");
const mysql = require("mysql");

module.exports = {
  name: "flight-info",
  aliases: ["info-o-locie"],
  description:
    "Shows current flights registered by the Evolving Airlines flight tracking system.",
  execute(message) {
    var con = mysql.createConnection({
      host: "localhost",
      user: "marcin",
      password: "01891484",
      database: "passing",
    });
    con.connect(function (err) {
      if (err) throw err;
    });
    var sql = `SELECT * from \`actual_flights\``;
    con.query(sql, function (err, result) {
      if (err) throw err;

      const exampleEmbed = new Discord.MessageEmbed()
        .setColor("#0099ff")
        .setTitle(`:small_blue_diamond: Current flights`)
        .setTimestamp()
        .setFooter(
          `Executed by ${message.author.username}. Made with ❤️ by MarcinK50`
        );
      result.forEach((flight) => {
        exampleEmbed.addField(`:small_blue_diamond: ${flight.pilotNick}`, `At ${flight.altitude}ft, with heading ${flight.heading} and speed ${flight.speed}kt`)
      });
      message.channel.send(exampleEmbed)
      console.log(result[0])
    });
  },
};
