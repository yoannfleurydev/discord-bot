const puppeteer = require("puppeteer");
const Discord = require("discord.js");

const PATH = "./vaccins.png";

module.exports = {
  name: "vaccins",
  description:
    "Récupérer les données françaises sur le vaccins contre le Coronavirus COVID-19",
  async execute(message) {
    message.channel.send(
      "⬇️ Récupération des données en cours, veuillez patienter"
    );

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox"],
    });
    const page = await browser.newPage();
    await page.goto("https://covidtracker.fr/vaccintracker/", {
      waitUntil: "networkidle2",
    });
    console.log("On page");

    // Taking screenshot
    await page.waitForSelector("#tableauVaccin");
    const table = await page.$("#tableauVaccin");
    await table.screenshot({ path: PATH });
    console.log("Taking screenshot");

    // Getting data
    await page.waitForSelector("#proportionVaccinesMax");
    const percentageElementMax = await page.$("#proportionVaccinesMax");
    const textMax = await page.evaluate(
      (element) => element.textContent,
      percentageElementMax
    );
    console.log("Getting percentage");
    await browser.close();

    // Create the attachment using MessageAttachment
    const attachment = new Discord.MessageAttachment(PATH);
    console.log("Sending attachment");
    // Send the attachment in the message channel
    message.channel.send(
      `Environ ${textMax}% de français vaccinés`,
      attachment
    );
  },
};
