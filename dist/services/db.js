"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const date_fns_1 = require("date-fns");
const chat_1 = __importDefault(require("../models/chat"));
class DbService {
    constructor(config) {
        this.mongoUri = config.mongo.uri;
    }
    async connect() {
        await mongoose_1.default.connect(this.mongoUri);
    }
    async disconnect() {
        await mongoose_1.default.disconnect();
    }
    async getChat(id) {
        return chat_1.default.findOne({ telegramId: id });
    }
    async createChat(id) {
        await chat_1.default.create({ telegramId: id });
    }
    async deleteChat(id) {
        await chat_1.default.deleteOne({ telegramId: id });
    }
    async checkIfUserIsMuted(chat, userId) {
        const users = chat.users || new Map();
        const user = users.get(String(userId));
        if (!user) {
            return false;
        }
        return (user.currentVotes < user.quorum && (0, date_fns_1.isBefore)(new Date(), user.unmuteAt));
    }
    async muteUser(chat, user, quorum, hours) {
        const users = chat.users || new Map();
        const record = {
            telegramId: user.id,
            username: user.username,
            quorum,
            currentVotes: 0,
            unmuteAt: (0, date_fns_1.addHours)(new Date(), hours),
        };
        users.set(String(user.id), record);
        await chat_1.default.updateOne({ _id: chat._id }, {
            users,
        }, { upsert: true });
    }
    async getUserIdByUsername(chat, username) {
        const users = chat.users;
        const arr = [...users.values()];
        const found = arr.find((item) => item.username === username);
        return found?.telegramId;
    }
    async voteForUser(chat, userId) {
        const users = chat.users;
        const user = users.get(String(userId));
        user.currentVotes++;
        users.set(String(userId), user);
        await chat_1.default.updateOne({ _id: chat._id }, {
            users,
        }, { upsert: true });
        return user;
    }
}
exports.DbService = DbService;
