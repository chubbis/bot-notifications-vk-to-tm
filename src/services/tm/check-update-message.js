const { getLastPost, getPinnedPost } = require('../vk/requests');
const { replyMessage } = require('../tm/send-message');
const { unsubscribe, subscribe } = require('../authorization');
const { wallPost } = require('../../utils/tm-utils');
const { getSession, removeSession, setSession } = require('../../utils/sessions');
const { checkSessionName } = require('./sessions');

const checkUpdateMessage = (ctx, isNeedAuthorize, texts) => {
    const { message } = ctx.update;
    const chatId = message.chat.id;
    const sessionName = getSession(chatId, 'name');

    if (message.text === '/register') {
        if (sessionName) removeSession(chatId);

        if (isNeedAuthorize) {
            setSession(chatId, 'name','register');
            setSession(chatId, 'status', 'firstStep');
            replyMessage(ctx, texts.registerInfo.instructions.firstStep);
        } else {
            subscribe(ctx);
        }
    }

    if (message.text === '/lastPost') {
        if (sessionName) removeSession(chatId);

        getLastPost().then(lastPost => {
            if (lastPost) {
                wallPost(lastPost);
            } else {
                ctx.reply('На стене нет записей, либо они недоступны');
            }
        });
    }
    if (message.text === '/lastPostPollResults') {
        if (sessionName) removeSession(chatId);
    }

    if (message.text === '/pinnedPost') {
        if (sessionName) removeSession(chatId);

        getPinnedPost().then(pinnedPost => {
            if (pinnedPost) {
                wallPost(pinnedPost);
            } else {
                ctx.reply('В сообществе нет закрепленной записей');
            }
        });
    }
    if (message.text === '/leaveMeAlone') {
        if (sessionName) removeSession(chatId);

        unsubscribe(ctx);
    }

    if (sessionName && message.text !== '/register') {
        checkSessionName(chatId, sessionName, message, ctx);
    }
};

module.exports = {
    checkUpdateMessage,
};