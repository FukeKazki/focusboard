import { createContext, useContext, useReducer } from "react";
import { List, Task } from "../../feature/type";

type State = {
  selectedTask: Task | undefined;
  selectedList: List | undefined;
};

type Action =
  | {
      type: "SELECT_TASK";
      task: Task;
    }
  | {
      type: "UNSELECT_TASK";
    }
  | {
      type: "SELECT_LIST";
      list: List;
    }
  | {
      type: "UNSELECT_LIST";
    };

export const dashboardReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SELECT_TASK":
      return {
        ...state,
        selectedTask: action.task,
      };
    case "UNSELECT_TASK":
      return {
        ...state,
        selectedTask: undefined,
      };
    case "SELECT_LIST":
      return {
        ...state,
        selectedList: action.list,
      };
    case "UNSELECT_LIST":
      return {
        ...state,
        selectedList: undefined,
      };
  }
};

const DashboardContext = createContext<{
  dashboardState: State;
  dispatchDashboardState: React.Dispatch<Action>;
}>({
  dashboardState: {
    selectedTask: undefined,
    selectedList: undefined,
  },
  dispatchDashboardState: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
});

export const useDashboard = () => useContext(DashboardContext);

export const DashboardProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [dashboardState, dispatchDashboardState] = useReducer(
    dashboardReducer,
    {
      selectedTask: undefined,
      selectedList: undefined,
    }
  );

  return (
    <DashboardContext.Provider
      value={{ dashboardState, dispatchDashboardState }}
    >
      {children}
    </DashboardContext.Provider>
  );
};
