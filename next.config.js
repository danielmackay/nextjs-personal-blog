const { withContentlayer } = require('next-contentlayer')

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

// You might need to insert additional domains in script-src if you are using external services
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.google-analytics.com https://www.googletagmanager.com https://vercel.live https://dandoescode.disqus.com https://c.disquscdn.com https://launchpad-wrapper.privacymanager.io https://launchpad.privacymanager.io;
  style-src 'self' 'unsafe-inline' https://c.disquscdn.com;
  img-src * blob: data: ;
  media-src 'none';
  connect-src *;
  font-src 'self';
  frame-src https://vercel.live https://disqus.com/;
  prefetch-src 'self' https://c.disquscdn.com https://disqus.com
`

const securityHeaders = [
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy.replace(/\n/g, ''),
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-DNS-Prefetch-Control
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Feature-Policy
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
]

/**
 * @type {import('next/dist/next-server/server/config').NextConfig}
 **/
module.exports = withContentlayer(
  withBundleAnalyzer({
    reactStrictMode: true,
    pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
    eslint: {
      dirs: ['pages', 'components', 'lib', 'layouts', 'scripts'],
    },
    async headers() {
      return [
        {
          source: '/:path*',
          headers: securityHeaders,
        },
      ]
    },
    webpack: (config, { dev, isServer }) => {
      config.module.rules.push({
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      })

      if (!dev && !isServer) {
        // Replace React with Preact only in client production build
        Object.assign(config.resolve.alias, {
          'react/jsx-runtime.js': 'preact/compat/jsx-runtime',
          react: 'preact/compat',
          'react-dom/test-utils': 'preact/test-utils',
          'react-dom': 'preact/compat',
        })
      }

      return config
    },
    async redirects() {
      return [
        {
          source: '/blog/bicep-part-one',
          destination: '/blog/bicep/part-one',
          permanent: true,
        },
        {
          source: '/blog/bicep-part-two',
          destination: '/blog/bicep/part-two',
          permanent: true,
        },
        {
          source: '/blog/bit-bucket-pipelines-part-one-building-and-testing-aspnet-core',
          destination: '/blog/bit-bucket-pipelines/part-one-building-and-testing-aspnet-core',
          permanent: true,
        },
        {
          source: '/blog/bit-bucket-pipelines-part-two-deploying-aspnet-core-to-azure',
          destination: '/blog/bit-bucket-pipelines/part-two-deploying-aspnet-core-to-azure',
          permanent: true,
        },
        {
          source: '/blog/bit-bucket-pipelines-part-three-deploying-static-site-to-azure',
          destination: 'blog/bit-bucket-pipelines/part-three-deploying-static-site-to-azure',
          permanent: true,
        },
        {
          source: '/blog/unit-testing-dotnet-core-with-xunit-part-one',
          destination: '/og/xunit-unit-testing/part-one',
          permanent: true,
        },
        {
          source: '/blog/unit-testing-dotnet-core-with-xunit-part-two',
          destination: 'blog/xunit-unit-testing/part-two',
          permanent: true,
        },
      ]
    },
  })
)
