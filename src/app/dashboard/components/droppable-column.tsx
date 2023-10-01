import { useDroppable } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { SortableCard } from "./sortable-card";
import { memo } from "react";

type Props = {
  id: string;
  order: string[];
};
export const DroppableColumn = memo(({ id, order }: Props) => {
  const { setNodeRef } = useDroppable({
    id: "droppable",
  });

  return (
    <SortableContext id={id} items={order} strategy={rectSortingStrategy}>
      <ul ref={setNodeRef}>
        {order.map((key) => (
          <li key={key}>
            <SortableCard id={key} />
          </li>
        ))}
      </ul>
    </SortableContext>
  );
});
