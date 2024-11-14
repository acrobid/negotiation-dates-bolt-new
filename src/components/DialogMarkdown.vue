<template>
  <dialog ref="dialogRef" :class="{ modal: true }">
    <div class="dialog-content">
      <header v-if="title" class="dialog-header">
        <h2>{{ title }}</h2>
        <button class="close-button" @click="closeDialog">&times;</button>
      </header>
      <div class="dialog-body" v-html="bodyContent" />
      <div class="dialog-body">
        <slot></slot>
      </div>
      <footer v-if="$slots.footer" class="dialog-footer">
        <slot name="footer">
          <button @click="closeDialog">Close</button>
        </slot>
      </footer>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { ref, useTemplateRef, watchEffect } from "vue";

const markdown = import.meta.glob<typeof import("*.md")>("../assets/**.md", {
  eager: true,
});

const props = defineProps<{
  title?: string;
  markdownFile: string;
}>();

const bodyContent = ref("");

const emit = defineEmits<{
  "update:isOpen": [value: boolean];
}>();

const dialogRef = useTemplateRef("dialogRef");

const openDialog = () => {
  if (dialogRef.value) {
    dialogRef.value.showModal();
  }
};

const closeDialog = () => {
  if (dialogRef.value) {
    dialogRef.value.close();
    emit("update:isOpen", false);
  }
};

watchEffect(async () => {
  if (props.markdownFile) {
    try {
      const result = markdown[`../assets/${props.markdownFile}`];
      if (result) {
        bodyContent.value = result.html;
      } else {
        throw new Error("Markdown file not found");
      }
    } catch (error) {
      console.error(`Error loading markdown file: ${error}`);
      bodyContent.value = "Error loading content";
    }
  }
});

defineExpose({
  openDialog,
  closeDialog,
});
</script>

<style scoped>
.modal {
  display: none;
  transition-property: display, opacity;
  transition-behavior: allow-discrete;
  transition-duration: 0.3s;

  opacity: 0;
}

.modal[open] {
  display: block;
  @starting-style {
    opacity: 0;
  }
  opacity: 1;
}

.modal[open]::backdrop {
  display: none;
  /* background: rgba(0, 0, 0, 0.5); */
}

.modal {
  border: none;
  border-radius: 6px;
  padding: 0;
  max-width: 500px;
  width: 90%;
  margin: 0 auto;
  overflow-y: auto;
}

.modal::backdrop {
  background: rgba(0, 0, 0, 0.5);
}

.dialog-content {
  padding: 1rem;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;

  top: 0;
  position: sticky;
  background-color: #333;
  color: white;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}

.dialog-footer {
  margin-top: 1rem;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

:deep(.dialog-body p) {
  margin-bottom: 2em; /* Increase spacing between paragraphs */
}
</style>
