<template>
  <div id="app">
    <h2>PM 助手接口测试</h2>

    <textarea
      v-model="message"
      placeholder="请输入你想问 PM 助手的问题-哈哈哈哈哈"
      rows="6"
    />

    <br />

    <button @click="send" :disabled="loading">
      {{ loading ? "请求中..." : "发送" }}
    </button>

    <div class="result" v-if="reply">
      <h3>AI 回复：</h3>
      <pre>{{ reply }}</pre>
    </div>

    <div class="error" v-if="error">
      {{ error }}
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "App",
  data() {
    return {
      message: "",
      reply: "",
      loading: false,
      error: ""
    };
  },
  methods: {
    async send() {
      if (!this.message.trim()) {
        this.error = "请输入内容";
        return;
      }

      this.loading = true;
      this.reply = "";
      this.error = "";

      try {
        const res = await axios.post(
          "https://pm-assistant-api-5w1t.vercel.app/api/chat",
          {
            message: this.message
          }
        );

        this.reply = res.data.reply || JSON.stringify(res.data, null, 2);
      } catch (err) {
  console.error("完整错误对象：", err);

  if (err.response) {
    console.error("后端返回 data：", err.response.data);
    console.error("后端返回 status：", err.response.status);

    this.error =
      "接口错误：" + JSON.stringify(err.response.data, null, 2);
  } else {
    this.error = "请求失败：" + err.message;
  }
}
 finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style>
#app {
  max-width: 700px;
  margin: 40px auto;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  color: #2c3e50;
}

textarea {
  width: 100%;
  font-size: 14px;
  padding: 10px;
}

button {
  margin-top: 10px;
  padding: 8px 20px;
  font-size: 14px;
  cursor: pointer;
}

.result {
  margin-top: 20px;
  text-align: left;
  background: #f6f8fa;
  padding: 15px;
  border-radius: 6px;
}

pre {
  white-space: pre-wrap;
  word-break: break-word;
}

.error {
  margin-top: 15px;
  color: red;
}
</style>
