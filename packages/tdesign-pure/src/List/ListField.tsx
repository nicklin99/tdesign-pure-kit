import { defineComponent, type PropType, reactive } from "vue";
import { type FormRule } from "tdesign-vue-next";
import { AddCircleIcon, MinusCircleIcon } from "tdesign-icons-vue-next";

export const TListField = defineComponent({
  name: "TListField",
  props: {
    /**
     * 字段名称
     */
    name: {
      type: String as PropType<string>,
      required: true,
    },
    /**
     * 字段初始化数据
     */
    data: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
    /**
     * 表单规则
    */
    rules: {
      type: Array as PropType<FormRule[]>,
      default: () => [],
    },
    /**
     * 添加图标
     */
    AddIcon: {
      type: Function as PropType<any>,
    },
    /**
     * 删除图标
     */
    MinusIcon: {
      type: Function as PropType<any>,
    },
  },
  setup(props, { slots }) {
    const { name, rules } = props;
    const opts = reactive(props.data);
    const add = () => {
      opts.push("");
    };
    const remove = (i: number) => {
      opts.splice(i, 1);
    };
    return () => {
      const { MinusIcon, AddIcon } = props;
      const MinusIconComp = MinusIcon  || MinusCircleIcon
      const AddIconComp = AddIcon || AddCircleIcon
      return (
        <div style="display:flex; flex-direction:column; gap:10px">
        {props.data.map((_, i) => (
          <t-form-item name={`${name}.${i}`} label-width="0" rules={rules}>
            <div style="display:flex; gap:10px">
              {slots.default && slots.default({
                idx: i,
              })}
              {props.data.length > 1 && (
                <MinusIconComp
                  size="30px"
                  style={{ marginLeft: "10px", cursor: "pointer" }}
                  onClick={() => remove(i)}
                />
              )}
              <AddIconComp
                style={{ cursor: "pointer" }}
                size="30px"
                onClick={() => add()}
              />
            </div>
          </t-form-item>
        ))}
      </div>
      )
    }
  },
});
