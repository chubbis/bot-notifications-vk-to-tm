const { getUsers, setUsers } = require('../utils/users');


const checkAuth = (ctx) => {
    const { message } = ctx.update;
    return getUsers().find(user => user.tmUserId === message.from.id);
};

const subscribe = (ctx) => {
    const { message } = ctx.update;
    const users = getUsers();
    users.push({ tmUserId: message.from.id, chatId: message.chat.id });
    setUsers(ctx, users);
};

const unsubscribe = (ctx) => {
    const { message } = ctx.update;
    const users = getUsers();
    const userToRemoveIndex = users.findIndex(user => user.tmUserId === message.from.id);
    users.splice(userToRemoveIndex, 1);
    setUsers(ctx, users, 'remove');
};

module.exports = {
    checkAuth,
    subscribe,
    unsubscribe,
};