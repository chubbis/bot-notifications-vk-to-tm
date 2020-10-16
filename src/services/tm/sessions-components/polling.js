const Telegram = require('telegraf/telegram');
const { tmToken } = require('../../../../config');
const { getLastPostWithPoll, getPoll } = require('../../vk/requests');
const { getUser } = require('../../../utils/users');
const Extra = require('telegraf/extra');

const tm = new Telegram(tmToken);

const userPollResults = (user, pollId, ctx) => {
    const { vkToken } = user;
    getPoll(vkToken, pollId).then(({ data }) => {
        const poll = data.response;
        const reply_markup = {
            inline_keyboard: [],
        };

        poll.answers.map(answer => {
            const userAnswerId = poll.answer_id;
            let text = `'${answer.text}' - ${answer.votes} (${answer.rate})`;

            if (userAnswerId === answer.id) text += ' (your vote)';

            const callback_data = userAnswerId === answer.id ? `poll_${poll.id}_${answer.id}_${userAnswerId}` : `poll_${poll.id}_${answer.id}`;

            reply_markup.inline_keyboard.push([{ text, callback_data }]);
        });

        return ctx.reply(poll.question, { reply_markup });

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
        userPollResults(user, pollId, ctx);
    });
};

module.exports = {
    pollingApp,
};