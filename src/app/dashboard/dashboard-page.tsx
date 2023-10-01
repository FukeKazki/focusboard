import {
  ArrowUpDownIcon,
  EyeIcon,
  EyeSlashIcon,
  PlusIcon,
} from "lib/shared/ui";
import { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { TaskModalDialog } from "./components/task-modal-dialog";
import { Board, Task } from "../feature/type";
import { useUser } from "../feature/user-hook";
import { useApiService } from "../feature/api-service-hook";
import { DashboardProvider, useDashboard } from "./hooks/dashboard-state";
import {
  closestCorners,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { KeyedMutator } from "swr";
import { DashboarList } from "./components/dashboard-list";

const DashboardPagePresenter = ({
  board,
  mutate,
  updateColumn,
}: {
  board: Board | undefined;
  mutate: KeyedMutator<Board | undefined>;
  updateColumn: (...v: any) => any;
}) => {
  const taskModalDialogRef = useRef<HTMLDialogElement>(null);

  const { dispatchDashboardState } = useDashboard();
  const [showSubTask, setShowSubTask] = useState(false);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // ╭──────────────────────────────────────────────────────────╮
  // │  同じ列内での移動                                        │
  // ╰──────────────────────────────────────────────────────────╯
  const handleDragEnd = async (event: DragEndEvent) => {
    // id: 移動したカードのid
    const activeId = event.active.id;
    const overId = event.over?.id;
    if (!overId) return;
    if (activeId === overId) return;
    // activeList: 移動したカードが所属するリスト
    const activeList = board?.columns?.find((column) =>
      column.taskIds.find((id) => id === activeId),
    );
    // activeTaskIndex: 移動したカードが所属するリスト内でのインデックス
    const activeTaskIndex = activeList?.taskIds.findIndex(
      (id) => id === activeId,
    );
    // overTaskIndex: 移動先のカードが所属するリスト内でのインデックス
    const overTaskIndex = activeList?.taskIds.findIndex((id) => id === overId);
    if (activeTaskIndex === undefined || overTaskIndex === undefined) return;
    const res = board?.columns?.map((column) => {
      if (column.listId === activeList?.listId) {
        const taskIds = arrayMove(
          column.taskIds,
          activeTaskIndex,
          overTaskIndex,
        );
        return {
          ...column,
          taskIds,
        };
      }
      return column;
    });
    await updateColumn(board?.id, board, { columns: res });
    mutate({
      ...board,
      columns: res,
    });
  };

  // ╭──────────────────────────────────────────────────────────╮
  // │  別カラムへの移動                                        │
  // ╰──────────────────────────────────────────────────────────╯
  const handleDragOver = async (event: DragOverEvent) => {
    const { delta } = event;
    if (!event.over?.id) return;
    const activeId = String(event.active.id);
    const overId = String(event.over.id);
    const activeColumn = board?.columns?.find((column) =>
      column.taskIds.includes(activeId),
    );
    const overColumn = board?.columns?.find((column) =>
      column.taskIds.includes(overId),
    );
    if (!activeColumn || !overColumn || activeColumn === overColumn) {
      return null;
    }
    const activeItems = activeColumn.taskIds;
    const overItems = overColumn.taskIds;
    const activeIndex = activeItems.findIndex((i) => i === activeId);
    const overIndex = overItems.findIndex((i) => i === overId);
    const newIndex = () => {
      const putOnBelowLastItem =
        overIndex === overItems.length - 1 && delta.y > 0;
      const modifier = putOnBelowLastItem ? 1 : 0;
      return overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
    };
    const res = board?.columns?.map((c) => {
      if (c.listId === activeColumn.listId) {
        c.taskIds = activeItems.filter((i) => i !== activeId);
        return c;
      } else if (c.listId === overColumn.listId) {
        c.taskIds = [
          ...overItems.slice(0, newIndex()),
          activeItems[activeIndex],
          ...overItems.slice(newIndex(), overItems.length),
        ];
        return c;
      } else {
        return c;
      }
    });

    await updateColumn(board?.id, board, { columns: res });
    mutate({
      ...board,
      columns: res,
    });
  };

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
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
        >
          {board?.columns?.map((column) => (
            <DashboarList key={column.listId} column={column} />
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
        </DndContext>
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
  const { useBoard, useUpdateBoard } = useApiService();
  const { data: board, mutate } = useBoard(currentUser, id as string);
  const { updateColumn } = useUpdateBoard(currentUser);

  // TODO: mutate は useTask の callback に渡すか useSWRConfigのmutateを使う
  return (
    <DashboardProvider>
      <DashboardPagePresenter
        board={board}
        updateColumn={updateColumn}
        mutate={mutate}
      />
    </DashboardProvider>
  );
}
