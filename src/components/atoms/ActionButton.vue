<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

type ButtonVariant = 'primary' | 'secondary'
type ButtonSize = 'sm' | 'md' | 'lg'

interface Props {
  type?: 'button' | 'submit' | 'reset'
  variant?: ButtonVariant
  size?: ButtonSize
  to?: RouteLocationRaw
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  variant: 'primary',
  type: 'button',
  size: 'md',
  disabled: false,
})

const disabledClasses = {
  primary: 'disabled:opacity-60 disabled:cursor-not-allowed',
  secondary: 'disabled:opacity-60 disabled:cursor-not-allowed hover:bg-transparent',
}

const variantClasses = {
  primary:
    'px-3 py-1 rounded border border-primary bg-primary text-white hover:opacity-90 transition-opacity',
  secondary:
    'px-3 py-1 rounded border border-primary text-primary hover:bg-primary/10 transition-colors',
}

const sizeClasses = {
  sm: 'text-sm rounded',
  md: 'text-base rounded-md',
  lg: 'text-base px-8 py-2 rounded-lg',
}

const buttonClasses = 'inline-flex items-center gap-2'
</script>

<template>
  <RouterLink
    v-if="to"
    :to="to"
    :class="[variantClasses[variant], sizeClasses[size], buttonClasses]"
  >
    <slot />
  </RouterLink>
  <button
    v-else
    :class="[variantClasses[variant], sizeClasses[size], disabledClasses[variant], buttonClasses]"
    :type="type"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>
