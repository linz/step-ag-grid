import { AgGridReact } from "ag-grid-react";
import React, { PropsWithChildren } from "react";

type IGridFilterCallback<T = unknown> = (row: T, rowData: T[]) => boolean;

type IGridFilter<T = any> = {
  callback: IGridFilterCallback<T>;
};

type Action = { type: "resetFilters" } | { type: "setFilters"; payload: IGridFilter[] };

type Dispatch = (action: Action) => void;

type State = {
  filters: IGridFilter[];
};

const GridFilterContext = React.createContext<{ state: State; dispatch: Dispatch } | undefined>(undefined);

function reducer(state: State, action: Action) {
  switch (action.type) {
    case "setFilters": {
      return {
        ...state,
        filters: [...action.payload],
      };
    }

    default:
      return {
        ...state,
        filters: [],
      };
  }
}

export const GridFilterProvider = ({
  agGridRef,
  children,
}: PropsWithChildren<{ agGridRef: React.RefObject<AgGridReact> }>) => {
  const [state, dispatch] = React.useReducer(reducer, {
    filters: [],
  });

  React.useEffect(() => {
    const agGrid = agGridRef.current;

    if (agGrid?.api) {
      const rowData = agGrid.props.rowData || [];

      if (state.filters.length > 0) {
        const filterCallbacks = state.filters.map((filter) => (row: any) => filter.callback(row, rowData));

        const filteredRowData = rowData.filter(
          (row) => filterCallbacks.filter((filterCallback) => filterCallback(row)).length === state.filters.length,
        );

        agGrid.api.setRowData(filteredRowData);
      } else {
        agGrid.api.setRowData(rowData);
      }
    }
  }, [agGridRef, state.filters]);

  return <GridFilterContext.Provider value={{ dispatch, state }}>{children}</GridFilterContext.Provider>;
};

export const useGridFilter = <T,>() => {
  const context = React.useContext(GridFilterContext);

  if (context == null) {
    throw new Error("useExtra must be used within a GridFilterContext");
  }

  const { state, dispatch } = context;

  return {
    setFilters: (builder: GridFilterBuilder<T>) => {
      dispatch({ type: "setFilters", payload: builder.filters });
    },
    resetFilters: () => {
      dispatch({ type: "resetFilters" });
    },
    state,
  };
};

class FilterExpression<T> {
  filters: IGridFilter<T>[] = [];

  addFilter(callback: IGridFilterCallback<T>) {
    this.filters.push({
      callback,
    });
    return this;
  }

  isAnyOf(field: keyof T, ...value: unknown[]) {
    this.addFilter((row) => value.find((value) => field !== undefined && value === row[field]) !== undefined);
    return this;
  }

  isEqual(field: keyof T, value: unknown) {
    this.addFilter((row) => row[field] === value);
    return this;
  }

  isGreaterThanOrEqual(field: keyof T, value: number) {
    this.addFilter((row) => row[field] >= value);
    return this;
  }

  isLessThanOrEqual(field: keyof T, value: number) {
    this.addFilter((row) => row[field] <= value);
    return this;
  }
}

class GridFilterBuilder<T> extends FilterExpression<T> {
  constructor() {
    super();
  }
}

export const GridFilter = <T,>() => new GridFilterBuilder<T>();
