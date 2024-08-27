<h1 align="center">React Vite Template</h1>

<div align="center">中后台管理系统模板</div>

### ✨ 特性

- 🌈 采用 [Ant Design](https://ant.design/index-cn) 为您提供企业级中后台产品的交互语言和视觉风格。
- 💥 基于 [Vite](https://vitejs.dev/) 构建，可*[快速启动开发](https://vitejs.dev/guide/why.html)*。
- 🛡 使用 **TypeScript** 开发，提供完整的类型定义。
- 👍 强大的 [redux-toolkit](https://redux-toolkit.js.org/) 让您可以专注于应用所需的核心逻辑。
- 🌏 使用 [axios](https://www.axios-http.cn/) 搭配 [ahooks](https://ahooks.js.org/zh-CN/) 中的 `useRequest` 进行网络请求。
- 🔌 同时支持 **约定式路由** 和 **配置化路由**。
- 🖥 提供默认 `Layout` 组件，且支持同时使用多个 `Layout` 布局组件，默认 `Layout` 可自由扩展。
- ☀ 支持 _亮/暗_ 主题，且提供多个主色调可任意切换。
- 🔨 antD 组件国际化和本地国际化。使用 [i18next-scanner](https://juejin.cn/post/7325132202970660873)自动化配置(扁平化、唯一 key、变量国际化)。
- ⚙️ 富文本编辑。使用 [wangeditor](https://www.wangeditor.com/)

### 📦 快速开始

#### 用 pnpm 启动项目

```
npm i pnpm -g

pnpm install

pnpm run dev
```

#

# Docker Compose

To start up the application using Docker Compose, follow these steps:

1. Execute the following command to docker build the application:

```javascript
docker build --tag demo:latest .
```

2. Execute the following command to start up the application:

```javascript
docker compose up -d
```

Please note

3. Important: Nginx in docker-compose.yml forwards API calls. Comment it out if unused.
   Keep network/service names matching backend API's docker-compose.yml for forwarding.

i. docker-compose.yml

```javascript
networks: sma_network: external: true;
```

ii. nginx.conf

```javascript
proxy_pass http://backend-api:8080;
```

iii. docker-compose.yml of pkg.gov.ogcio.sma.adm.parent

```javascript
services:
  backend-api:
...
...
networks:
  sma_network:
    name: sma_network
    driver: bridge
```

#

4. if your Maven update process requires downloading libraries without VPN, you may need to comment out the VPN setting in the Dockerfile before building the image.

```javascript
RUN npm config set proxy http://proxy.pccw.com:8080
RUN npm config set https-proxy http://proxy.pccw.com:8080
```

These commands will handle the setup and deployment of the SMA Admin Portal using Docker Compose.
