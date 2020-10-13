const { prepareMessage } = require('../services/tm/send-message');

const wallPost = (newPost) => {
    let { text, attachments } = newPost;
    const media = [];

    if (attachments) {
        attachments.map(el => {
            if (el.type === 'photo' || el.type === 'video') media.push(makeMedia(el));
            if (el.type === 'poll') text = makePollResults(el, text);
        });
    }

    prepareMessage(text, media);
};

const prepareVerifyCode = () => {
    let code = '';
    for (let i = 0; i <= 6; i++) {
        const max = 9, min = 0;
        code += Math.floor(Math.random() * (max - min)) + min;
    }

    return code;
};

const makePollResults = (item, text) => {
    const { poll } = item;

    text += `\nВсего голосов: ${poll.votes}\n${poll.question}`;

    poll.answers.map(answer => {
        text += `\n${answer.text} - ${answer.votes} (${answer.rate}%)`;
    });

    return text;
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