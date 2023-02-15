import { AgGridReact } from "ag-grid-react";
import { createContext, PropsWithChildren, useContext } from "react";

type IGridFilterCallback<T = unknown> = (row: T, index: number, rowData: T[]) => boolean;

type IGridFilter<T = any> = {
  callback: IGridFilterCallback<T>;
};

const GridFilterContext = createContext<
  | {
      setFilters: (filters: IGridFilter[]) => void;
    }
  | undefined
>(undefined);

export const GridFilterProvider = ({
  agGridRef,
  children,
}: PropsWithChildren<{ agGridRef: React.RefObject<AgGridReact> }>) => {
  return (
    <GridFilterContext.Provider
      value={{
        setFilters: (filters: IGridFilter[]) => {
          const agGrid = agGridRef.current;

          if (agGrid?.api) {
            agGrid.api.setIsExternalFilterPresent(() => filters.length > 0);
            agGrid.api.setDoesExternalFilterPass((node) => {
              const row = node.data;

              const doesAllFilterPass = filters.every(({ callback }) => {
                const doesFilterPass = callback(row, node.rowIndex ?? 0, agGrid.props.rowData ?? []);
                return doesFilterPass;
              });

              return doesAllFilterPass;
            });

            agGrid.api.onFilterChanged();
          }
        },
      }}
    >
      {children}
    </GridFilterContext.Provider>
  );
};

export const useGridFilter = <T,>() => {
  const context = useContext(GridFilterContext);

  if (context == null) {
    throw new Error("useExtra must be used within a GridFilterContext");
  }

  return {
    setFilters: (expression: GridFilterExpression<T>) => {
      context.setFilters(expression.filters);
    },
    resetFilters: () => {
      context.setFilters([]);
    },
  };
};

class GridFilterExpression<T> {
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

export const GridFilter = <T,>() => new GridFilterExpression<T>();
