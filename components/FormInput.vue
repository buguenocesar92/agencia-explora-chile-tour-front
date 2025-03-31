<template>
  <div class="form-group">
    <label :for="id" class="block text-gray-700 font-medium mb-1">
      {{ label }}
    </label>

    <!-- Para inputs que NO son de tipo file -->
    <template v-if="type !== 'file'">
      <input
        :id="id"
        :value="modelValue"
        @input="handleInput"
        :type="type"
        :required="required"
        :placeholder="placeholder"
        :class="[
          'w-full border px-3 py-2 rounded focus:outline-none focus:ring-2',
          error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
        ]"
      />
    </template>

    <!-- Para input de tipo file (sin binding de value) -->
    <template v-else>
      <input
        :id="id"
        type="file"
        @change="handleInput"
        :required="required"
        :class="[
          'w-full border px-3 py-2 rounded focus:outline-none focus:ring-2',
          error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
        ]"
      />
    </template>

    <p v-if="error" class="text-red-500 text-sm mt-1">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps({
  id: { type: String, required: true },
  label: { type: String, required: true },
  modelValue: { type: [String, Number, File, null], required: true },
  error: { type: String, default: '' },
  type: { type: String, default: 'text' },
  required: { type: Boolean, default: false },
  placeholder: { type: String, default: '' },
});

const emit = defineEmits(['update:modelValue']);

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.type === 'file') {
    emit('update:modelValue', target.files ? target.files[0] : null);
  } else {
    emit('update:modelValue', target.value);
  }
};
</script>

<style scoped>
.form-group input:disabled {
  background-color: #f3f4f6;
  cursor: not-allowed;
}
</style>
