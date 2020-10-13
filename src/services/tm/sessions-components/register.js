const { vkIdInInteger } = require('../../vk/requests');

const findVkId = (link) => {
    const reg =  new RegExp('vk\\.com\\/(id(\\d+)|[a-zA-Z0-9_.]+)$');

    let regGroups = reg.exec(link);

    if (regGroups) {
        return regGroups[2] ? regGroups[2] : regGroups[1];
    } else {
        return regGroups;
    }
};

const firstStepHandler = (message, chatId, tm) => {
    const notPreparedVkId = findVkId(message);

    if (notPreparedVkId) {
        return vkIdInInteger(notPreparedVkId).then(({ data }) => data.response[0].id);
    } else {
        tm.sendMessage(chatId, 'Ссылка введена неверно. Попробуй ещё раз').catch(err => console.log(err));
    }
};

module.exports = {
    firstStepHandler,
};