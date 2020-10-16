const Telegram = require('telegraf/telegram');
const { tmToken } = require('../../../../config');
const { getLastPostWithPoll, getPoll } = require('../../vk/requests');
const { getUser } = require('../../../utils/users');

const tm = new Telegram(tmToken);

const userPollResults = (user, pollId) => {
    const { vkToken, chatId } = user;
    getPoll(vkToken, pollId).then(({ data }) => {
        const poll = data.response;

    });
};

const lastPollId = () => {
    return getLastPostWithPoll()
        .then(data => data.attachments.find(el => el.type === 'poll'))
        .then(data => data.poll.id);
};

const pollingApp = (chatId, ctx) => {
    lastPollId().then(pollId => {
        const user = getUser(chatId);
        userPollResults(user, pollId);
    });
};

module.exports = {
    pollingApp,
};