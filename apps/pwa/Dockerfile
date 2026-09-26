FROM node:20-alpine AS build

WORKDIR /repo
RUN npm install -g pnpm@9

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/pwa/package.json apps/pwa/package.json
COPY packages/types/package.json packages/types/package.json
COPY packages/ui/package.json packages/ui/package.json

RUN pnpm install --frozen-lockfile

COPY apps/pwa apps/pwa
COPY packages/types packages/types

ARG VITE_API_URL=/api/v1
ARG VITE_DEPLOYMENT_MODE=cloud
ARG VITE_MEDIA_CDN_URL=
ARG VITE_ADMIN_STAFF_HASH=
ARG VITE_SUPABASE_URL=
ARG VITE_BUILD_ID=
ENV VITE_API_URL=$VITE_API_URL \
    VITE_DEPLOYMENT_MODE=$VITE_DEPLOYMENT_MODE \
    VITE_MEDIA_CDN_URL=$VITE_MEDIA_CDN_URL \
    VITE_ADMIN_STAFF_HASH=$VITE_ADMIN_STAFF_HASH \
    VITE_SUPABASE_URL=$VITE_SUPABASE_URL \
    VITE_BUILD_ID=$VITE_BUILD_ID

RUN pnpm --filter @cyberlearn/pwa build

FROM nginx:1.27-alpine
COPY apps/pwa/nginx.http.conf /etc/nginx/nginx.conf
COPY apps/pwa/nginx.conf /etc/nginx/conf.d/default.conf
COPY apps/pwa/nginx.tls.conf /etc/nginx/tls.conf.template
COPY apps/pwa/docker-entrypoint.sh /docker-entrypoint.sh
COPY --from=build /repo/apps/pwa/dist /usr/share/nginx/html
RUN chmod +x /docker-entrypoint.sh
EXPOSE 80 443
HEALTHCHECK --interval=15s --timeout=5s --retries=5 \
    CMD wget -qO- http://127.0.0.1/ >/dev/null || wget -qO- https://127.0.0.1/ --no-check-certificate >/dev/null || exit 1
ENTRYPOINT ["/docker-entrypoint.sh"]
