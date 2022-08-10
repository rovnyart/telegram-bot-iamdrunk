import mongoose from 'mongoose';
import { addHours, isBefore } from 'date-fns';
import { User as TelegramUser } from 'telegraf/typings/core/types/typegram';

import ChatModel, { User, Chat } from '../models/chat';

import { Config } from '../config';

export class DbService {
  private mongoUri: string;

  constructor(config: Config) {
    this.mongoUri = config.mongo.uri;
  }

  async connect() {
    await mongoose.connect(this.mongoUri);
  }

  async disconnect() {
    await mongoose.disconnect();
  }

  async getChat(id: number): Promise<Chat | null> {
    return ChatModel.findOne({ telegramId: id });
  }

  async createChat(id: number): Promise<void> {
    await ChatModel.create({ telegramId: id });
  }

  async deleteChat(id: number): Promise<void> {
    await ChatModel.deleteOne({ telegramId: id });
  }

  async checkIfUserIsMuted(chat: Chat, userId: number): Promise<boolean> {
    const users =
      (chat.users as unknown as Map<string, User>) || new Map<string, User>();

    const user = users.get(String(userId));

    if (!user) {
      return false;
    }

    return (
      user.currentVotes < user.quorum && isBefore(new Date(), user.unmuteAt)
    );
  }

  async muteUser(
    chat: Chat,
    user: TelegramUser,
    quorum: number,
    hours: number,
  ): Promise<void> {
    const users =
      (chat.users as unknown as Map<string, User>) || new Map<string, User>();

    const record = {
      telegramId: user.id,
      username: user.username,
      quorum,
      currentVotes: 0,
      unmuteAt: addHours(new Date(), hours),
    };

    users.set(String(user.id), record as User);

    await ChatModel.updateOne(
      { _id: chat._id },
      {
        users,
      },
      { upsert: true },
    );
  }

  async getUserIdByUsername(
    chat: Chat,
    username: string,
  ): Promise<number | undefined> {
    const users = chat.users as unknown as Map<string, User>;

    const arr = [...users.values()];
    const found = arr.find((item) => item.username === username);

    return found?.telegramId;
  }

  async voteForUser(chat: Chat, userId: number): Promise<User> {
    const users = chat.users as unknown as Map<string, User>;

    const user = users.get(String(userId))!;

    user.currentVotes++;

    users.set(String(userId), user);

    await ChatModel.updateOne(
      { _id: chat._id },
      {
        users,
      },
      { upsert: true },
    );

    return user;
  }
}
