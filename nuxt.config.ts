// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss'],
  css: ['~/assets/css/main.css'],

  devServer: {
    host: '0.0.0.0',
    port: 3000
  },

  vite: {
    server: {
      allowedHosts: true
    }
  },

  runtimeConfig: {
    adminUsername: process.env.ADMIN_USERNAME || 'admin',
    adminPassword: process.env.ADMIN_PASSWORD || 'firezone2026',
    sessionSecret: process.env.SESSION_SECRET || 'fz-nuxt-cms-secret-key-2026-secure',
    wpBackupUploadsUrl: process.env.WP_BACKUP_UPLOADS_URL || 'https://fz.uarea.in/uploads',
    public: {
      wpMediaOrigin: process.env.WP_MEDIA_ORIGIN || 'https://fz.uarea.in',
      wpBackupUploadsUrl: process.env.WP_BACKUP_UPLOADS_URL || 'https://fz.uarea.in/uploads'
    }
  },

  app: {
    head: {
      htmlAttrs: {
        lang: 'th'
      },
      title: 'จำหน่ายอุปกรณ์ไฟอราม - Firezone | ระบบสัญญาณเตือนอัคคีภัย',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'บริษัท ไฟร์โซน แอนด์แมนูแฟคเจอริ่ง จำกัด จัดจำหน่ายอุปกรณ์พร้อมติดตั้งระบบสัญญาณเตือนอัคคีภัย FIRE ALARM กล้องวงจรปิด CCTV ระบบทีวีดิจิตอล MATV และระบบแจ้งเตือนผ่าน Line / Email ยินดีให้คำปรึกษาฟรี'
        },
        { property: 'og:locale', content: 'th_TH' },
        { property: 'og:site_name', content: 'Firezone' },
        { property: 'og:type', content: 'website' }
      ],
      link: [
        {
          rel: 'icon',
          type: 'image/jpeg',
          href: '/logo-fz.jpg'
        },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700&family=Sarabun:wght@300;400;500;600;700&display=swap'
        }
      ]
    }
  }
})
