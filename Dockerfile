FROM node:20.10-alpine3.17

RUN apk add tini

ENV NODE_ENV production

RUN adduser -D node-user -G node

USER node-user

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

ENTRYPOINT ["/sbin/tini", "--"]

CMD ["node", "/app"]






