FROM node:18-alpine

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
COPY ./apps ./apps
COPY ./libs ./libs
COPY ./nest-cli.json ./
COPY ./tsconfig.build.json ./
COPY ./tsconfig.json ./

RUN npm install -g @nestjs/cli
RUN npm i

RUN nest build proto-schema

RUN npm run build

ENV PORT 3000
ENV PORT 9229

CMD ["npm", "start"]