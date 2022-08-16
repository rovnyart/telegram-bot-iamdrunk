# IamDrunkBot for Telegram

## Description

This is a quite simple bot for your Telegram chats, which have only one function: it can mute you on demand, when you want it, for example, when u're a bit drunk and don't want your co-workers to hear some unpleasant (or opposite) stuff from you =)

## Configuration

This bot uses `MongoDb` as a databse, so you should have an access to running `Mongodb` instance.

The configuration is really simple, you just need to pass two environmental variables:

* `process.env.TELEGRAM_TOKEN` - your bot token
* `process.env.MONGO_URI` - Mongodb connection string (including database)

Optionally, if you want, you can put corresponding values directly to `config.ts` file.

## Running

run in dev mode:

```bash
npm run dev
```

run in production mode

```bash
npm run build && npm run start
```

## Docker

You can use provided `Dockerfile` to build a docker image of this app and then use it in `docker-compose` or `Kubernetes` environments

```bash
docker build -t my-iamdrunk-bot .
```
