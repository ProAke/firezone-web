<template>
  <div class="hidden" aria-hidden="true" />
</template>

<script setup lang="ts">
const { settings } = useSiteData()
const { consent } = usePdpaConsent()

// Always render Google Search Console verification tag in SSR head
useHead(() => {
  const meta: Array<Record<string, string>> = []
  if (settings.value.googleSiteVerification) {
    meta.push({
      name: 'google-site-verification',
      content: settings.value.googleSiteVerification.trim()
    })
  }
  return { meta }
})

const analyticsLoaded = ref(false)
const marketingLoaded = ref(false)

function injectHtmlFragment(rawHtml: string, target: HTMLElement, position: 'append' | 'prepend' = 'append') {
  if (!rawHtml || !rawHtml.trim()) return
  const container = document.createElement('div')
  container.innerHTML = rawHtml

  const nodes = Array.from(container.childNodes)
  for (const node of nodes) {
    if (node.nodeName.toLowerCase() === 'script') {
      const oldScript = node as HTMLScriptElement
      const newScript = document.createElement('script')
      for (const attr of Array.from(oldScript.attributes)) {
        newScript.setAttribute(attr.name, attr.value)
      }
      if (oldScript.textContent) {
        newScript.textContent = oldScript.textContent
      }
      target.appendChild(newScript)
    } else if (position === 'prepend' && target.firstChild) {
      target.insertBefore(node.cloneNode(true), target.firstChild)
    } else {
      target.appendChild(node.cloneNode(true))
    }
  }
}

function loadAnalyticsScripts() {
  if (analyticsLoaded.value || !import.meta.client) return
  const gaId = (settings.value.gaMeasurementId || '').trim()
  if (gaId && /^G-[A-Z0-9]+$/i.test(gaId)) {
    analyticsLoaded.value = true
    const s = document.createElement('script')
    s.async = true
    s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`
    document.head.appendChild(s)

    const inline = document.createElement('script')
    inline.textContent = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', ${JSON.stringify(gaId)}, { anonymize_ip: true });
    `
    document.head.appendChild(inline)
  }
}

function loadMarketingAndCustomTags() {
  if (marketingLoaded.value || !import.meta.client) return
  marketingLoaded.value = true

  // 1. Google Tag Manager
  const gtmId = (settings.value.gtmContainerId || '').trim()
  if (gtmId && /^GTM-[A-Z0-9]+$/i.test(gtmId)) {
    const gtmScript = document.createElement('script')
    gtmScript.textContent = `
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer',${JSON.stringify(gtmId)});
    `
    document.head.appendChild(gtmScript)
  }

  // 2. Meta (Facebook) Pixel
  const pixelId = (settings.value.metaPixelId || '').trim()
  if (pixelId && /^[0-9]{8,25}$/.test(pixelId)) {
    const fbScript = document.createElement('script')
    fbScript.textContent = `
      !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
      n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
      document,'script','https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', ${JSON.stringify(pixelId)});
      fbq('track', 'PageView');
    `
    document.head.appendChild(fbScript)
  }

  // 3. LINE Tag
  const lineTagId = (settings.value.lineTagId || '').trim()
  if (lineTagId && /^[a-zA-Z0-9\-]{8,64}$/.test(lineTagId)) {
    const ltScript = document.createElement('script')
    ltScript.textContent = `
      (function(g,d,o){
        g._ltq=g._ltq||[];g._lt=g._lt||function(){g._ltq.push(arguments)};
        var h=d.getElementsByTagName(o)[0];
        var j=d.createElement(o);j.async=1;
        j.src='https://d.line-scdn.net/n/line_tag/public/release/v1/lt.js';
        h.parentNode.insertBefore(j,h);
      })(window, document, 'script');
      _lt('init', { customerType: 'account', tagId: ${JSON.stringify(lineTagId)} });
      _lt('send', 'pv', [${JSON.stringify(lineTagId)}]);
    `
    document.head.appendChild(ltScript)
  }

  // 4. Custom Head / Body Start / Body End Scripts configured by Admin
  if (settings.value.customHeadScripts) {
    injectHtmlFragment(settings.value.customHeadScripts, document.head, 'append')
  }
  if (settings.value.customBodyStartScripts) {
    injectHtmlFragment(settings.value.customBodyStartScripts, document.body, 'prepend')
  }
  if (settings.value.customBodyEndScripts) {
    injectHtmlFragment(settings.value.customBodyEndScripts, document.body, 'append')
  }
}

function evaluateScripts() {
  if (!import.meta.client) return
  const pdpaDisabled = settings.value.pdpaEnabled === '0'
  if (pdpaDisabled || (consent.value.decided && consent.value.analytics)) {
    loadAnalyticsScripts()
  }
  if (pdpaDisabled || (consent.value.decided && consent.value.marketing)) {
    loadMarketingAndCustomTags()
  }
}

watch(
  () => [consent.value.decided, consent.value.analytics, consent.value.marketing, settings.value.gaMeasurementId],
  evaluateScripts,
  { deep: true }
)

onMounted(() => {
  evaluateScripts()
})
</script>
