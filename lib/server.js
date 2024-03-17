const axios = require("axios");
const express = require("express");
const http = require("http");
//console.log("sᴇʀᴠᴇʀ sᴛᴀʀᴛᴇᴅ ✅")
const app = express();
const PORT = process.env.PORT || 6838;

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
let i = 0;

async function web(connect) {
    app.get('/', function (req, res) {
        res.send(`${connect}`);
    });
  app.listen(PORT, () => console.log("sᴇʀᴠᴇʀ sᴛᴀʀᴛᴇᴅ ᴏɴ ᴘᴏʀᴛ : ", PORT));
  while (true) {
      i++;
      try {
       let response = await axios("http://web.v1p3r-x.repl.co")
          //console.log('Connected to web -- ', response.status);
          await sleep(40000)
      } catch {
        await sleep(10000)
         //console.log("Retrying...");
        
      }
  }

    }
 module.exports = web
