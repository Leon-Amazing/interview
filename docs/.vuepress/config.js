module.exports = {
    // 站点配置
    base: '/interview/',
    lang: 'zh-CN',
    title: "Interview Reference",
    description: "Leon's library",
    head: [['link', { rel: 'icon', href: 'logo.png' }]],

    // 主题和它的配置
    theme: '@vuepress/theme-default',
    themeConfig: {
        logo: 'logo.png',
        // 导航
        navbar: [
            {
                text: 'JavaScript',
                link: '/javascript/README.md',
            },
            {
                text: '方法库',
                link: '/javascript/Tool.md',
            },
            {
                text: 'Vue',
                link: '/vue/README.md',
            },
            {
                text: '数据结构与算法',
                link: '/DSA/README.md',
            },
            {
                text: '项目实践',
                link: 'https://gitee.com/leoamazing/practice',
            },
        ],

    },

    // plugins
    plugins: [
        [
            '@vuepress/plugin-search',
            {
                locales: {
                    '/': {
                        placeholder: 'Search',
                    },
                    '/zh/': {
                        placeholder: '搜索',
                    },
                },
            },
        ],
    ],
}