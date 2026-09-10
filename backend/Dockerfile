# 与 .python-version 一致，避免运行时 uv 重新下载 CPython
FROM python:3.12-slim

WORKDIR /app

# 禁止 uv 在运行时下载 Python；复制而非硬链接（跨层更稳）
ENV UV_PYTHON_DOWNLOADS=never \
    UV_LINK_MODE=copy

# 安装 uv (Python 包管理器)
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

# 先复制依赖清单 + python 版本钉（放在源码前，利用构建缓存）
COPY pyproject.toml uv.lock .python-version ./

# 构建期一次性装好依赖到 /app/.venv
RUN uv venv && uv sync --frozen --no-dev --no-install-project

# 复制应用代码
COPY . .

# 把 venv 放进 PATH —— 运行时直接用 alembic / uvicorn，不再走 uv run（避免每次冷启动重装环境）
# PYTHONPATH=/app 让 alembic env.py / uvicorn 能 import app.*（不走 uv run 就没有隐式 sys.path 注入）
ENV PATH="/app/.venv/bin:$PATH" \
    PYTHONPATH="/app"

# 暴露端口（Cloud Run 注入 $PORT，默认 8080）
EXPOSE 8080

# 启动：先跑数据库迁移（库已 stamp 到 head 时为空转），再起服务，监听 $PORT
CMD ["sh", "-c", "alembic upgrade head && exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8080}"]
