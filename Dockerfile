FROM node:22-slim

WORKDIR /app

# Copy all project assets, compositions, rendered video, and web server
COPY . .

ENV PORT=8080
ENV NODE_ENV=production

EXPOSE 8080

CMD ["node", "server.mjs"]
