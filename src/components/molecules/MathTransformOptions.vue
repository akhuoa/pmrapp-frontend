<script setup lang="ts">
import ActionButton from '@/components/atoms/ActionButton.vue'
import type { MathMLFormatOptions } from '@/types/mathml'

interface Props {
  hasMathsData: boolean
  transformMaths: boolean
  options: MathMLFormatOptions
}

const emit = defineEmits<{
  'update:transformMaths': [value: boolean]
  'update:options': [value: MathMLFormatOptions]
}>()

const props = defineProps<Props>()

const toggleTransformMaths = () => {
  emit('update:transformMaths', !props.transformMaths)
}

const toggleOption = (key: keyof MathMLFormatOptions) => {
  emit('update:options', {
    ...props.options,
    [key]: !props.options[key],
  })
}
</script>

<template>
  <div v-if="hasMathsData" class="flex items-center justify-end gap-1.5 flex-wrap">
    <ActionButton
      size="sm"
      :variant="transformMaths ? 'primary' : 'secondary'"
      content-section="Exposure Detail - Mathematics"
      @click="toggleTransformMaths"
    >
      Transform maths
    </ActionButton>
    <template v-if="transformMaths">
      <ActionButton
        size="sm"
        :variant="options.subscript ? 'primary' : 'secondary'"
        content-section="Exposure Detail - Mathematics"
        @click="toggleOption('subscript')"
      >
        Subscript
      </ActionButton>
      <ActionButton
        size="sm"
        :variant="options.numberFormat ? 'primary' : 'secondary'"
        content-section="Exposure Detail - Mathematics"
        @click="toggleOption('numberFormat')"
      >
        Number format
      </ActionButton>
      <ActionButton
        size="sm"
        :variant="options.greekSymbols ? 'primary' : 'secondary'"
        content-section="Exposure Detail - Mathematics"
        @click="toggleOption('greekSymbols')"
      >
        Greek symbols
      </ActionButton>
      <ActionButton
        size="sm"
        :variant="options.scientificENotation ? 'primary' : 'secondary'"
        content-section="Exposure Detail - Mathematics"
        @click="toggleOption('scientificENotation')"
      >
        Scientific notation
      </ActionButton>
    </template>
  </div>
</template>
