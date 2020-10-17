const { checkVote } = require('../vk/poll');

const checkCallbackQuery = (ctx) => {
    const { message, data, id } = ctx.update.callback_query;

    const [ queryType, pollId, answerId, userAnswerId ] = data.split('_');

    if (queryType === 'poll') {
        checkVote(ctx, pollId, answerId, +userAnswerId, message, id);
    }

};

module.exports = {
    checkCallbackQuery
}