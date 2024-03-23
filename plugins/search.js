const {
    Sparky,
    commands,
    isPublic
} = require("../lib/plugins.js");
const axios = require('axios');
const fetch = require('node-fetch');
const API = require("../config.js");

Sparky(
    {
        name: "xv",
        fromMe: isPublic,
        desc: "Instagram downloader",
        category: "downloader",
    },
    async ({
        m, client, args
    }) => {
let sample = await fetch(`${API}/api/search/xvideos?search=${args}`);
var data = await sample.json();
let txt = `xv search results\n\n`;
      
        for (let i=1; i<11; i++){
  txt+=`
TITLE : ${data.data[i].title}
DURATION : ${data.data[i].duration}
URL : ${data.data[i].url}\n`
        }
return m.adreply(`${txt}`)
    }
  );
