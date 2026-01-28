<script setup lang="ts">
import { type RouteLocationRaw, useRoute } from 'vue-router'
import { trackButtonClick } from '@/utils/analytics'

type ButtonVariant = 'primary' | 'secondary' | 'link'
type ButtonSize = 'sm' | 'md' | 'lg'

interface Props {
  type?: 'button' | 'submit' | 'reset'
  variant?: ButtonVariant
  size?: ButtonSize
  to?: RouteLocationRaw
  href?: string
  disabled?: boolean
  contentSection?: string
  download?: boolean
  target?: string
  rel?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  type: 'button',
  size: 'md',
  disabled: false,
  contentSection: 'global',
  target: '_self',
  rel: '',
})

const route = useRoute()

const handleClick = (event: Event) => {
  const buttonText = (event.currentTarget as HTMLElement)?.textContent?.trim() || ''

  trackButtonClick({
    button_name: buttonText,
    content_section: props.contentSection,
    link_category: route.path,
  })
}

const disabledClasses = {
  primary: 'disabled:opacity-60 disabled:cursor-not-allowed',
  secondary: 'disabled:opacity-60 disabled:cursor-not-allowed',
  link: 'disabled:opacity-60 disabled:cursor-not-allowed',
}

const variantClasses = {
  primary:
    'px-3 py-1 rounded border border-primary bg-primary text-white hover:opacity-90 transition-opacity',
  secondary:
    'px-3 py-1 rounded border border-primary text-primary hover:text-primary-hover hover:shadow transition-all',
  link: 'text-primary hover:text-primary-hover transition-colors',
}

const sizeClasses = {
  sm: 'text-sm rounded',
  md: 'text-base rounded-md',
  lg: 'text-base px-4 py-2 rounded-lg',
}

const buttonClasses = 'inline-flex items-center justify-center gap-2 cursor-pointer'
</script>

<template>
  <a
    v-if="href"
    :href="href"
    :class="[variantClasses[variant], sizeClasses[size], disabledClasses[variant], buttonClasses]"
    :download="download || undefined"
    :target="target"
    :rel="rel"
    @click="handleClick"
  >
    <slot />
  </a>
  <RouterLink
    v-else-if="to"
    :to="to"
    :class="[variantClasses[variant], sizeClasses[size], disabledClasses[variant], buttonClasses]"
    @click="handleClick"
  >
    <slot />
  </RouterLink>
  <button
    v-else
    :class="[variantClasses[variant], sizeClasses[size], disabledClasses[variant], buttonClasses]"
    :type="type"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot />
  </button>
</template>
