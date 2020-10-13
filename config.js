const fs = require('fs');
const projectPath = require('./projectPath');
const Config = fs.readFileSync(`${projectPath}/config.json`, "utf-8");
const config = JSON.parse(Config);

module.exports = {
    ...config,
    vkApiVersion: '5.52',
    pathToUsersJsonFile: `${projectPath}/src/db/subscribed-users.json`,
    pathToSessionsFile: `${projectPath}/src/db/sessions.json`,
    texts: {
        start: {
            auth: 'Когда появится новый пост, тебе придёт уведомление.\n' +
                'Доступные команды /help',
            notAuth: `Привет!\n
            Для того, что бы получать новости из группы https://vk.com/club${config.groupId}, необходимо быть её участников в vk, и зарегестрироваться.\n
            Для регистрации отправь команду /register`,
            noNeedAuth: `Ты подписан новости группы https://vk.com/club${config.groupId}`,
        },
        help: {
            auth: 'Доступные команды:\n' +
                '/lastPost - посмотреть последнюю запись\n' +
                '/pinnedPost - посмотреть закрепленную запись\n' +
                '/leaveMeAlone - отказаться от оповещений\n',
            notAuth: 'Для регистрации отправь команду /register',
        },
        registerInfo: {
            auth: 'Ты уже зарегестрирован.\nЧтобы узнать доступные команды набери /help',
            notAuth: 'Для регистрации необходимо перейти по ссылке:\n' +
                'https://oauth.vk.com/authorize?client_id=7619178&display=page&redirect_uri=https://oauth.vk.com/blank.html&response_type=token&v=5.65&scope=offline,groups\n' +
                'Дать разрешение на доступ к группам и отправить боту открывшуюся ссылку вида:\n' +
                'https://oauth.vk.com/blank.html#access_token=1234efgt&expires_in=0&user_id=1234',
            successSubscribe: 'Регистрация прошла успешно.\nТеперь ты будешь получать обновления.',
            successUnsubscribe: 'Регистрация отменена.\nБольше сообщения приходить не будут',
            instructions: {
                firstStep: 'Шаг 1. Необходимо прислать ссылку на свою страницу vk',
                secondStep: `Шаг 2. Открыть диалог с группой и написать любую фразу. https://vk.com/im?media=&sel=-${config.groupId}`,
                thirdStep: 'Бот в vk прислал код для регистрации. Его необходимо ввести сюда в течение 2 минут',
            }
        },
        sessionCloseMessage: 'Сессия закрыта. Сообщение необходимо отправить в течение 2 минут. Чтобы повторить, наберите ',
        notAuthMessage: 'Команда доступна только зарегестрированным пользователям\n' +
            'Чтобы посмотреть список доступных команд, наберите /help',
    },
};