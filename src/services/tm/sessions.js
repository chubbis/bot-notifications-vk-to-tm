const Telegram = require('telegraf/telegram');
const {setUsers} = require("../../utils/users");
const { setSession, removeSession, getSession, generateVerifyCode } = require('../../utils/sessions');
const { tmToken, texts } = require('../../../config');
const { firstStepHandler } = require('./sessions-components/register');
const { isMemberOfGroup, isMessagesFromGroupAllowed, sendVerifyCode } = require('../vk/requests');
const { getUsers } = require('../../utils/users');

const tm = new Telegram(tmToken);

const closeSession = (chatId, sessionName, sessionStatus) => {
    setTimeout(() => {
        if (getSession(chatId, 'status') === sessionStatus && getSession(chatId, 'name') === sessionName) {
            removeSession(chatId);
            const closeSessionText = `${texts.sessionCloseMessage} /${sessionName}`;
            tm.sendMessage(chatId, closeSessionText).catch(err => console.log(err));
        }
    }, 120000);
};

const checkSessionName = (chatId, sessionName, message, ctx) => {
    const messageText = message.text;
    const sessionStatus = getSession(chatId, 'status');

    const registerTexts = texts.registerInfo.instructions;

    if (sessionName === 'register') {
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
                        tm.sendMessage(chatId, registerTexts.secondStep).catch(err => console.log(err));
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
                                            tm.sendMessage(chatId, registerTexts.thirdStep).catch(err => console.log(err));
                                            closeSession(chatId, sessionName, sessionStatus);
                                            })
                                        }
                                    }
                                })
                            }
                        }, 5000);

                        setTimeout(() => clearInterval(checkAllow), 120000);
                    }
                } else {
                    tm.sendMessage(chatId, 'Ты не являешься участником сообщества').catch(err => console.log(err));
                    removeSession(chatId);
                }
            })
        }

        if (sessionStatus === 'thirdStep') {
            const verifyCode = getSession(chatId, 'verifyCode');

            if (verifyCode === messageText) {
                const users = getUsers();
                const vkId = getSession(chatId, 'registeringVkIds');
                const tmUserId = message.from.id;

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
    }
};

module.exports = {
    checkSessionName,
};