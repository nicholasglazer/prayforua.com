import adapter from '@sveltejs/adapter-vercel';
import {vitePreprocess} from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  runtime: 'nodejs18.x',
  kit: {
    adapter: adapter()
  },
  preprocess: vitePreprocess()
};
export default config;
