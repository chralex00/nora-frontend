<script lang="ts">
import { defineComponent } from 'vue';
import BaseLayout from '../layouts/BaseLayout.vue';

export default defineComponent({
  components: {
    BaseLayout: BaseLayout
  },
  data() {
    return {
      value: [false, false, false],
      collapses: [
        {
          title: "# Contact us via Email",
          content: "If you are a user, you can contact us sending an email to christian.alessandro.atzeni.00@outlook.com."
        },
        {
          title: "# Contact us via GitHub",
          content: "If you are a developer, you can open an issue directly on GitHub at https://github.com/chralex00/nora-frontend "
          + "(for the frontend), or https://github.com/chralex00/nora-backend (for the backend). Please explain in detail the bug you "
          + "encountered, or the suggestion you plan to give me. Thanks in advance!"
        }
      ],
    };
  },
});
</script>

<template>
  <BaseLayout>
    <h2 class="va-h2 mt-2">Help</h2>
    <div class="row">
      <div class="flex flex-col">
        <div class="item py-4">
          <VaAccordion v-model="value" multiple>
            <VaCollapse
              v-for="(collapse, index) in collapses"
              :key="index"
              :header="collapse.title">
              <template #content>
                {{ collapse.content }}
              </template>
            </VaCollapse>
          </VaAccordion>
        </div>
      </div>
    </div>
  </BaseLayout>
</template>
