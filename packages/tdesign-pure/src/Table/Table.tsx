import { Table, type TableProps } from "tdesign-vue-next";
import { inject, type SetupContext } from "vue";
import type { ContextProps } from "../types";
import { provideKey } from "../const";

export type ListTableProps = {
  /**
   * 总条数
   * 
   * @default 0
   */
  total: number; 
} & TableProps  
export function TListTable (props: ListTableProps, { slots }: SetupContext) {
  const ctx = inject<ContextProps>(provideKey);
  const { pagination, total } = props
  if (!pagination?.pageSize && ctx?.pagination?.pageSize) {
    pagination!.pageSize = ctx?.pagination?.pageSize;
  }
  return (
    <Table
      disableDataPage
      {...props}
      pagination={{
        ...pagination,
        total,
      }}
      onPageChange={(pageInfo) => {
        pagination!.current = pageInfo.current;
        pagination!.pageSize = pageInfo.pageSize;
      }}
      v-slots={slots}
    ></Table>
  );
};

