# Multi-stage is overkill here; simple image
FROM node:20-alpine

WORKDIR /app

# server deps
COPY server/package.json server/package-lock.json ./server/
RUN cd server && npm ci

# app files
COPY server ./server
COPY index.html ./index.html
COPY app.js ./app.js
COPY config.js ./config.js
COPY styles.css ./styles.css
COPY ar.html ./ar.html
COPY assets ./assets
COPY tiles ./tiles

ENV PORT=8787
EXPOSE 8787

CMD ["node", "server/server.js"]
