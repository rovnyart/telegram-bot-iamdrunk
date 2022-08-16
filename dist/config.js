"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.config = {
    telegram: {
        token: process.env.TELEGRAM_TOKEN || '',
    },
    mongo: {
        uri: process.env.MONGO_URI || 'mongodb://localhost/imdrunk',
    },
};
