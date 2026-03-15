import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';

export default defineConfig({
    base: '/hackday/',
    plugins: [svelte()],
    build: {
        outDir: 'build'
    }
});
