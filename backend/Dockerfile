FROM node:26-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx nest build user-service && \
    npx nest build gateway-service && \
    npx nest build authentication-service && \
    npx nest build authorization-service && \
    npx nest build department-service && \
    npx nest build employee-service && \
    npx nest build customer-service
    
FROM node:26-slim
WORKDIR /app
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/apps ./apps
COPY --from=build /app/tsconfig.build.json ./
COPY --from=build /app/tsconfig.json ./
COPY --from=build /app/nest-cli.json ./
CMD ["node", "dist/apps/gateway-service/main.js"]
