<script setup lang="ts">
import CopyButton from '@/components/atoms/CopyButton.vue'

// Citation text for the CellML Model Repository.
const citationText =
  'Lloyd, C.M., Lawson, J.L., Hunter, P.J. and Nielsen, P.F. The CellML Model Repository. Bioinformatics. 2008 September;24(18):2122-2123.'
</script>

<template>
  <div>
    <p>
      To reference the CellML model repository please cite the following publication:
    </p>

    <div class="group relative mt-4">
      <code>
        {{ citationText }}
      </code>
      <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <CopyButton
          :text="citationText"
          title="Copy citation"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
@reference 'tailwindcss';
@reference '@/assets/main.css';

code {
  @apply block text-sm! m-0! p-4 pr-8 bg-gray-50 dark:bg-gray-900 rounded-md;
}

h3 {
  @apply text-lg font-semibold mt-6 mb-2;
}

p + p,
p + ul,
ul + p {
  @apply mt-4;
}

ul {
  @apply list-disc list-inside mb-4 pl-4;
}

li {
  @apply mb-1;
}
</style>
