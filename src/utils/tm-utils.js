const { prepareMessage } = require('../services/tm/send-message');

const wallPost = (chatId, newPost, ctx) => {
    let { text, attachments } = newPost;
    const media = [];
    let poll = null;

    if (attachments) {
        attachments.map(el => {
            if (el.type === 'photo' || el.type === 'video') media.push(makeMedia(el));
            if (el.type === 'poll') poll = el.poll;
        });
    }

    prepareMessage(chatId, text, media, poll, ctx);
};

const prepareVerifyCode = () => {
    let code = '';
    for (let i = 0; i <= 6; i++) {
        const max = 9, min = 0;
        code += Math.floor(Math.random() * (max - min)) + min;
    }

    return code;
};

const makeMedia = (media) => {
    let url, videoUrl;

    url = media[media.type].photo_604;
    if (media.type === 'video') {
        videoUrl = `https://vk.com/video${media[media.type].owner_id}_${media[media.type].id}`;
        url = media[media.type].photo_320;
    }
    if (media.type === 'photo') url = media[media.type].photo_604;

    return {
        media: url,
        type: media.type,
        videoUrl,
    }
};



module.exports = {
    wallPost,
    prepareVerifyCode,
};