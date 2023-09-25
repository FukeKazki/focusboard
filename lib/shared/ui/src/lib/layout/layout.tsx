import { Link } from "react-router-dom";
import Header from "../header/header";
// import './layout.css';
type Props = {
  children?: React.ReactNode;
  boards: Array<{
    id: string;
    name: string;
  }>;
};
export function Layout({ children, boards }: Props) {
  return (
    <div className="drawer">
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        <Header />
        <div className="children">{children}</div>
      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer-3" className="drawer-overlay"></label>
        <ul className="menu p-4 w-80 min-h-full relative bg-base-200">
          <li className="menu-title">ボード</li>
          {boards.map((board, index) => (
            <li key={`${board.id}-${index}`}>
              <Link to={`dashboard/${board.id}`}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5l-3.9 19.5m-2.1-19.5l-3.9 19.5"
                  />
                </svg>
                {board.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
