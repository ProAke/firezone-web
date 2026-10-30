export interface PdpaPreferences {
  decided: boolean
  necessary: boolean
  analytics: boolean
  marketing: boolean
  updatedAt: string
}

const STORAGE_KEY = 'fz_pdpa_consent_v1'

export function usePdpaConsent() {
  const state = useState<PdpaPreferences>('pdpa-consent-state', () => ({
    decided: false,
    necessary: true,
    analytics: false,
    marketing: false,
    updatedAt: ''
  }))

  const modalOpen = useState<boolean>('pdpa-modal-open', () => false)
  const hydrated = useState<boolean>('pdpa-hydrated', () => false)

  function loadConsent() {
    if (!import.meta.client) return
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        state.value = {
          decided: Boolean(parsed.decided),
          necessary: true,
          analytics: Boolean(parsed.analytics),
          marketing: Boolean(parsed.marketing),
          updatedAt: String(parsed.updatedAt || '')
        }
      }
    } catch {
      // ignore corrupted storage
    } finally {
      hydrated.value = true
    }
  }

  function saveConsent(prefs: { analytics: boolean; marketing: boolean }) {
    const next: PdpaPreferences = {
      decided: true,
      necessary: true,
      analytics: prefs.analytics,
      marketing: prefs.marketing,
      updatedAt: new Date().toISOString()
    }
    state.value = next
    modalOpen.value = false
    if (import.meta.client) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch {
        // ignore storage quota errors
      }
    }
  }

  function acceptAll() {
    saveConsent({ analytics: true, marketing: true })
  }

  function acceptNecessaryOnly() {
    saveConsent({ analytics: false, marketing: false })
  }

  function openPreferencesModal() {
    modalOpen.value = true
  }

  return {
    consent: state,
    hydrated,
    modalOpen,
    loadConsent,
    saveConsent,
    acceptAll,
    acceptNecessaryOnly,
    openPreferencesModal
  }
}
