import type { TableProps } from "tdesign-vue-next";
import { defineComponent, provide, reactive, type PropType } from "vue";
import { provideKey } from "./const";

export const TContextProvider = defineComponent({
  name: "TContextProvider",
  props: {
    pagination: {
      type: Object as PropType<TableProps["pagination"]>,
      default: () => ({ pageSize: 10}),
    },
  },
  setup(props, { slots }) {
    const ctx = reactive({
      pagination: {
        ...props.pagination,
      },
    });
    provide(provideKey, ctx);
    return () => (slots.default ? slots.default() : null);
  },
});
