const findLastPost = (posts) => {
    return posts.items.find(post => !post.is_pinned);
};

const findPinnedPost = (posts) => {
    return posts.items.find(post => post.is_pinned);
};

const findPollPost = (posts) => {
    return posts.items.find(post => {
        if (post.attachments) {
            return post.attachments.find(el => el.type === 'poll');
        }
    })
};

module.exports = {
    findLastPost,
    findPinnedPost,
    findPollPost,
};