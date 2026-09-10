FROM python:3.11-slim

WORKDIR /app

# 安装 uv (Python 包管理器)
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

# 复制依赖文件
COPY pyproject.toml uv.lock ./

# 安装依赖
RUN uv venv && uv sync --frozen --no-dev --no-install-project

# 复制应用代码
COPY . .

# 暴露端口（Cloud Run 注入 $PORT，默认 8080）
EXPOSE 8080

# 启动：先跑数据库迁移（幂等），再起服务，监听 $PORT
CMD ["sh", "-c", "uv run alembic upgrade head && uv run uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8080}"]