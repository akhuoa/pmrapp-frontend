/// <reference types="vite/client" />

declare module '@/vendor/mathml-polyfills/all-polyfills.js' {
	export const _MathTransforms: {
		getCSSStyleSheet: () => HTMLStyleElement
		transform: (container: HTMLElement) => void
	}
}
