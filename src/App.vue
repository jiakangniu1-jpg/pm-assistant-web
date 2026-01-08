<template>
  <div class="page">
    <div class="hero">
      <div class="hero-text">
        <p class="eyebrow">AI 产品助手 · GPT 风格</p>
        <h1>用对话快速收敛 PRD</h1>
        <p class="sub">
          先用表单提交关键需求，再通过对话补充细节，信息充分后生成 PRD。
        </p>
      </div>
      <div class="steps">
        <div :class="['step', stage === 'collect' ? 'active' : '']">收集需求</div>
        <div class="step-line"></div>
        <div :class="['step', stage === 'prd' ? 'active' : '']">生成 PRD</div>
      </div>
    </div>

    <div class="toolbar">
      <div class="field">
        <label>PRD 模板</label>
        <select v-model="selectedTemplateId">
          <option v-for="tpl in templates" :key="tpl.id" :value="tpl.id">
            {{ tpl.name }}
          </option>
        </select>
        <p class="hint">{{ currentTemplate.desc }}</p>
      </div>
      <div class="field">
        <label>快捷插入</label>
        <div class="chips">
          <button
            v-for="(p, idx) in quickPrompts"
            :key="idx"
            class="chip"
            type="button"
            @click="insertQuick(p)"
          >
            {{ p }}
          </button>
        </div>
      </div>
      <div class="actions">
        <button class="ghost" @click="newChat" :disabled="loading">新建对话</button>
        <button class="primary" @click="generatePrd" :disabled="loading || !messages.length">生成 PRD</button>
      </div>
    </div>

    <div class="layout">
      <div class="left-col">
        <div class="card form-card">
          <div class="card-header">
            <div>
              <div class="title">需求表单</div>
              <div class="caption">先提交结构化信息，AI 更快进入追问与生成</div>
            </div>
            <button class="ghost" @click="resetForm" :disabled="loading">清空</button>
          </div>
          <div class="form-grid">
            <label>
              标题 / 项目名
              <input v-model="form.title" :disabled="loading" placeholder="例：移动端会员增长优化" />
            </label>
            <label>
              目标 / 成功指标
              <input v-model="form.goal" :disabled="loading" placeholder="例：次月留存+8%，会员转化率+5%" />
            </label>
            <label>
              目标用户 / 画像
              <input v-model="form.users" :disabled="loading" placeholder="例：新注册用户、一线城市白领" />
            </label>
            <label>
              主要场景
              <input v-model="form.scenario" :disabled="loading" placeholder="例：首页推荐、签到、任务中心" />
            </label>
            <label>
              核心功能
              <textarea v-model="form.features" :disabled="loading" rows="2" placeholder="例：任务墙、积分商城、成长体系"></textarea>
            </label>
            <label>
              不做什么 / 边界
              <textarea v-model="form.outOfScope" :disabled="loading" rows="2" placeholder="例：不改后端结算、不做跨境支付"></textarea>
            </label>
            <label>
              时间线 / 里程碑
              <input v-model="form.timeline" :disabled="loading" placeholder="例：MVP 2 周，Beta 4 周，上线 6 周" />
            </label>
            <label>
              风险与依赖
              <textarea v-model="form.risks" :disabled="loading" rows="2" placeholder="例：数据埋点未齐，设计资源紧张"></textarea>
            </label>
          </div>
          <div class="form-actions">
            <button class="primary" :disabled="loading" @click="submitForm">提交表单给 AI</button>
          </div>
        </div>

        <div class="chat-card">
          <div class="chat-header">
            <div>
              <div class="title">对话</div>
              <div class="caption">提交表单后可继续追问补充</div>
            </div>
            <div class="status" v-if="loading">
              <span class="dot"></span> 正在思考...
            </div>
          </div>

          <div class="messages" :class="{ empty: !messages.length }">
            <div v-if="!messages.length" class="placeholder">
              <div class="placeholder-icon">💬</div>
              <div>先提交表单或直接开始对话</div>
            </div>
            <template v-else>
              <div
                v-for="(m, i) in messages"
                :key="i"
                :class="['bubble', m.role]"
              >
                <div class="meta">
                  <span class="role" :class="m.role">
                    {{ m.role === 'user' ? '我' : 'AI' }}
                  </span>
                </div>
                <div class="content">{{ m.content }}</div>
              </div>
            </template>
          </div>

          <div class="input-area">
            <input
              v-model="input"
              :disabled="loading"
              placeholder="描述你的想法或补充信息，回车发送"
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
            <div class="title">PRD 预览</div>
            <div class="caption">生成后可复制 / 下载</div>
          </div>
          <div class="card-actions">
            <button class="ghost" :disabled="!prdContent" @click="copyPrd">复制</button>
            <button class="ghost" :disabled="!prdContent" @click="downloadPrd">下载 .md</button>
          </div>
        </div>
        <div class="prd-body" :class="{ empty: !prdContent }">
          <div v-if="!prdContent" class="placeholder">生成后将在此展示 PRD 内容</div>
          <pre v-else>{{ prdContent }}</pre>
        </div>
      </div>
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
      error: "",
      prdContent: "",
      selectedTemplateId: "std",
      templates: [
        {
          id: "std",
          name: "通用 PRD",
          desc: "背景/目标/用户/需求列表/流程/里程碑/风险/不做什么",
          sections: [
            "项目背景与目标",
            "成功指标",
            "用户画像与场景",
            "需求列表(含优先级)",
            "核心流程",
            "数据与接口",
            "里程碑",
            "风险与不做什么",
          ],
        },
        {
          id: "b2b",
          name: "ToB 产品",
          desc: "痛点与业务价值/角色权限/集成依赖/交付验收",
          sections: [
            "客户痛点与业务价值",
            "买方与用方角色/权限",
            "功能与非功能需求",
            "集成与数据依赖",
            "交付与验收标准",
            "里程碑",
            "风险与约束",
          ],
        },
        {
          id: "data",
          name: "数据产品",
          desc: "指标定义/数据来源/口径/权限/质量与性能",
          sections: [
            "项目背景与目标指标",
            "核心口径与字段",
            "数据来源与同步链路",
            "权限与分级",
            "性能与质量要求",
            "界面与交互",
            "风险与不做什么",
          ],
        },
      ],
      quickPrompts: [
        "用户是谁，日常场景是什么",
        "核心目标与成功指标",
        "最小可行版本包含哪些功能",
        "不做什么/边界是什么",
        "上线时间与里程碑预期",
        "主要风险与依赖",
      ],
      form: {
        title: "",
        goal: "",
        users: "",
        scenario: "",
        features: "",
        outOfScope: "",
        timeline: "",
        risks: "",
      },
    };
  },
  computed: {
    currentTemplate() {
      return this.templates.find((t) => t.id === this.selectedTemplateId) || this.templates[0];
    },
    stage() {
      return this.prdContent ? "prd" : "collect";
    },
  },
  methods: {
    insertQuick(text) {
      this.input = this.input ? `${this.input} ${text}` : text;
    },
    resetForm() {
      this.form = {
        title: "",
        goal: "",
        users: "",
        scenario: "",
        features: "",
        outOfScope: "",
        timeline: "",
        risks: "",
      };
    },
    newChat() {
      if (this.loading) return;
      this.input = "";
      this.messages = [];
      this.prdContent = "";
      this.error = "";
    },
    async submitForm() {
      if (this.loading) return;
      const parts = [
        this.form.title && `标题/项目：${this.form.title}`,
        this.form.goal && `目标/成功指标：${this.form.goal}`,
        this.form.users && `目标用户：${this.form.users}`,
        this.form.scenario && `主要场景：${this.form.scenario}`,
        this.form.features && `核心功能：${this.form.features}`,
        this.form.outOfScope && `不做什么/边界：${this.form.outOfScope}`,
        this.form.timeline && `时间线/里程碑：${this.form.timeline}`,
        this.form.risks && `风险与依赖：${this.form.risks}`,
      ].filter(Boolean);

      if (!parts.length) {
        this.error = "请至少填写一项再提交";
        return;
      }

      const content = `以下是本次需求表单，请先阅读并向我确认缺失信息，再进入追问：\n${parts.join("\n")}`;
      await this.sendMessage(content);
    },
    async send() {
      if (!this.input || this.loading) return;
      const content = this.input;
      this.input = "";
      await this.sendMessage(content);
    },
    async sendMessage(content) {
      const userMessage = {
        role: "user",
        content,
      };

      this.messages.push(userMessage);

      const aiMessage = {
        role: "assistant",
        content: "",
      };
      this.messages.push(aiMessage);

      this.loading = true;
      this.error = "";

      try {
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

        if (!res.ok) {
          const text = await res.text();
          this.loading = false;
          aiMessage.content = `接口错误 ${res.status}: ${text || "无返回体"}`;
          return;
        }

        const contentType = res.headers.get("content-type") || "";
        const isSse = contentType.includes("text/event-stream");

        if (!isSse) {
          const text = await res.text();
          this.loading = false;
          aiMessage.content = text || "接口返回空内容，请检查云函数日志";
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder("utf-8");

        let buffer = "";

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          const events = buffer.split("\n\n");
          buffer = events.pop();

          for (const event of events) {
            const line = event.trim();

            if (!line.startsWith("data:")) continue;

            const data = line.replace("data:", "").trim();

            if (data === "[DONE]") {
              this.loading = false;
              return;
            }

            aiMessage.content += data;
          }
        }

        this.loading = false;
      } catch (err) {
        this.loading = false;
        aiMessage.content = `请求异常: ${err.message}`;
      }
    },
    async generatePrd() {
      if (!this.messages.length || this.loading) return;
      this.loading = true;
      this.error = "";
      this.prdContent = "";

      const prompt = `请基于本次对话内容，按照模板「${
        this.currentTemplate.name
      }」生成一份结构化 PRD，包含：${this.currentTemplate.sections.join(", ")}。突出风险与不做什么，给出清晰的里程碑。`;

      try {
        const res = await fetch(
          "https://pm-assistant-api-5w1t.vercel.app/api/chat",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              messages: [...this.messages, { role: "user", content: prompt }],
            }),
          }
        );

        if (!res.ok) {
          const text = await res.text();
          this.loading = false;
          this.prdContent = `接口错误 ${res.status}: ${text || "无返回体"}`;
          return;
        }

        const contentType = res.headers.get("content-type") || "";
        const isSse = contentType.includes("text/event-stream");

        if (!isSse) {
          const text = await res.text();
          this.loading = false;
          this.prdContent = text || "接口返回空内容，请检查云函数日志";
          this.messages.push({ role: "assistant", content: this.prdContent });
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let buffer = "";
        let draft = "";

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const events = buffer.split("\n\n");
          buffer = events.pop();

          for (const event of events) {
            const line = event.trim();
            if (!line.startsWith("data:")) continue;
            const data = line.replace("data:", "").trim();
            if (data === "[DONE]") {
              this.loading = false;
              this.messages.push({ role: "assistant", content: draft || "(空 PRD 返回)" });
              return;
            }
            draft += data;
            this.prdContent = draft;
          }
        }

        this.loading = false;
        this.prdContent = draft;
        this.messages.push({ role: "assistant", content: draft || "(空 PRD 返回)" });
      } catch (err) {
        this.loading = false;
        this.prdContent = `请求异常: ${err.message}`;
      }
    },
    async copyPrd() {
      if (!this.prdContent) return;
      try {
        await navigator.clipboard.writeText(this.prdContent);
        this.error = "";
      } catch (e) {
        this.error = "复制失败，请手动复制";
      }
    },
    downloadPrd() {
      if (!this.prdContent) return;
      const blob = new Blob([this.prdContent], { type: "text/markdown;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "prd.md";
      a.click();
      URL.revokeObjectURL(url);
    },
  },
};
</script>

<style>
:root {
  --bg: #f7f8fa;
  --card: #ffffff;
  --border: #e5e7eb;
  --text: #1f2937;
  --muted: #6b7280;
  --accent: #10a37f;
  --user: #dfe6f5;
  --assistant: #ecfdf4;
  --shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: "Inter", "PingFang SC", "Microsoft YaHei", sans-serif;
  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
}

.page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 32px 20px 60px;
}

.hero {
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.hero-text {
  background: #f2f5f8;
  border: 1px solid #eef1f4;
  border-radius: 16px;
  padding: 18px 20px;
  box-shadow: var(--shadow);
}

.steps {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 999px;
  padding: 6px 10px;
  box-shadow: var(--shadow);
}

.step {
  padding: 6px 14px;
  border-radius: 999px;
  background: #f3f4f6;
  color: var(--muted);
  font-weight: 600;
  font-size: 13px;
}

.step.active {
  background: rgba(16, 163, 127, 0.12);
  color: var(--accent);
  border: 1px solid rgba(16, 163, 127, 0.25);
}

.step-line {
  width: 26px;
  height: 2px;
  background: var(--border);
}

.eyebrow {
  margin: 0 0 8px;
  letter-spacing: 0.08em;
  color: var(--muted);
  font-size: 12px;
  text-transform: uppercase;
}

h1 {
  margin: 0 0 8px;
  font-size: 26px;
  font-weight: 700;
  color: #0f172a;
}

.sub {
  margin: 0;
  color: var(--muted);
  line-height: 1.6;
}

.toolbar {
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 14px 16px;
  box-shadow: var(--shadow);
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 12px;
  align-items: center;
  margin-bottom: 14px;
}

.field label {
  display: block;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 6px;
}

.field select {
  width: 100%;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: #fff;
  color: #0f172a;
}

.hint {
  margin: 6px 0 0;
  color: var(--muted);
  font-size: 12px;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.chip {
  border: 1px solid var(--border);
  background: #fff;
  color: #0f172a;
  border-radius: 999px;
  padding: 6px 10px;
  cursor: pointer;
  font-size: 13px;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.chip:hover {
  border-color: rgba(16, 163, 127, 0.6);
  box-shadow: 0 2px 8px rgba(16, 163, 127, 0.15);
}

.actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.ghost,
.primary {
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 10px 14px;
  font-weight: 600;
  cursor: pointer;
  background: #fff;
  color: #0f172a;
  transition: all 0.15s ease;
}

.primary {
  background: linear-gradient(120deg, var(--accent), #16c79a);
  color: #fff;
  border: none;
  box-shadow: 0 8px 20px rgba(16, 163, 127, 0.25);
}

.ghost:disabled,
.primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.layout {
  display: grid;
  grid-template-columns: 1.25fr 0.75fr;
  gap: 14px;
}

.left-col {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.card,
.chat-card,
.prd-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 18px;
  box-shadow: var(--shadow);
  padding: 18px;
}

.form-card .form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 10px;
}

.form-card label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-weight: 600;
  color: #0f172a;
}

.form-card input,
.form-card textarea {
  width: 100%;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: #fff;
  color: #0f172a;
  outline: none;
  resize: vertical;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-card input:focus,
.form-card textarea:focus {
  border-color: rgba(16, 163, 127, 0.6);
  box-shadow: 0 0 0 3px rgba(16, 163, 127, 0.15);
}

.form-actions {
  margin-top: 12px;
  text-align: right;
}

.chat-header,
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.title {
  font-weight: 700;
  color: #0f172a;
}

.caption {
  color: var(--muted);
  font-size: 13px;
}

.status {
  color: var(--muted);
  font-size: 13px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 0 6px rgba(16, 163, 127, 0.15);
}

.messages {
  min-height: 240px;
  max-height: 440px;
  overflow-y: auto;
  padding: 12px;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: #fafbfc;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.messages.empty {
  justify-content: center;
  align-items: center;
}

.placeholder {
  text-align: center;
  color: var(--muted);
}

.placeholder-icon {
  font-size: 28px;
  margin-bottom: 8px;
}

.bubble {
  max-width: 85%;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid var(--border);
  box-shadow: 0 6px 18px rgba(15, 23, 42, 0.06);
  line-height: 1.6;
}

.bubble.user {
  align-self: flex-end;
  background: var(--user);
  border-color: #d5ddf0;
}

.bubble.assistant {
  align-self: flex-start;
  background: var(--assistant);
  border-color: #cdeee2;
}

.meta {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
  font-size: 12px;
  color: var(--muted);
}

.role.user {
  color: #4b5563;
}

.role.assistant {
  color: var(--accent);
}

.content {
  color: #111827;
  white-space: pre-wrap;
}

.input-area {
  display: flex;
  gap: 10px;
  margin-top: 12px;
}

.input-area input {
  flex: 1;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: #fff;
  color: #0f172a;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.input-area input:focus {
  border-color: rgba(16, 163, 127, 0.6);
  box-shadow: 0 0 0 3px rgba(16, 163, 127, 0.18);
}

.input-area input:disabled {
  opacity: 0.7;
}

.input-area button {
  width: 96px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(120deg, var(--accent), #16c79a);
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease;
  box-shadow: 0 8px 20px rgba(16, 163, 127, 0.25);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.input-area button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.input-area button:not(:disabled):active {
  transform: translateY(1px);
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.35);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.9s linear infinite;
}

.error {
  margin-top: 8px;
  color: #d14343;
  font-size: 13px;
}

.prd-card .card-actions {
  display: flex;
  gap: 8px;
}

.prd-body {
  margin-top: 10px;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: #fafbfc;
  min-height: 260px;
  max-height: 460px;
  overflow: auto;
  padding: 12px;
}

.prd-body pre {
  margin: 0;
  white-space: pre-wrap;
  color: #111827;
  font-family: "JetBrains Mono", "SFMono-Regular", Menlo, Monaco, Consolas, monospace;
  font-size: 14px;
  line-height: 1.6;
}

.prd-body.empty {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--muted);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 1100px) {
  .layout {
    grid-template-columns: 1fr;
  }
  .toolbar {
    grid-template-columns: 1fr;
  }
  .actions {
    justify-content: flex-start;
  }
  .form-card .form-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .bubble {
    max-width: 100%;
  }
  .input-area {
    flex-direction: column;
  }
  .input-area button {
    width: 100%;
  }
}
</style>
