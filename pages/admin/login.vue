<template>
  <div class="min-h-screen bg-firezone-navy flex items-center justify-center p-4">
    <div class="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden">
      <div class="bg-firezone-red p-6 text-white text-center">
        <img
          src="/logofooter-firesone.png"
          alt="Firezone"
          class="h-14 w-auto mx-auto object-contain mb-2"
        />
        <h1 class="text-xl font-extrabold">FIREZONE CMS</h1>
        <p class="text-xs text-red-100 mt-1">ระบบจัดการเนื้อหาและสินค้าเว็บไซต์</p>
      </div>

      <form class="p-6 md:p-8 space-y-4" @submit.prevent="handleLogin">
        <div
          v-if="errorMsg"
          class="bg-red-50 border border-red-200 text-red-700 text-xs font-medium p-3 rounded"
        >
          {{ errorMsg }}
        </div>

        <div>
          <label class="block text-xs font-bold text-gray-700 mb-1">ชื่อผู้ใช้ (Username)</label>
          <input
            v-model="username"
            type="text"
            required
            autocomplete="username"
            class="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-firezone-red"
          />
        </div>

        <div>
          <label class="block text-xs font-bold text-gray-700 mb-1">รหัสผ่าน (Password)</label>
          <input
            v-model="password"
            type="password"
            required
            autocomplete="current-password"
            class="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-firezone-red"
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="btn-firezone w-full text-sm disabled:opacity-60"
        >
          {{ loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบผู้ดูแล' }}
        </button>

        <div class="pt-3 border-t border-gray-100 text-center">
          <NuxtLink to="/" class="text-xs text-gray-500 hover:text-firezone-red">
            ← กลับสู่หน้าหลักเว็บไซต์
          </NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false
})

const router = useRouter()
const username = ref('')
const password = ref('')
const loading = ref(false)
const errorMsg = ref('')

async function handleLogin() {
  loading.value = true
  errorMsg.value = ''
  try {
    await $fetch('/api/admin/login', {
      method: 'POST',
      body: { username: username.value, password: password.value }
    })
    router.push('/admin')
  } catch (err: any) {
    errorMsg.value = err?.data?.statusMessage || 'เข้าสู่ระบบไม่สำเร็จ'
  } finally {
    loading.value = false
  }
}

useHead({
  title: 'เข้าสู่ระบบผู้ดูแล | FIRESZONE CMS',
  meta: [{ name: 'robots', content: 'noindex, nofollow, noarchive' }]
})
</script>
