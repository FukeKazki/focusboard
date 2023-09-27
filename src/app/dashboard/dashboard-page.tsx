import {
  ArrowUpDownIcon,
  CheckCircleIcon,
  EyeIcon,
  EyeSlashIcon,
  PlusIcon,
  cn,
} from "lib/shared/ui";
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
              <EyeIcon className="h-4 w-4" />
              サブタスクを表示
            </div>
            <div className="swap-off flex items-center gap-2">
              <EyeSlashIcon className="h-4 w-4" />
              サブタスクを非表示
            </div>
          </label>
          <button className="btn-sm btn">
            <ArrowUpDownIcon />
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
                  <PlusIcon />
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
                      "card-bordered card cursor-pointer rounded-md shadow-sm",
                    )}
                    onClick={() => {
                      dispatchDashboardState({ type: "SELECT_TASK", task });
                      taskModalDialogRef.current?.showModal();
                    }}
                  >
                    <div className="card-body">
                      <p className="card-title text-lg font-normal">
                        <CheckCircleIcon />
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
                      <PlusIcon />
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
                  <PlusIcon />
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
              <PlusIcon />
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
