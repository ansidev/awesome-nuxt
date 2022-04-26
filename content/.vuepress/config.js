const { defaultTheme } = require('vuepress')
const { googleAnalyticsPlugin } = require('@vuepress/plugin-google-analytics')

const isProd = process.env.NODE_ENV === "production"

module.exports = {
  title: "Awesome NuxtJS",
  description: "🎉 A curated list of awesome things related to NuxtJS",
  head: [
    ["link", {
      rel: "icon",
      href: `/logo.png`
    }],
    ["link", {
      rel: "manifest",
      href: "/manifest.webmanifest"
    }],
    ["meta", {
      name: "theme-color",
      content: "#3eaf7c"
    }],
    ["meta", {
      name: "apple-mobile-web-app-capable",
      content: "yes"
    }],
    [
      "meta",
      {
        name: "apple-mobile-web-app-status-bar-style",
        content: "black"
      },
    ],
    [
      "link",
      {
        rel: "apple-touch-icon",
        href: `/icons/apple-touch-icon-152x152.png`
      },
    ],
    [
      "link",
      {
        rel: "mask-icon",
        href: "/icons/safari-pinned-tab.svg",
        color: "#3eaf7c",
      },
    ],
    [
      "meta",
      {
        name: "msapplication-TileImage",
        content: "/icons/msapplication-icon-144x144.png",
      },
    ],
    ["meta", {
      name: "msapplication-TileColor",
      content: "#fff"
    }],
  ],
  base: "/",
  theme: defaultTheme({
    repo: "ansidev/awesome-nuxt",
    editLinks: true,
    lastUpdated: "Last Updated",
    sidebar: [{
      title: "Resources",
      collapsable: false,
      children: [
        "/resources/official-resources",
        "/resources/community",
        "/resources/modules",
        "/resources/tools",
        "/resources/mention-of-nuxt",
        "/resources/tutorials",
        "/resources/blogs",
        "/resources/books",
        "/resources/starter-template",
        "/resources/docker",
        "/resources/official-examples",
        "/resources/community-examples",
        "/resources/open-source-projects-using-nuxt",
        "/resources/projects-using-nuxt",
        "/resources/showcase",
      ],
    }, ],
    themePlugins: {
      // only enable git plugin in production mode
      git: isProd,
    },
  }),
  plugins: [
    ["@vuepress/pwa", {
      skipWaiting: true
    }],
    googleAnalyticsPlugin({
      id: process.env.GA_ID
    }),
    [
      '@vuepress/docsearch',
      {
        apiKey: process.env.DOCSEARCH_API_KEY,
        indexName: process.env.DOCSEARCH_INDEX_NAME
      },
    ],
  ],
};
