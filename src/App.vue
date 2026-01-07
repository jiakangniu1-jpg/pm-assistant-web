<template>
  <div class="chat">
    <div class="messages">
      <div
        v-for="(m, i) in messages"
        :key="i"
        :class="m.role"
      >
        <strong>{{ m.role }}：</strong>{{ m.content }}
      </div>
    </div>

    <div class="input">
      <input v-model="input" @keyup.enter="send" />
      <button @click="send">发送</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      input: "",
      messages: [],
      loading: false,
    };
  },
  methods: {
    async send() {
      if (!this.input || this.loading) return;

      const userMessage = {
        role: "user",
        content: this.input,
      };

      this.messages.push(userMessage);
      this.input = "";

      // 关键：先 push 一个“空的 AI 消息”
      const aiMessage = {
        role: "assistant",
        content: "",
      };
      this.messages.push(aiMessage);

      this.loading = true;

      const res = await fetch(
        "https://pm-assistant-api-5w1t.vercel.app/api/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: this.messages.slice(0, -1),
          }),
        }
      );

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n").filter(Boolean);

        for (const line of lines) {
          if (!line.startsWith("data:")) continue;

          const data = line.replace("data:", "").trim();

          if (data === "[DONE]") {
            this.loading = false;
            return;
          }

          // 实时拼接内容（核心）
          aiMessage.content += data;
        }
      }

      this.loading = false;
    },
  },
};
</script>

<style>
.chat {
  max-width: 600px;
  margin: 40px auto;
}

.messages {
  min-height: 300px;
  border: 1px solid #ddd;
  padding: 10px;
}

.user {
  color: #333;
}

.assistant {
  color: #42b983;
}

.input {
  margin-top: 10px;
  display: flex;
}
</style>
