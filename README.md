# Authentication API with Nodejs

An auth API for Nodejs applications.

## Features

1. Register a user
2. Verify user's email address
3. Send forgot password email
4. Reset password
5. Get current user
6. Login
7. Access token
8. Refresh tokens

## What technology are we using?

- [TypeScript](https://www.typescriptlang.org/) - Static type checking
- [Express@5](https://expressjs.com/en/5x/api.html) - Web server
- [Typegoose](https://typegoose.github.io/typegoose/) - Mongoose wrapper for creating TypeScript interfaces and models
- [argon2](https://github.com/ranisalt/node-argon2#readme) - Password hashing
- [Zod](https://github.com/colinhacks/zod) - Validation
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) - Signing and verifying JSON web tokens
- [Nodemailer](https://nodemailer.com/about/) - Sending emails
- [Pino](https://github.com/pinojs/pino) - Logging
- [config](https://github.com/lorenwest/node-config) - Managing configuration

### Init TypeScript

npx tsc --init

### Install dev dependencies

yarn add typescript ts-node-dev @types/express @types/config pino-pretty @types/nodemailer @types/lodash @types/jsonwebtoken -D

### Install Express

yarn add express@5

### Install dependencies

yarn add mongoose @typegoose/typegoose config argon2 pino dayjs nanoid@3.0.0 nodemailer lodash jsonwebtoken dotenv zod

Generate new Base64 Encoded keys for your access and refresh token private and public keys.
