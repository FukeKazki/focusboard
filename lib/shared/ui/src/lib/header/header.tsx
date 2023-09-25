export function Header() {
  return (
    <div className="navbar bg-base-100">
      <div className="flex-none">
        <label className="btn-ghost btn-square btn" htmlFor="my-drawer-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="inline-block h-5 w-5 stroke-current"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </label>
      </div>
      <div className="flex-1">
        <a className="btn-ghost btn text-xl normal-case" href="/">
          Focus Board
        </a>
      </div>
      <div className="dropdown-end dropdown">
        <label tabIndex={0} className="btn-ghost btn-circle avatar btn">
          <div className="w-10 rounded-full">
            <img
              src="https://avatars.githubusercontent.com/u/40536586?v=4"
              alt="Fuke Kazuki"
            />
          </div>
        </label>
        <ul
          tabIndex={0}
          className="dropdown-content menu rounded-box menu-sm z-[1] mt-3 w-52 bg-base-100 p-2 shadow"
        >
          <li>
            <a href="/">Settings</a>
          </li>
          <li>
            <a href="/">Logout</a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Header;
