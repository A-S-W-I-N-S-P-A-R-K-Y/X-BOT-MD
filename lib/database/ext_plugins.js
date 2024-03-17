const config = require('../../config');
const {
    DataTypes
} = require('sequelize');
const GevPlugin = config.DATABASE.define('Plugin', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    url: {
        type: DataTypes.TEXT,
        allowNull: false
    }
});

async function PluginInstall(adres, file) {
  await GevPlugin.sync() 
    const existingPlugin = await GevPlugin.findOne({
        where: {
            url: adres
        }
    });

    if (existingPlugin) {
        return false;
    } else {
        return await GevPlugin.create({
            url: adres, name: file
        });
    }
}

module.exports = {
    GevPlugin,
    PluginInstall
};
