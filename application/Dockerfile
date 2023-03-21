FROM node:19

ENV PORT=5000
ENV NODE_ENV=production
WORKDIR /app

COPY . .
RUN npm install --production 
RUN npm install typescript@4.8.4 -g && tsc -p .
RUN npm run build

CMD ["node", "./server.js"]

EXPOSE $PORT