<template>
  <button
    @click="$emit('click')"
    class="w-6 h-6 hover:opacity-70 transition-opacity cursor-pointer"
    aria-label="Close"
    type="button"
  >
    <span aria-hidden="true">✕</span>
  </button>
</template>
