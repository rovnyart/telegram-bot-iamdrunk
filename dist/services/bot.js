"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramService = void 0;
const telegraf_1 = require("telegraf");
const errors_1 = require("../lib/errors");
class TelegramService {
    constructor(token, dbService) {
        if (!token) {
            throw new errors_1.NoTelegramTokenError();
        }
        this.bot = new telegraf_1.Telegraf(token);
        this.db = dbService;
        this.bot.use(this.checkMessage.bind(this));
        this.bot.command('start', this.handleStartCommand.bind(this));
        this.bot.command('stop', this.handleStopCommand.bind(this));
        this.bot.command('help', this.handleHelpCommand.bind(this));
        this.bot.command('drunk', this.handleDrunkCommand.bind(this));
        this.bot.command('vote', this.handleVoteCommand.bind(this));
    }
    async run() {
        this.bot.launch();
    }
    async handleStartCommand(ctx) {
        if (!ctx.chat) {
            return;
        }
        try {
            await this.checkIfBotIsAdmin(ctx);
            await this.checkIfUserIsAdmin(ctx);
            const existing = await this.db.getChat(ctx.chat.id);
            if (existing) {
                throw new errors_1.TelegramError('😐 Your chat is already registered');
            }
            await this.db.createChat(ctx.chat.id);
            await ctx.telegram.sendMessage(ctx.chat.id, '🎉 Yeah! Your chat is registered!');
        }
        catch (error) {
            await ctx.telegram.sendMessage(ctx.chat.id, error.message);
        }
    }
    async handleStopCommand(ctx) {
        if (!ctx.chat) {
            return;
        }
        try {
            await this.checkIfBotIsAdmin(ctx);
            await this.checkIfUserIsAdmin(ctx);
            const existing = await this.db.getChat(ctx.chat.id);
            if (!existing) {
                throw new errors_1.TelegramError('🤷‍♀️ Your chat is not registered, register it with "/start" command');
            }
            await this.db.deleteChat(ctx.chat.id);
            await ctx.telegram.sendMessage(ctx.chat.id, '🧛‍♀️ Okay, I forget about this chat');
        }
        catch (error) {
            await ctx.telegram.sendMessage(ctx.chat.id, error.message);
        }
    }
    async handleHelpCommand(ctx) {
        if (!ctx.chat) {
            return;
        }
        try {
            await ctx.replyWithHTML([
                `👋👋👋`,
                `Hi, this is IamDrunkBot!`,
                'You can use me every time you feel you gonna write some <i>really wrong</i> things to your chats.',
                '',
                'To register me, enter "/start" command (you must have admin rights in current chat).',
                '',
                'Send me "/stop" command to unregister your chat from my database (need admin rights as well).',
                '',
                'After registration, everybody in your chat can feel free to use "/drunk" command. This command sets it\'s originator to <b>Drunk Mode</b> - all their messages will be (almost) immediately deleted.',
                '',
                '"/drunk" command has two optional parameters, which can be passed space-separated. The first one is quorum - the number of votes needed to unmute Drunk Mode issuer. The second one is number of hours, after which issuer will be unmuted automatically.',
                '',
                '"/vote @username" command adds 1 vote to currently muted user. It can be used unlimited times by any users, votes count every time.',
                '',
                '',
                'This bot is an open source project located on <a href="https://github.com/rovnyart/telegram-bot-iamdrunk">GitHub</a>. The default instance (@ShutMeUpBot) has no access to any chat messages (Privacy Mode=on).',
            ].join('\n'));
        }
        catch (error) {
            await ctx.telegram.sendMessage(ctx.chat.id, error.message);
        }
    }
    async handleDrunkCommand(ctx) {
        if (!ctx.chat || !ctx.message?.from?.username) {
            return;
        }
        try {
            await this.checkIfBotIsAdmin(ctx);
            const chat = await this.db.getChat(ctx.chat.id);
            if (!chat) {
                throw new errors_1.ChatNotRegisteredError();
            }
            const isMuted = await this.db.checkIfUserIsMuted(chat, ctx.message?.from.id);
            if (isMuted) {
                throw new errors_1.UserIsAlreadyMutedError(ctx.message.from.username);
            }
            const [, rawQuorum, rawHours] = ctx.update.message.text.split(' ');
            const quorum = Number(rawQuorum) || 2;
            const hours = Number(rawHours) || 6;
            await this.db.muteUser(chat, ctx.message.from, quorum, hours);
            await ctx.replyWithHTML([
                '🍻🍻🍻 ',
                `User <b>${ctx.message.from.username}</b> put them into <b>Drunk Mode</b>!`,
                'All their messages will be deleted',
                `${quorum} votes needed to allow them to speak (use "/vote username") command`,
                `Or they will be unlocked automatically in ${hours} hours`,
            ].join('\n'));
        }
        catch (error) {
            await ctx.telegram.sendMessage(ctx.chat.id, error.message);
        }
    }
    async handleVoteCommand(ctx) {
        if (!ctx.chat) {
            return;
        }
        try {
            await this.checkIfBotIsAdmin(ctx);
            const chat = await this.db.getChat(ctx.chat.id);
            if (!chat) {
                throw new errors_1.ChatNotRegisteredError();
            }
            const [, rawUsername = ''] = ctx.update.message.text.split(' ');
            const username = rawUsername.replace('@', '');
            if (!username) {
                throw new errors_1.UsernameNotPassedError();
            }
            const userId = await this.db.getUserIdByUsername(chat, username);
            if (!userId) {
                throw new errors_1.MutedUserNotFoundError(username);
            }
            const isMuted = await this.db.checkIfUserIsMuted(chat, userId);
            if (!isMuted) {
                throw new errors_1.MutedUserNotFoundError(username);
            }
            const updated = await this.db.voteForUser(chat, userId);
            await ctx.replyWithHTML([
                '🎉🎉🎉',
                `You voted for <b>${username}</b>, who is currently having fun`,
                `They now have <b>${updated.currentVotes}</b> of <b>${updated.quorum}</b> votes`,
                `They will be automatically unmuted on ${updated.unmuteAt} if quorum won't be reached`,
            ].join('\n'));
        }
        catch (error) {
            await ctx.telegram.sendMessage(ctx.chat.id, error.message);
        }
    }
    //
    async checkIfBotIsAdmin(ctx) {
        if (!ctx.chat) {
            throw new errors_1.BotIsNotAdminError();
        }
        const member = await ctx.telegram.getChatMember(ctx.chat.id, ctx.botInfo.id);
        if (member.status !== 'administrator') {
            throw new errors_1.BotIsNotAdminError();
        }
    }
    async checkIfUserIsAdmin(ctx) {
        if (!ctx.chat || !ctx.message?.from) {
            throw new errors_1.UserIsNotAdminError();
        }
        const member = await ctx.telegram.getChatMember(ctx.chat.id, ctx.message?.from?.id);
        if (!['administrator', 'creator'].includes(member.status)) {
            throw new errors_1.UserIsNotAdminError();
        }
    }
    async checkMessage(ctx, next) {
        if (!ctx.chat || !ctx.message) {
            return next();
        }
        try {
            await this.checkIfBotIsAdmin(ctx);
        }
        catch (error) {
            return next();
        }
        const chat = await this.db.getChat(ctx.chat.id);
        if (!chat) {
            return next();
        }
        const isMuted = await this.db.checkIfUserIsMuted(chat, ctx.message?.from.id);
        if (!isMuted) {
            return next();
        }
        await ctx.telegram.deleteMessage(ctx.chat.id, ctx.message.message_id);
    }
}
exports.TelegramService = TelegramService;
