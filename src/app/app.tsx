import { Layout } from 'lib/shared/ui';
import { Outlet } from 'react-router-dom';

export function App() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

export default App;
