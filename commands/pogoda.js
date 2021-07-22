const Discord = require("discord.js");
const axios = require("axios");

module.exports = {
  name: "weather",
  aliases: ["pogoda"],
  description: "Wyświetla pogodę dla danego lotniska!",
  execute(message, args) {
    if (!args.length) return message.channel.send("Enter the airport's ICAO code!");

    // Make a request for a user with a given ID
    axios
      .get(
        `https://avwx.rest/api/metar/${args[0]}?token=5KZMQbG7X9iN2HR45G5t0KgLA4Y02DRH4YF-u2jB3UA`
      )
      .then(function (response) {
        if (response.data.remarks) {
          var remarks = response.data.remarks;
        } else {
          remarks = "Brak.";
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
          .setTitle(`:white_sun_cloud: Weather for ${args[0]}`)
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
            { name: "Remarks", value: `:small_blue_diamond: ${remarks}` },
            { name: "METAR", value: `:small_blue_diamond: ${response.data.raw}` }
          )
          .setTimestamp()
          .setFooter(
            `Executed by ${message.author.username}. Made with ❤️ by MarcinK50`
          );
        message.channel.send(exampleEmbed);
      })
      .catch(function (error) {
        // handle error
        message.channel.send(
          "An error has occured :("
        );
        console.log(error);
      });
  },
};
