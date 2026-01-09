<template>
  <div class="app-container">
    <header class="navbar">
      <div class="navbar-container">
        <!-- Logo 和品牌 -->
        <div class="navbar-brand">
          <div class="logo-icon">✨</div>
          <router-link to="/" class="brand-link">
            <span class="brand-text">AI 助手集合</span>
          </router-link>
        </div>

        <!-- 导航链接 -->
        <nav class="navbar-nav">
          <router-link to="/" class="nav-item" exact-active-class="active">
            <span class="nav-icon">🏠</span>
            <span class="nav-text">首页</span>
          </router-link>
          <router-link to="/pm" class="nav-item" exact-active-class="active">
            <span class="nav-icon">📝</span>
            <span class="nav-text">产品经理</span>
          </router-link>
          <router-link to="/dev" class="nav-item" exact-active-class="active">
            <span class="nav-icon">🧑‍💻</span>
            <span class="nav-text">程序员</span>
          </router-link>
          <router-link to="/doctor" class="nav-item" exact-active-class="active">
            <span class="nav-icon">🩺</span>
            <span class="nav-text">寻医问诊</span>
          </router-link>
        </nav>

        <!-- 移动端菜单按钮 -->
        <button class="menu-toggle" @click="toggleMenu" :class="{ open: menuOpen }">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <!-- 移动端菜单 -->
      <div class="mobile-menu" :class="{ open: menuOpen }">
        <router-link to="/" class="mobile-nav-item" @click="closeMenu">
          <span class="mobile-nav-icon">🏠</span>
          <span>首页</span>
        </router-link>
        <router-link to="/pm" class="mobile-nav-item" @click="closeMenu">
          <span class="mobile-nav-icon">📝</span>
          <span>产品经理</span>
        </router-link>
        <router-link to="/dev" class="mobile-nav-item" @click="closeMenu">
          <span class="mobile-nav-icon">🧑‍💻</span>
          <span>程序员</span>
        </router-link>
        <router-link to="/doctor" class="mobile-nav-item" @click="closeMenu">
          <span class="mobile-nav-icon">🩺</span>
          <span>寻医问诊</span>
        </router-link>
      </div>
    </header>

    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      menuOpen: false
    };
  },
  methods: {
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
    },
    closeMenu() {
      this.menuOpen = false;
    }
  }
};
</script>

<style>
/* 全局变量 */
:root {
  --bg: #f7f8fa;
  --card: #ffffff;
  --border: #e5e7eb;
  --text: #1f2937;
  --muted: #6b7280;
  --primary: #667eea;
  --primary-dark: #764ba2;
  --shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
  --navbar-height: 72px;
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

/* 应用容器 */
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 导航栏 */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.navbar-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 32px;
  height: var(--navbar-height);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
}

/* 品牌区域 */
.navbar-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.logo-icon {
  font-size: 32px;
  animation: sparkle 2s ease-in-out infinite;
}

@keyframes sparkle {
  0%, 100% { transform: scale(1) rotate(0deg); }
  50% { transform: scale(1.1) rotate(5deg); }
}

.brand-link {
  text-decoration: none;
}

.brand-text {
  font-size: 22px;
  font-weight: 800;
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 0.02em;
}

/* 导航菜单 */
.navbar-nav {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  justify-content: center;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 12px;
  text-decoration: none;
  color: var(--muted);
  font-weight: 600;
  font-size: 15px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.nav-item::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.nav-item > * {
  position: relative;
  z-index: 1;
}

.nav-icon {
  font-size: 20px;
  transition: transform 0.3s ease;
}

.nav-text {
  font-weight: 600;
}

.nav-item:hover {
  color: var(--primary);
  background: rgba(102, 126, 234, 0.08);
  transform: translateY(-2px);
}

.nav-item:hover .nav-icon {
  transform: scale(1.2);
}

.nav-item.active {
  color: white;
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.nav-item.active::before {
  opacity: 1;
}

.nav-item.active:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

/* 移动端菜单按钮 */
.menu-toggle {
  display: none;
  flex-direction: column;
  gap: 6px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  z-index: 1001;
}

.menu-toggle span {
  width: 28px;
  height: 3px;
  background: var(--text);
  border-radius: 2px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.menu-toggle.open span:nth-child(1) {
  transform: rotate(45deg) translate(6px, 6px);
}

.menu-toggle.open span:nth-child(2) {
  opacity: 0;
}

.menu-toggle.open span:nth-child(3) {
  transform: rotate(-45deg) translate(7px, -7px);
}

/* 移动端菜单 */
.mobile-menu {
  display: none;
  position: fixed;
  top: var(--navbar-height);
  left: 0;
  right: 0;
  background: white;
  padding: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  transform: translateY(-100%);
  opacity: 0;
  transition: all 0.3s ease;
  z-index: 999;
}

.mobile-menu.open {
  transform: translateY(0);
  opacity: 1;
}

.mobile-nav-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  text-decoration: none;
  color: var(--text);
  border-radius: 12px;
  margin-bottom: 8px;
  font-weight: 600;
  font-size: 16px;
  transition: all 0.2s ease;
}

.mobile-nav-item:hover {
  background: rgba(102, 126, 234, 0.08);
}

.mobile-nav-item.router-link-active {
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  color: white;
}

.mobile-nav-icon {
  font-size: 24px;
}

/* 主内容区 */
.main-content {
  flex: 1;
  margin-top: var(--navbar-height);
  min-height: calc(100vh - var(--navbar-height));
}

/* 保留原有的全局样式 */
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

.main-content-legacy {
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

/* 响应式设计 */
@media (max-width: 768px) {
  .navbar-nav {
    display: none;
  }
  
  .menu-toggle {
    display: flex;
  }
  
  .mobile-menu {
    display: block;
  }
  
  .navbar-container {
    padding: 0 20px;
  }
  
  .brand-text {
    font-size: 18px;
  }
}

@media (max-width: 480px) {
  .navbar-container {
    padding: 0 16px;
  }
  
  .logo-icon {
    font-size: 28px;
  }
  
  .brand-text {
    font-size: 16px;
  }
}
</style>
