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
  base: '/',
  themeConfig: {
    algolia: {
      apiKey: '67346acb58a687206ed3790536caa923',
      indexName: 'awesome-nuxt',
      algoliaOptions: {
        hitsPerPage: 10,
      },
    },
    repo: 'ansidev/awesome-nuxt',
    editLinks: true,
    lastUpdated: 'Last Updated',
    nav: [],
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
    ],
    plugins: [
      ['@vuepress/pwa', {
        serviceWorker: true,
        updatePopup: true
      }],
      ['@vuepress/google-analytics', { ga: 'UA-133732317-1' }]
    ]
  }
};
