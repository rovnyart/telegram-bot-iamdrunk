import { model, Schema, Document } from 'mongoose';

export interface User extends Document {
  telegramId: number;
  username: string;
  quorum: number;
  currentVotes: number;
  unmuteAt: Date;
}

export interface Chat extends Document {
  telegramId: number;
  users?: Record<string, User>;
}

export const UserSchema = new Schema<User>({
  telegramId: { type: Number, required: true },
  username: { type: String, required: true },
  quorum: { type: Number, required: true },
  currentVotes: { type: Number, required: true },
  unmuteAt: { type: Date, required: true },
});

export const ChatSchema = new Schema<Chat>({
  telegramId: { type: Number, required: true },
  users: { type: Map, of: UserSchema },
});

export default model<Chat>('Chat', ChatSchema);
