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
import { useReducer, useRef, useState } from 'react';

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
          {
            id: 'kchVwJoq98zxZJy9X7jC-2',
            name: 'エンジニアのための知的生産術を読む',
          },
        ],
      },
      {
        id: 'h56UJFE4mYSioOGYAaBy',
        name: '今日やること',
        tasks: [],
      },
      {
        id: 'h56UJFE4mYSioOGYAaBya',
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

type State =
  | {
    visible: false;
  }
  | {
    visible: true;
    listId: string;
    text: string;
  };

type Action =
  | {
    type: 'OPEN';
    listId: string;
  }
  | {
    type: 'CLOSE';
  }
  | {
    type: 'CHANGE_TEXT';
    text: string;
  };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'OPEN':
      return {
        visible: true,
        listId: action.listId,
        text: '',
      };
    case 'CLOSE':
      return {
        visible: false,
      };
    case 'CHANGE_TEXT':
      return {
        visible: true,
        listId: state.visible ? state.listId : '',
        text: action.text,
      };
  }
};

export function DashboardPage() {
  // TODO: Recoil で管理する
  const value = useLoaderData() as Awaited<ReturnType<typeof dashboardLoader>>;
  // TODO: board を選択できるように、query params?
  const board = value?.[0];

  const taskModalDialogRef = useRef<HTMLDialogElement>(null);

  const [newTaskState, dispatchNewTaskState] = useReducer(reducer, {
    visible: false,
  });

  return (
    <div>
      {/* toolbar */}
      <div className="px-8 py-4 border-b flex justify-between">
        <h1 className="text-lg font-bold">{board.name}</h1>
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
      <ul className="flex gap-4 p-4 w-screen overflow-x-auto">
        {/* list */}
        {board.lists.map((list) => (
          <li key={list.id} className="min-w-[400px]">
            <div className="flex justify-between">
              <p className="text-2xl">{list.name}</p>
              <div className="grid gap-1 grid-cols-2">
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
                <div className="dropdown dropdown-end">
                  <label tabIndex={0}>
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
                          d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                        />
                      </svg>
                    </Button>
                  </label>
                  <ul
                    tabIndex={0}
                    className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
                  >
                    <li>
                      <button>
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
                            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                          />
                        </svg>
                        セクション名を変更
                      </button>
                    </li>
                    <li>
                      <button>
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
                            d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
                          />
                        </svg>
                        セクションを削除
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            {/* cards */}
            <ul className="grid gap-2 mt-4">
              {list.tasks.map((task) => (
                <li key={task.id}>
                  <div
                    className="card card-bordered rounded-md cursor-pointer"
                    onClick={() => taskModalDialogRef.current?.showModal()}
                  >
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
                        {task.name}
                      </p>
                      <p className="text-sm text-gray-500">9月1日</p>
                    </div>
                  </div>
                </li>
              ))}
              {newTaskState.visible && newTaskState.listId === list.id && (
                <li>
                  <div className="card card-body card-bordered rounded-md cursor-pointer">
                    <div className="flex gap-2 items-center">
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
                      <input
                        type="text"
                        className="input w-full h-auto"
                        placeholder="タスクを追加"
                        autoFocus
                        // フォーカスが外れたとき
                        onBlur={() => {
                          // 未入力のときはキャンセル
                          if (!newTaskState.text) {
                            return dispatchNewTaskState({
                              type: 'CLOSE',
                            });
                          }
                          // 入力されているときは追加
                          // TODO: サーバーに追加
                          // refetch するか state を更新するか
                          // refetch のときは Recoil で管理する必要がある
                        }}
                        value={newTaskState.text}
                        onChange={(e) =>
                          dispatchNewTaskState({
                            type: 'CHANGE_TEXT',
                            text: e.target.value,
                          })
                        }
                      />
                    </div>
                    <p className="text-sm text-gray-500">9月1日</p>
                  </div>
                </li>
              )}
              <li>
                <Button
                  as="button"
                  className="btn-block"
                  onClick={() =>
                    dispatchNewTaskState({
                      type: 'OPEN',
                      listId: list.id,
                    })
                  }
                >
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
        ))}
        {/* add list */}
        <li className="min-w-[400px]">
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
        </li>
      </ul>
      {/* task modal-dialog */}
      <dialog className="modal" ref={taskModalDialogRef}>
        <div className="modal-box max-w-5xl">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg flex gap-2 items-center">
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
            FocusBoardの使い方を知ろう
          </h3>
          <ul className="grid gap-2 mt-4">
            <li className="grid grid-cols-[100px_1fr] gap-4">
              <p className="text-gray-500">期日</p>
              <p>9月1日</p>
            </li>
            <li className="grid grid-cols-[100px_1fr] gap-4">
              <p className="text-gray-500">説明</p>
              <div>
                <p>マイタスクへようこそ！</p>
                <p>
                  マイタスクは自分に割り当てられたすべてのタスクが表示される個人用の計画スペースです。マイタスクでは以下のことができます。
                </p>
                <p>
                  セクションを使ってタスクを計画したり整理したりします
                  To-Doを記録および管理します
                </p>
                <p>期日やプロジェクト、優先度でタスクをソートします</p>
              </div>
            </li>
          </ul>
          <div className="mt-4">
            <p className="text-gray-500">サブタスク</p>
            <ul className="grid gap-2 mt-2">
              <li>
                <div className="border-t border-b py-2 border-gray-500 cursor-pointer">
                  <p className="flex gap-2">
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
                    FocusBoardアカウントを作成しよう
                  </p>
                </div>
              </li>
              <li>
                <div className="border-b py-2 border-gray-500 cursor-pointer">
                  <p className="flex gap-2">
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
                    タスクを登録してみよう
                  </p>
                </div>
              </li>
            </ul>
            <Button as="button" className="btn-sm mt-4">
              サブタスクを追加
            </Button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
