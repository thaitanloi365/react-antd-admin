export default {
  siteName: 'Admin',
  copyright: 'Ant Design Admin  ©2019 zuiidea',
  logoPath: '/logo.svg',
  apiPrefix: 'http://localhost:8080',
  fixedHeader: true, // sticky primary layout header

  /* Layout configuration, specify which layout to use for route. */
  layouts: [
    {
      name: 'primary',
      include: [/.*/],
      exclude: [/(\/(en|zh))*\/login/],
    },
  ],
};
