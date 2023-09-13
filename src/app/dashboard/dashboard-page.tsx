import {
  DocumentReference,
  DocumentSnapshot,
  collection,
  getDocs,
} from 'firebase/firestore';
import { User, onAuthStateChanged } from 'firebase/auth';
import { firestore, auth } from '../../main';
import { useLoaderData } from 'react-router-dom';
import { Button } from 'lib/shared/ui';

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
  const board = value?.[0];
  return (
    <div>
      {/* toolbar */}
      <div className="px-8 py-4 border-b flex justify-between">
        <h1 className="text-lg font-bold">マイタスク</h1>
        <Button as="button" className="btn-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
            />
          </svg>
          ソート
        </Button>
      </div>
      {/* board */}
      <ul className="flex gap-4 p-4">
        {/* list */}
        <li>
          <div className="flex justify-between">
            <p className="text-2xl">inbox</p>
            <div>
              <Button as="button" className="btn-square btn-sm">
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
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
              </Button>
            </div>
          </div>
          {/* cards */}
          <ul className="grid gap-2 mt-4">
            <li>
              <div className="card card-bordered border-white rounded-md">
                <div className="card-body">
                  <p className="card-title font-normal text-lg">
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
                        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    FocusBoardの使いかたについて知る
                  </p>
                  <p className="text-sm text-gray-500">9月1日</p>
                </div>
              </div>
            </li>
            <li>
              <div className="card card-bordered border-opacity-20 border-white rounded-md">
                <div className="card-body">
                  <p className="card-title font-normal text-lg">
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
                        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    FocusBoardの使いかたについて知る
                  </p>
                  <p className="text-sm text-gray-500">9月1日</p>
                </div>
              </div>
            </li>
          </ul>
        </li>
        {/* list */}
        <li>
          <div className="flex justify-between">
            <p className="text-2xl">今日やること</p>
            <div>
              <Button as="button" className="btn-square btn-sm">
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
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
              </Button>
            </div>
          </div>
          {/* cards */}
          <ul className="grid gap-2 mt-4">
            <li>
              <div className="card cursor-pointer card-bordered border-white border-opacity-20 hover:border-opacity-100 rounded-md">
                <div className="card-body">
                  <span className="badge badge-info">hackz</span>
                  <p className="card-title font-normal text-lg">
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
                        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    FocusBoardの使いかたについて知る
                  </p>
                  <p className="text-sm text-gray-500">今日</p>
                </div>
              </div>
            </li>
            <li>
              <div className="card card-bordered border-opacity-20 border-white rounded-md">
                <div className="card-body">
                  <p className="card-title font-normal text-lg">
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
                        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    FocusBoardの使いかたについて知る
                  </p>
                  <p className="text-sm text-gray-500">9月1日</p>
                </div>
              </div>
            </li>
            <li>
              <Button as="button" className="btn-block">
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
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
                タスクを追加
              </Button>
            </li>
          </ul>
        </li>
        {/* list */}
        <li>
          <div className="flex justify-between">
            <Button as="button" className="btn-block">
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
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              セクションを追加
            </Button>
          </div>
          <div className="bg-gradient-to-b from-gray-700 to-gray-800 w-[400px] h-96 mt-4 rounded-md" />
        </li>
      </ul>
    </div>
  );
}
