const { deleteVote, addVote } = require('./requests');
const { getUser } = require('../../utils/users');

const successNotification = (text) => {
    // tm.answerCallbackQuery()
};

const makeVote = (user, pollId, answerId, userAnswerId, message, callbackQueryId) => {
    if (answerId !== userAnswerId) {
        addVote(user.vkToken, pollId, answerId)
            .then(({ data }) => {
                if (data.response) {
                    // поменять сообщение.
                }
            })
    } else {
        successNotification()
    }
};

const checkVote = (pollId, answerId, userAnswerId, message, callbackQueryId) => {
    const user = getUser(message.chat.id);

    if (userAnswerId) {
        deleteVote(user.vkToken, pollId, userAnswerId)
            .then(({ data }) => {
                if (data.response) {
                    makeVote(user.vkToken, pollId, answerId, userAnswerId, message, callbackQueryId);
                }
            });
    } else {
        makeVote(user.vkToken, pollId, answerId, userAnswerId, message, callbackQueryId);
    }
};
module.exports = {
    checkVote
}