import { User } from "firebase/auth";
import {
  DocumentReference,
  DocumentSnapshot,
  Firestore,
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { Board, Task } from "./type";
import useSWR from "swr";
import { firestore } from "../lib/firebase";

class ApiService {
  firestore: Firestore;

  constructor(firestore: Firestore) {
    this.firestore = firestore;
  }

  async fetchBoards(user: User) {
    const boardRef = collection(
      this.firestore,
      "workspaces",
      user.uid ?? "",
      "boards",
    );
    const boardSnapshots = await getDocs(boardRef);
    const boards = await Promise.all(
      boardSnapshots.docs.map(async (doc) => {
        return { id: doc.id, ...doc.data() } as Board;
      }),
    );
    return boards;
  }

  async fetchTask(
    user: User,
    input: {
      boardId: string;
      taskId: string;
    },
  ) {
    const ref = doc(
      this.firestore,
      "workspaces",
      user.uid,
      "boards",
      input.boardId,
      "tasks",
      input.taskId,
    );
    const taskRef = await getDoc(ref);
    return { id: taskRef.id, ...taskRef.data() } as Task;
  }

  async fetchBoard(user: User, boardId: string) {
    const ref = doc(this.firestore, "workspaces", user.uid, "boards", boardId);
    const boardRef = await getDoc(ref);
    const lists = await this.fetchLists(boardRef);
    return { id: boardRef.id, ...boardRef.data(), lists } as Board;
  }
  private async fetchLists(boardDoc: DocumentSnapshot) {
    const listsRef = collection(boardDoc.ref, "lists");
    const listSnapshots = await getDocs(listsRef);
    const lists = await Promise.all(
      listSnapshots.docs.map(async (doc) => {
        // const tasks = await this.fetchTasks(doc.ref);
        return { id: doc.id, ...doc.data() };
      }),
    );
    return lists;
  }
  // private async fetchTasks(listRef: DocumentReference) {
  //   const tasksRef = collection(listRef, "tasks");
  //   // const q = query(tasksRef, where('isSubTask', '==', false));
  //   // subTask除外する
  //   const taskSnapshots = await getDocs(tasksRef);
  //   const tasks = taskSnapshots.docs.map((doc) => ({
  //     id: doc.id,
  //     ...doc.data(),
  //   }));
  //   return tasks;
  // }
  async updateBoard(user: User, boardId: string, input: any) {
    const boardRef = doc(
      this.firestore,
      "workspaces",
      user.uid,
      "boards",
      boardId,
    );
    await updateDoc(boardRef, input);
  }

  async addTask(user: User, boardId: string, input: any) {
    const boardRef = collection(
      firestore,
      "workspaces",
      user.uid ?? "",
      "boards",
      boardId,
      "tasks",
    );
    return await addDoc(boardRef, input);
  }

  async updateTask(user: User, boardId: string, taskId: string, input: any) {
    const taskRef = doc(
      this.firestore,
      "workspaces",
      user.uid,
      "boards",
      boardId,
      "tasks",
      taskId,
    );
    await updateDoc(taskRef, input);
  }

  async addSubTask(
    user: User,
    boardId: string,
    listId: string,
    input: {
      name: string;
      parent: string;
    },
  ) {
    const res = await this.addTask(user, boardId, listId, {
      ...input,
      parent: doc(
        this.firestore,
        "workspaces",
        user.uid,
        "boards",
        boardId,
        "tasks",
        input.parent,
      ),
      isSubTask: true,
    });

    await this.updateTask(user, boardId, input.parent, {
      children: arrayUnion(res),
    });
  }
}

export const useApiService = () => {
  const apiService = new ApiService(firestore);

  const useBoards = (user: User | null | undefined) =>
    useSWR(
      ["boards", user],
      () => {
        if (!user) {
          return;
        }
        return apiService.fetchBoards(user);
      },
      {
        revalidateOnFocus: false,
      },
    );

  const useTask = (
    user: User | null | undefined,
    input: { boardId: string; taskId: string },
  ) => {
    return useSWR(
      ["task", user, input.boardId, input.taskId],
      async () => {
        if (!user) {
          return;
        }
        return apiService.fetchTask(user, input);
      },
      {
        revalidateOnFocus: false,
      },
    );
  };

  const useBoard = (user: User | null | undefined, boardId: string) => {
    return useSWR(
      ["board", user, boardId],
      async () => {
        if (!user) {
          return;
        }
        return apiService.fetchBoard(user, boardId);
      },
      {
        revalidateOnFocus: false,
      },
    );
  };

  const useAddTask = (user: User | null | undefined) => ({
    addTask: (boardId: string, input: any) => {
      if (!user) {
        return;
      }
      return apiService.addTask(user, boardId, input);
    },
  });

  const useAddSubTask = (user: User | null | undefined) => ({
    addSubTask: (boardId: string, listId: string, input: any) => {
      if (!user) {
        return;
      }
      return apiService.addSubTask(user, boardId, listId, input);
    },
  });

  type InputUpdateColumn = Pick<Board, "columns">;
  const useUpdateBoard = (user: User | null | undefined) => ({
    updateColumn: (boardId: string, input: InputUpdateColumn) => {
      if (!user) {
        return;
      }
      return apiService.updateBoard(user, boardId, {
        ...input,
      });
    },
  });

  return {
    useBoards,
    useTask,
    useBoard,
    useAddTask,
    useAddSubTask,
    useUpdateBoard,
  };
};
