"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsernameNotPassedError = exports.MutedUserNotFoundError = exports.UserIsAlreadyMutedError = exports.ChatNotRegisteredError = exports.UserIsNotAdminError = exports.BotIsNotAdminError = exports.TelegramError = exports.NoTelegramTokenError = void 0;
const ts_error_1 = require("ts-error");
class NoTelegramTokenError extends ts_error_1.ExtendableError {
    constructor() {
        super('🤦‍♂️ No Telegram token provided');
    }
}
exports.NoTelegramTokenError = NoTelegramTokenError;
class TelegramError extends ts_error_1.ExtendableError {
    // TODO
    constructor(message) {
        super(message);
    }
}
exports.TelegramError = TelegramError;
class BotIsNotAdminError extends TelegramError {
    constructor() {
        super('👮 I have to be administrator in your chat');
    }
}
exports.BotIsNotAdminError = BotIsNotAdminError;
class UserIsNotAdminError extends TelegramError {
    constructor() {
        super('👮 Sorry, start/stop is for chat admins only');
    }
}
exports.UserIsNotAdminError = UserIsNotAdminError;
class ChatNotRegisteredError extends TelegramError {
    constructor() {
        super('🤨 It seems your chat is not registered :( Register it with "/start" command');
    }
}
exports.ChatNotRegisteredError = ChatNotRegisteredError;
class UserIsAlreadyMutedError extends TelegramError {
    constructor(username) {
        super(`🥴 User ${username} is already muted`);
    }
}
exports.UserIsAlreadyMutedError = UserIsAlreadyMutedError;
class MutedUserNotFoundError extends TelegramError {
    constructor(username) {
        super(`🤷 User ${username} is not muted`);
    }
}
exports.MutedUserNotFoundError = MutedUserNotFoundError;
class UsernameNotPassedError extends TelegramError {
    constructor() {
        super('🌚 You must pass username as a command argument, e.g. "/vote someUser" or "/vote @someUser" (for autocomplete)');
    }
}
exports.UsernameNotPassedError = UsernameNotPassedError;
