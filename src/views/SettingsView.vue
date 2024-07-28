<script lang="ts">
import { defineComponent } from 'vue';
import BaseLayout from '../layouts/BaseLayout.vue';
import { reactive } from 'vue';
import { useToast } from 'vuestic-ui';

const { notify, closeAll } = useToast();

export default defineComponent({
  components: {
    BaseLayout: BaseLayout
  },
  data() {
    return {
      form: reactive({
        apiKeyHeaderName: localStorage.getItem("auth.apiKeyHeaderName") || "",
        apiKeyValue: localStorage.getItem("auth.apiKeyValue") || ""
      })
    }
  },
  methods: {
    validate(): boolean {
      let status: boolean = true;

      const apiKeyHeaderName = this.form.apiKeyHeaderName;
      if (!(apiKeyHeaderName && apiKeyHeaderName?.length > 0 && apiKeyHeaderName?.length >= 1 && apiKeyHeaderName?.length <= 256)) {
        status = false;
      }

      const apiKeyValue = this.form.apiKeyValue;
      if (!(apiKeyValue && apiKeyValue?.length > 0 && apiKeyValue?.length >= 1 && apiKeyValue?.length <= 512)) {
        status = false;
      }

      if (!status) {
        notify({
          title: "Error: INVALID FORM",
          message: "Please, <strong>check again</strong> all form fields, there are one (or more) incorrect field(s).",
          color: "danger",
          duration: 10_000,
          dangerouslyUseHtmlString: true
        });
      }

      return status;
    },
    async submit(): Promise<void> {
      localStorage.setItem("auth.apiKeyHeaderName", this.form.apiKeyHeaderName);
      localStorage.setItem("auth.apiKeyValue", this.form.apiKeyValue);
      notify({
        title: "SUCCESS",
        message: "Settings <strong>saved</strong> with success!",
        color: "success",
        duration: 5_000,
        dangerouslyUseHtmlString: true
      });
    }
  },
  onBeforeRouteLeave(to, from, next): void {
    closeAll();
    next();
  }
});
</script>

<template>
  <BaseLayout>
    <h2 class="va-h2 mt-2">Settings</h2>
    <div class="row">
      <div class="flex flex-col">
        <div class="item py-4">
          <VaForm ref="formRef">
            <div class="row">

              <!-- API Key Header Name -->
              <div class="flex flex-col">
                <div class="item py-2">
                  <VaInput
                    style="width: 100%"
                    v-model="form.apiKeyHeaderName"
                    :rules="[
                      (value) => (value && value?.length > 0) || 'API Key\'s header name is a required field',
                      (value) => (value?.length >= 1 && value?.length <= 256) || 'API Key\'s header name must have between 1 and 256 characters'
                    ]"
                    label="API Key Header Name"
                  />
                </div>
              </div>
            </div>

            <!-- API Key Value -->
            <div class="flex flex-col">
              <div class="item py-2">
                <VaInput
                  style="width: 100%"
                  v-model="form.apiKeyValue"
                  :rules="[
                    (value) => (value && value?.length > 0) || 'API Key\'s value is a required field',
                    (value) => (value?.length >= 1 && value?.length <= 512) || 'API Key\'s value must have between 1 and 512 characters'
                  ]"
                  label="API Key Value"
                />
              </div>
            </div>

            <!-- Submit Button -->
            <div class="flex flex-col">
              <div class="item py-4">
                <VaButton icon="check" @click="validate() && submit()" style="width: 180px">
                  Save
                </VaButton>
              </div>
            </div>
          </VaForm>
        </div>
      </div>
    </div>
  </BaseLayout>
</template>
