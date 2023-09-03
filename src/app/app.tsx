import { Layout } from 'lib/shared/ui';
import { Outlet } from 'react-router-dom';

export function App() {
  return (
    <Layout>
      <p>Welcome focusboard</p>
      <Outlet />
    </Layout>
  );
}

export default App;
