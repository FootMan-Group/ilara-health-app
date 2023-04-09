
## Description

This is the Ilara health app

## Installation

```bash
$ npm install
$ docker-compose up -d dev-db
$ npx prisma migrate dev
$ npx prisma deploy
```

## Running the app

```bash
# Add some DB entries
$ npx prisma studio
# Add 2 types of transactions
# Add 2 types of Departments Pharmacists and IT


npm
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
