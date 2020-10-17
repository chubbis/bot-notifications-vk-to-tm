const { getUsers, getUser } = require('../../utils/users');
const Telegram = require('telegraf/telegram');
const { tmToken } = require('../../../config');
const tm = new Telegram(tmToken);

const sendTextMessage = (user, text) => {
    tm.sendMessage(user.chatId, text).catch(e => console.log(new Date(), e));
};

const sendMediaMessage = (user, text, media) => {
    if (media.type === 'video') text = `Посмотреть видео: ${media.videoUrl}\n${text}`;

    tm.sendPhoto(user.chatId, media.media, {caption: text}).catch(e => console.log(new Date(), e));
};

const sendMediaGroupMessage = (user, text, media) => {
    tm.sendMediaGroup(user.chatId, media).then(() => sendTextMessage(user, text)).catch(e => console.log(new Date(), e));
};

const prepareMessage = (chatId, text, media = []) => {
    const users = chatId ? [getUser(chatId)] : getUsers();

    const mediaAttachments = [];

    media.map(el => {
        if (el.type === 'photo' || el.type === 'video') mediaAttachments.push(el);
    });

    users.map(user => {
        if (mediaAttachments.length > 1) sendMediaGroupMessage(user, text, mediaAttachments);
        if (mediaAttachments.length === 1) sendMediaMessage(user, text, media[0]);
        if (!mediaAttachments.length) sendTextMessage(user, text);
    })
};

const replyMessage = (ctx, text) => {
    ctx.reply(text).catch(e => console.log(new Date(), e));
};

module.exports = {
    prepareMessage,
    replyMessage,
};