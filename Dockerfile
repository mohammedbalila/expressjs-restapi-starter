FROM node:12

EXPOSE 8000

RUN mkdir /app
WORKDIR /app
ADD package.json yarn.lock /app/
RUN yarn --pure-lockfile
RUN yarn global add pm2 
ADD . /app

CMD ["pm2-runtime", "src/server.js"]
