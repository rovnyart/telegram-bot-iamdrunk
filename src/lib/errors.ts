import { ExtendableError } from 'ts-error';

export class NoTelegramTokenError extends ExtendableError {
  constructor() {
    super('🤦‍♂️ No Telegram token provided');
  }
}

export class TelegramError extends ExtendableError {
  // TODO
  constructor(message: string) {
    super(message);
  }
}

export class BotIsNotAdminError extends TelegramError {
  constructor() {
    super('👮 I have to be administrator in your chat');
  }
}

export class UserIsNotAdminError extends TelegramError {
  constructor() {
    super('👮 Sorry, start/stop is for chat admins only');
  }
}

export class ChatNotRegisteredError extends TelegramError {
  constructor() {
    super(
      '🤨 It seems your chat is not registered :( Register it with "/start" command',
    );
  }
}

export class UserIsAlreadyMutedError extends TelegramError {
  constructor(username: string) {
    super(`🥴 User ${username} is already muted`);
  }
}

export class MutedUserNotFoundError extends TelegramError {
  constructor(username: string) {
    super(`🤷 User ${username} is not muted`);
  }
}

export class UsernameNotPassedError extends TelegramError {
  constructor() {
    super(
      '🌚 You must pass username as a command argument, e.g. "/vote someUser" or "/vote @someUser" (for autocomplete)',
    );
  }
}
