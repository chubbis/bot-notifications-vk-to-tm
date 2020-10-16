const Telegraf = require('telegraf');
const { groupToken, vkApiVersion, groupId, tmToken, isNeedAuthorize, texts } = require('../config');
const { subscribeUpdates } = require('./services/vk/long-poll');
const { checkAuth, subscribe } = require('./services/authorization');
const { replyMessage } = require('./services/tm/send-message');
const { checkUpdateMessage } = require('./services/tm/check-update-message');
const { removeSession, getSession } = require('./utils/sessions');

const bot = new Telegraf(tmToken);

bot.start(ctx => {
    const chatId = ctx.update.message.chat.id;

    if (getSession(chatId, 'name')) removeSession(chatId);

    if (isNeedAuthorize) {
        if (checkAuth(ctx)) {
            replyMessage(ctx, texts.start.auth);
        } else {
            replyMessage(ctx, texts.start.notAuth);
        }
    } else {
        subscribe(ctx);
    }
});

bot.help(ctx => {
    const chatId = ctx.update.message.chat.id;

    if (getSession(chatId, 'name')) removeSession(chatId);

    if (checkAuth(ctx)) {
        replyMessage(ctx, texts.help.auth);
    } else {
        replyMessage(ctx, texts.help.notAuth);
    }
});

bot.on('text', ctx => {
    const { message } = ctx.update;
    if (checkAuth(ctx) || message.text === '/register' || getSession(message.chat.id, 'name')) {
        checkUpdateMessage(ctx, isNeedAuthorize, texts);
    } else {
        replyMessage(ctx, texts.help.notAuth);
    }
});

subscribeUpdates(groupId, vkApiVersion, groupToken);

bot.launch().catch(e => console.log(new Date(), e));

