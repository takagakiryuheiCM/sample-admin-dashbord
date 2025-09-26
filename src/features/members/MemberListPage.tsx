import { Link } from 'react-router-dom'

export const MemberListPage = () => {
  return (
    <div>
      <h1>メンバー一覧</h1>
      <p>ここにメンバーのリストが表示されます。</p>
      <Link to="/">ホームに戻る</Link>
    </div>
  );
};