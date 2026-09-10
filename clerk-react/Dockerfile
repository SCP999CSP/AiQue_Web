# 构建阶段
FROM node:22-alpine AS builder

WORKDIR /app

# 安装 pnpm（钉 9，与 pnpm-lock.yaml lockfileVersion 9.0 对齐）
RUN npm install -g pnpm@9

# 复制 package 文件
COPY package.json pnpm-lock.yaml ./

# 安装依赖
RUN pnpm install --frozen-lockfile

# 复制源代码（含 .env.production —— Vite 构建时自动读取 VITE_* 变量）
COPY . .

RUN pnpm run build

# 生产阶段 - 使用 nginx 提供静态文件
FROM nginx:alpine

# 复制构建产物到 nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制 nginx 配置（用于 SPA 路由支持；监听 $PORT=8080）
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]

