const Telegram = require('telegraf/telegram');
const { tmToken, texts } = require('../../../../config');
const { vkIdInInteger } = require('../../vk/requests');
const { getUsers, setUsers } = require('../../../utils/users');
const { getSession, setSession, removeSession, generateVerifyCode } = require('../../../utils/sessions');
const { isMemberOfGroup, isMessagesFromGroupAllowed, sendVerifyCode } = require('../../vk/requests');

const tm = new Telegram(tmToken);

const closeSession = (chatId, sessionName, sessionStatus) => {
    setTimeout(() => {
        if (getSession(chatId, 'status') === sessionStatus && getSession(chatId, 'name') === sessionName) {
            removeSession(chatId);
            const closeSessionText = `${texts.sessionCloseMessage} /${sessionName}`;
            tm.sendMessage(chatId, closeSessionText).catch(err => console.log(new Date(), err));
        }
    }, 120000);
};

const findVkId = (link) => {
    const reg =  new RegExp('vk\\.com\\/(id(\\d+)|[a-zA-Z0-9_.]+)$');

    let regGroups = reg.exec(link);

    if (regGroups) {
        return regGroups[2] ? regGroups[2] : regGroups[1];
    } else {
        return regGroups;
    }
};

const firstStepHandler = (message, chatId,) => {
    const notPreparedVkId = findVkId(message);

    if (notPreparedVkId) {
        return vkIdInInteger(notPreparedVkId).then(({ data }) => data.response[0].id);
    } else {
        tm.sendMessage(chatId, 'Ссылка введена неверно. Попробуй ещё раз').catch(err => console.log(new Date(), err));
    }
};

const registerApp = (chatId, sessionName, messageText, ctx) => {
    const registerTexts = texts.registerInfo.instructions;
    const sessionStatus = getSession(chatId, 'status');

    if (sessionStatus === 'firstStep') {
        firstStepHandler(messageText, chatId, tm)
            .then(vkId => {
                setSession(chatId, 'registeringVkIds', vkId);

                if (getSession(chatId, 'registeringVkIds')) {
                    return isMemberOfGroup(vkId);
                }
            })
            .then(({ data }) => {
                const isGroupMember = data.response;

                if (isGroupMember) {
                    setSession(chatId, 'status', 'secondStep');

                    if (getSession(chatId, 'status') === 'secondStep') {
                        tm.sendMessage(chatId, registerTexts.secondStep).catch(err => console.log(new Date(), err));
                        closeSession(chatId, sessionName, sessionStatus);

                        const vkId = getSession(chatId, 'registeringVkIds');
                        let isMessagesFromGroupAllow;


                        let checkAllow = setInterval(() => {

                            if (!isMessagesFromGroupAllow) {
                                isMessagesFromGroupAllowed(vkId).then(({ data }) => {

                                    if (data.response.is_allowed) {
                                        isMessagesFromGroupAllow = true;
                                        const verifyCode = generateVerifyCode();
                                        setSession(chatId, 'verifyCode', verifyCode);

                                        if (getSession(chatId, 'verifyCode')) {
                                            sendVerifyCode(vkId, verifyCode).then(({data}) => {
                                                setSession(chatId, 'status', 'thirdStep');
                                                tm.sendMessage(chatId, registerTexts.thirdStep).catch(err => console.log(new Date(), err));
                                                closeSession(chatId, sessionName, sessionStatus);
                                            })
                                        }
                                    }
                                })
                            }
                        }, 5000);

                        setTimeout(() => {
                            clearInterval(checkAllow);
                            if (getSession(chatId, 'status') === 'secondStep') tm.sendMessage(chatId, 'Разрешение на получение сообщений не получено');
                        }, 120000);
                    }
                } else {
                    tm.sendMessage(chatId, 'Ты не являешься участником сообщества').catch(err => console.log(new Date(), err));
                    removeSession(chatId);
                }
            })
    }

    if (sessionStatus === 'thirdStep') {
        const verifyCode = getSession(chatId, 'verifyCode');

        if (verifyCode === messageText) {
            const users = getUsers();
            const vkId = getSession(chatId, 'registeringVkIds');
            const tmUserId = ctx.update.message.from.id;

            const newUser = {
                chatId,
                vkId,
                tmUserId
            };

            users.push(newUser);
            setUsers(ctx, users);

            removeSession(chatId);
        } else {
            tm.sendMessage(chatId, 'Код не верный. Введи верный или повтори процедуру регитсрации /register');
        }
    }
};

module.exports = {
    registerApp,
};