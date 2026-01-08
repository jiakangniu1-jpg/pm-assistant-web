<template>
  <div>
    <header class="topbar">
      <div class="brand">AI 助手集合</div>
      <nav class="nav-links">
        <router-link to="/" exact-active-class="active" exact>首页</router-link>
        <router-link to="/pm" exact-active-class="active" exact>产品经理</router-link>
        <router-link to="/dev" exact-active-class="active" exact>程序员</router-link>
        <router-link to="/doctor" exact-active-class="active" exact>寻医问诊</router-link>
      </nav>
    </header>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
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
  font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  background: var(--bg);
  color: var(--text);
}

.container {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.sidebar {
  width: 240px;
  flex-shrink: 0;
  background: #f7f9fc;
  border-right: 1px solid var(--border);
  padding: 14px 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  position: relative;
}

.brand {
  font-weight: 800;
  color: #0f172a;
  letter-spacing: 0.02em;
  padding: 0 8px 10px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 4px;
}

.nav-links {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.nav-links a {
  display: block;
  padding: 10px 12px;
  border-radius: 10px;
  color: #0f172a;
  text-decoration: none;
  font-weight: 600;
  border: 1px solid transparent;
  transition: all 0.15s ease;
}

.nav-links a:hover {
  background: #eef2f7;
}

.nav-links a.active {
  background: rgba(16, 163, 127, 0.12);
  color: var(--accent);
  border-color: rgba(16, 163, 127, 0.2);
}

.page {
  padding: 24px 20px 60px;
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
  grid-template-columns: 1fr 1fr 1fr auto;
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

.ghost.compact {
  padding: 6px 10px;
  font-size: 12px;
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

.session-list {
  border: 1px solid var(--border);
  border-radius: 12px;
  background: #fafbfc;
  padding: 8px;
  max-height: 240px;
  overflow: auto;
}

.session-list.empty {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 96px;
}

.session-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 10px;
  border-radius: 12px;
  cursor: pointer;
  border: 1px solid transparent;
  transition: background 0.15s ease, border-color 0.15s ease;
}

.session-item + .session-item {
  margin-top: 6px;
}

.session-item:hover {
  background: #ffffff;
  border-color: var(--border);
}

.session-item.active {
  background: rgba(16, 163, 127, 0.08);
  border-color: rgba(16, 163, 127, 0.25);
}

.session-main {
  min-width: 0;
}

.session-name {
  font-weight: 700;
  color: #0f172a;
  font-size: 13px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 240px;
}

.session-time {
  color: var(--muted);
  font-size: 12px;
  margin-top: 2px;
}

.session-actions {
  display: flex;
  gap: 6px;
  flex-shrink: 0;
}

.icon-btn {
  border: 1px solid var(--border);
  background: #fff;
  color: #0f172a;
  border-radius: 10px;
  padding: 6px 8px;
  font-size: 12px;
  cursor: pointer;
}

.icon-btn:hover {
  border-color: rgba(16, 163, 127, 0.5);
}

.icon-btn.danger {
  border-color: rgba(220, 38, 38, 0.25);
  color: #b91c1c;
}

.icon-btn.danger:hover {
  border-color: rgba(220, 38, 38, 0.5);
}

.form-card .form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 10px;
}

.form-card .form-grid.single {
  grid-template-columns: 1fr;
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

.chat-controls {
  display: flex;
  align-items: center;
  gap: 8px;
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
  font-family: 'JetBrains Mono', 'SFMono-Regular', Menlo, Monaco, Consolas, monospace;
  font-size: 14px;
  line-height: 1.6;
}

.prd-body.empty {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--muted);
}

.home-page {
  padding-top: 40px;
}

.home-hero {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 20px;
  margin-bottom: 24px;
}

.hero-panel {
  border: 1px solid var(--border);
  border-radius: 18px;
  background: #fff;
  box-shadow: var(--shadow);
  padding: 20px;
}

.hero-panel-title {
  font-weight: 700;
  margin-bottom: 12px;
}

.hero-panel ol {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.hero-panel li {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.badge {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(16, 163, 127, 0.12);
  color: var(--accent);
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.step-title {
  font-weight: 600;
  color: #0f172a;
}

.step-desc {
  color: var(--muted);
  font-size: 13px;
}

.hero-actions {
  margin-top: 18px;
  display: flex;
  gap: 12px;
}

.hero-actions .ghost {
  min-width: 140px;
}

.role-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  margin-bottom: 24px;
}

.role-card {
  border: 1px solid var(--border);
  border-radius: 18px;
  padding: 18px;
  background: #fff;
  box-shadow: var(--shadow);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.role-head {
  display: flex;
  gap: 12px;
  align-items: center;
}

.emoji {
  font-size: 30px;
}

.role-title {
  font-weight: 700;
  color: #0f172a;
}

.role-desc {
  color: var(--muted);
  font-size: 13px;
}

.role-card ul {
  margin: 0;
  padding-left: 18px;
  color: #111827;
  line-height: 1.5;
}

.role-cta {
  margin-top: auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  border: 1px solid rgba(16, 163, 127, 0.4);
  padding: 10px 0;
  text-decoration: none;
  color: var(--accent);
  font-weight: 600;
  transition: background 0.15s ease;
}

.role-cta:hover {
  background: rgba(16, 163, 127, 0.08);
}

.home-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.stat {
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 18px;
  text-align: center;
  box-shadow: var(--shadow);
}

.stat-value {
  font-size: 22px;
  font-weight: 800;
  color: #0f172a;
}

.stat-label {
  color: var(--muted);
  margin-top: 6px;
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
  .home-hero {
    grid-template-columns: 1fr;
  }
  .role-grid,
  .home-stats {
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
  .nav-links {
    gap: 6px;
  }
}
</style>
