<template>
  <div class="pm-page">
    <!-- 顶部欢迎区 -->
    <div class="welcome-section">
      <div class="welcome-content">
        <div class="welcome-badge">🚀 智能产品助手</div>
        <h1 class="welcome-title">让我帮你快速完善产品方案</h1>
        <p class="welcome-desc">只需简单描述你的想法，AI 会通过对话帮你梳理需求、发现盲点、生成专业 PRD</p>
      </div>
      
      <!-- 快速开始卡片 -->
      <div class="quick-start-cards">
        <div class="quick-card" @click="startWithTemplate('mvp')">
          <div class="quick-icon">🎯</div>
          <div class="quick-title">快速验证想法</div>
          <div class="quick-desc">从 0 到 1 设计 MVP，验证核心价值</div>
        </div>
        <div class="quick-card" @click="startWithTemplate('optimize')">
          <div class="quick-icon">⚡</div>
          <div class="quick-title">优化现有功能</div>
          <div class="quick-desc">提升转化率、留存率等关键指标</div>
        </div>
        <div class="quick-card" @click="startWithTemplate('new')">
          <div class="quick-icon">✨</div>
          <div class="quick-title">全新产品</div>
          <div class="quick-desc">完整的产品规划与功能设计</div>
        </div>
      </div>
    </div>

    <!-- 工作区 -->
    <div class="workspace" v-if="activeSessionId">
      <!-- 左侧：对话区 -->
      <div class="chat-panel">
        <div class="chat-header">
          <div class="header-left">
            <button class="back-btn" @click="showWelcome = true" v-if="!showWelcome">
              ← 返回
            </button>
            <h3 class="chat-title">{{ currentSessionName }}</h3>
          </div>
          <div class="header-right">
            <button class="icon-btn" @click="showSessions = !showSessions" title="历史会话">
              📂
            </button>
            <button class="icon-btn" @click="newSession" title="新建会话">
              ➕
            </button>
          </div>
        </div>

        <!-- 会话列表侧边栏 -->
        <div class="sessions-sidebar" v-if="showSessions">
          <div class="sidebar-header">
            <h4>历史会话</h4>
            <button class="close-btn" @click="showSessions = false">×</button>
          </div>
          <div class="sessions-list">
            <div 
              v-for="s in sessionsSorted" 
              :key="s.id"
              class="session-item"
              :class="{ active: s.id === activeSessionId }"
              @click="openSession(s.id)"
            >
              <div class="session-info">
                <div class="session-name">{{ s.name }}</div>
                <div class="session-time">{{ formatTime(s.updatedAt) }}</div>
              </div>
              <div class="session-actions" @click.stop>
                <button class="session-action-btn" @click="renameSession(s.id)" title="重命名">✏️</button>
                <button class="session-action-btn danger" @click="deleteSession(s.id)" title="删除">🗑️</button>
              </div>
            </div>
          </div>
        </div>

        <!-- 对话内容 -->
        <div class="messages-container" ref="messagesContainer">
          <div v-if="!messages.length" class="empty-state">
            <div class="empty-icon">💭</div>
            <div class="empty-title">开始描述你的产品想法</div>
            <div class="empty-tips">
              <div class="tip-item">• 比如："我想做一个帮助用户管理时间的 App"</div>
              <div class="tip-item">• 比如："优化购物车的结账流程，提高转化率"</div>
            </div>
          </div>
          
          <div v-else class="messages-list">
            <div 
              v-for="(m, i) in messages" 
              :key="i"
              :class="['message', m.role]"
            >
              <div class="message-avatar">
                {{ m.role === 'user' ? '👤' : '🤖' }}
              </div>
              <div class="message-content">
                <div class="message-role">{{ m.role === 'user' ? '你' : '产品助手' }}</div>
                <div class="message-text">{{ m.content }}</div>
              </div>
            </div>
            
            <!-- 智能建议 -->
            <div v-if="suggestions.length > 0 && !loading" class="suggestions">
              <div class="suggestions-label">你可以补充：</div>
              <div class="suggestion-chips">
                <button 
                  v-for="(s, i) in suggestions" 
                  :key="i"
                  class="suggestion-chip"
                  @click="useSuggestion(s)"
                >
                  {{ s }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 输入区 -->
        <div class="input-section">
          <div v-if="loading" class="loading-indicator">
            <div class="loading-spinner"></div>
            <span>正在思考...</span>
          </div>
          
          <div class="input-container">
            <textarea
              v-model="input"
              class="chat-input"
              placeholder="描述你的想法，或补充信息..."
              rows="1"
              @keydown.enter.prevent="handleEnter"
              :disabled="loading"
              ref="inputRef"
            ></textarea>
            <button 
              class="send-btn"
              @click="sendMessage"
              :disabled="loading || !input.trim()"
            >
              发送
            </button>
          </div>
          
          <!-- 快捷操作 -->
          <div class="quick-actions">
            <button class="quick-action" @click="generatePrd" :disabled="loading || messages.length === 0">
              📄 生成 PRD
            </button>
            <button class="quick-action" @click="exportData" :disabled="messages.length === 0">
              💾 导出对话
            </button>
          </div>
        </div>
      </div>

      <!-- 右侧：PRD 预览 -->
      <div class="prd-panel" v-if="prdContent">
        <div class="prd-header">
          <h3>📋 PRD 文档</h3>
          <div class="prd-actions">
            <button class="action-btn" @click="copyPrd">复制</button>
            <button class="action-btn" @click="downloadPrd">下载</button>
          </div>
        </div>
        <div class="prd-content">
          <pre>{{ prdContent }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const PM_SESSIONS_KEY = 'pm-sessions-v2';
const PM_ACTIVE_ID_KEY = 'pm-active-session-id-v2';

function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export default {
  name: 'PMView',
  data() {
    return {
      showWelcome: true,
      showSessions: false,
      input: '',
      messages: [],
      loading: false,
      error: '',
      prdContent: '',
      
      sessions: [],
      activeSessionId: '',
      
      suggestions: [
        '目标用户是谁？',
        '核心功能是什么？',
        '遇到什么问题？',
        '预期达到什么效果？',
        '有什么限制条件？'
      ]
    };
  },
  computed: {
    currentSessionName() {
      const session = this.sessions.find(s => s.id === this.activeSessionId);
      return (session && session.name) || '未命名会话';
    },
    sessionsSorted() {
      return [...this.sessions].sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
    }
  },
  created() {
    this.initSessions();
  },
  methods: {
    formatTime(ts) {
      if (!ts) return '';
      try {
        const date = new Date(ts);
        const now = new Date();
        const diff = now - date;
        
        if (diff < 60000) return '刚刚';
        if (diff < 3600000) return `${Math.floor(diff / 60000)} 分钟前`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)} 小时前`;
        if (diff < 604800000) return `${Math.floor(diff / 86400000)} 天前`;
        
        return date.toLocaleDateString('zh-CN', {
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        });
      } catch (e) {
        return '';
      }
    },
    
    initSessions() {
      if (typeof window === 'undefined') return;
      
      let sessions = [];
      try {
        sessions = JSON.parse(localStorage.getItem(PM_SESSIONS_KEY) || '[]') || [];
      } catch (e) {
        sessions = [];
      }
      
      this.sessions = sessions;
      
      if (sessions.length > 0) {
        const activeId = localStorage.getItem(PM_ACTIVE_ID_KEY);
        if (activeId && sessions.find(s => s.id === activeId)) {
          this.activeSessionId = activeId;
          this.loadSessionData(activeId);
        }
      }
    },
    
    saveSessions() {
      if (typeof window === 'undefined') return;
      localStorage.setItem(PM_SESSIONS_KEY, JSON.stringify(this.sessions));
      if (this.activeSessionId) {
        localStorage.setItem(PM_ACTIVE_ID_KEY, this.activeSessionId);
      }
    },
    
    saveCurrentSession() {
      const session = this.sessions.find(s => s.id === this.activeSessionId);
      if (!session) return;
      
      session.messages = this.messages;
      session.prdContent = this.prdContent;
      session.updatedAt = Date.now();
      this.saveSessions();
    },
    
    loadSessionData(sessionId) {
      const session = this.sessions.find(s => s.id === sessionId);
      if (!session) return;
      
      this.messages = session.messages || [];
      this.prdContent = session.prdContent || '';
      this.showWelcome = false;
    },
    
    startWithTemplate(type) {
      const templates = {
        mvp: {
          name: '快速验证想法',
          prompt: '我想快速验证一个产品想法，帮我梳理需求'
        },
        optimize: {
          name: '优化现有功能',
          prompt: '我想优化现有功能，帮我分析提升空间'
        },
        new: {
          name: '全新产品',
          prompt: '我要做一个全新的产品，帮我从零规划'
        }
      };
      
      const tpl = templates[type];
      this.newSession(tpl.name);
      this.input = tpl.prompt;
      this.$nextTick(() => {
        this.sendMessage();
      });
    },
    
    newSession(name = `会话 ${new Date().toLocaleDateString('zh-CN')}`) {
      this.saveCurrentSession();
      
      const session = {
        id: uid(),
        name,
        messages: [],
        prdContent: '',
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      
      this.sessions.unshift(session);
      this.activeSessionId = session.id;
      this.messages = [];
      this.prdContent = '';
      this.showWelcome = false;
      this.showSessions = false;
      this.saveSessions();
      
      this.$nextTick(() => {
        this.$refs.inputRef?.focus();
      });
    },
    
    openSession(sessionId) {
      this.saveCurrentSession();
      this.activeSessionId = sessionId;
      this.loadSessionData(sessionId);
      this.showSessions = false;
    },
    
    renameSession(sessionId) {
      const session = this.sessions.find(s => s.id === sessionId);
      if (!session) return;
      
      const newName = window.prompt('请输入新名称', session.name);
      if (newName && newName.trim()) {
        session.name = newName.trim().slice(0, 30);
        session.updatedAt = Date.now();
        this.saveSessions();
      }
    },
    
    deleteSession(sessionId) {
      const idx = this.sessions.findIndex(s => s.id === sessionId);
      if (idx === -1) return;
      
      if (confirm('确定要删除这个会话吗？')) {
        this.sessions.splice(idx, 1);
        
        if (sessionId === this.activeSessionId) {
          if (this.sessions.length > 0) {
            this.openSession(this.sessions[0].id);
          } else {
            this.activeSessionId = '';
            this.messages = [];
            this.prdContent = '';
            this.showWelcome = true;
          }
        }
        
        this.saveSessions();
      }
    },
    
    useSuggestion(text) {
      this.input = text;
      this.$refs.inputRef?.focus();
    },
    
    handleEnter(e) {
      if (e.shiftKey) return;
      this.sendMessage();
    },
    
    async sendMessage() {
      const content = this.input.trim();
      if (!content || this.loading) return;
      
      if (!this.activeSessionId) {
        this.newSession();
      }
      
      this.input = '';
      this.messages.push({ role: 'user', content });
      
      const aiMessage = { role: 'assistant', content: '' };
      this.messages.push(aiMessage);
      
      this.loading = true;
      this.error = '';
      
      this.$nextTick(() => {
        this.scrollToBottom();
      });
      
      try {
        const res = await fetch('https://pm-assistant-api-5w1t.vercel.app/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [
              { role: 'system', content: '你是一位资深产品经理助手。你的任务是：1）理解用户的产品想法 2）主动追问关键信息（目标用户、核心价值、痛点等） 3）给出专业建议 4）当信息充分时提醒用户可以生成 PRD。回答要简洁、友好、结构化。' },
              ...this.messages.slice(0, -1)
            ]
          })
        });
        
        if (!res.ok) {
          const text = await res.text();
          aiMessage.content = `请求失败: ${text || '未知错误'}`;
          this.loading = false;
          this.saveCurrentSession();
          return;
        }
        
        const isSse = res.headers.get('content-type')?.includes('text/event-stream');
        
        if (!isSse) {
          const text = await res.text();
          aiMessage.content = text || '未返回内容';
          this.loading = false;
          this.saveCurrentSession();
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
            if (data === '[DONE]') break;
            
            draft += data;
            aiMessage.content = draft;
            
            this.$nextTick(() => {
              this.scrollToBottom();
            });
          }
        }
        
        this.loading = false;
        this.saveCurrentSession();
        
      } catch (err) {
        this.loading = false;
        aiMessage.content = `发生错误: ${err.message}`;
        this.saveCurrentSession();
      }
    },
    
    async generatePrd() {
      if (!this.activeSessionId || this.loading || this.messages.length === 0) return;
      
      this.loading = true;
      this.prdContent = '正在生成 PRD，请稍候...';
      
      const prompt = '请基于以上对话内容，生成一份完整的 PRD 文档。包含以下章节：\n\n1. 项目背景与目标\n2. 目标用户画像\n3. 核心功能需求\n4. 用户流程图\n5. 数据埋点需求\n6. 里程碑规划\n7. 风险与应对\n\n要求：结构清晰、重点突出、可直接用于评审。';
      
      try {
        const res = await fetch('https://pm-assistant-api-5w1t.vercel.app/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [
              { role: 'system', content: '你是一位资深产品经理，擅长撰写专业的 PRD 文档。' },
              ...this.messages,
              { role: 'user', content: prompt }
            ]
          })
        });
        
        if (!res.ok) {
          const text = await res.text();
          this.prdContent = `生成失败: ${text}`;
          this.loading = false;
          return;
        }
        
        const isSse = res.headers.get('content-type')?.includes('text/event-stream');
        
        if (!isSse) {
          const text = await res.text();
          this.prdContent = text || '生成失败';
          this.loading = false;
          this.saveCurrentSession();
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
            if (data === '[DONE]') break;
            
            draft += data;
            this.prdContent = draft;
          }
        }
        
        this.loading = false;
        this.saveCurrentSession();
        
      } catch (err) {
        this.loading = false;
        this.prdContent = `生成失败: ${err.message}`;
      }
    },
    
    async copyPrd() {
      if (!this.prdContent) return;
      try {
        await navigator.clipboard.writeText(this.prdContent);
        alert('已复制到剪贴板');
      } catch (e) {
        alert('复制失败，请手动复制');
      }
    },
    
    downloadPrd() {
      if (!this.prdContent) return;
      const blob = new Blob([this.prdContent], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${this.currentSessionName}_PRD.md`;
      a.click();
      URL.revokeObjectURL(url);
    },
    
    exportData() {
      const data = {
        sessionName: this.currentSessionName,
        createdAt: new Date().toISOString(),
        messages: this.messages,
        prdContent: this.prdContent
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${this.currentSessionName}_对话记录.json`;
      a.click();
      URL.revokeObjectURL(url);
    },
    
    scrollToBottom() {
      const container = this.$refs.messagesContainer;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }
  }
};
</script>

<style scoped>
.pm-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

/* 欢迎区域 */
.welcome-section {
  max-width: 1000px;
  margin: 0 auto;
  padding: 60px 20px;
  text-align: center;
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.welcome-badge {
  display: inline-block;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 20px;
  backdrop-filter: blur(10px);
}

.welcome-title {
  color: white;
  font-size: 42px;
  font-weight: 800;
  margin: 0 0 16px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.welcome-desc {
  color: rgba(255, 255, 255, 0.9);
  font-size: 18px;
  max-width: 600px;
  margin: 0 auto 50px;
  line-height: 1.6;
}

.quick-start-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.quick-card {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.quick-card:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.quick-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.quick-title {
  color: white;
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 8px;
}

.quick-desc {
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  line-height: 1.5;
}

/* 工作区 */
.workspace {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 450px;
  gap: 20px;
  animation: slideUp 0.4s ease;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 对话面板 */
.chat-panel {
  background: white;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  max-height: 85vh;
}

.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.back-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  padding: 6px 12px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.chat-title {
  color: white;
  font-size: 18px;
  font-weight: 700;
  margin: 0;
}

.header-right {
  display: flex;
  gap: 8px;
}

.icon-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* 会话侧边栏 */
.sessions-sidebar {
  position: absolute;
  left: 0;
  top: 73px;
  bottom: 0;
  width: 320px;
  background: white;
  border-right: 1px solid #e5e7eb;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  z-index: 10;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
}

.sidebar-header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #1f2937;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #6b7280;
  cursor: pointer;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #f3f4f6;
}

.sessions-list {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
}

.session-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 8px;
}

.session-item:hover {
  background: #f9fafb;
}

.session-item.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.session-item.active .session-time {
  color: rgba(255, 255, 255, 0.7);
}

.session-info {
  flex: 1;
  min-width: 0;
}

.session-name {
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.session-time {
  font-size: 12px;
  color: #9ca3af;
}

.session-actions {
  display: flex;
  gap: 4px;
}

.session-action-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  padding: 6px;
  border-radius: 6px;
  transition: all 0.2s ease;
  opacity: 0.7;
}

.session-action-btn:hover {
  background: rgba(0, 0, 0, 0.05);
  opacity: 1;
}

.session-item.active .session-action-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.session-action-btn.danger:hover {
  background: rgba(239, 68, 68, 0.2);
}

/* 消息区 */
.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  background: #f9fafb;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  text-align: center;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-title {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 20px;
}

.empty-tips {
  color: #6b7280;
  font-size: 14px;
  line-height: 2;
}

.tip-item {
  opacity: 0.7;
}

.messages-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.message {
  display: flex;
  gap: 12px;
  animation: messageSlide 0.3s ease;
}

@keyframes messageSlide {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.message.user {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}

.message.user .message-avatar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.message.assistant .message-avatar {
  background: #f3f4f6;
}

.message-content {
  max-width: 70%;
}

.message-role {
  font-size: 12px;
  color: #9ca3af;
  margin-bottom: 4px;
}

.message.user .message-role {
  text-align: right;
}

.message-text {
  background: white;
  padding: 14px 18px;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  line-height: 1.6;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.message.user .message-text {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.message.assistant .message-text {
  background: white;
  color: #1f2937;
}

/* 智能建议 */
.suggestions {
  margin-top: 24px;
  padding: 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  animation: fadeIn 0.3s ease;
}

.suggestions-label {
  font-size: 13px;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 12px;
}

.suggestion-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.suggestion-chip {
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  color: #1f2937;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.suggestion-chip:hover {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: transparent;
}

/* 输入区 */
.input-section {
  padding: 20px 24px;
  background: white;
  border-top: 1px solid #e5e7eb;
}

.loading-indicator {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  color: #6b7280;
  font-size: 14px;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #e5e7eb;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.input-container {
  display: flex;
  gap: 12px;
  align-items: flex-end;
}

.chat-input {
  flex: 1;
  border: 2px solid #e5e7eb;
  border-radius: 16px;
  padding: 14px 18px;
  font-size: 15px;
  font-family: inherit;
  resize: none;
  outline: none;
  transition: all 0.2s ease;
  max-height: 120px;
}

.chat-input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.send-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 14px 28px;
  border-radius: 16px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.send-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quick-actions {
  display: flex;
  gap: 12px;
  margin-top: 16px;
}

.quick-action {
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  color: #1f2937;
  padding: 10px 18px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

.quick-action:hover:not(:disabled) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: transparent;
}

.quick-action:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* PRD 面板 */
.prd-panel {
  background: white;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  max-height: 85vh;
}

.prd-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.prd-header h3 {
  color: white;
  font-size: 18px;
  font-weight: 700;
  margin: 0;
}

.prd-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.prd-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  background: #f9fafb;
}

.prd-content pre {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: 'JetBrains Mono', 'SFMono-Regular', Menlo, Monaco, Consolas, monospace;
  font-size: 14px;
  line-height: 1.8;
  color: #1f2937;
}

/* 响应式 */
@media (max-width: 1200px) {
  .workspace {
    grid-template-columns: 1fr;
  }
  
  .prd-panel {
    display: none;
  }
}

@media (max-width: 768px) {
  .welcome-section {
    padding: 40px 16px;
  }
  
  .welcome-title {
    font-size: 28px;
  }
  
  .welcome-desc {
    font-size: 16px;
  }
  
  .quick-start-cards {
    grid-template-columns: 1fr;
  }
  
  .chat-panel {
    max-height: calc(100vh - 40px);
    border-radius: 16px;
  }
  
  .message-content {
    max-width: 85%;
  }
}
</style>
