const { getUsers, setUsers } = require('../../../utils/users');
const { getSession } = require('../../../utils/sessions');
const { checkVkToken } = require('../../vk/requests');

const setVkToken = (chatId, sessionName, messageText, ctx) => {
    const sessionStatus = getSession(chatId, 'status');

    if (sessionStatus === 'firstStep') {
        const regexp = new RegExp('access_token=([a-f0-9]+).+user_id=(\\d+)');
        let regGroups = regexp.exec(messageText);

        if (regGroups !== null) {
            const token = regGroups[1];
            const vkId = regGroups[2];

            const users = getUsers();

            const currentUserIndex = users.findIndex(user => user.chatId === chatId);
            const currentUser = users[currentUserIndex];

            if (currentUser) {
                checkVkToken(token)
                    .then(({ data }) => {
                        console.log(data.error.request_params);
                        if (data.error) {
                            ctx.reply('Токен недействителен. Попробуй создать токен ещё раз /setVkToken');
                        } else {
                            currentUser.vkToken = token;
                            currentUser.vkId = vkId;
                            ctx.reply('Все прошло успешно. Можно голосовать в vk отсюда.\n' +
                            'Для показа последнего голосования набери /getLastPoll');
                        }
                    });
            }
        } else {
            ctx.reply('Введена неправильная ссылка. Попробуй ввести ещё раз');
        }
    }
};

module.exports = {
    setVkToken
};