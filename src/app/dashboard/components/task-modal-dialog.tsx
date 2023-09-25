import { Button } from 'lib/shared/ui';
import { ComponentPropsWithoutRef, forwardRef, useReducer } from 'react';
import useSWR from 'swr';
import { DocumentReference, getDoc } from 'firebase/firestore';
import { Task } from '../../feature/type';
import { useUser } from '../../feature/user-hook';
import { useApiService } from '../../feature/api-service-hook';
import { useDashboard } from '../hooks/dashboard-state';

type Props = {
  boardId: string;
  handleSelectSubTask: (subTask: Task) => void;
} & ComponentPropsWithoutRef<'dialog'>;

const fetchSubTasks = async (subTaskIds: DocumentReference[]) => {
  const subTasks = await Promise.all(
    subTaskIds.map(async (subTaskId) => {
      const subTaskRef = await getDoc(subTaskId);
      return { id: subTaskRef.id, ...subTaskRef.data() } as Task;
    })
  );
  return subTasks;
};

type State =
  | {
    visible: false;
  }
  | {
    visible: true;
    text: string;
  };

type Action =
  | {
    type: 'OPEN';
  }
  | {
    type: 'CLOSE';
  }
  | {
    type: 'CHANGE_TEXT';
    text: string;
  };

const reducer = (_state: State, action: Action): State => {
  switch (action.type) {
    case 'OPEN':
      return {
        visible: true,
        text: '',
      };
    case 'CLOSE':
      return {
        visible: false,
      };
    case 'CHANGE_TEXT':
      return {
        visible: true,
        text: action.text,
      };
  }
};

export const TaskModalDialog = forwardRef<HTMLDialogElement, Props>(
  ({ boardId, handleSelectSubTask, ...props }, ref) => {
    const { currentUser } = useUser();
    const { dashboardState } = useDashboard();
    const { useTask, useAddSubTask } = useApiService();
    const { data, mutate: mutateTask } = useTask(currentUser, {
      boardId: boardId,
      listId: dashboardState.selectedList?.id ?? '',
      taskId: dashboardState.selectedTask?.id ?? '',
    });
    const { addSubTask } = useAddSubTask(currentUser);

    const { data: subTasks } = useSWR(
      () => ['subTasks/?id=' + data?.id ?? null, data?.children ?? []],
      async () => {
        return fetchSubTasks(data?.children ?? []);
      }
    );
    const [newTaskState, dispatchNewTaskState] = useReducer(reducer, {
      visible: false,
    });
    // TODO fetchParentTask
    return (
      <dialog className="modal" ref={ref} {...props}>
        <div className="modal-box max-w-5xl">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          {data?.parent && (
            <div className="flex gap-1 items-center cursor-pointer text-gray-500 hover:underline mb-1">
              {data.parent.id}
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
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </div>
          )}
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
            {data?.name}
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
              {subTasks?.map((subTask) => (
                <li
                  key={subTask.id}
                  onClick={() => handleSelectSubTask(subTask)}
                >
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
                      {subTask.name}
                    </p>
                  </div>
                </li>
              ))}
              {newTaskState.visible && (
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
                          if (!dashboardState.selectedList?.id) {
                            return;
                          }
                          if (!dashboardState.selectedTask?.id) {
                            return;
                          }
                          // 入力されているときは追加
                          await addSubTask(
                            boardId,
                            dashboardState.selectedList.id,
                            {
                              name: newTaskState.text,
                              parent: dashboardState.selectedTask.id,
                            }
                          );
                          // ローカルデータの更新
                          mutateTask();
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
                    </p>
                  </div>
                </li>
              )}
            </ul>
            <Button
              as="button"
              className="btn-sm mt-4"
              onClick={async () => {
                dispatchNewTaskState({
                  type: 'OPEN',
                });
              }}
            >
              サブタスクを追加
            </Button>
          </div>
        </div>
      </dialog>
    );
  }
);
