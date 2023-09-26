import { cn } from "lib/shared/ui";
import { useReducer, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { TaskModalDialog } from "./components/task-modal-dialog";
import { Board, Task } from "../feature/type";
import { useUser } from "../feature/user-hook";
import { useApiService } from "../feature/api-service-hook";
import { DashboardProvider, useDashboard } from "./hooks/dashboard-state";

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
      type: "OPEN";
      listId: string;
    }
  | {
      type: "CLOSE";
    }
  | {
      type: "CHANGE_TEXT";
      text: string;
    };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "OPEN":
      return {
        visible: true,
        listId: action.listId,
        text: "",
      };
    case "CLOSE":
      return {
        visible: false,
      };
    case "CHANGE_TEXT":
      return {
        visible: true,
        listId: state.visible ? state.listId : "",
        text: action.text,
      };
  }
};

const DashboardPagePresenter = ({
  board,
  addTask,
  mutate,
}: {
  board: Board | undefined;
  addTask: (...v: any) => void;
  mutate: () => void;
}) => {
  const taskModalDialogRef = useRef<HTMLDialogElement>(null);

  const [newTaskState, dispatchNewTaskState] = useReducer(reducer, {
    visible: false,
  });
  const { dispatchDashboardState } = useDashboard();
  const [showSubTask, setShowSubTask] = useState(false);

  return (
    <div>
      {/* toolbar */}
      <div className="flex justify-between border-b px-8 py-4">
        <h1 className="text-lg font-bold">{board?.name}</h1>
        <div className="flex gap-2">
          <label className="swap btn-sm btn">
            <input type="checkbox" onChange={() => setShowSubTask((v) => !v)} />
            <div className="swap-on flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6"
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
            </div>
            <div className="swap-off flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                />
              </svg>
              サブタスクを非表示
            </div>
          </label>
          <button className="btn-sm btn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
              />
            </svg>
            ソート
          </button>
        </div>
      </div>
      {/* board */}
      <ul className="flex w-screen gap-4 overflow-x-auto p-4">
        {/* list */}
        {board?.lists?.map((list) => (
          <li
            key={list.id}
            className="min-w-[400px]"
            onClick={() =>
              dispatchDashboardState({ type: "SELECT_LIST", list })
            }
          >
            <div className="flex justify-between">
              <p className="text-2xl">{list.name}</p>
              <div className="grid grid-cols-2 gap-1">
                <button className="btn-square btn-sm btn">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                </button>
                <div className="dropdown-end dropdown">
                  <label tabIndex={0}>
                    <button className="btn-square btn-sm btn">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="h-6 w-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                        />
                      </svg>
                    </button>
                  </label>
                  <ul
                    tabIndex={0}
                    className="dropdown-content menu rounded-box z-[1] w-52 bg-base-100 p-2 shadow"
                  >
                    <li>
                      <button>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="h-4 w-4"
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
                          className="h-4 w-4"
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
            <ul className="mt-4 grid gap-2">
              {list.tasks.map((task) => (
                <li
                  key={task.id}
                  className={showSubTask && task.isSubTask ? "hidden" : "block"}
                >
                  <div
                    className={cn(
                      "card-bordered card cursor-pointer rounded-md border-gray-200 shadow-sm",
                      task.isSubTask && "border-gray-100",
                    )}
                    onClick={() => {
                      dispatchDashboardState({ type: "SELECT_TASK", task });
                      taskModalDialogRef.current?.showModal();
                    }}
                  >
                    <div className="card-body">
                      <p className="card-title text-lg font-normal">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="h-6 w-6"
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
                  <div className="card-bordered card card-body cursor-pointer rounded-md">
                    <div className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="h-6 w-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <input
                        type="text"
                        className="input h-auto w-full"
                        placeholder="タスクを追加"
                        autoFocus
                        // フォーカスが外れたとき
                        onBlur={async () => {
                          // 未入力のときはキャンセル
                          if (!newTaskState.text) {
                            return dispatchNewTaskState({
                              type: "CLOSE",
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
                            type: "CLOSE",
                          });
                        }}
                        value={newTaskState.text}
                        onChange={(e) =>
                          dispatchNewTaskState({
                            type: "CHANGE_TEXT",
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
                <button
                  className="btn-block btn"
                  onClick={() =>
                    dispatchNewTaskState({
                      type: "OPEN",
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
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                  タスクを追加
                </button>
              </li>
            </ul>
          </li>
        ))}
        {/* add list */}
        <li className="min-w-[400px]">
          <div className="flex justify-between">
            <button className="btn-block btn">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              セクションを追加
            </button>
          </div>
        </li>
      </ul>
      <TaskModalDialog
        ref={taskModalDialogRef}
        boardId={board?.id ?? ""}
        handleSelectSubTask={(selectedSubTask: Task) => {
          dispatchDashboardState({
            type: "SELECT_TASK",
            task: selectedSubTask,
          });
        }}
      />
    </div>
  );
};
export function DashboardPage() {
  const { id } = useParams();
  const { currentUser } = useUser();
  const { useBoard, useAddTask } = useApiService();
  const { data: board, mutate } = useBoard(currentUser, id as string);
  const { addTask } = useAddTask(currentUser);

  // TODO: mutate は useTask の callback に渡す
  return (
    <DashboardProvider>
      <DashboardPagePresenter board={board} addTask={addTask} mutate={mutate} />
    </DashboardProvider>
  );
}
