<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

type ButtonVariant = 'primary' | 'secondary'
type ButtonSize = 'sm' | 'md' | 'lg'

interface Props {
  variant?: ButtonVariant
  size?: ButtonSize
  to?: RouteLocationRaw
}

withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
})

const variantClasses = {
  primary: 'px-3 py-1 rounded bg-primary text-white hover:opacity-90 transition-opacity',
  secondary: 'px-3 py-1 rounded border border-primary text-primary hover:bg-primary/10 transition-colors',
}

const sizeClasses = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg px-4 py-2',
}
</script>

<template>
  <RouterLink
    v-if="to"
    :to="to"
    :class="[variantClasses[variant], sizeClasses[size]]"
  >
    <slot />
  </RouterLink>
  <button
    v-else
    :class="[variantClasses[variant], sizeClasses[size]]"
    type="button"
  >
    <slot />
  </button>
</template>
