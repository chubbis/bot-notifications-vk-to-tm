const { getLastPost, getPinnedPost, checkVkToken } = require('../vk/requests');
const { unsubscribe, subscribe } = require('../authorization');
const { wallPost } = require('../../utils/tm-utils');
const { getSession, removeSession, setSession } = require('../../utils/sessions');
const { hasUserVkToken } = require('../../utils/users');
const { checkSessionName } = require('./sessions');
const { pollingApp } = require('./sessions-components/polling');

const checkUpdateMessage = (ctx, isNeedAuthorize, texts) => {
    const { message } = ctx.update;
    const chatId = message.chat.id;
    const sessionName = getSession(chatId, 'name');
    const possibleSessions = ['/register', '/setVkToken'];

    if (message.text === '/register') {
        if (sessionName) removeSession(chatId);

        if (isNeedAuthorize) {
            setSession(chatId, 'name','register');
            setSession(chatId, 'status', 'firstStep');
            ctx.reply(texts.registerInfo.instructions.firstStep);
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

        ctx.reply('результаты голосования последнего поста с голосованием');
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

    if (message.text === '/setVkToken') {
        const user = hasUserVkToken(chatId);

        const vkToken = user ? user.vkToken : '';

        checkVkToken(vkToken).then(({ data }) => {
            if (data.error) {
                setSession(chatId, 'name','setVkToken');
                setSession(chatId, 'status', 'firstStep');
                ctx.reply(texts.setVkToken.firstStep, {
                    parse_mode: 'MarkdownV2',
                });
            } else {
                ctx.reply('Ты уже добавил токен');
            }
        });
    }

    if (message.text === '/getLastPoll') {
        if (sessionName) removeSession(chatId);

        const user = hasUserVkToken(chatId);

        if (user) {
            checkVkToken(user.vkToken).then(({ data }) => {
                if (data.error) {
                    ctx.reply('Ошибка доступа. Необходимо заново предоставить токен. /setVkToken');
                }

                if (data.response.success) {
                    pollingApp(chatId, ctx);
                }
            });
        } else {
            ctx.reply('Для голосования необходимо добавить VK token\nДля добавления набери /setVkToken');
        }
    }

    if (sessionName && !possibleSessions.find(el => el === message.text)) {
        checkSessionName(chatId, sessionName, message, ctx);
    }
};

module.exports = {
    checkUpdateMessage,
};