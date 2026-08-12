import type { TableData } from "../../types/poker";

export type TablePresentation<TData> = {
  name: string;
  active: boolean;
  data: TData | null;

  activate: (tableData: TableData) => void;
  deactivate: () => void;
};

export type TablePresentationSnapshot<TData> = {
  active: boolean;
  data: TData | null;
};