import { Layout } from 'lib/shared/ui';
import { Outlet } from 'react-router-dom';
import { useUser } from './feature/user-hook';
import { useApiService } from './feature/api-service-hook';
import './global.css';
import './tailwind.css';

export function App() {
  const { currentUser } = useUser();
  const { useBoards } = useApiService();
  const { data } = useBoards(currentUser);
  return (
    <Layout boards={data ?? []}>
      <Outlet />
    </Layout>
  );
}

export default App;
