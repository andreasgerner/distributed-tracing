FROM node:20-alpine
WORKDIR /app

ENV NODE_ENV=production

COPY ./public ./public

RUN mkdir .next

COPY --chmod=777 .next/standalone ./
COPY .next/static ./.next/static

ENV PORT=3000

ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
