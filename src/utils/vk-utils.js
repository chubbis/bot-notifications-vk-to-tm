const findLastPost = (posts) => {
    return posts.items.find(post => !post.is_pinned);
};

const findPinnedPost = (posts) => {
    return posts.items.find(post => post.is_pinned);
};

module.exports = {
    findLastPost,
    findPinnedPost,
};