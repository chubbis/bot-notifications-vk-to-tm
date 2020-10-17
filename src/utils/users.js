const fs = require("fs");
const { pathToUsersJsonFile, texts, tmToken } = require('../../config');
const Users = fs.readFileSync(pathToUsersJsonFile, 'utf-8');
const users = JSON.parse(Users);
const Telegram = require('telegraf/telegram');

const tm = new Telegram(tmToken);

const getUsers = () => {
    return users;
};

const hasUserVkToken = (chatId) => {
    return getUsers().find(el => el.chatId === chatId && el.vkToken);
};

const getUser = (chatId) => {
    return users.find(user => user.chatId === chatId);
};

const setUsers = (ctx, users, setReason = '', chatId) => {
    fs.writeFile(pathToUsersJsonFile, JSON.stringify(users), err => {
        if (err) {
            console.log(new Date(), err);
        } else {
            if (setReason === 'remove') {
                ctx.reply(texts.registerInfo.successUnsubscribe);
            } else if (setReason === 'leavedGroup') {
                tm.sendMessage(chatId, 'Вы больше не можете получать обновления, т.к. покинули группу');
            } else if (setReason === 'setVkToken'){
                ctx.reply('Все прошло успешно. Можно голосовать в vk отсюда.\n' +
                    'Для показа последнего голосования набери /getLastPoll')
            } else {
                ctx.reply(texts.registerInfo.successSubscribe);
            }
        }
    });
};

module.exports = {
    getUsers,
    getUser,
    setUsers,
    hasUserVkToken,
};