<script lang="ts">
import { defineComponent } from 'vue';
import { RouteNames } from "../enums/RouteNames";

export default defineComponent({
    data() {
        return {
            ROUTE_NAMES: RouteNames,
            appShownVersion: import.meta.env.VITE_SHOWN_VERSION,
            showSidebar: false,
            page: null
        }
    },
    watch:{
      $route(){
          this.page = this.$route.name;
      }
    },
    methods: {
        onPageChange(newPage: RouteNames): void {
            this.$router.push({ name: newPage });
        }
    }
});
</script>

<template>
    <VaLayout style="height: 100vh" :left="{ absolute: true}">
        <!-- Header -->
        <template #top>
          <VaNavbar color="primary" class="py-2">
            <template #left>
              <VaButton :icon="showSidebar ? 'menu_open' : 'menu'" @click="showSidebar = !showSidebar" />
              <h6 class="va-h6 mt-2">Nora AI Assistant</h6>
            </template>
          </VaNavbar>
        </template>
        
        <!-- Sidebar -->
        <template #left>
          <VaSidebar v-model="showSidebar" class="py-4">
            <VaSidebarItem :active="$route.name === ROUTE_NAMES.home" @click="onPageChange(ROUTE_NAMES.home as RouteNames)">
              <VaSidebarItemContent>
                <VaIcon name="home" /> 
                <VaSidebarItemTitle>Home</VaSidebarItemTitle>
              </VaSidebarItemContent>
            </VaSidebarItem>
            <VaSidebarItem :active="$route.name === ROUTE_NAMES.nora" @click="onPageChange(ROUTE_NAMES.nora as RouteNames)">
                <VaSidebarItemContent>
                    <VaIcon name="psychology" />
                    <VaSidebarItemTitle>Nora</VaSidebarItemTitle>
                </VaSidebarItemContent>
            </VaSidebarItem>
            <VaSidebarItem :active="$route.name === ROUTE_NAMES.settings" @click="onPageChange(ROUTE_NAMES.settings as RouteNames)">
                <VaSidebarItemContent>
                    <VaIcon name="settings" />
                    <VaSidebarItemTitle>Settings</VaSidebarItemTitle>
                </VaSidebarItemContent>
            </VaSidebarItem>
            <VaSidebarItem :active="$route.name === ROUTE_NAMES.help" @click="onPageChange(ROUTE_NAMES.help as RouteNames)">
              <VaSidebarItemContent>
                <VaIcon name="help" />
                <VaSidebarItemTitle>Help</VaSidebarItemTitle>
              </VaSidebarItemContent>
            </VaSidebarItem>
          </VaSidebar>
        </template>
        
        <!-- Main -->
        <template #content>
          <main class="p-4">
            <slot />
          </main>
        </template>

        <!-- Footer -->
        <template #bottom>
          <footer class="p-4 va-text-dark" style="position: absolute;  bottom: 0; right: 0; font-size: 12px">
            Copyright &copy; 2024- - by Christian Alessandro Atzeni - Version: {{ appShownVersion }}
          </footer>
        </template>
    </VaLayout>
</template>