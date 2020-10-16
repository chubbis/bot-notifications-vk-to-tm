const Telegram = require('telegraf/telegram');
const { tmToken } = require('../../../../config');
const { getLastPostWithPoll } = require('../../vk/requests')

const tm = new Telegram(tmToken);

const lastPoll = (ctx) => {
    getLastPostWithPoll().then(post => {
        console.log(post);
        ctx.reply('123');
    });
};

const pollingApp = (chatId, messageText, ctx) => {
    console.log(chatId, messageText);
};

module.exports = {
    pollingApp,
};