<!-- 自定义theme fileListDisplay 不生效 -->
<template>
  <t-upload
    ref="uploadRef"
    v-model="files"
    :theme="uploaderTheme"
    :tips="tips"
    :accept="accept"
    :request-method="handleUploadImage"
    :onChange="handleFileListChange"
    :multiple="multiple"
    :max="max"
    :sizeLimit="sizeLimits"
    :onValidate="onValidate"
    :draggable="
      uploaderTheme === 'custom' ||
      uploaderTheme === 'image' ||
      uploaderTheme === 'file'
        ? drag
        : undefined
    "
    :upload-button="null"
    :locale="locale"
    :placeholder="placeholder"
    class="tuploader"
  >
    <template
      #fileListDisplay="{ files: displayFiles }"
      v-if="theme === 'video'"
    >
      <ul :class="`${classPrefix}-upload__card`">
        <li
          v-for="(file, fi) in displayFiles"
          :key="fi"
          :class="`${classPrefix}-upload__card-item`"
        >
          <div
            :class="[
              `${classPrefix}-upload__card-container`,
              `${classPrefix}-upload__card-box`,
            ]"
          >
            <div
              v-if="file.status === 'progress'"
              :class="[
                `${classPrefix}-upload__image-${file.status}`,
                `${classPrefix}-is-background`,
              ]"
            >
              <p>
                {{ locale?.progress?.uploadingText }}
                {{ ` ${file.percent}%` }}
              </p>
            </div>
            <div
              v-if="file.status === 'fail'"
              :class="[
                `${classPrefix}-upload__card-content`,
              ]"
            >
              <div :class="[
                `${classPrefix}-upload__card-status-wrap`,
              ]">
                <ErrorCircleFilledIcon />
              <p>{{ file.response?.error || locale?.progress?.failText }}</p>
              <div :class="`${classPrefix}-upload__card-mask`">
                <span
                  :class="`${classPrefix}-upload__card-mask-item`"
                  @click.stop
                >
                  <DeleteIcon
                    @click="
                      displayFiles.splice(fi, 1);
                      handleFileListChange(files, { trigger: 'remove' });
                    "
                  />
                </span>
              </div>
              </div>
            </div>
            <div
              v-if="file.status === 'success'"
              :class="`${classPrefix}-upload__card-content ${classPrefix}-upload__card-box`"
            >
              <video :src="file.url" width="100%" />
              <div :class="`${classPrefix}-upload__card-mask`">
                <span
                  :class="`${classPrefix}-upload__card-mask-item`"
                  @click.stop
                >
                  <BrowseIcon @click="previewVideo(file.url)" />
                </span>
                <span
                  :class="`${classPrefix}-upload__card-mask-item-divider`"
                />
                <span
                  :class="`${classPrefix}-upload__card-mask-item`"
                  @click.stop
                >
                  <DeleteIcon
                    @click="
                      files.splice(fi, 1);
                      handleFileListChange(files, { trigger: 'remove' });
                    "
                  />
                </span>
              </div>
            </div>
          </div>
        </li>
        <li
          v-if="
            props.max ? displayFiles.length < props.max : !displayFiles.length
          "
          @click="uploadRef?.triggerUpload()"
          :class="`${classPrefix}-upload__card-item`"
        >
          <div
            :class="[
              `${classPrefix}-upload__image-add`,
              `${classPrefix}-upload__card-container`,
              `${classPrefix}-upload__card-box`,
              {
                [`${classPrefix}-is-disabled`]: disabled,
              },
            ]"
          >
            <AddIcon />
            <p
              :class="[
                `${classPrefix}-size-s`,
                `${classPrefix}-upload__add-text`,
              ]"
            >
              {{ locale?.triggerUploadText?.image }}
            </p>
          </div>
        </li>
      </ul>
    </template>
    <slot />
    <template #dragContent="params" v-if="drag && uploaderTheme === 'custom'">
      <slot name="drag" v-bind="params" />
    </template>
  </t-upload>
</template>

<script setup lang="ts">
import {
  type UploadFile,
  type UploadProps,
  type UploadInstanceFunctions,
  DialogPlugin,
} from "tdesign-vue-next";
import {
  BrowseIcon,
  DeleteIcon,
  AddIcon,
  ErrorCircleFilledIcon,
} from "tdesign-icons-vue-next";
import { computed, ref, shallowRef, useSlots } from "vue";
type ThemeList = UploadProps["theme"] | "video";
type Props = {
  max?: number; // 最多个数
  multiple?: boolean; // 是否支持多选
  theme?: ThemeList; // image 图片模式
  tips?: string; // 提示文字
  accept?: UploadProps["accept"]; // 文件类型  image/* 图片 video/* 视频, 更多常见类型 https://developer.mozilla.org/zh-CN/docs/Web/HTTP/MIME_types/Common_types
  onUpload: (
    file: UploadFile,
    _ref: typeof uploadRef
  ) => Promise<{ url: string }>; // 上传回调
  sizeLimit?: string;
  drag?: boolean;
  placeholder?: string;
  locale?: UploadProps["locale"]; // 语言
  disabled?: boolean;
  classPrefix?: string;
};
const props = withDefaults(defineProps<Props>(), {
  theme: "image" as ThemeList,
  tips: "",
  accpet: "image/*" as UploadProps["accept"],
  max: 0,
  sizeLimit: "",
  drag: false,
  classPrefix: "t",
});
const sizeMatchRet = props.sizeLimit.match(/(\d+)(\D+)/);
const sizeLimits = sizeMatchRet
  ? {
      size: sizeMatchRet[1],
      unit: sizeMatchRet[2],
    }
  : undefined;
const model = defineModel<string | string[]>();
const uploadRef = shallowRef<UploadInstanceFunctions>();
const initFiles = () => {
  return model.value
    ? [
        {
          status: "success",
          url: model.value,
        },
      ]
    : [];
};
const { multiple, theme, drag } = props;
const slots = useSlots();

const uploaderTheme = computed(() => {
  if (drag && slots.drag) {
    return "custom";
  } else {
    if (theme === "video") {
      return "file";
    }
    return theme;
  }
});

const defaultFiles = initFiles() as UploadFile[];
const files = ref<UploadFile[]>(defaultFiles);

const handleFileListChange: UploadProps["onChange"] = (
  files: UploadFile[],
  { trigger, index }
) => {
  // console.log(
  //   "handleFileListChange files:",
  //   files,
  //   "index:",
  //   index,
  //   "trigger:",
  //   trigger
  // );
  let ret;
  if (multiple) {
    // 多个
    ret = files.map((v) => v.url as string);
  } else {
    // 单个
    switch (trigger) {
      case "remove":
        ret = "";
        break;
      case "add":
        ret = files[0].url as string;
        break;
      case "abort":
        ret = "";
        break;
      case "progress":
      case "progress-fail":
      case "progress-success":
      default:
    }
  }
  model.value = ret;
  emits("change", ret);
};

const handleUploadImage: UploadProps["requestMethod"] = async (uploadFiles) => {
  // console.log("uploadFiles:", uploadFiles);
  let file: UploadFile;
  if (uploadFiles instanceof Array) {
    // 多传, tdesign组件多选实际会跳用多次
    file = uploadFiles[0] as UploadFile;
  } else {
    // 单传
    file = uploadFiles as UploadFile;
  }
  try {
    const data = await props.onUpload(file, uploadRef);
    // 设置 file.percent 更新上传进度
    return Promise.resolve({
      status: "success",
      response: {
        url: data.url,
      },
    });
  } catch (error) {
    return Promise.resolve({
      status: "fail",
      error: error as string,
      response: {},
    });
  }
};
const onValidate: UploadProps["onValidate"] = ({ type, files }) => {
  // console.log("onValidate:", type, files);
  if (type === "FILE_OVER_SIZE_LIMIT" || type === "FILES_OVER_LENGTH_LIMIT") {
    emits("oversize", files);
  }
};

const previewVideo = (uri: string) => {
  console.log("previewVideo:", uri);
  // TODO: 预览视频
  DialogPlugin({
    header: "预览视频",
    destroyOnClose: true,
    footer: false,
    body: (h) => h("video", { src: uri, controls: true, width: "100%" }),
  });
};

const emits = defineEmits<{
  (event: "change", value?: string | string[]): void;
  (event: "oversize", files: UploadFile[]): void;
}>();
</script>

<style scoped>
.tuploader {
  /* 名称长度太长自动换行 */
  :global(.t-upload__card-item) {
    width: 110px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-break: break-all;
    white-space: normal;
  }
  /* 名称自动换行 */
  :global(.t-upload__card-name) {
    display: inline;
  }
  /* 上传失败文本优化 */
  :global(.t-upload__card-box p) {
    padding: 0 6px;
  }
  :global(.t-upload__dragger) {
    /*  */
    flex-wrap: wrap;
  }
}
</style>
