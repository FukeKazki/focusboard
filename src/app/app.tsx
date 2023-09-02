import { LibSharedUi, NavbarWithDropdown } from 'lib/shared/ui';
import { Outlet } from 'react-router-dom';

export function App() {
  return (
    <div>
      <NavbarWithDropdown/>
      <p>Welcome focusboard</p>
      <LibSharedUi />
      <Outlet />
    </div>
  );
}

export default App;
