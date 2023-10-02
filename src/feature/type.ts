import { DocumentReference } from "firebase/firestore";

/**
 * Application Types
 **/

export type Task = {
  id: string;
  name: string;
  parent?: DocumentReference;
  children?: DocumentReference[];
  isSubTask: boolean;
};

export type List = {
  id: string;
  name: string;
  order: string[];
  // tasks: Task[];
};

export type Board = {
  id: string;
  name: string;
  lists: List[];
  columns: {
    listId: string;
    taskIds: string[];
  }[];
};

export type Workspace = {
  id: string;
  boards: Board[];
};
