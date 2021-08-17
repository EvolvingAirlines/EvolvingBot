const Discord = require("discord.js");
const mysql = require("mysql");

module.exports = {
  name: "current-flights",
  aliases: ["loty", "aktualne-loty", "actual-flights"],
  description:
    "Shows current flights registered by the Evolving Airlines flight tracking system.",
  execute(message) {
    var connection;

    function handleDisconnect() {
      connection = mysql.createConnection({
        host: "localhost",
        user: "marcin",
        password: "01891484",
        database: "passing",
      });

      connection.connect(function (err) {
        if (err) {
          console.log("error when connecting to db:", err);
          setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
        } // to avoid a hot loop, and to allow our node script to
      }); // process asynchronous requests in the meantime.
      // If you're also serving http, display a 503 error.
      connection.on("error", function (err) {
        console.log("db error", err);
        if (err.code === "PROTOCOL_CONNECTION_LOST") {
          // Connection to the MySQL server is usually
          handleDisconnect(); // lost due to either server restart, or a
        } else {
          // connnection idle timeout (the wait_timeout
          throw err; // server variable configures this)
        }
      });
    }

    handleDisconnect();
    connection.connect(function (err) {
      if (err) throw err;
    });
    var sql = `SELECT * from \`actual_flights\``;
    connection.query(sql, function (err, result) {
      if (err) throw err;

      const exampleEmbed = new Discord.MessageEmbed()
        .setColor("#0099ff")
        .setTitle(`:small_blue_diamond: Current flights`)
        .setTimestamp()
        .setFooter(
          `Executed by ${message.author.username}. Made with ❤️ by MarcinK50`
        );
      if (result.length == 0) {
        exampleEmbed.setDescription(
          `:small_blue_diamond: Currently, nobody flying`
        );
      } else {
        result.forEach((flight) => {
          exampleEmbed.addField(
            `:small_blue_diamond: ${flight.pilotNick}`,
            `At ${flight.altitude}ft, with heading ${flight.heading} and speed ${flight.speed}kt`
          );
        });
      }
      message.channel.send(exampleEmbed);
      console.log(result[0]);
    });
  },
};
