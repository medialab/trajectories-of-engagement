FROM node:16.4.0-alpine

COPY --chown=node:node . /api

WORKDIR /api

RUN npm ci --production false

# CMD ["npm", "run", "start"]
CMD ["node", "./api/server.js"]