<template>
  <div class="page">
    <div class="hero">
      <div class="hero-text">
        <p class="eyebrow">程序员助手</p>
        <h1>帮你查 BUG、给思路、提优化</h1>
        <p class="sub">描述问题或粘贴代码，AI 以资深程序员视角给出定位、修复与优化建议。</p>
      </div>
      <div class="steps">
        <div class="step active">问题上下文</div>
        <div class="step-line"></div>
        <div class="step">分析与建议</div>
      </div>
    </div>

    <div class="layout">
      <div class="left-col">
        <div class="card form-card">
          <div class="card-header">
            <div>
              <div class="title">提交问题</div>
              <div class="caption">尽量提供复现步骤、报错、预期行为</div>
            </div>
            <button class="ghost" @click="resetContext" :disabled="loading">清空</button>
          </div>
          <div class="form-grid single">
            <label>
              问题简述 / 期望
              <input v-model="issue" :disabled="loading" placeholder="例：接口 500，期望返回 200" />
            </label>
            <label>
              关键日志 / 报错
              <textarea v-model="logs" :disabled="loading" rows="2" placeholder="例：TypeError: xxx is not a function"></textarea>
            </label>
            <label>
              代码片段（可选）
              <textarea v-model="codeSnippet" :disabled="loading" rows="4" placeholder="粘贴相关函数/配置"></textarea>
            </label>
            <label>
              预期行为 / 约束
              <input v-model="expectation" :disabled="loading" placeholder="例：兼容移动端，需保持向后兼容" />
            </label>
          </div>
          <div class="form-actions">
            <button class="primary" :disabled="loading" @click="submitContext">提交给 AI</button>
          </div>
        </div>

        <div class="chat-card">
          <div class="chat-header">
            <div>
              <div class="title">对话</div>
              <div class="caption">继续补充细节或询问实现思路</div>
            </div>
            <div class="chat-controls">
              <div class="status" v-if="loading">
                <span class="dot"></span> 正在分析...
              </div>
              <button
                v-else-if="canRestoreSession"
                class="ghost compact"
                type="button"
                @click="restoreSession"
                :disabled="loading"
              >
                恢复上次会话
              </button>
            </div>
          </div>

          <div class="messages" :class="{ empty: !messages.length }">
            <div v-if="!messages.length" class="placeholder">
              <div class="placeholder-icon">🧑‍💻</div>
              <div>先提交上下文或直接提问</div>
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

          <div class="chips" style="margin-top: 8px;">
            <button class="chip" type="button" @click="insertQuick('请给出最小复现和排查步骤')">排查步骤</button>
            <button class="chip" type="button" @click="insertQuick('请给出性能优化建议和复杂度分析')">性能优化</button>
            <button class="chip" type="button" @click="insertQuick('请指出潜在安全风险')">安全风险</button>
          </div>

          <div class="input-area">
            <input
              v-model="input"
              :disabled="loading"
              placeholder="继续提问或补充信息，回车发送"
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
            <div class="title">摘要 / ToDo</div>
            <div class="caption">AI 的行动建议汇总</div>
          </div>
          <div class="card-actions">
            <button class="ghost" :disabled="!summary" @click="copySummary">复制</button>
          </div>
        </div>
        <div class="prd-body" :class="{ empty: !summary }">
          <div v-if="!summary" class="placeholder">AI 建议将展示在此处</div>
          <pre v-else>{{ summary }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const DEV_SESSION_KEY = 'dev-session';

const SYSTEM_PROMPT = {
  role: 'system',
  content:
    '你是一名资深程序员，请用清晰的步骤诊断问题，指出根因，给出修复建议、可能的副作用，并提供可选的优化。回答尽量简洁，必要时给代码片段。',
};

export default {
  name: 'ProgrammerView',
  data() {
    return {
      issue: '',
      logs: '',
      codeSnippet: '',
      expectation: '',
      input: '',
      messages: [],
      loading: false,
      error: '',
      summary: '',
      hasSavedSession: false,
    };
  },
  computed: {
    canRestoreSession() {
      return this.hasSavedSession && !this.messages.length && !this.loading;
    },
  },
  created() {
    this.checkSavedSession();
  },
  methods: {
    buildPayload(messages) {
      return [SYSTEM_PROMPT, ...messages];
    },
    checkSavedSession() {
      if (typeof window === 'undefined') return;
      this.hasSavedSession = !!localStorage.getItem(DEV_SESSION_KEY);
    },
    persistSession() {
      if (typeof window === 'undefined') return;
      try {
        const snapshot = {
          issue: this.issue,
          logs: this.logs,
          codeSnippet: this.codeSnippet,
          expectation: this.expectation,
          input: this.input,
          messages: this.messages,
          summary: this.summary,
        };
        localStorage.setItem(DEV_SESSION_KEY, JSON.stringify(snapshot));
        this.hasSavedSession = true;
      } catch (err) {
        console.warn('Failed to persist dev session', err);
      }
    },
    restoreSession() {
      if (this.loading || typeof window === 'undefined') return;
      const raw = localStorage.getItem(DEV_SESSION_KEY);
      if (!raw) return;
      try {
        const parsed = JSON.parse(raw);
        this.issue = parsed.issue || '';
        this.logs = parsed.logs || '';
        this.codeSnippet = parsed.codeSnippet || '';
        this.expectation = parsed.expectation || '';
        this.input = parsed.input || '';
        this.messages = parsed.messages || [];
        this.summary = parsed.summary || '';
        this.hasSavedSession = true;
      } catch (err) {
        console.warn('Failed to restore dev session', err);
        this.clearSessionSnapshot();
      }
    },
    clearSessionSnapshot() {
      if (typeof window === 'undefined') return;
      localStorage.removeItem(DEV_SESSION_KEY);
      this.hasSavedSession = false;
    },
    insertQuick(text) {
      this.input = this.input ? `${this.input} ${text}` : text;
    },
    resetContext() {
      this.issue = '';
      this.logs = '';
      this.codeSnippet = '';
      this.expectation = '';
      this.messages = [];
      this.input = '';
      this.summary = '';
      this.error = '';
      this.clearSessionSnapshot();
    },
    async submitContext() {
      if (this.loading) return;
      const parts = [
        this.issue && `问题：${this.issue}`,
        this.logs && `日志/报错：${this.logs}`,
        this.expectation && `期望：${this.expectation}`,
        this.codeSnippet && `代码：\n${this.codeSnippet}`,
      ].filter(Boolean);

      if (!parts.length) {
        this.error = '请至少填写问题描述';
        return;
      }

      const content = `请按“定位原因-修复方案-验证步骤-注意事项”给建议：\n${parts.join('\n')}`;
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
          this.persistSession();
          return;
        }

        const contentType = res.headers.get('content-type') || '';
        const isSse = contentType.includes('text/event-stream');

        if (!isSse) {
          const text = await res.text();
          this.loading = false;
          aiMessage.content = text || '接口返回空内容，请检查云函数日志';
          if (shouldSummarize) this.summary = aiMessage.content;
          this.persistSession();
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
              this.persistSession();
              return;
            }
            draft += data;
            aiMessage.content = draft;
          }
        }

        this.loading = false;
        if (shouldSummarize) this.summary = draft;
        this.persistSession();
      } catch (err) {
        this.loading = false;
        aiMessage.content = `请求异常: ${err.message}`;
        this.persistSession();
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
