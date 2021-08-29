require("dotenv").config();
const Discord = require("discord.js");
const fs = require("fs");
const prefix = process.env.PREFIX;
const axios = require("axios");
const WebSocket = require("ws");

const client = new Discord.Client();
client.commands = new Discord.Collection();

// const ws = new WebSocket("ws://marcink50.ddns.net:3000");

// ws.on("open", function open() {
//   setInterval(() => {
//     ws.send("send");
//   }, 2000);
// });
// ws.on("message", function incoming(message) {
//   const id = message.split(", ")[0];
//   const token = message.split(", ")[1];
//   console.log(`id: ${id}, token: ${token}`);
//   (async () => {
//     await client.guilds.fetch("867704240972627969")
//     .then(guild => {
//       guild.addMember(id, { accessToken: token })
//     })
    // await client.guilds.cache.get("867704240972627969").members.fetch(id)
    //   .then((member) => {
    //     member.setNickname("test");
    //   });
//   })();
// });

const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  // set a new item in the Collection
  // with the key as the command name and the value as the exported module
  client.commands.set(command.name, command);
}

client.once("ready", () => {
  console.log("Ready!");
  // CZĘŚĆ METAR
  client.channels.fetch(process.env.METARCHANNEL).then((channel) => {
    const airports = ["EDDV"];

    airports.forEach((airport) => {
      axios
        .get(
          `https://avwx.rest/api/metar/${airport}?token=${process.env.METARTOKEN}`
        )
        .then(function (response) {
          if (response.data.remarks) {
            var remarks = response.data.remarks;
          } else {
            remarks = "None.";
          }
          if (response.data.visibility.repr == "CAVOK") {
            var cavok = `:white_check_mark: ${response.data.visibility.repr} - Clouds and visibility ok`;
          } else {
            cavok = `:small_blue_diamond: ${response.data.visibility.repr}`;
          }
          if (response.data.flight_rules == "VFR") {
            var flightRules = `:white_check_mark: ${response.data.flight_rules}`;
          } else if (response.data.flight_rules == "MVFR") {
            flightRules = `:warning: ${response.data.flight_rules}`;
          } else {
            flightRules = `:x: ${response.data.flight_rules}`;
          }
          if (response.data.wind_speed.value < 15) {
            var wind = `:white_check_mark: ${response.data.wind_direction.repr} at ${response.data.wind_speed.value}KT`;
          } else {
            wind = `:x: ${response.data.wind_direction.repr} z siłą ${response.data.wind_speed.value}KT`;
          }
          var cloudsMessage = "";
          response.data.clouds.forEach((cloud) => {
            if (cloud.altitude <= 100) cloud.altitude = `0${cloud.altitude}`;
            switch (cloud.type) {
              case "FEW":
                var clouds = `FEW - 12,5% - 25% cloudy on FL${cloud.altitude}`;
                break;
              case "SCT":
                clouds = `SCT - 37,5% - 50% cloudy on FL${cloud.altitude}`;
                break;
              case "BKN":
                clouds = `BKN - 62,5% - 87,5% cloudy on FL${cloud.altitude}`;
                break;
              case "OVC":
                clouds = `OVC - 100% cloudy on FL${cloud.altitude}`;
                break;
            }
            cloudsMessage = `${cloudsMessage}\n:small_blue_diamond: ${clouds}`;
          });
          if (response.data.clouds[0] == undefined) {
            cloudsMessage = ":small_blue_diamond: None.";
          }

          const exampleEmbed = new Discord.MessageEmbed()
            .setColor("#0099ff")
            .setTitle(`:white_sun_cloud: Hourly weather for ${airport}`)
            .addFields(
              {
                name: "QNH",
                value: `:small_blue_diamond: ${response.data.altimeter.value}hPa`,
              },
              { name: "Wind", value: `${wind}` },
              {
                name: "Temperature/dewpoint",
                value: `:small_blue_diamond: ${response.data.temperature.value}°C/${response.data.dewpoint.value}°C`,
              },
              { name: "Flight rules", value: `${flightRules}` },
              { name: "Visibility", value: `${cavok}` },
              { name: "Clouds", value: `${cloudsMessage}` },
              { name: "Remarks", value: `:small_blue_diamond: ${remarks}` }
            )
            .setTimestamp()
            .setFooter(`Made with ❤️ by MarcinK50`);
          channel.send(exampleEmbed);
        })
        .catch(function (error) {
          // handle error
          channel.send("An error has occurred @MarcinK50#9775 :(");
          console.log(error);
        });
    });

    setTimeout(() => {
      setInterval(() => {
        var weatherEmbed;

        channel.messages.fetch({ limit: 1 }).then((msg) => {
          const fetchedMsg = msg.first();
          axios
            .get(
              `https://avwx.rest/api/metar/EDDV?token=${process.env.METARTOKEN}`
            )
            .then(function (response) {
              if (response.data.remarks) {
                var remarks = response.data.remarks;
              } else {
                remarks = "None.";
              }
              if (response.data.visibility.repr == "CAVOK") {
                var cavok = `:white_check_mark: ${response.data.visibility.repr} - Clouds and visibility ok`;
              } else {
                cavok = `:small_blue_diamond: ${response.data.visibility.repr}`;
              }
              if (response.data.flight_rules == "VFR") {
                var flightRules = `:white_check_mark: ${response.data.flight_rules}`;
              } else if (response.data.flight_rules == "MVFR") {
                flightRules = `:warning: ${response.data.flight_rules}`;
              } else {
                flightRules = `:x: ${response.data.flight_rules}`;
              }
              if (response.data.wind_speed.value < 15) {
                var wind = `:white_check_mark: ${response.data.wind_direction.repr} at ${response.data.wind_speed.value}KT`;
              } else {
                wind = `:x: ${response.data.wind_direction.repr} at ${response.data.wind_speed.value}KT`;
              }
              var cloudsMessage = "";
              response.data.clouds.forEach((cloud) => {
                if (cloud.altitude <= 100)
                  cloud.altitude = `0${cloud.altitude}`;
                switch (cloud.type) {
                  case "FEW":
                    var clouds = `FEW - 12,5% - 25% cloudy on FL${cloud.altitude}`;
                    break;
                  case "SCT":
                    clouds = `SCT - 37,5% - 50% cloudy on FL${cloud.altitude}`;
                    break;
                  case "BKN":
                    clouds = `BKN - 62,5% - 87,5% cloudy on FL${cloud.altitude}`;
                    break;
                  case "OVC":
                    clouds = `OVC - 100% cloudy on FL${cloud.altitude}`;
                    break;
                }
                cloudsMessage = `${cloudsMessage}\n:small_blue_diamond: ${clouds}`;
              });
              if (response.data.clouds[0] == undefined) {
                cloudsMessage = ":small_blue_diamond: None.";
              }

              weatherEmbed = new Discord.MessageEmbed()
                .setColor("#0099ff")
                .setTitle(`:white_sun_cloud: Hourly weather for EDDV`)
                .addFields(
                  {
                    name: "QNH",
                    value: `:small_blue_diamond: ${response.data.altimeter.value}hPa`,
                  },
                  { name: "Wind", value: `${wind}` },
                  {
                    name: "Temperature/dewpoint",
                    value: `:small_blue_diamond: ${response.data.temperature.value}°C/${response.data.dewpoint.value}°C`,
                  },
                  { name: "Flight rules", value: `${flightRules}` },
                  { name: "Visibility", value: `${cavok}` },
                  { name: "Clouds", value: `${cloudsMessage}` },
                  { name: "Remarks", value: `:small_blue_diamond: ${remarks}` }
                )
                .setTimestamp()
                .setFooter(`Made with ❤️ by MarcinK50`);
              fetchedMsg.edit(weatherEmbed);
            });
        });
      }, 60000);
    }, 5000);
  });
  // KONIEC CZĘŚCI METAR
  // CZĘŚĆ ATIS
  client.channels.fetch(process.env.ATISCHANNEL).then((channel) => {
    fs.readFile("db.json", "utf-8", (err, data) => {
      if (err) {
        throw err;
      }

      var parsedData = JSON.parse(data);
      var atisEmbed = new Discord.MessageEmbed()
        .setColor("#0099ff")
        .setTitle(`:satellite: Current ATIS messages`)
        .setTimestamp()
        .setFooter(`Made with ❤️ by MarcinK50`);
      if (parsedData.length == 0)
        atisEmbed.setDescription(":small_blue_diamond: No ATIS");
      parsedData.forEach((atis) => {
        atisEmbed.addField(
          `${atis.airport}`,
          `:small_blue_diamond: ${atis.atis}`
        );
      });

      channel.send(atisEmbed);
    });

    setTimeout(() => {
      setInterval(() => {
        channel.messages.fetch({ limit: 1 }).then((msg) => {
          const fetchedMsg = msg.first();
          fs.readFile("db.json", "utf-8", (err, data) => {
            if (err) {
              throw err;
            }

            var parsedData = JSON.parse(data);
            var atisEmbed = new Discord.MessageEmbed()
              .setColor("#0099ff")
              .setTitle(`:satellite: Current ATIS messages`)
              .setTimestamp()
              .setFooter(`Made with ❤️ by MarcinK50`);
            if (parsedData.length == 0)
              atisEmbed.setDescription(":small_blue_diamond: No ATIS");
            parsedData.forEach((atis) => {
              atisEmbed.addField(
                `${atis.airport}`,
                `:small_blue_diamond: ${atis.atis}`
              );
            });

            fetchedMsg.edit(atisEmbed);
          });
        });
      }, 10000);
    }, 5000);
  });
  // KONIEC CZĘŚCI ATIS
});

client.on("message", (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command =
    client.commands.get(commandName) ||
    client.commands.find(
      (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
    );

  if (!command) return;

  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply("there was an error trying to execute that command!");
  }
});

client.login('ODgwMDk0NDQ2NjE4ODA4NDEx.YSZR0w.EPmreeayrraBJX_PePb4QUFvLwA');
