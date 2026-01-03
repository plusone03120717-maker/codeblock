/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://codeblock.jp',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  outDir: './public',
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
  },
};
