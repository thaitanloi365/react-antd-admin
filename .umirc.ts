import { IConfig } from 'umi-types';
import { resolve } from 'path';
import slash from 'slash2';

// ref: https://umijs.org/config/
const config: IConfig = {
  treeShaking: true,
  routes: [
    {
      path: '/',
      component: '../pages/index.tsx',
    },
    {
      path: '/login',
      component: '../pages/login/index.tsx',
    },
    {
      path: '/dashboard',
      component: '../layouts/PrimaryLayout.tsx',
      routes: [{ path: '/dashboard', component: '../pages/dashboard/index.tsx' }],
    },
    {
      path: '/user',
      component: '../layouts/PrimaryLayout.tsx',
      routes: [{ path: '/user', component: '../pages/user/index.tsx' }],
    },
  ],
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    [
      'umi-plugin-react',
      {
        dva: {
          immer: true,
        },
        antd: true,
        dynamicImport: false,
        title: 'react-antd-admin',
        dll: false,

        routes: {
          exclude: [/components\//],
        },
      },
    ],
  ],
  alias: {
    components: resolve(__dirname, './src/components/'),
    models: resolve(__dirname, './src/models/'),
    routes: resolve(__dirname, './src/routes/'),
    services: resolve(__dirname, './src/services/'),
    themes: resolve(__dirname, './src/themes/'),
    utils: resolve(__dirname, './src/utils/'),
  },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableRedirectHoist: true,
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (
      context: {
        resourcePath: string;
      },
      _: string,
      localName: string,
    ) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('ant.design.pro.less') ||
        context.resourcePath.includes('global.less')
      ) {
        return localName;
      }

      const match = context.resourcePath.match(/src(.*)/);

      if (match && match[1]) {
        const antdProPath = match[1].replace('.less', '');
        const arr = slash(antdProPath)
          .split('/')
          .map((a: string) => a.replace(/([A-Z])/g, '-$1'))
          .map((a: string) => a.toLowerCase());
        return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
      }

      return localName;
    },
  },
  manifest: {
    basePath: '/',
  },
};

export default config;
