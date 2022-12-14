import { ExtendableError } from 'ts-error';

export class NoTelegramTokenError extends ExtendableError {
  constructor() {
    super('๐คฆโโ๏ธ No Telegram token provided');
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
    super('๐ฎ I have to be administrator in your chat');
  }
}

export class UserIsNotAdminError extends TelegramError {
  constructor() {
    super('๐ฎ Sorry, start/stop is for chat admins only');
  }
}

export class ChatNotRegisteredError extends TelegramError {
  constructor() {
    super(
      '๐คจ It seems your chat is not registered :( Register it with "/start" command',
    );
  }
}

export class UserIsAlreadyMutedError extends TelegramError {
  constructor(username: string) {
    super(`๐ฅด User ${username} is already muted`);
  }
}

export class MutedUserNotFoundError extends TelegramError {
  constructor(username: string) {
    super(`๐คท User ${username} is not muted`);
  }
}

export class UsernameNotPassedError extends TelegramError {
  constructor() {
    super(
      '๐ You must pass username as a command argument, e.g. "/vote someUser" or "/vote @someUser" (for autocomplete)',
    );
  }
}
