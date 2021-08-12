const Config = {
    Onebot: {
        selfId: process.env.ONEBOT_ACCOUNT!,

        devGroup: process.env.ONEBOT_DEV_GROUP!,
        modGroup: process.env.ONEBOT_MOD_GROUP!,
        motGroup: process.env.ONEBOT_MOT_GROUP!,
        watchGroups: process.env
            .ONEBOT_WATCH_GROUPS!.split(',')
            .map(group => group.trim()),

        developer: { onebot: process.env.ONEBOT_MASTER_ACCOUNT!, name: 'Mind' },
        moderators: [
            { onebot: '616041132', name: 'Texas.C' },
            { onebot: '544844493', name: 'TsFreddie' },
            { onebot: '312253557', name: 'ACTom' },
            { onebot: '1085321861', name: 'Dan_cao' },
            { onebot: '745116989', name: 'Rice' },
            { onebot: '2754231645', name: 'xiaocan' },
            // { onebot: '1634300602', name: 'Mind' },
            { onebot: '1242305018', name: 'ArchLinux' },
            { onebot: '2169140389', name: 'Dust fall' },
            { onebot: '994539654', name: 'KuNao' },
            { onebot: '1535650454', name: 'wuu' },
            { onebot: '1010089230', name: 'Sol' },
            { onebot: '577047398', name: '满月' },
            { onebot: '784122675', name: 'Rance' },
        ],
    },

    Discord: {
        developer: {
            discord: process.env.DISCORD_MASTER_ACCOUNT!,
            name: 'Mind',
        },

        groupId: process.env.DISCORD_GROUP!,
        devChannel: process.env.DISCORD_DEV_CHANNEL!,
        modChannel: process.env.DISCORD_MOD_CHANNEL!,
        motChannel: process.env.DISCORD_MOT_CHANNEL!,
        watchChannels: process.env
            .DISCORD_WATCH_CHANNELS!.split(',')
            .map(channel => channel.trim()),
    },

    UnknownErrorMsg: '$出现未知错误$',
    PlayerNotFoundMsg: 'Player Not Found',
    PlayerNameErrorMsg: '玩家名称过长（超15字节）',
    // pointsData404ErrorMsg: 'Player not found',
    // pointsData404ErrorMsgBackup: 'Player Not Found',
};

export default Config;
