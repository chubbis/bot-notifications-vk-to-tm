const { deleteVote, addVote } = require('./requests');
const { getUser } = require('../../utils/users');
const { userPollResults } = require('../tm/sessions-components/polling');

const dataIsNotFresh = (user, pollId, ctx) => {
    const cbNotificationText = 'Данные были изменены на странице в вк.\nПроголосуй ещё раз';
    userPollResults(user, pollId, ctx,'change', cbNotificationText);
};

const makeVote = (ctx, user, pollId, answerId, userAnswerId) => {
    if (+answerId !== userAnswerId) {
        addVote(user.vkToken, pollId, answerId)
            .then(({ data }) => {
                if (data.response) {
                    const cbNotificationText = userAnswerId ? 'Голос изменен' : 'Голос добавлен';
                    userPollResults(user, pollId, ctx,'change', cbNotificationText)
                } else {
                    dataIsNotFresh(user, pollId, ctx);
                }
            }).catch((err => console.log(new Date(), err)));
    } else {
        const cbNotificationText = 'Голос удален';
        userPollResults(user, pollId, ctx,'change', cbNotificationText);
    }
};

const checkVote = (ctx, pollId, answerId, userAnswerId, message) => {
    const user = getUser(message.chat.id);

    if (userAnswerId) {
        deleteVote(user.vkToken, pollId, userAnswerId)
            .then(({ data }) => {
                if (data.response) {
                    makeVote(ctx, user, pollId, answerId, userAnswerId);
                } else {
                    dataIsNotFresh(user, pollId, ctx);
                }
            });
    } else {
        makeVote(ctx, user, pollId, answerId, userAnswerId);
    }
};
module.exports = {
    checkVote
}