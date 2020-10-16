const { getLongPollServer, getUpdates } = require('./requests');
const { wallPost } = require('../../utils/tm-utils');
const { getUsers, setUsers } = require('../../utils/users');

const subscribeUpdates = (groupId, vkApiVersion, groupToken) => {
    getLongPollServer(groupId, vkApiVersion, groupToken)
        .then(({ data }) => {
            let { server, key, ts } = data.response;
            setInterval(() => {
                getUpdates(server, key, ts)
                    .then(({ data }) => {
                        const { updates } = data;
                        ts = data.ts;

                        if (updates && updates.length) {
                            updates.map(el => {
                                if (el.type === 'wall_post_new') wallPost(el.object);
                                if (el.type === 'group_leave') {
                                    const users = getUsers();
                                    const leavedUserIndex = users.findIndex(user => user.vkId === el.object.user_id);
                                    const chatId = users[leavedUserIndex].chatId;
                                    if (chatId) {
                                        users.slice(leavedUserIndex, 1);
                                        setUsers('', users, 'leavedGroup', chatId);
                                    }
                                }
                            });
                        }
                    })
                    .catch(e => console.log(new Date(), e));
            }, 26000);
        });
};

module.exports = {
    subscribeUpdates,
};