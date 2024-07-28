<script lang="ts">
import { defineComponent, reactive } from 'vue';
import BaseLayout from '../layouts/BaseLayout.vue';
import { OpenAI } from "openai";
import dateformat from "dateformat";
import axios from 'axios';

export default defineComponent({
  components: {
    BaseLayout: BaseLayout
  },
  data() {
    return {
      openAiClient: new OpenAI({
        apiKey: import.meta.env.VITE_OPEN_AI_API_KEY,
        dangerouslyAllowBrowser: true
      }),
      form: reactive({
        message: ""
      }),
      liveMessages: [],
      assistantLoading: false
    };
  },
  methods: {
    async submit(): Promise<void> {
      const message = this.form.message;

      if (!(message && message?.length > 0 && message?.length >= 1 && message?.length <= 256)) {
        this.form.message = "";
        return;
      }

      this.form.message = "";

      await this.liveMessages.push({
        type: "user",
        text: message,
        timestamp: dateformat(new Date(), "HH:MM")
      } as never);

      this.scrollToBottomOfChat();

      this.assistantLoading = true;
      
      const { text, timestamp } = await this.makePromptReq(message);

      if (text?.length && timestamp?.length) {
        await this.liveMessages.push({
          type: "assistant",
          text: text,
          timestamp: dateformat(new Date(timestamp), "HH:MM")
        } as never);

        this.scrollToBottomOfChat();

        await this.makeTextToSpeechReq(text);
      }
      
      this.assistantLoading = false;
    },
    async makePromptReq(message: string): Promise<{ text: string; timestamp: string; }> {
      try {
        const res: any = await axios({
          method: "post",
          url: `${import.meta.env.VITE_APIS_BASE_URL}/prompt`,
          data: {
            role: "user",
            text: message
          },
          headers: {
            [localStorage.getItem("auth.apiKeyHeaderName") || ""]: localStorage.getItem("auth.apiKeyValue") || ""
          }
        });

        return res.data;
      }
      catch (error) {
        return {
          text: "",
          timestamp: ""
        };
      }
    },
    scrollToBottomOfChat(): void {
      const chatWrapperDiv: any = document.getElementById("chatWrapperDiv");
      chatWrapperDiv.scrollTo(0, chatWrapperDiv.scrollHeight);
    },
    async makeTextToSpeechReq(message: string): Promise<void> {
      const mp3 = await this.openAiClient.audio.speech.create({
        model: import.meta.env.VITE_OPEN_AI_SPEECH_MODEL, 
        voice: import.meta.env.VITE_OPEN_AI_SPEECH_VOICE,
        input: message
      });

      const audioBuffer: ArrayBuffer = await mp3?.arrayBuffer();
      const audioBlob = new Blob([ audioBuffer ], { type: "audio/mp3" });

      const audioElement: any = document.createElement("AUDIO");
      audioElement.src = window.URL.createObjectURL(audioBlob);

      audioElement.play();
    }
  }
});
</script>

<template>
  <BaseLayout>
    <h2 class="va-h2 mt-2">Nora AI Assistant</h2>
    <div class="row">
      <div class="flex flex-col">
        <div class="item py-4">
          <div id="chatWrapperDiv" class="chat-wrapper">
            <div
              v-for="(message, index) in liveMessages as any[]"
              :key="index"
              :class="`${message.type}-chat-message-wrapper`">
              <div :class="`${message.type}-message`">
                {{ message.text }}
                <div class="message-timestamp">{{ message.timestamp }}</div>
              </div>
            </div>
          </div>
          <div class="message-wrapper">
            <div class="row">
              <div class="flex flex-col md10 lg11">
                <div class="item py-2">
                  <VaInput
                    :disabled="assistantLoading"
                    style="width: 100%"
                    v-model="form.message"
                    label=""
                  />
                </div>
              </div>
              <div class="flex flex-col md2 lg1">
                <div class="item py-2">
                  <VaButton :disabled="assistantLoading" icon="send" @click="submit()" style="width: 100%" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </diV>
    </div>
  </BaseLayout>
</template>


<style lang="scss">
.chat-wrapper {
  background-color: white;
  width: 100%;
  height: 50vh;
  padding: 30px 10px 30px 10px;
  border-radius: 10px;
  overflow-y: scroll;

  .user-chat-message-wrapper {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-bottom: 10px;

    .user-message {
      position: relative;
      background-color: #EFEFEF;
      padding: 10px;
      border-radius: 15px 15px 0px 15px;
      max-width: 50vw;
      text-wrap: wrap;
      overflow-wrap: break-word;

      .message-timestamp {
        margin-top: 5px;
        font-size: 10px;
      }
    }
  }

  .assistant-chat-message-wrapper {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-bottom: 10px;

    .assistant-message {
      position: relative;
      background-color: #81F35D;
      padding: 10px;
      border-radius: 15px 15px 0px 15px;
      max-width: 50vw;
      text-wrap: wrap;
      overflow-wrap: break-word;

      .message-timestamp {
        margin-top: 5px;
        font-size: 10px;
      }
    }
  }
}

.message-wrapper {
  background-color: white;
  width: 100%;
  height: auto;
  margin: 10px 0px 10px 0px;
  padding: 10px;
  border-radius: 10px;
}
</style>