import { Metadata } from 'next'
import { baseUrl } from './Url'

const SEO = (): Metadata => {
  return {
    metadataBase: new URL(`${baseUrl}`),
    title: {
      default: 'pweeq - Where conversations flow',
      template: '%s | pweeq'
    },
    description: 'Tired of boring social apps? pweeq connects you with real people through authentic conversations - no algorithms, no noise, just genuine connection.',
    applicationName: 'pweeq',
    keywords: [
      'chat platform', 'social app', 'pweeq', 'messaging', 'authentic connections', 
      'digital hangout', 'conversation space', 'real conversations', 'social networking',
      'chat app', 'messaging platform', 'online community', 'social media alternative',
      'genuine connections', 'meaningful conversations', 'chat rooms', 'social chat',
      'conversation starter', 'meet new people', 'social discovery', 'authentic social'
    ],
    authors: [{ name: 'Medzy Amara', url: `https://medzyamara.com` }],
    creator: 'Medzy Amara',
    publisher: 'pweeq',
    category: 'Social Networking',
    classification: 'Social Media Platform',
    referrer: 'origin-when-cross-origin',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: `${baseUrl}`,
      languages: {
        'en-US': `${baseUrl}`,
        'en': `${baseUrl}/en`,
        'es': `${baseUrl}/es`,
        'fr': `${baseUrl}/fr`,
        'de': `${baseUrl}/de`,
        'it': `${baseUrl}/it`,
        'pt-BR': `${baseUrl}/pt-br`,
        'zh-CN': `${baseUrl}/zh-cn`,
        'ja': `${baseUrl}/ja`,
        'ko': `${baseUrl}/ko`,
        'ar': `${baseUrl}/ar`,
        'hi': `${baseUrl}/hi`,
        'ru': `${baseUrl}/ru`,
        'x-default': `${baseUrl}`,
      },
      media: {
        'only screen and (max-width: 600px)': `${baseUrl}/mobile`,
      },
      types: {
        'application/rss+xml': `${baseUrl}/rss.xml`,
      },
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: `${baseUrl}`,
      siteName: 'pweeq',
      title: 'pweeq - Be yourself, find your people',
      description: 'Join the conversation on pweeq. No filters, no fake personas - just real talk with people who get you.',
      emails: ['contact@pweeq.com'],
      phoneNumbers: ['+1-555-pweeq-APP'],
      faxNumbers: [],
      countryName: 'United States',
      ttl: 604800,
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: 'pweeq - Authentic conversations start here',
          type: 'image/png',
          secureUrl: `${baseUrl}/og-image.png`,
        },
        {
          url: '/Icons/web/icon-512.png',
          width: 512,
          height: 512,
          alt: 'pweeq App Icon',
          type: 'image/png',
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: 'pweeq - Where real talk happens',
      description: 'Ditch the social media noise. Join pweeq for conversations that actually matter.',
      siteId: '1467726470533754880',
      creator: '@medzyamara',
      creatorId: 'your-twitter-creator-id',
      site: '@pweeqApp',
      images: {
        url: '/og-image.png',
        alt: 'pweeq Social Preview',
        width: 1200,
        height: 630,
      },
    },
    appLinks: {
      ios: {
        url: 'pweeq://open',
        app_store_id: 'your-ios-app-id',
        app_name: 'pweeq',
      },
      android: {
        package: 'com.pweeq.app',
        url: 'pweeq://open',
        class: 'com.pweeq.MainActivity',
        app_name: 'pweeq',
      },
      web: {
        url: `${baseUrl}`,
        should_fallback: true,
      },
    },
    archives: [`${baseUrl}/archives`],
    assets: [`${baseUrl}/assets`],
    bookmarks: [`${baseUrl}/bookmarks`],
    manifest: '/manifest.json',
    appleWebApp: {
      capable: true,
      title: 'pweeq',
      statusBarStyle: 'black-translucent',
      startupImage: [
        {
          url: '/Icons/web/apple-touch-startup-image-768x1004.png',
          media: '(device-width: 768px) and (device-height: 1024px)',
        },
        {
          url: '/Icons/web/apple-touch-startup-image-1536x2008.png',
          media: '(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2)',
        },
      ],
    },
    abstract: 'pweeq is a social platform focused on authentic conversations and genuine connections.',
    other: {
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'black-translucent',
      'mobile-web-app-capable': 'yes',
      'msapplication-TileImage': '/Icons/web/icon-144.png',
      'msapplication-config': '/browserconfig.xml',
      'color-scheme': 'light dark',
      'supported-color-schemes': 'light dark',
      'rating': 'general',
      'distribution': 'global',
      'revisit-after': '2 days',
      'language': 'EN',
      'target': 'all',
      'audience': 'all',
      'coverage': 'Worldwide',
      'directory': 'submission',
      'copyright': '© 2025 pweeq. All rights reserved.',
      'designer': 'Medzy Amara',
      'owner': 'pweeq',
      'url': baseUrl,
      'identifier-URL': baseUrl,
      'shortlink': baseUrl,
      'pagename': 'pweeq',
      'HandheldFriendly': 'True',
      'MobileOptimized': '320',
      'og:video': `${baseUrl}/preview-video.mp4`,
      'og:video:type': 'video/mp4',
      'og:video:width': '1200',
      'og:video:height': '630',
      'twitter:player': `${baseUrl}/twitter-player.html`,
      'twitter:player:width': '1200',
      'twitter:player:height': '630',
      'article:author': 'Medzy Amara',
      'article:publisher': 'https://facebook.com/pweeqApp',
      'profile:first_name': 'pweeq',
      'profile:last_name': 'App',
      'profile:username': 'pweeqApp',
    },
    icons: {
      icon: [
        { url: '/Icons/web/favicon.ico', sizes: 'any' },
        { url: '/Icons/web/icon-192.png', type: 'image/png', sizes: '192x192' },
        { url: '/Icons/web/icon-512.png', type: 'image/png', sizes: '512x512' }
      ],
      apple: [
        { url: '/Icons/web/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
        { url: '/Icons/web/icon-192-maskable.png', sizes: '192x192', type: 'image/png' },
        { url: '/Icons/web/icon-512-maskable.png', sizes: '512x512', type: 'image/png' }
      ],
      other: [
        { rel: 'mask-icon', url: '/Icons/web/safari-pinned-tab.svg', color: '#000000' }
      ]
    }
  }
}

export default SEO
