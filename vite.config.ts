import {resolve} from 'path';
import {defineConfig} from 'vitest/config';
import dts from 'vite-plugin-dts';

export default defineConfig({
    plugins: [dts()],
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'simpleTreeUtils',
            fileName: 'simple-tree-utils',
            formats: ['es', 'cjs', 'umd', 'iife'],
        },
    },
    test: {
        include: ["test/**/*.spec.ts"],
        coverage: {
            include: ["src/**"],
            reporter: ['html', 'lcov']
        },
    },
});