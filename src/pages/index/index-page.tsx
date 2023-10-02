import { Link } from "react-router-dom";

export function IndexPage() {
  return (
    <div>
      <p>Index page</p>
      <Link to="/login" className="btn">
        ログイン
      </Link>
    </div>
  );
}
