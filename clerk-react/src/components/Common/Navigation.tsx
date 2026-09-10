import { Link } from '@tanstack/react-router'

export function Navigation() {
  return (
    <nav className="flex items-center gap-4">
      <Link to="/" className="text-sm hover:underline">
        首页
      </Link>
      <Link to="/about" className="text-sm hover:underline">
        关于
      </Link>
      <Link to="/users" className="text-sm hover:underline">
        用户列表
      </Link>
      <Link to="/form" className="text-sm hover:underline">
        表单示例
      </Link>
      <Link to="/coding-challenge" className="text-sm hover:underline">
        Coding Challenge
      </Link>
    </nav>
  )
}

