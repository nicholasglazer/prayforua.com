import {sveltekit} from '@sveltejs/kit/vite';
import {defineConfig} from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      $stores: path.resolve('./src/stores/'),
      $components: path.resolve('./src/components/')
    }
  },
  plugins: [sveltekit()]
});
