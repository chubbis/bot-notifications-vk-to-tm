const fs = require("fs");
const { pathToSessionsFile } = require('../../config');
const Sessions = fs.readFileSync(pathToSessionsFile, 'utf-8');
const sessions = JSON.parse(Sessions);


const getSession = (chatId, sessionKey) => {
    if (sessions[chatId]) {
        return sessions[chatId][sessionKey];
    }

    return false;
};

const setSession = (chatId, sessionKey, sessionValue ) => {
    if (sessionKey === 'remove') {
        delete sessions[chatId];
    } else {
        if (!sessions[chatId]) sessions[chatId] = {};
        sessions[chatId][sessionKey] = sessionValue;
    }

    return fs.writeFile(pathToSessionsFile, JSON.stringify(sessions), err => {
        if (err) {
            console.log(err);
        } else {
            return true;
        }
    })
};

const removeSession = (chatId) => {
    setSession(chatId, 'remove');
};

const generateVerifyCode = () => {
    let code = '';
    const min = 0, max = 9;

    for (let i = 0; i < 6; i++) {
        const num = Math.floor(min - 0.5 + Math.random() * (max - min + 1));
        code += num;
    }

    return code;
};

module.exports = {
    getSession,
    setSession,
    removeSession,
    generateVerifyCode,
};