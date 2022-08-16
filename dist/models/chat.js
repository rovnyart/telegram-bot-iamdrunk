"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatSchema = exports.UserSchema = void 0;
const mongoose_1 = require("mongoose");
exports.UserSchema = new mongoose_1.Schema({
    telegramId: { type: Number, required: true },
    username: { type: String, required: true },
    quorum: { type: Number, required: true },
    currentVotes: { type: Number, required: true },
    unmuteAt: { type: Date, required: true },
});
exports.ChatSchema = new mongoose_1.Schema({
    telegramId: { type: Number, required: true },
    users: { type: Map, of: exports.UserSchema },
});
exports.default = (0, mongoose_1.model)('Chat', exports.ChatSchema);
