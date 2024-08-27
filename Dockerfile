FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
#RUN corepack enable
COPY . /app
WORKDIR /app

FROM base AS prod-deps
RUN npm config set proxy http://proxy.pccw.com:8080
RUN npm config set https-proxy http://proxy.pccw.com:8080
RUN  npm i pnpm -g
#RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install 
RUN pnpm install
#RUN npx sonar-scanner
COPY . .
RUN pnpm run build 

FROM base
RUN npm config set proxy http://proxy.pccw.com:8080
RUN npm config set https-proxy http://proxy.pccw.com:8080
RUN  npm i pnpm -g
RUN npm install -g serve

#COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=prod-deps /app/dist /app/dist

#add env variable
RUN npm config delete https-proxy
RUN npm config delete proxy

EXPOSE 3000
CMD [ "pnpm", "run", "serve" ]
