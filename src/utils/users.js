const fs = require("fs");
const { pathToUsersJsonFile, texts, tmToken } = require('../../config');
const Users = fs.readFileSync(pathToUsersJsonFile, 'utf-8');
const users = JSON.parse(Users);
const Telegram = require('telegraf/telegram');
const tm = new Telegram(tmToken);

const getUsers = () => {
    return users;
};

const setUsers = (ctx, users, remove = '', chatId) => {
    fs.writeFile(pathToUsersJsonFile, JSON.stringify(users), err => {
        if (err) {
            console.log(err);
        } else {
            if (remove === 'remove') {
                ctx.reply(texts.registerInfo.successUnsubscribe);
            } else if (remove === 'leavedGroup') {
                tm.sendMessage(chatId, 'Вы больше не можете получать обновления, т.к. покинули группу');
            } else {
                ctx.reply(texts.registerInfo.successSubscribe);
            }
        }
    });
};

module.exports = {
    getUsers,
    setUsers,
};