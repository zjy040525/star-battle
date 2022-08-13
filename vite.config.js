import { defineConfig } from 'vite'
import { createHtmlPlugin } from 'vite-plugin-html'

export default defineConfig({
  plugins: [
    createHtmlPlugin({
      entry: '/src/main.js',
      inject: {
        data: {
          title: 'Star Battle',
        },
      },
      minify: true,
    }),
  ],
})
