import { collection, getDocs } from 'firebase/firestore';
import { Layout } from 'lib/shared/ui';
import { Outlet } from 'react-router-dom';
import { firestore } from '../main';
import { User } from 'firebase/auth';
import useSWR from 'swr';
import { Board, getUserAsync } from './dashboard/dashboard-page';
// TODO: custom hook にしたい
async function fetchBoards(user: User) {
  const boardRef = collection(
    firestore,
    'workspaces',
    user?.uid ?? '',
    'boards'
  );
  const boardSnapshots = await getDocs(boardRef);
  const boards = await Promise.all(
    boardSnapshots.docs.map(async (doc) => {
      return { id: doc.id, ...doc.data() } as Board;
    })
  );
  return boards;
}

export function App() {
  const { data } = useSWR(
    'boards',
    async () => {
      const user = await getUserAsync();
      if (!user) {
        return;
      }
      return fetchBoards(user);
    },
    {
      revalidateOnFocus: false,
    }
  );
  return (
    <Layout boards={data ?? []}>
      <Outlet />
    </Layout>
  );
}

export default App;
