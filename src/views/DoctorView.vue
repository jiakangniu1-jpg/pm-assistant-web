<template>
  <div class="page">
    <div class="hero">
      <div class="hero-text">
        <p class="eyebrow">寻医问诊助手</p>
        <h1>整理症状、提供初步建议</h1>
        <p class="sub">非医疗建议，仅供参考；如有严重不适，请尽快线下就医。</p>
      </div>
      <div class="steps">
        <div class="step active">症状信息</div>
        <div class="step-line"></div>
        <div class="step">建议与关注点</div>
      </div>
    </div>

    <div class="layout">
      <div class="left-col">
        <div class="card form-card">
          <div class="card-header">
            <div>
              <div class="title">填写症状</div>
              <div class="caption">尽量提供时间、用药、过敏史等信息</div>
            </div>
            <button class="ghost" @click="resetForm" :disabled="loading">清空</button>
          </div>
          <div class="form-grid single">
            <label>
              主要症状
              <input v-model="symptom" :disabled="loading" placeholder="例：发烧 38.5℃，咳嗽两天" />
            </label>
            <label>
              持续时间 / 变化
              <input v-model="duration" :disabled="loading" placeholder="例：第 3 天，晚上更严重" />
            </label>
            <label>
              已用药 / 副作用
              <textarea v-model="medications" :disabled="loading" rows="2" placeholder="例：吃了布洛芬，胃不适"></textarea>
            </label>
            <label>
              既往史 / 过敏史
              <input v-model="history" :disabled="loading" placeholder="例：有哮喘史，对青霉素过敏" />
            </label>
            <label>
              其他补充
              <textarea v-model="notes" :disabled="loading" rows="2" placeholder="例：近期高强度运动，睡眠不足"></textarea>
            </label>
          </div>
          <div class="form-actions">
            <button class="primary" :disabled="loading" @click="submitForm">提交给 AI</button>
          </div>
        </div>

        <div class="chat-card">
          <div class="chat-header">
            <div>
              <div class="title">对话</div>
              <div class="caption">补充信息或追问</div>
            </div>
            <div class="status" v-if="loading">
              <span class="dot"></span> 正在回复...
            </div>
          </div>

          <div class="messages" :class="{ empty: !messages.length }">
            <div v-if="!messages.length" class="placeholder">
              <div class="placeholder-icon">🩺</div>
              <div>提交症状或直接提问</div>
            </div>
            <template v-else>
              <div v-for="(m, i) in messages" :key="i" :class="['bubble', m.role]">
                <div class="meta">
                  <span class="role" :class="m.role">{{ m.role === 'user' ? '我' : 'AI' }}</span>
                </div>
                <div class="content">{{ m.content }}</div>
              </div>
            </template>
          </div>

          <div class="input-area">
            <input
              v-model="input"
              :disabled="loading"
              placeholder="补充症状或追问，回车发送"
              @keyup.enter="send"
            />
            <button :disabled="loading || !input" @click="send">
              <span v-if="loading" class="spinner"></span>
              <span v-else>发送</span>
            </button>
          </div>
          <div v-if="error" class="error">{{ error }}</div>
        </div>
      </div>

      <div class="prd-card">
        <div class="card-header">
          <div>
            <div class="title">建议摘要</div>
            <div class="caption">仅供参考，请遵医嘱</div>
          </div>
          <div class="card-actions">
            <button class="ghost" :disabled="!summary" @click="copySummary">复制</button>
          </div>
        </div>
        <div class="prd-body" :class="{ empty: !summary }">
          <div v-if="!summary" class="placeholder">AI 生成的建议会展示在这里</div>
          <pre v-else>{{ summary }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const SYSTEM_PROMPT = {
  role: 'system',
  content:
    '你是一名谨慎的全科医生助手，请基于用户描述给出可能的方向、家庭护理建议、何时需要线下就医或急诊的标准，并强调这是非医疗建议。回答要结构化，优先安全。',
};

export default {
  name: 'DoctorView',
  data() {
    return {
      symptom: '',
      duration: '',
      medications: '',
      history: '',
      notes: '',
      input: '',
      messages: [],
      loading: false,
      error: '',
      summary: '',
    };
  },
  methods: {
    buildPayload(messages) {
      return [SYSTEM_PROMPT, ...messages];
    },
    resetForm() {
      this.symptom = '';
      this.duration = '';
      this.medications = '';
      this.history = '';
      this.notes = '';
      this.input = '';
      this.messages = [];
      this.summary = '';
      this.error = '';
    },
    async submitForm() {
      if (this.loading) return;
      const parts = [
        this.symptom && `症状：${this.symptom}`,
        this.duration && `持续时间/变化：${this.duration}`,
        this.medications && `已用药：${this.medications}`,
        this.history && `既往史/过敏史：${this.history}`,
        this.notes && `其他：${this.notes}`,
      ].filter(Boolean);

      if (!parts.length) {
        this.error = '请至少填写症状';
        return;
      }

      const content = `请按“可能方向-需要警惕的信号-建议的就医时机-家庭护理与注意事项”整理：\n${parts.join('\n')}`;
      await this.sendMessage(content, true);
    },
    async send() {
      if (!this.input || this.loading) return;
      const content = this.input;
      this.input = '';
      await this.sendMessage(content, false);
    },
    async sendMessage(content, shouldSummarize) {
      const userMessage = { role: 'user', content };
      this.messages.push(userMessage);

      const aiMessage = { role: 'assistant', content: '' };
      this.messages.push(aiMessage);

      this.loading = true;
      this.error = '';

      try {
        const res = await fetch('https://pm-assistant-api-5w1t.vercel.app/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: this.buildPayload(this.messages.slice(0, -1)) }),
        });

        if (!res.ok) {
          const text = await res.text();
          this.loading = false;
          aiMessage.content = `接口错误 ${res.status}: ${text || '无返回体'}`;
          return;
        }

        const contentType = res.headers.get('content-type') || '';
        const isSse = contentType.includes('text/event-stream');

        if (!isSse) {
          const text = await res.text();
          this.loading = false;
          aiMessage.content = text || '接口返回空内容，请检查云函数日志';
          if (shouldSummarize) this.summary = aiMessage.content;
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let buffer = '';
        let draft = '';

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const events = buffer.split('\n\n');
          buffer = events.pop();
          for (const event of events) {
            const line = event.trim();
            if (!line.startsWith('data:')) continue;
            const data = line.replace('data:', '').trim();
            if (data === '[DONE]') {
              this.loading = false;
              if (shouldSummarize) this.summary = draft;
              return;
            }
            draft += data;
            aiMessage.content = draft;
          }
        }

        this.loading = false;
        if (shouldSummarize) this.summary = draft;
      } catch (err) {
        this.loading = false;
        aiMessage.content = `请求异常: ${err.message}`;
      }
    },
    async copySummary() {
      if (!this.summary) return;
      try {
        await navigator.clipboard.writeText(this.summary);
        this.error = '';
      } catch (e) {
        this.error = '复制失败，请手动复制';
      }
    },
  },
};
</script>
