FROM node:latest AS builder

COPY . .

ENV PUBLIC_URL /
RUN npm install && npm run build

FROM node:lts-slim

RUN npm -g install serve
WORKDIR /app

COPY --from=builder /build .

CMD serve -s

