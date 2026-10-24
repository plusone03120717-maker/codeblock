/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://codeblock.jp',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  // Python ナビ（新しいコース）の画面は検索に出さない
  exclude: ['/navi', '/navi/*'],
  outDir: './public',
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/navi'],
      },
    ],
  },
};
