module.exports = {
  title: 'Awesome Nuxt.js',
  description: '🎉 A curated list of awesome things related to Nuxt.js',
  head: [
    ['link', { rel: 'icon', href: `/logo.png` }],
    ['link', { rel: 'manifest', href: '/manifest.json' }],
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
    ['link', { rel: 'apple-touch-icon', href: `/icons/apple-touch-icon-152x152.png` }],
    ['link', { rel: 'mask-icon', href: '/icons/safari-pinned-tab.svg', color: '#3eaf7c' }],
    ['meta', { name: 'msapplication-TileImage', content: '/icons/msapplication-icon-144x144.png' }],
    ['meta', { name: 'msapplication-TileColor', content: '#fff' }]
  ],
  serviceWorker: true,
  base: '/',
  themeConfig: {
    algolia: {
      apiKey: 'b99936b745ef54d9428c2ba55c88c7a3',
      indexName: 'ansidev_awesome_nuxt'
    },
    repo: 'ansidev/awesome-nuxt',
    editLinks: true,
    lastUpdated: 'Last Updated',
    nav: [],
    serviceWorker: {
      updatePopup: true,
    },
    sidebar: [
      {
        title: 'Resources',
        collapsable: false,
        children: [
          '/resources/official-resources',
          '/resources/external-resources',
          '/resources/mention-of-nuxtjs',
          '/resources/community',
          '/resources/modules',
          '/resources/tools',
          '/resources/official-examples',
          '/resources/tutorials',
          '/resources/examples',
          '/resources/projects-using-nuxtjs',
          '/resources/showcase',
          '/resources/job-portal',
          '/resources/conferences',
          '/resources/podcasts',
          '/resources/youtube-channels',
          '/resources/books',
        ],
      },
    ]
  }
};
