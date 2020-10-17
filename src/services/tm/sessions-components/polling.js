const { getLastPostWithPoll, getPoll } = require('../../vk/requests');
const { getUser } = require('../../../utils/users');

const pollCbNotification = (text, ctx) => {
    ctx.answerCbQuery(text).catch(err => console.log(new Date(), err));
};

const userPollResults = (user, pollId, ctx, messageId, replyType, cbNotificationText) => {
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

            const callback_data = `poll_${poll.id}_${answer.id}_${userAnswerId}`;

            reply_markup.inline_keyboard.push([{ text, callback_data }]);
        });

        if (replyType === 'change') {
            ctx.editMessageText(poll.question, { reply_markup }).then(() => {
                pollCbNotification(cbNotificationText, ctx);
            })
                .catch(err => console.log(new Date(), err));
        } else {
            return ctx.reply(poll.question, { reply_markup });
        }
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
    pollCbNotification,
    userPollResults,
};