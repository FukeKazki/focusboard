import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CheckCircleIcon, cn } from "lib/shared/ui";
import { useApiService } from "../../feature/api-service-hook";
import { useUser } from "../../feature/user-hook";
import { useParams } from "react-router-dom";
import { memo } from "react";

type Props = {
  id: string;
};
export const SortableCard = memo(({ id }: Props) => {
  const params = useParams();
  const { currentUser } = useUser();
  const { useTask, useBoard } = useApiService();
  const { data: board } = useBoard(currentUser, params.id as string);
  const { data } = useTask(currentUser, {
    boardId: board?.id ?? "",
    taskId: id,
  });
  // ╭──────────────────────────────────────────────────────────╮
  // │                    ここからpresenter                     │
  // ╰──────────────────────────────────────────────────────────╯
  const { attributes, listeners, setNodeRef, transform } = useSortable({
    id: id,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div
        className={cn("card-bordered card cursor-pointer rounded-md shadow-sm")}
      >
        <div className="card-body">
          <p className="card-title text-lg font-normal">
            <CheckCircleIcon />
            {data?.name}
          </p>
          <p className="text-sm text-gray-500">9月1日</p>
        </div>
      </div>
    </div>
  );
});
