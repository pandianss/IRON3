import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@kernel': path.resolve(__dirname, './src/kernel'),
            '@runtime': path.resolve(__dirname, './src/runtime'),
            '@interfaces': path.resolve(__dirname, './src/interfaces'),
        },
    },
})
