import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  history: { type: 'hash' },
  hash: true, // 打包 文件后缀 hash 值
  base: '/dist/',
  publicPath: '/dist/',
  // outputPath: '/dist/',默认 dist
  // mock: false,
  routes: [
    { path: '/', component: '@/pages/index', title: '主页' },
    { path: '/dva', component: '@/pages/dva', title: 'dva' },
  ],
});
