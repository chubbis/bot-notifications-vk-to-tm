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
            notAuth: 'Привет!\n' +
            `Для того, что бы получать новости из группы https://vk.com/club${config.groupId}, необходимо быть её участников в vk, и зарегистрироваться.\n` +
            'Для регистрации отправь команду /register',
            noNeedAuth: `Ты подписан новости группы https://vk.com/club${config.groupId}`,
        },
        help: {
            auth: 'Доступные команды:\n' +
                '/lastPost - посмотреть последнюю запись\n' +
                '/pinnedPost - посмотреть закрепленную запись\n' +
                '/leaveMeAlone - отказаться от оповещений\n' +
                '/getLastPoll - последний опрос',
            notAuth: 'Для регистрации отправь команду /register',
        },
        registerInfo: {
            auth: 'Ты уже зарегистрирован.\nЧтобы узнать доступные команды набери /help',
            successSubscribe: 'Регистрация прошла успешно.\nТеперь ты будешь получать обновления.',
            successUnsubscribe: 'Регистрация отменена.\nБольше сообщения приходить не будут',
            instructions: {
                firstStep: 'Шаг 1. Необходимо прислать ссылку на свою страницу vk',
                secondStep: `Шаг 2. Открыть диалог с группой и написать любую фразу. https://vk.com/im?media=&sel=-${config.groupId}`,
                thirdStep: 'Бот в vk прислал код для регистрации. Его необходимо ввести сюда в течение 2 минут',
            }
        },
        setVkToken: {
            firstStep: 'Для возможности голосования, необходимо разрешить боту делать это от твоего имени\\.\n' +
                `https://oauth\\.vk\\.com/authorize?client\\_id\\=${config.clientId}&display\\=page&redirect\\_uri\\=https://oauth\\.vk\\.com/blank\\.html&scope\\=wall,offline&response\\_type\\=token&v\\=5\\.52\n` +
                'Дать разрешение на доступ к группам и отправить боту открывшуюся ссылку вида:\n' +
                '\`https://oauth\\.vk\\.com/blank\\.html#access\\_token\\=1234efgt&expires\\_in\\=0&user\\_id\\=1234\`\n ' +
                'ВНИМАНИЕ\\! Это действие разрешит боту получать данные со стены, менять их, и прочие манипуляции, связанные со стеной\\.' +
                'Именно об этом предупреждает vk\\. Это разрешение необходимо для голосования от твоего имени\\. Для остановки предоставления токена нажми /stopSetVkToken\n' +
                'Разрешение можно отменить в любой момент на странице приложений в vk',
        },
        sessionCloseMessage: 'Сессия закрыта. Сообщение необходимо отправить в течение 2 минут. Чтобы повторить, наберите /register',
        notAuthMessage: 'Команда доступна только зарегистрированным пользователям\n' +
            'Чтобы посмотреть список доступных команд, наберите /help',
    },
};