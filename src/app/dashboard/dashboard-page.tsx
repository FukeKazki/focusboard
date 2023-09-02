import {
  DocumentReference,
  DocumentSnapshot,
  collection,
  getDocs,
} from 'firebase/firestore';
import { User, onAuthStateChanged } from 'firebase/auth';
import { firestore, auth } from '../../main';
import { useLoaderData } from 'react-router-dom';

// const getUserAsync = (): Promise<User | null> => {
//   return new Promise((resolve) => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       // user オブジェクトを resolve
//       resolve(user);
//       // 登録解除
//       unsubscribe();
//     });
//   });
// };
//
// async function fetchTasks(listRef: DocumentReference) {
//   const tasksRef = collection(listRef, 'tasks');
//   const taskSnapshots = await getDocs(tasksRef);
//   const tasks = taskSnapshots.docs.map((doc) => ({
//     id: doc.id,
//     ...doc.data(),
//   }));
//   return tasks;
// }
//
// async function fetchLists(boardDoc: DocumentSnapshot) {
//   const listsRef = collection(boardDoc.ref, 'lists');
//   const listSnapshots = await getDocs(listsRef);
//   const lists = await Promise.all(
//     listSnapshots.docs.map(async (doc) => {
//       const tasks = await fetchTasks(doc.ref);
//       return { id: doc.id, ...doc.data(), tasks };
//     })
//   );
//   return lists;
// }
//
// async function fetchBoards(user: User) {
//   const boardRef = collection(
//     firestore,
//     'workspaces',
//     user?.uid ?? '',
//     'boards'
//   );
//   const boardSnapshots = await getDocs(boardRef);
//   const boards = await Promise.all(
//     boardSnapshots.docs.map(async (doc) => {
//       const lists = await fetchLists(doc);
//       return { id: doc.id, ...doc.data(), lists };
//     })
//   );
//   return boards;
// }
//
export const dashboardLoader = async () => {
  // const user = await getUserAsync();
  // if (!user) {
  //   return;
  // }
  // return await fetchBoards(user);
  return boards;
};

const boards = [
  {
    id: 'hsJDohDYDTcXxjXph69s',
    name: 'マイタスク',
    lists: [
      {
        id: 'YZnIZ46u6LWdCFeQxAaw',
        name: 'inbox',
        tasks: [
          {
            id: 'kchVwJoq98zxZJy9X7jC',
            name: 'FocusBoardの使いかたについて知る',
          },
        ],
      },
      {
        id: 'h56UJFE4mYSioOGYAaBy',
        name: '今日やること',
        tasks: [],
      },
    ],
  },
  {
    id: 'hsJDohDYDTcXxjXph69s',
    name: '読書',
    lists: [
      {
        id: 'YZnIZ46u6LWdCFeQxAaw',
        name: 'inbox',
        tasks: [
          {
            id: 'kchVwJoq98zxZJy9X7jC',
            name: 'FocusBoardの使いかたについて知る',
          },
        ],
      },
      {
        id: 'h56UJFE4mYSioOGYAaBy',
        name: '今日やること',
        tasks: [],
      },
    ],
  },
];

export function DashboardPage() {
  const value = useLoaderData() as Awaited<ReturnType<typeof dashboardLoader>>;
  console.log(value);
  return (
    <div>
      <p>Dashboard page</p>
      <div>{JSON.stringify(value)}</div>
    </div>
  );
}
