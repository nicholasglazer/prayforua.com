import {sveltekit} from '@sveltejs/kit/vite';
import {defineConfig, searchForWorkspaceRoot} from 'vite';
import path from 'path';

export default defineConfig({
  server: {
    fs: {
      allow: [searchForWorkspaceRoot(process.cwd()), './flow.json']
    }
  },
  resolve: {
    alias: {
      $stores: path.resolve('./src/stores/'),
      $components: path.resolve('./src/components/')
    }
  },
  plugins: [sveltekit()]
});
