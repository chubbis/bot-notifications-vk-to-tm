const axios = require('axios');
const { vkToken, vkApiVersion, groupId, groupToken } = require('../../../config');
const { findPinnedPost, findLastPost } = require('../../utils/vk-utils');

const getAllPosts = () => {
    return axios(`https://api.vk.com/method/wall.get?owner_id=-${groupId}&v=${vkApiVersion}&access_token=${vkToken}`)
        .then(({ data }) => data);
};

const getLastPost = () => {
    return getAllPosts().then(data => findLastPost(data.response));
};

const getPinnedPost = () => {
    return getAllPosts().then(data => findPinnedPost(data.response));
};

const getLongPollServer = (groupId, vkApiVersion, groupToken) => {
    return axios(`https://api.vk.com/method/groups.getLongPollServer?group_id=${groupId}&v=${vkApiVersion}&access_token=${groupToken}`);
};

const getUpdates = (server, key, ts) => {
    return axios(`${server}?act=a_check&key=${key}&ts=${ts}&wait=25&mode=2&version=3`);
};

const sendVerifyCode = (vkId, message) => {
    return axios(`https://api.vk.com/method/messages.send?&v=${vkApiVersion}&access_token=${groupToken}&user_id=${vkId}&message=${message}`);
};

const isMessagesFromGroupAllowed = (vkId) => {
    return axios(`https://api.vk.com/method/messages.isMessagesFromGroupAllowed?&v=${vkApiVersion}&access_token=${groupToken}&user_id=${vkId}&group_id=${groupId}`);
};

const vkIdInInteger = (vkId) => {
    return axios(`https://api.vk.com/method/users.get?&v=${vkApiVersion}&access_token=${groupToken}&user_ids=${vkId}`)
};

const isMemberOfGroup = (vkId) => {
    return axios(`https://api.vk.com/method/groups.isMember?&v=${vkApiVersion}&access_token=${groupToken}&group_id=${groupId}&user_id=${vkId}`);
};

module.exports = {
    getLastPost,
    getLongPollServer,
    getUpdates,
    getPinnedPost,
    sendVerifyCode,
    isMessagesFromGroupAllowed,
    vkIdInInteger,
    isMemberOfGroup,
};