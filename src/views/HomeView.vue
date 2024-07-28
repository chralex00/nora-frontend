<script lang="ts">
import { defineComponent } from 'vue';
import BaseLayout from '../layouts/BaseLayout.vue';
import axios, { HttpStatusCode } from 'axios';
import { useToast } from 'vuestic-ui';

const { notify, closeAll } = useToast();

export default defineComponent({
  components: {
    BaseLayout: BaseLayout
  },
  data() {
    return {
      status: null
    }
  },
  methods: {
    async makeHealthcheckReq(): Promise<void> {
      try {
        const options: any = {
          headers: {
            [localStorage.getItem("auth.apiKeyHeaderName") || ""]: localStorage.getItem("auth.apiKeyValue") || ""
          }
        };
        const res: any = await axios.get(`${import.meta.env.VITE_APIS_BASE_URL}/healthcheck`, options);
        this.status = res.data.status === "up";
      }
      catch (error) {
        this.status = false;
        if (error?.name == "AxiosError" && error?.response?.status === HttpStatusCode.Forbidden) {
          notify({
            title: "Error: INVALID API KEY",
            message: "Your <strong>API Key</strong> is incorrect, or has changed. Please, <strong>provide a correct API Key</strong> in the <em>Settings</em> panel.",
            color: "danger",
            duration: 10_000,
            dangerouslyUseHtmlString: true
          });
        }
        else {
          notify({
            title: "Error: GENERIC ERROR OCCURRED",
            message: "It looks that a <strong>Generic Error</strong> occurred. Please, <strong>check your connectivity</strong>, or <strong>contact us</strong> if the problem persists.",
            color: "danger",
            duration: 10_000,
            dangerouslyUseHtmlString: true
          });
        }
      }
    }
  },
  mounted(): void {
    this.makeHealthcheckReq();
  },
  onBeforeRouteLeave(to, from, next): void {
    closeAll();
    next();
  }
});
</script>

<template>
  <BaseLayout>
    <h2 class="va-h2 mt-2">Home</h2>
    <div class="row">
      <div class="flex flex-col md6 lg4">
        <div class="item py-4">
          <VaButton color="transparent" border-color="gray" class="py-3" style="width: 100%" to="/nora">
            Nora
          </VaButton>
        </div>
      </div>
      <div class="flex flex-col md6 lg4">
        <div class="item py-4">
          <VaButton color="transparent" border-color="gray" class="py-3" style="width: 100%" to="/settings">
            Settings
          </VaButton>
        </div>
      </div>
      <div class="flex flex-col md6 lg4">
        <div class="item py-4">
          <VaButton color="transparent" border-color="gray" class="py-3" style="width: 100%" to="/help">
            Help
          </VaButton>
        </div>
      </div>
      <div class="flex flex-col md6">
        <div class="item py-4">
          <VaCard stripe :stripe-color="status === true ? 'success' : (status === null ? 'gray' : 'danger')">
            <VaCardTitle>Nora's Healthcheck</VaCardTitle>
            <VaCardContent>
              <template v-if="status === true">
                Nora AI Assistant is <strong class="text-green">ready</strong> to talk!
              </template>
              <template v-else-if="status === false">
                There are <strong class="text-danger">some problems</strong> with Nora AI Assistant is.
              </template>
              <template v-else>
                Checking the Nora's status...  
              </template>
            </VaCardContent>
          </VaCard>
        </div>
      </div>
    </div>
  </BaseLayout>
</template>
