<template>
  <t-form :data="formData" :rules="rules">
    <t-form-item label="联系人" required-mark>
      <TListField
        :data="formData.contacts"
        :name="`contacts`"
        :rules="rules.contacts"
        :AddIcon="AddIcon"
        :MinusIcon="MinusIcon"
      >
        <template #default="{ idx }">
          <t-input v-model="formData.contacts[idx]" />
        </template>
      </TListField>
    </t-form-item>
  </t-form>
</template>

<script setup lang="ts">
import { type FormRules } from "tdesign-vue-next";
import { AddIcon, MinusIcon } from "tdesign-icons-vue-next";
import { reactive, shallowRef } from "vue";

const formData = reactive({
  contacts: [''],
});
const rules = shallowRef<FormRules>({
  contacts: [{ required: true }],
});
</script>
