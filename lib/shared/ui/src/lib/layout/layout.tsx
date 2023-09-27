import { Link } from "react-router-dom";
import Header from "../header/header";
import { HashtagIcon } from "../icons/hashtag-icon";
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
        <ul className="menu relative min-h-full w-80 bg-base-200 p-4">
          <li className="menu-title">ボード</li>
          {boards.map((board, index) => (
            <li key={`${board.id}-${index}`}>
              <Link to={`dashboard/${board.id}`}>
                <HashtagIcon/>
                {board.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
