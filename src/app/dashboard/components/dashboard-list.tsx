import { CheckCircleIcon, PlusIcon } from "lib/shared/ui";
import { DroppableColumn } from "./droppable-column";
import { memo, useReducer } from "react";
import { useUser } from "../../feature/user-hook";
import { useApiService } from "../../feature/api-service-hook";
import { useParams } from "react-router-dom";

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

type Props = {
  column: {
    listId: string;
    taskIds: string[];
  };
};
export const DashboarList = memo(({ column }: Props) => {
  const { id } = useParams();
  const { currentUser } = useUser();
  const { useBoard, useAddTask, useUpdateBoard } = useApiService();
  const { data: board, mutate } = useBoard(currentUser, id as string);
  const { addTask } = useAddTask(currentUser);
  const { updateColumn } = useUpdateBoard(currentUser);

  // TODO: get list data
  const [newTaskState, dispatchNewTaskState] = useReducer(reducer, {
    visible: false,
  });

  return (
    <li
      key={column.listId}
      className="min-w-[400px]"
      // onClick={() =>
      //   dispatchDashboardState({ type: "SELECT_LIST", list })
      // }
    >
      <div className="flex justify-between">
        <p className="text-2xl">list.name</p>
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
      <DroppableColumn id={column.listId} order={column.taskIds} />
      <div className="mt-4 grid gap-2">
        {newTaskState.visible && newTaskState.listId === column.listId && (
          <div className="card-bordered card card-body cursor-pointer rounded-md">
            <div className="flex items-center gap-2">
              <CheckCircleIcon />
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
                  const res = await addTask(board?.id ?? "", {
                    name: newTaskState.text,
                    isSubTask: false,
                    listId: column.listId,
                  });
                  if (!res) return;
                  const newColumns = board?.columns?.map((c) => {
                    if (c.listId === column.listId) {
                      return {
                        ...c,
                        taskIds: [...c.taskIds, res.id],
                      };
                    }
                    return c;
                  });
                  if (!newColumns) return;
                  await updateColumn(board?.id ?? "", {
                    columns: newColumns,
                  });
                  // ローカルデータの更新
                  mutate({
                    ...board,
                    columns: newColumns,
                  });
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
        )}
        <button
          className="btn-block btn"
          onClick={() =>
            dispatchNewTaskState({
              type: "OPEN",
              listId: column.listId,
            })
          }
        >
          <PlusIcon />
          タスクを追加
        </button>
      </div>
    </li>
  );
});
