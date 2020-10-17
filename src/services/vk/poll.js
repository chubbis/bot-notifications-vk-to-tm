const { deleteVote, addVote } = require('./requests');
const { getUser } = require('../../utils/users');
const { userPollResults } = require('../tm/sessions-components/polling');

const dataIsNotFresh = (user, pollId, ctx, message) => {
    const cbNotificationText = 'Данные были изменены на странице в вк.\nПроголосуй ещё раз';
    userPollResults(user, pollId, ctx, message.message_id, 'change', cbNotificationText);
};

const makeVote = (ctx, user, pollId, answerId, userAnswerId, message) => {
    if (+answerId !== userAnswerId) {
        addVote(user.vkToken, pollId, answerId)
            .then(({ data }) => {
                if (data.response) {
                    const cbNotificationText = userAnswerId ? 'Голос изменен' : 'Голос добавлен';
                    userPollResults(user, pollId, ctx, message.message_id, 'change', cbNotificationText)
                } else {
                    dataIsNotFresh(user, pollId, ctx, message);
                }
            }).catch((err => console.log(new Date(), err)));
    } else {
        const cbNotificationText = 'Голос удален';
        userPollResults(user, pollId, ctx, message.message_id, 'change', cbNotificationText);
    }
};

const checkVote = (ctx, pollId, answerId, userAnswerId, message, callbackQueryId) => {
    const user = getUser(message.chat.id);

    if (userAnswerId) {
        deleteVote(user.vkToken, pollId, userAnswerId)
            .then(({ data }) => {
                if (data.response) {
                    makeVote(ctx, user, pollId, answerId, userAnswerId, message);
                } else {
                    dataIsNotFresh(user, pollId, ctx, message);
                }
            });
    } else {
        makeVote(ctx, user, pollId, answerId, userAnswerId, message, callbackQueryId);
    }
};
module.exports = {
    checkVote
}