import { Button } from 'lib/shared/ui';
import { useReducer, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { TaskModalDialog } from './components/task-modal-dialog';
import { List, Task } from '../feature/type';
import { useUser } from '../feature/user-hook';
import { useApiService } from '../feature/board-hook';

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
  const { id } = useParams();
  const { currentUser } = useUser();
  const { useBoard, useAddTask } = useApiService();
  const { data: board, mutate } = useBoard(currentUser, id as string);
  const { addTask } = useAddTask(currentUser);

  const taskModalDialogRef = useRef<HTMLDialogElement>(null);

  const [newTaskState, dispatchNewTaskState] = useReducer(reducer, {
    visible: false,
  });
  const [selectedTask, setSelectedTask] = useState<Task | undefined>();
  const [selectedList, setSelectedList] = useState<List | undefined>();
  return (
    <div>
      {/* toolbar */}
      <div className="px-8 py-4 border-b flex justify-between">
        <h1 className="text-lg font-bold">{board?.name}</h1>
        <div className="flex gap-2">
          <Button as="button" className="btn-sm">
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
                d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            サブタスクを表示
          </Button>
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
      </div>
      {/* board */}
      <ul className="flex gap-4 p-4 w-screen overflow-x-auto">
        {/* list */}
        {board?.lists?.map((list) => (
          <li
            key={list.id}
            className="min-w-[400px]"
            onClick={() => setSelectedList(list)}
          >
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
                    onClick={() => {
                      setSelectedTask(task);
                      taskModalDialogRef.current?.showModal();
                    }}
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
                        onBlur={async () => {
                          // 未入力のときはキャンセル
                          if (!newTaskState.text) {
                            return dispatchNewTaskState({
                              type: 'CLOSE',
                            });
                          }
                          // 入力されているときは追加
                          await addTask(board.id, list.id, {
                            name: newTaskState.text,
                            isSubTask: false,
                          });
                          // ローカルデータの更新
                          mutate();
                          dispatchNewTaskState({
                            type: 'CLOSE',
                          });
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
      <TaskModalDialog
        ref={taskModalDialogRef}
        boardId={board?.id ?? ''}
        listId={selectedList?.id ?? ''}
        taskId={selectedTask?.id ?? ''}
      />
    </div>
  );
}
