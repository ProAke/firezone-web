<template>
  <div class="min-h-screen bg-slate-100 flex flex-col lg:flex-row text-gray-800">
    <!-- Admin Sidebar -->
    <aside class="w-full lg:w-64 bg-firezone-navy text-gray-200 shrink-0 flex flex-col">
      <div class="p-5 border-b border-white/10 flex items-center justify-between">
        <NuxtLink to="/admin" class="flex items-center gap-2.5">
          <div class="w-9 h-9 rounded bg-firezone-red text-white flex items-center justify-center font-extrabold text-sm">
            FZ
          </div>
          <div>
            <div class="font-bold text-white text-sm leading-tight">FIRESZONE CMS</div>
            <div class="text-[11px] text-gray-400">ระบบจัดการเว็บไซต์</div>
          </div>
        </NuxtLink>

        <button
          type="button"
          class="lg:hidden p-2 rounded hover:bg-white/10 text-gray-300"
          @click="sidebarOpen = !sidebarOpen"
        >
          <Menu class="w-5 h-5" />
        </button>
      </div>

      <nav
        :class="[
          'p-3 space-y-1 text-sm flex-1',
          sidebarOpen ? 'block' : 'hidden lg:block'
        ]"
      >
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 px-3.5 py-2.5 rounded-md transition-colors"
          :class="
            isActive(item.to)
              ? 'bg-firezone-red text-white font-semibold'
              : 'text-gray-300 hover:bg-white/10 hover:text-white'
          "
          @click="sidebarOpen = false"
        >
          <component :is="item.icon" class="w-4 h-4 shrink-0" />
          <span class="flex-1">{{ item.label }}</span>
        </NuxtLink>
      </nav>

      <div class="hidden lg:block p-4 border-t border-white/10 space-y-2">
        <NuxtLink
          to="/"
          target="_blank"
          class="w-full flex items-center justify-center gap-2 px-3 py-2 rounded bg-white/10 hover:bg-white/20 text-xs text-white font-medium transition-colors"
        >
          <ExternalLink class="w-3.5 h-3.5" />
          <span>เปิดดูหน้าเว็บไซต์</span>
        </NuxtLink>
        <button
          type="button"
          class="w-full flex items-center justify-center gap-2 px-3 py-2 rounded bg-red-500/20 hover:bg-red-500/30 text-xs text-red-200 font-medium transition-colors"
          @click="handleLogout"
        >
          <LogOut class="w-3.5 h-3.5" />
          <span>ออกจากระบบ</span>
        </button>
      </div>
    </aside>

    <!-- Main Admin Content -->
    <div class="flex-1 flex flex-col min-w-0">
      <header class="bg-white border-b border-gray-200 px-6 py-3.5 flex items-center justify-between">
        <div class="text-sm text-gray-500">
          บริษัท ไฟร์โซน แอนด์แมนูแฟคเจอริ่ง จำกัด — ระบบหลังบ้าน (แทน WordPress เดิม)
        </div>
        <div class="flex items-center gap-3">
          <NuxtLink
            to="/"
            target="_blank"
            class="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-firezone-red"
          >
            <ExternalLink class="w-3.5 h-3.5" />
            <span>ดูหน้าเว็บ</span>
          </NuxtLink>
          <button
            type="button"
            class="inline-flex items-center gap-1.5 text-xs font-medium text-red-600 hover:text-red-700"
            @click="handleLogout"
          >
            <LogOut class="w-3.5 h-3.5" />
            <span>ออกจากระบบ</span>
          </button>
        </div>
      </header>

      <main class="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Briefcase,
  ExternalLink,
  FolderTree,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Newspaper,
  Package,
  Settings,
  Wrench
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const sidebarOpen = ref(false)

const navItems = [
  { to: '/admin', label: 'ภาพรวมระบบ', icon: LayoutDashboard },
  { to: '/admin/products', label: 'จัดการสินค้า', icon: Package },
  { to: '/admin/categories', label: 'หมวดหมู่สินค้า', icon: FolderTree },
  { to: '/admin/services', label: 'บริการ & อุปกรณ์', icon: Wrench },
  { to: '/admin/portfolio', label: 'ผลงานการติดตั้ง', icon: Briefcase },
  { to: '/admin/news', label: 'ข่าวสาร & บทความ', icon: Newspaper },
  { to: '/admin/inquiries', label: 'ข้อความติดต่อลูกค้า', icon: MessageSquare },
  { to: '/admin/settings', label: 'ตั้งค่าเว็บไซต์', icon: Settings }
]

function isActive(target: string) {
  if (target === '/admin') return route.path === '/admin'
  return route.path.startsWith(target)
}

async function handleLogout() {
  await $fetch('/api/admin/logout', { method: 'POST' })
  router.push('/admin/login')
}
</script>
