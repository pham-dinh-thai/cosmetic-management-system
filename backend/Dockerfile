FROM node:26-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN set -eux; \
    mkdir -p /opt/built; \
    for app in user-service gateway-service authentication-service authorization-service department-service employee-service customer-service category-service supplier-service cosmetic-service inventory-service purchase-service order-service invoice-service basket-service storage-service; do \
      npx nest build "$app"; \
      mkdir -p "/opt/built/$app"; \
      cp -r "dist/apps/$app/." "/opt/built/$app/"; \
    done; \
    for built in /opt/built/*; do \
      app="$(basename "$built")"; \
      mkdir -p "dist/apps/$app"; \
      cp -r "$built/." "dist/apps/$app/"; \
    done; \
    rm -rf /opt/built
    
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
