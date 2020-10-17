const { registerApp } = require('../tm/sessions-components/register');
const { pollingApp } = require('../tm/sessions-components/polling');
const { setVkToken } = require('../tm/sessions-components/set-vk-token');

const checkSessionName = (chatId, sessionName, message, ctx) => {
    const messageText = message.text;

    if (sessionName === 'register') {
        registerApp(chatId, sessionName, messageText, ctx);
    }

    if (sessionName === 'setVkToken') {
        setVkToken(chatId, sessionName, messageText, ctx);
    }
};

module.exports = {
    checkSessionName,
};