import { User } from 'firebase/auth';
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
} from 'firebase/firestore';
import { Board, Task } from './type';
import { firestore } from '../../main';
import useSWR from 'swr';

class ApiService {
  firestore: Firestore;

  constructor(firestore: Firestore) {
    this.firestore = firestore;
  }

  async fetchBoards(user: User) {
    const boardRef = collection(
      this.firestore,
      'workspaces',
      user.uid ?? '',
      'boards'
    );
    const boardSnapshots = await getDocs(boardRef);
    const boards = await Promise.all(
      boardSnapshots.docs.map(async (doc) => {
        return { id: doc.id, ...doc.data() } as Board;
      })
    );
    return boards;
  }

  async fetchTask(
    user: User,
    input:
      | DocumentReference
      | {
          boardId: string;
          listId: string;
          taskId: string;
        }
  ) {
    if (input instanceof DocumentReference) {
      const taskRef = await getDoc(input);
      return { id: taskRef.id, ...taskRef.data() } as Task;
    }
    const ref = doc(
      this.firestore,
      'workspaces',
      user.uid,
      'boards',
      input.boardId,
      'lists',
      input.listId,
      'tasks',
      input.taskId
    );
    const taskRef = await getDoc(ref);
    return { id: taskRef.id, ...taskRef.data() } as Task;
  }

  async fetchBoard(user: User, boardId: string) {
    const ref = doc(this.firestore, 'workspaces', user.uid, 'boards', boardId);
    const boardRef = await getDoc(ref);
    const lists = await this.fetchLists(boardRef);
    return { id: boardRef.id, ...boardRef.data(), lists } as Board;
  }
  private async fetchLists(boardDoc: DocumentSnapshot) {
    const listsRef = collection(boardDoc.ref, 'lists');
    const listSnapshots = await getDocs(listsRef);
    const lists = await Promise.all(
      listSnapshots.docs.map(async (doc) => {
        const tasks = await this.fetchTasks(doc.ref);
        return { id: doc.id, ...doc.data(), tasks };
      })
    );
    return lists;
  }
  private async fetchTasks(listRef: DocumentReference) {
    const tasksRef = collection(listRef, 'tasks');
    const q = query(tasksRef, where('isSubTask', '==', false));
    // subTask除外する
    // kirikaeru
    const taskSnapshots = await getDocs(q);
    const tasks = taskSnapshots.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return tasks;
  }

  async addTask(user: User, boardId: string, listId: string, input: any) {
    const boardRef = collection(
      firestore,
      'workspaces',
      user.uid ?? '',
      'boards',
      boardId,
      'lists',
      listId,
      'tasks'
    );
    await addDoc(boardRef, input);
  }

  async updateTask(
    user: User,
    boardId: string,
    listId: string,
    taskId: string,
    input: any
  ) {
    const taskRef = doc(
      this.firestore,
      'workspaces',
      user.uid,
      'boards',
      boardId,
      'lists',
      listId,
      'tasks',
      taskId
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
    }
  ) {
    const res = await this.addTask(user, boardId, listId, {
      ...input,
      isSubTask: true,
    });

    await this.updateTask(user, boardId, listId, input.parent, {
      children: arrayUnion(res),
    });
  }
}

export const useApiService = () => {
  const apiService = new ApiService(firestore);

  const useBoards = (user: User | null | undefined) =>
    useSWR(
      ['boards', user],
      () => {
        if (!user) {
          return;
        }
        return apiService.fetchBoards(user);
      },
      {
        revalidateOnFocus: false,
      }
    );

  const useTask = (
    user: User | null | undefined,
    input:
      | DocumentReference
      | { boardId: string; listId: string; taskId: string }
  ) => {
    return useSWR(
      ['task', user, input],
      async () => {
        if (!user) {
          return;
        }
        return apiService.fetchTask(user, input);
      },
      {
        revalidateOnFocus: false,
      }
    );
  };

  const useBoard = (user: User | null | undefined, boardId: string) => {
    return useSWR(
      ['board', user, boardId],
      async () => {
        if (!user) {
          return;
        }
        return apiService.fetchBoard(user, boardId);
      },
      {
        revalidateOnFocus: false,
      }
    );
  };

  const useAddTask = (user: User | null | undefined) => ({
    addTask: (boardId: string, listId: string, input: any) => {
      if (!user) {
        return;
      }
      return apiService.addTask(user, boardId, listId, input);
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

  return {
    useBoards,
    useTask,
    useBoard,
    useAddTask,
    useAddSubTask,
  };
};
