const axios = require(`axios`);

const siliconDBUrl = 'https://silicondb.32-pratyushprat.repl.co'

// Ban an user
async function banUser(userID) {
  try {
    const response = await axios.get(
      `${siliconDBUrl}/api/data/${userID}`
    );
    if (response.status == 404 || !response.data) {
      await axios.post(`${siliconDBUrl}/api/data`, {
        id: userID,
        ban: true,
      });
    }
    if (response.data) {
      const oldData = response.data;
      const newData = { ...oldData, ban: true };
      await axios.put(
        `${siliconDBUrl}/api/data/${userID}`,
        newData
      );
    }
  } catch (err) {
    await axios.post(`${siliconDBUrl}/api/data`, {
      id: userID,
      ban: true,
    });
  }
}

// Check if an user is banned
async function checkBan(userID) {
  try {
    const response = await axios.get(
      `${siliconDBUrl}/api/data/${userID}`
    );
    if (
      response.status == 404 ||
      !response.data ||
      response.data.ban !== true
    ) {
      return false;
    } else {
      if (response.data.ban == true) {
        return true;
      } else {
        return false;
      }
    }
  } catch (err) {
    return false;
  }
}

// Unban an user
async function unbanUser(userID) {
  try {
    const response = await axios.get(
      `${siliconDBUrl}/api/data/${userID}`
    );
    if (response.status == 404 || !response.data) {
      await axios.post(`${siliconDBUrl}/api/data`, {
        id: userID,
        ban: false,
      });
    }
    if (response.data) {
      const oldData = response.data;
      const newData = { ...oldData, ban: false };
      await axios.put(
        `${siliconDBUrl}/api/data/${userID}`,
        newData
      );
    }
  } catch (err) {
    await axios.post(`${siliconDBUrl}/api/data`, {
      id: userID,
      ban: false,
    });
  }
}

// Adding a Moderator
async function addMod(userID) {
  try {
    const response = await axios.get(
      `${siliconDBUrl}/api/data/${userID}`
    );
    if (response.status == 404 || !response.data) {
      await axios.post(`${siliconDBUrl}/api/data`, {
        id: userID,
        mod: true,
      });
    }
    if (response.data) {
      const oldData = response.data;
      const newData = { ...oldData, mod: true };
      await axios.put(
        `${siliconDBUrl}/api/data/${userID}`,
        newData
      );
    }
  } catch (err) {
    await axios.post(`${siliconDBUrl}/api/data`, {
      id: userID,
      mod: true,
    });
  }
}

// Check if an user is moderator
async function checkMod(userID) {
  try {
    const response = await axios.get(
      `${siliconDBUrl}/api/data/${userID}`
    );
    if (
      response.status == 404 ||
      !response.data ||
      response.data.mod !== true
    ) {
      return false;
    } else {
      if (response.data.mod == true) {
        return true;
      } else {
        return false;
      }
    }
  } catch (err) {
    return false;
  }
}

// Removing a Moderator
async function delMod(userID) {
  try {
    const response = await axios.get(
      `${siliconDBUrl}/api/data/${userID}`
    );
    if (response.status == 404 || !response.data) {
      await axios.post(`${siliconDBUrl}/api/data`, {
        id: userID,
        mod: false,
      });
    }
    if (response.data) {
      const oldData = response.data;
      const newData = { ...oldData, mod: false };
      await axios.put(
        `${siliconDBUrl}/api/data/${userID}`,
        newData
      );
    }
  } catch (err) {
    await axios.post(`${siliconDBUrl}/api/data`, {
      id: userID,
      mod: false,
    });
  }
}

// Changing the character
async function setChar(charID) {
  try {
    const response = await axios.get(
      `${siliconDBUrl}/api/data/char`
    );
    if (response.status == 404 || !response.data) {
      await axios.post(`${siliconDBUrl}/api/data`, {
        id: `char`,
        charno: charID,
      });
    } else {
      await axios.put(
        `${siliconDBUrl}/api/data/char`,
        {
          id: `char`,
          charno: charID,
        }
      );
    }
  } catch (err) {
    await axios.post(`${siliconDBUrl}/api/data`, {
      id: `char`,
      charno: charID,
    });
  }
}

// Getting the character
async function getChar() {
  try {
    const response = await axios.get(
      `${siliconDBUrl}/api/data/char`
    );
    if (
      response.status == 404 ||
      !response.data ||
      response.data.charno == undefined
    ) {
      return `0`;
    } else {
      return response.data.charno;
    }
  } catch (err) {
    return `0`;
  }
}

// Activating the PM ChatBot
async function activateChatBot() {
  try {
    const response = await axios.get(
      `${siliconDBUrl}/api/data/pmchatbot`
    );
    if (response.status == 404 || !response.data) {
      await axios.post(`${siliconDBUrl}/api/data`, {
        id: `pmchatbot`,
        pmchatbot: true,
      });
    } else {
      await axios.put(
        `${siliconDBUrl}/api/data/pmchatbot`,
        {
          id: `pmchatbot`,
          pmchatbot: true,
        }
      );
    }
  } catch (err) {
    await axios.post(`${siliconDBUrl}/api/data`, {
      id: `pmchatbot`,
      pmchatbot: true,
    });
  }
}

// Checking the PM ChatBot
async function checkPmChatbot() {
  try {
    const response = await axios.get(
      `${siliconDBUrl}/api/data/pmchatbot`
    );
    if (response.status == 404 || !response.data) {
      return false;
    } else {
      if (response.data.pmchatbot == true) {
        return true;
      } else {
        return false;
      }
    }
  } catch (err) {
    return false;
  }
}
// Deactivating the PM ChatBot
async function deactivateChatBot() {
  try {
    const response = await axios.get(
      `${siliconDBUrl}/api/data/pmchatbot`
    );
    if (response.status == 404 || !response.data) {
      await axios.post(`${siliconDBUrl}/api/data`, {
        id: `pmchatbot`,
        pmchatbot: false,
      });
    } else {
      await axios.put(
        `${siliconDBUrl}/api/data/pmchatbot`,
        {
          id: `pmchatbot`,
          pmchatbot: false,
        }
      );
    }
  } catch (err) {
    await axios.post(`${siliconDBUrl}/api/data`, {
      id: `pmchatbot`,
      pmchatbot: false,
    });
  }
}

// Push Installation of plugin name in an array
async function pushPlugin(newPlugin, url) {
  try {
    const response = await axios.get(
      `${siliconDBUrl}/api/data`
    );
    const pluginsData = response.data.find((item) => item.id === `plugin`);
    const dataPlugin = {
      name: newPlugin,
      url: url,
    };
    if (!pluginsData) {
      await axios.post(`${siliconDBUrl}/api/data`, {
        id: `plugin`,
        plugins: [dataPlugin],
      });
    } else {
      const oldPlugins = pluginsData.plugins || [];
      const newPlugins = [...oldPlugins, dataPlugin];
      const newData = {
        ...pluginsData,
        plugins: newPlugins,
      };
      await axios.put(
        `${siliconDBUrl}/api/data/plugin`,
        newData
      );
    }
  } catch (err) {
    const dataPlugin = {
      name: newPlugin,
      url: url,
    };
    await axios.post(`${siliconDBUrl}/api/data`, {
      id: `plugin`,
      plugins: [dataPlugin],
    });
  }
}

// Pull all plugins name as an array
async function getPlugin() {
  try {
    const response = await axios.get(
      `${siliconDBUrl}/api/data`
    );
    const pluginsData = response.data.find((item) => item.id === `plugin`);
    if (!pluginsData) {
      return undefined;
    } else {
      return pluginsData.plugins.map((plugin) => ({
        name: plugin.name,
        url: plugin.url,
      }));
    }
  } catch (err) {
    return undefined;
  }
}

async function delPlugin(pluginName) {
  try {
    const response = await axios.get(
      `${siliconDBUrl}/api/data`
    );
    const pluginsData = response.data.find((item) => item.id === `plugin`);
    if (!pluginsData) {
      return undefined;
    } else {
      const oldPlugins = pluginsData.plugins || [];
      const newPlugins = oldPlugins.filter(
        (plugin) => plugin.name !== pluginName
      );
      const newData = {
        ...pluginsData,
        plugins: newPlugins,
      };
      await axios.put(
        `${siliconDBUrl}/api/data/plugin`,
        newData
      );
    }
  } catch (err) {
    return undefined;
  }
}

// Turning on the Welcome message
async function setWelcome(groupID) {
  try {
    const response = await axios.get(
      `${siliconDBUrl}/api/data/${groupID}`
    );
    if (response.status == 404 || !response.data) {
      await axios.post(`${siliconDBUrl}/api/data`, {
        id: groupID,
        welcome: true,
      });
    }
    if (response.data) {
      const oldData = response.data;
      const newData = { ...oldData, welcome: true };
      await axios.put(
        `${siliconDBUrl}/api/data/${groupID}`,
        newData
      );
    }
  } catch (err) {
    await axios.post(`${siliconDBUrl}/api/data`, {
      id: groupID,
      welcome: true,
    });
  }
}

// Checking the status of Welcome message
async function checkWelcome(groupID) {
  try {
    const response = await axios.get(
      `${siliconDBUrl}/api/data/${groupID}`
    );
    if (response.status == 404 || !response.data) {
      return false;
    }
    if (response.data) {
      return response.data.welcome;
    }
  } catch (err) {
    return false;
  }
}

// Turning off the Welcome message
async function delWelcome(groupID) {
  try {
    const response = await axios.get(
      `${siliconDBUrl}/api/data/${groupID}`
    );
    if (response.status == 404 || !response.data) {
      await axios.post(`${siliconDBUrl}/api/data`, {
        id: groupID,
        welcome: false,
      });
    }
    if (response.data) {
      const oldData = response.data;
      const newData = { ...oldData, welcome: false };
      await axios.put(
        `${siliconDBUrl}/api/data/${groupID}`,
        newData
      );
    }
  } catch (err) {
    await axios.post(`${siliconDBUrl}/api/data`, {
      id: groupID,
      welcome: false,
    });
  }
}

// Turning on the Antilink
async function setAntilink(groupID) {
  try {
    const response = await axios.get(
      `${siliconDBUrl}/api/data/${groupID}`
    );
    if (response.status == 404 || !response.data) {
      await axios.post(`${siliconDBUrl}/api/data`, {
        id: groupID,
        antilink: true,
      });
    }
    if (response.data) {
      const oldData = response.data;
      const newData = { ...oldData, antilink: true };
      await axios.put(
        `${siliconDBUrl}/api/data/${groupID}`,
        newData
      );
    }
  } catch (err) {
    await axios.post(`${siliconDBUrl}/api/data`, {
      id: groupID,
      antilink: true,
    });
  }
}

// Checking the status of Antilink
async function checkAntilink(groupID) {
  try {
    const response = await axios.get(
      `${siliconDBUrl}/api/data/${groupID}`
    );
    if (response.status == 404 || !response.data) {
      return false;
    }
    if (response.data) {
      return response.data.antilink;
    }
  } catch (err) {
    return false;
  }
}

// Turning off the Antilink
async function delAntilink(groupID) {
  try {
    const response = await axios.get(
      `${siliconDBUrl}/api/data/${groupID}`
    );
    if (response.status == 404 || !response.data) {
      await axios.post(`${siliconDBUrl}/api/data`, {
        id: groupID,
        antilink: false,
      });
    }
    if (response.data) {
      const oldData = response.data;
      const newData = { ...oldData, antilink: false };
      await axios.put(
        `${siliconDBUrl}/api/data/${groupID}`,
        newData
      );
    }
  } catch (err) {
    await axios.post(`${siliconDBUrl}/api/data`, {
      id: groupID,
      antilink: false,
    });
  }
}

// Turning on the Group Chatbot
async function setGroupChatbot(groupID) {
  try {
    const response = await axios.get(
      `${siliconDBUrl}/api/data/${groupID}`
    );
    if (response.status == 404 || !response.data) {
      await axios.post(`${siliconDBUrl}/api/data`, {
        id: groupID,
        chatbotgc: true,
      });
    }
    if (response.data) {
      const oldData = response.data;
      const newData = { ...oldData, chatbotgc: true };
      await axios.put(
        `${siliconDBUrl}/api/data/${groupID}`,
        newData
      );
    }
  } catch (err) {
    await axios.post(`${siliconDBUrl}/api/data`, {
      id: groupID,
      chatbotgc: true,
    });
  }
}

// Checking the status of Group Chatbot
async function checkGroupChatbot(groupID) {
  try {
    const response = await axios.get(
      `${siliconDBUrl}/api/data/${groupID}`
    );
    if (response.status == 404 || !response.data) {
      return false;
    }
    if (response.data) {
      return response.data.chatbotgc;
    }
  } catch (err) {
    return false;
  }
}

// Turning off the Group Chatbot
async function delGroupChatbot(groupID) {
  try {
    const response = await axios.get(
      `${siliconDBUrl}/api/data/${groupID}`
    );
    if (response.status == 404 || !response.data) {
      await axios.post(`${siliconDBUrl}/api/data`, {
        id: groupID,
        chatbotgc: false,
      });
    }
    if (response.data) {
      const oldData = response.data;
      const newData = { ...oldData, chatbotgc: false };
      await axios.put(
        `${siliconDBUrl}/api/data/${groupID}`,
        newData
      );
    }
  } catch (err) {
    await axios.post(`${siliconDBUrl}/api/data`, {
      id: groupID,
      chatbotgc: false,
    });
  }
}

// Setting bot working mode
async function setBotMode(mode) {
  try {
    const response = await axios.get(
      `${siliconDBUrl}/api/data/mode`
    );
    if (response.status == 404 || !response.data) {
      await axios.post(`${siliconDBUrl}/api/data`, {
        id: `mode`,
        mode: mode,
      });
    }
    if (response.data) {
      const oldData = response.data;
      const newData = { ...oldData, mode: mode };
      await axios.put(
        `${siliconDBUrl}/api/data/mode`,
        newData
      );
    }
  } catch (err) {
    await axios.post(`${siliconDBUrl}/api/data`, {
      mode: mode,
    });
  }
}

// Getting bot working mode
async function getBotMode() {
  try {
    const response = await axios.get(
      `${siliconDBUrl}/api/data`
    );
    if (response.status == 404 || !response.data) {
      return `public`;
    }
    if (response.data) {
      return response.data.mode;
    }
  } catch (err) {
    return `public`;
  }
}

// Banning a group
async function banGroup(groupID) {
  try {
    const response = await axios.get(
      `${siliconDBUrl}/api/data/${groupID}`
    );
    if (response.status == 404 || !response.data) {
      await axios.post(`${siliconDBUrl}/api/data`, {
        id: groupID,
        ban: true,
      });
    }
    if (response.data) {
      const oldData = response.data;
      const newData = { ...oldData, ban: true };
      await axios.put(
        `${siliconDBUrl}/api/data/${groupID}`,
        newData
      );
    }
  } catch (err) {
    await axios.post(`${siliconDBUrl}/api/data`, {
      id: groupID,
      ban: true,
    });
  }
}

// Checking the ban status of a group
async function checkBanGroup(groupID) {
  try {
    const response = await axios.get(
      `${siliconDBUrl}/api/data/${groupID}`
    );
    if (response.status == 404 || !response.data) {
      return false;
    }
    if (response.data) {
      return response.data.ban;
    }
  } catch (err) {
    return false;
  }
}

// Unbanning a group
async function unbanGroup(groupID) {
  try {
    const response = await axios.get(
      `${siliconDBUrl}/api/data/${groupID}`
    );
    if (response.status == 404 || !response.data) {
      await axios.post(`${siliconDBUrl}/api/data`, {
        id: groupID,
        ban: false,
      });
    }
    if (response.data) {
      const oldData = response.data;
      const newData = { ...oldData, ban: false };
      await axios.put(
        `${siliconDBUrl}/api/data/${groupID}`,
        newData
      );
    }
  } catch (err) {
    await axios.post(`${siliconDBUrl}/api/data`, {
      id: groupID,
      ban: false,
    });
  }
}




// Exporting the functions
module.exports = {
  banUser, //----------------------- BAN
  checkBan, // --------------------- CHECK BAN STATUS
  unbanUser, // -------------------- UNBAN
  addMod, // ----------------------- ADD MOD
  checkMod, // --------------------- CHECK MOD STATUS
  delMod, // ----------------------- DEL MOD
  setChar, // ---------------------- SET CHAR ID
  getChar, // ---------------------- GET CHAR ID
  activateChatBot, // -------------- ACTIVATE PM CHATBOT
  checkPmChatbot, // --------------- CHECK PM CHATBOT STATUS
  deactivateChatBot, // ------------ DEACTIVATE PM CHATBOT
  pushPlugin, // ------------------- PUSH NEW INSTALLED PLUGIN IN DATABASE
  getPlugin, // -------------------- GET ALL PLUGIN NAMES AS AN ARRAY
  delPlugin, // -------------------- DELETE A PLUGIN FROM THE DATABASE
  setWelcome, // ------------------- SET WELCOME MESSAGE
  checkWelcome, // ----------------- CHECK WELCOME MESSAGE STATUS
  delWelcome, // ------------------- DELETE WELCOME MESSAGE
  setAntilink, // ------------------ SET ANTILINK
  checkAntilink, // ---------------- CHECK ANTILINK STATUS
  delAntilink, // ------------------ DELETE ANTILINK
  setGroupChatbot, // -------------- SET GROUP CHATBOT
  checkGroupChatbot, // ------------ CHECK GROUP CHATBOT STATUS
  delGroupChatbot, // -------------- DELETE GROUP CHATBOT
  setBotMode, // ------------------- SET BOT MODE
  getBotMode, // ------------------- GET BOT MODE
  banGroup, // --------------------- BAN GROUP
  checkBanGroup, //----------------- CHECK BAN STATUS OF A GROUP
  unbanGroup, // ------------------- UNBAN GROUP
};

