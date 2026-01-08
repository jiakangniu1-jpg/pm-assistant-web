<template>
  <div class="page">
    <div class="hero">
      <div class="hero-text">
        <p class="eyebrow">AI 产品助手</p>
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
        <label>身份</label>
        <select v-model="userIdentity">
          <option value="">普通用户（AI 中立）</option>
          <option value="pm">产品经理（AI 以产品经理身份回复）</option>
        </select>
        <p class="hint">选择身份以调整 AI 视角和语气</p>
      </div>

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
        <div class="card session-card">
          <div class="card-header">
            <div>
              <div class="title">历史会话</div>
              <div class="caption">点击进入历史对话，自动保存</div>
            </div>
            <button class="ghost compact" type="button" @click="newChat" :disabled="loading">新会话</button>
          </div>

          <div class="session-list" :class="{ empty: !sessionsSorted.length }">
            <div v-if="!sessionsSorted.length" class="placeholder">暂无会话，点击“新会话”开始</div>
            <div
              v-else
              v-for="s in sessionsSorted"
              :key="s.id"
              class="session-item"
              :class="{ active: s.id === activeSessionId }"
              @click="openSession(s.id)"
            >
              <div class="session-main">
                <div class="session-name">{{ s.name }}</div>
                <div class="session-time">{{ formatTime(s.updatedAt) }}</div>
              </div>
              <div class="session-actions" @click.stop>
                <button class="icon-btn" type="button" @click="renameSession(s.id)">重命名</button>
                <button class="icon-btn danger" type="button" @click="deleteSession(s.id)">删除</button>
              </div>
            </div>
          </div>
        </div>

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
            <div class="chat-controls">
              <div class="status" v-if="loading">
                <span class="dot"></span> 正在思考...
              </div>
              <div v-else class="hint">当前会话：{{ activeSessionName }}</div>
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
const PM_SESSIONS_KEY = 'pm-sessions';
const PM_ACTIVE_ID_KEY = 'pm-active-session-id';
const PM_LEGACY_KEY = 'pm-session';

function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export default {
  name: 'PMView',
  data() {
    return {
      input: '',
      messages: [],
      loading: false,
      error: '',
      prdContent: '',
      userIdentity: '',
      selectedTemplateId: 'std',

      sessions: [],
      activeSessionId: '',

      templates: [
        {
          id: 'std',
          name: '通用 PRD',
          desc: '背景/目标/用户/需求列表/流程/里程碑/风险/不做什么',
          sections: [
            '项目背景与目标',
            '成功指标',
            '用户画像与场景',
            '需求列表(含优先级)',
            '核心流程',
            '数据与接口',
            '里程碑',
            '风险与不做什么',
          ],
        },
        {
          id: 'b2b',
          name: 'ToB 产品',
          desc: '痛点与业务价值/角色权限/集成依赖/交付验收',
          sections: [
            '客户痛点与业务价值',
            '买方与用方角色/权限',
            '功能与非功能需求',
            '集成与数据依赖',
            '交付与验收标准',
            '里程碑',
            '风险与约束',
          ],
        },
        {
          id: 'data',
          name: '数据产品',
          desc: '指标定义/数据来源/口径/权限/质量与性能',
          sections: [
            '项目背景与目标指标',
            '核心口径与字段',
            '数据来源与同步链路',
            '权限与分级',
            '性能与质量要求',
            '界面与交互',
            '风险与不做什么',
          ],
        },
      ],
      quickPrompts: [
        '用户是谁，日常场景是什么',
        '核心目标与成功指标',
        '最小可行版本包含哪些功能',
        '不做什么/边界是什么',
        '上线时间与里程碑预期',
        '主要风险与依赖',
      ],
      form: {
        title: '',
        goal: '',
        users: '',
        scenario: '',
        features: '',
        outOfScope: '',
        timeline: '',
        risks: '',
      },
    };
  },
  computed: {
    currentTemplate() {
      return this.templates.find((t) => t.id === this.selectedTemplateId) || this.templates[0];
    },
    stage() {
      return this.prdContent ? 'prd' : 'collect';
    },
    systemMessage() {
      if (this.userIdentity === 'pm') {
        return {
          role: 'system',
          content:
            '你是一名资深产品经理，请帮助用户澄清目标与场景，补齐需求、边界、数据、里程碑和风险，给出清晰、礼貌、结构化的回复。',
        };
      }
      return null;
    },
    sessionsSorted() {
      return [...this.sessions].sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
    },
    activeSessionName() {
      const cur = this.sessions.find((s) => s.id === this.activeSessionId);
      return (cur && cur.name) || '未命名';
    },
  },
  created() {
    this.initSessions();
  },
  methods: {


    buildPayload(messages) {
      const system = this.systemMessage;
      return system ? [system, ...messages] : messages;
    },
    formatTime(ts) {
      if (!ts) return '';
      try {
        return new Date(ts).toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        });
      } catch (e) {
        return '';
      }
    },
    defaultSnapshot() {
      return {
        messages: [],
        prdContent: '',
        form: {
          title: '',
          goal: '',
          users: '',
          scenario: '',
          features: '',
          outOfScope: '',
          timeline: '',
          risks: '',
        },
        selectedTemplateId: 'std',
        userIdentity: '',
      };
    },
    initSessions() {
      if (typeof window === 'undefined') return;

      let sessions = [];
      try {
        sessions = JSON.parse(localStorage.getItem(PM_SESSIONS_KEY) || '[]') || [];
      } catch (e) {
        sessions = [];
      }

      // 旧数据迁移：把单会话快照转成会话列表
      if (!sessions.length) {
        const legacy = localStorage.getItem(PM_LEGACY_KEY);
        if (legacy) {
          try {
            const parsed = JSON.parse(legacy);
            sessions = [
              {
                id: uid(),
                name: '迁移的会话',
                updatedAt: Date.now(),
                snapshot: {
                  ...this.defaultSnapshot(),
                  ...parsed,
                  form: { ...this.defaultSnapshot().form, ...(parsed.form || {}) },
                },
              },
            ];
            localStorage.removeItem(PM_LEGACY_KEY);
          } catch (e) {
            sessions = [];
          }
        }
      }

      if (!sessions.length) {
        sessions = [
          {
            id: uid(),
            name: '新会话',
            updatedAt: Date.now(),
            snapshot: this.defaultSnapshot(),
          },
        ];
      }

      let activeId = localStorage.getItem(PM_ACTIVE_ID_KEY) || '';
      if (!activeId || !sessions.some((s) => s.id === activeId)) {
        activeId = sessions[0].id;
      }

      this.sessions = sessions;
      this.activeSessionId = activeId;
      localStorage.setItem(PM_ACTIVE_ID_KEY, activeId);
      this.applySnapshot(this.getActiveSession()?.snapshot || this.defaultSnapshot());
      this.saveSessions();
    },
    saveSessions() {
      if (typeof window === 'undefined') return;
      localStorage.setItem(PM_SESSIONS_KEY, JSON.stringify(this.sessions));
      if (this.activeSessionId) localStorage.setItem(PM_ACTIVE_ID_KEY, this.activeSessionId);
    },
    getActiveSession() {
      return this.sessions.find((s) => s.id === this.activeSessionId) || null;
    },
    applySnapshot(snapshot) {
      const s = snapshot || this.defaultSnapshot();
      this.messages = s.messages || [];
      this.prdContent = s.prdContent || '';
      this.form = { ...this.defaultSnapshot().form, ...(s.form || {}) };
      this.selectedTemplateId = s.selectedTemplateId || 'std';
      this.userIdentity = s.userIdentity || '';
      this.input = '';
      this.loading = false;
      this.error = '';
    },
    makeSnapshot() {
      return {
        messages: this.messages,
        prdContent: this.prdContent,
        form: this.form,
        selectedTemplateId: this.selectedTemplateId,
        userIdentity: this.userIdentity,
      };
    },
    persistActiveSession() {
      const cur = this.getActiveSession();
      if (!cur) return;
      cur.snapshot = this.makeSnapshot();
      cur.updatedAt = Date.now();
      this.saveSessions();
    },
    ensureActiveSession() {
      if (this.activeSessionId && this.getActiveSession()) return;
      this.newChat();
    },
    openSession(id) {
      if (this.loading) return;
      if (id === this.activeSessionId) return;
      this.persistActiveSession();
      this.activeSessionId = id;
      localStorage.setItem(PM_ACTIVE_ID_KEY, id);
      const target = this.sessions.find((s) => s.id === id);
      this.applySnapshot((target && target.snapshot) || this.defaultSnapshot());
      this.saveSessions();
    },
    renameSession(id) {
      const s = this.sessions.find((x) => x.id === id);
      if (!s) return;
      const name = window.prompt('请输入会话名称', s.name || '');
      if (!name) return;
      s.name = name.trim().slice(0, 30) || s.name;
      s.updatedAt = Date.now();
      this.saveSessions();
    },
    deleteSession(id) {
      if (this.loading) return;
      const idx = this.sessions.findIndex((x) => x.id === id);
      if (idx < 0) return;
      const removed = this.sessions.splice(idx, 1)[0];
      if (removed && removed.id === this.activeSessionId) {
        const next = this.sessions[0];
        if (next) {
          this.activeSessionId = next.id;
          this.applySnapshot(next.snapshot || this.defaultSnapshot());
        } else {
          // 如果删光了，就新建一个空会话
          this.newChat();
        }
      }
      this.saveSessions();
    },

    insertQuick(text) {

      this.input = this.input ? `${this.input} ${text}` : text;
    },
    resetForm() {
      this.form = {
        title: '',
        goal: '',
        users: '',
        scenario: '',
        features: '',
        outOfScope: '',
        timeline: '',
        risks: '',
      };
    },
    newChat() {
      if (this.loading) return;
      this.persistActiveSession();

      const id = uid();
      const session = {
        id,
        name: `会话 ${new Date().toLocaleString('zh-CN')}`,
        updatedAt: Date.now(),
        snapshot: this.defaultSnapshot(),
      };
      this.sessions.unshift(session);
      this.activeSessionId = id;
      this.applySnapshot(session.snapshot);
      this.saveSessions();
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
        this.error = '请至少填写一项再提交';
        return;
      }

      const content = `以下是本次需求表单，请先阅读并向我确认缺失信息，再进入追问：\n${parts.join('\n')}`;
      await this.sendMessage(content);
    },
    async send() {
      if (!this.input || this.loading) return;
      const content = this.input;
      this.input = '';
      await this.sendMessage(content);
    },
    async sendMessage(content) {
      this.ensureActiveSession();

      const userMessage = {
        role: 'user',
        content,
      };

      this.messages.push(userMessage);

      const aiMessage = {
        role: 'assistant',
        content: '',
      };
      this.messages.push(aiMessage);

      this.loading = true;
      this.error = '';

      try {
        const res = await fetch('https://pm-assistant-api-5w1t.vercel.app/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: this.buildPayload(this.messages.slice(0, -1)),
          }),
        });

        if (!res.ok) {
          const text = await res.text();
          this.loading = false;
          aiMessage.content = `接口错误 ${res.status}: ${text || '无返回体'}`;
          this.persistActiveSession();
          return;
        }

        const contentType = res.headers.get('content-type') || '';
        const isSse = contentType.includes('text/event-stream');

        if (!isSse) {
          const text = await res.text();
          this.loading = false;
          aiMessage.content = text || '接口返回空内容，请检查云函数日志';
          this.persistActiveSession();
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder('utf-8');

        let buffer = '';

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
              this.persistActiveSession();
              return;
            }

            aiMessage.content += data;
          }
        }

        this.loading = false;
        this.persistActiveSession();
      } catch (err) {
        this.loading = false;
        aiMessage.content = `请求异常: ${err.message}`;
        this.persistActiveSession();
      }
    },


    async generatePrd() {
      this.ensureActiveSession();
      if (!this.messages.length || this.loading) return;

      this.loading = true;
      this.error = '';
      this.prdContent = '';

      const prompt = `请基于本次对话内容，按照模板「${this.currentTemplate.name}」生成一份结构化 PRD，包含：${this.currentTemplate.sections.join(', ')}。突出风险与不做什么，给出清晰的里程碑。`;

      try {
        const res = await fetch('https://pm-assistant-api-5w1t.vercel.app/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: this.buildPayload([...this.messages, { role: 'user', content: prompt }]),
          }),
        });

        if (!res.ok) {
          const text = await res.text();
          this.loading = false;
          this.prdContent = `接口错误 ${res.status}: ${text || '无返回体'}`;
          this.messages.push({ role: 'assistant', content: this.prdContent });
          this.persistActiveSession();
          return;
        }

        const contentType = res.headers.get('content-type') || '';
        const isSse = contentType.includes('text/event-stream');

        if (!isSse) {
          const text = await res.text();
          this.loading = false;
          this.prdContent = text || '接口返回空内容，请检查云函数日志';
          this.messages.push({ role: 'assistant', content: this.prdContent });
          this.persistActiveSession();
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
              this.messages.push({ role: 'assistant', content: draft || '(空 PRD 返回)' });
              this.persistActiveSession();
              return;
            }
            draft += data;
            this.prdContent = draft;
          }
        }

        this.loading = false;
        this.prdContent = draft;
        this.messages.push({ role: 'assistant', content: draft || '(空 PRD 返回)' });
        this.persistActiveSession();
      } catch (err) {
        this.loading = false;
        this.prdContent = `请求异常: ${err.message}`;
        this.persistActiveSession();
      }
    },


    async copyPrd() {
      if (!this.prdContent) return;
      try {
        await navigator.clipboard.writeText(this.prdContent);
        this.error = '';
      } catch (e) {
        this.error = '复制失败，请手动复制';
      }
    },
    downloadPrd() {
      if (!this.prdContent) return;
      const blob = new Blob([this.prdContent], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'prd.md';
      a.click();
      URL.revokeObjectURL(url);
    },
  },
};
</script>
