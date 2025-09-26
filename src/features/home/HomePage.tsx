import { Link } from 'react-router-dom'

export const HomePage = () => {
  return (
    <div>
      <h1>ホームページ</h1>
      <nav>
        <ul>
          <li>
            <Link to="/members">メンバー一覧</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}