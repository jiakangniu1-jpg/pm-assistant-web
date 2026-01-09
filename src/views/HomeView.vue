<template>
  <div class="home-page">
    <!-- Hero 区域 -->
    <section class="hero-section">
      <div class="hero-content">
        <div class="hero-badge">
          <span>✨ AI 助手集合平台</span>
        </div>
        <h1 class="hero-title">
          三个专业助手<br />
          <span class="gradient-text">解决你的所有问题</span>
        </h1>
        <p class="hero-desc">
          从产品规划、技术难题到健康咨询，AI 助手随时待命。本地保存所有对话，随时恢复，安全可靠。
        </p>
        <div class="hero-buttons">
          <router-link class="btn btn-primary" to="/pm">
            🚀 开始写 PRD
          </router-link>
          <router-link class="btn btn-secondary" to="/dev">
            🧑‍💻 解决技术问题
          </router-link>
        </div>
      </div>
      
      <div class="hero-visual">
        <div class="floating-card card-1">
          <div class="card-icon">📝</div>
          <div class="card-text">产品经理助手</div>
        </div>
        <div class="floating-card card-2">
          <div class="card-icon">🧑‍💻</div>
          <div class="card-text">程序员助手</div>
        </div>
        <div class="floating-card card-3">
          <div class="card-icon">🩺</div>
          <div class="card-text">寻医问诊助手</div>
        </div>
      </div>
    </section>

    <!-- 使用流程 -->
    <section class="process-section">
      <div class="section-header">
        <h2 class="section-title">简单三步，快速上手</h2>
        <p class="section-desc">无需学习，即用即会</p>
      </div>
      
      <div class="process-steps">
        <div class="process-step" v-for="(step, idx) in steps" :key="idx">
          <div class="step-number">{{ idx + 1 }}</div>
          <div class="step-content">
            <h3 class="step-title">{{ step.title }}</h3>
            <p class="step-desc">{{ step.desc }}</p>
          </div>
          <div class="step-icon">{{ step.icon }}</div>
        </div>
      </div>
    </section>

    <!-- 功能卡片 -->
    <section class="features-section">
      <div class="section-header">
        <h2 class="section-title">专业助手，各司其职</h2>
        <p class="section-desc">选择最适合你的场景化 AI 助手</p>
      </div>
      
      <div class="features-grid">
        <article v-for="role in roles" :key="role.id" class="feature-card" :class="role.id">
          <div class="feature-icon">{{ role.emoji }}</div>
          <h3 class="feature-title">{{ role.title }}</h3>
          <p class="feature-desc">{{ role.desc }}</p>
          
          <ul class="feature-list">
            <li v-for="(point, idx) in role.points" :key="idx">
              <span class="check-icon">✓</span>
              {{ point }}
            </li>
          </ul>
          
          <router-link class="feature-link" :to="role.to">
            {{ role.cta }}
            <span class="arrow">→</span>
          </router-link>
        </article>
      </div>
    </section>

    <!-- 数据统计 -->
    <section class="stats-section">
      <div class="stats-container">
        <div class="stat-item">
          <div class="stat-number">3</div>
          <div class="stat-label">场景化助手</div>
          <div class="stat-icon">🎯</div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <div class="stat-number">5 min</div>
          <div class="stat-label">即可准备首版方案</div>
          <div class="stat-icon">⚡</div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <div class="stat-number">100%</div>
          <div class="stat-label">本地保存，安全可靠</div>
          <div class="stat-icon">🔒</div>
        </div>
      </div>
    </section>

    <!-- 底部 CTA -->
    <section class="cta-section">
      <h2 class="cta-title">准备好开始了吗？</h2>
      <p class="cta-desc">选择一个助手，开始你的 AI 协作之旅</p>
      <div class="cta-buttons">
        <router-link class="cta-btn" to="/pm">
          产品经理助手
        </router-link>
        <router-link class="cta-btn" to="/dev">
          程序员助手
        </router-link>
        <router-link class="cta-btn" to="/doctor">
          寻医问诊助手
        </router-link>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'HomeView',
  data() {
    return {
      steps: [
        { 
          title: '选择助手', 
          desc: '根据你的需求，挑选产品经理、程序员或寻医问诊助手',
          icon: '👆'
        },
        { 
          title: '提交上下文', 
          desc: '用表单或对话输入你的问题、需求或症状信息',
          icon: '💬'
        },
        { 
          title: '获得方案', 
          desc: 'AI 智能分析，生成专业建议、PRD 文档或解决方案',
          icon: '📄'
        },
      ],
      roles: [
        {
          id: 'pm',
          emoji: '📝',
          title: '产品经理助手',
          desc: '通过对话快速收敛需求，生成专业的 PRD 文档。支持多种模板，自动保存会话。',
          points: [
            '自然对话，无需复杂表单',
            '支持多种 PRD 模板',
            '智能追问，补齐缺失信息',
            '一键生成并下载 Markdown'
          ],
          to: '/pm',
          cta: '开始写 PRD',
        },
        {
          id: 'dev',
          emoji: '🧑‍💻',
          title: '程序员助手',
          desc: '提交代码或日志，AI 协助定位问题，提供修复方案和优化建议。',
          points: [
            '快速定位问题根因',
            '提供可执行的修复方案',
            '性能与安全检查',
            '生成优化建议和 ToDo'
          ],
          to: '/dev',
          cta: '去查 BUG',
        },
        {
          id: 'doctor',
          emoji: '🩺',
          title: '寻医问诊助手',
          desc: '整理症状、评估风险，提供初步建议和就医时机提醒（非医疗结论）。',
          points: [
            '结构化采集症状信息',
            '家庭护理建议',
            '高风险信号提醒',
            '何时就医的明确提示'
          ],
          to: '/doctor',
          cta: '填写症状',
        },
      ],
    };
  },
};
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  overflow-x: hidden;
}

/* Hero 区域 */
.hero-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 20px;
  align-items: center;
  animation: fadeIn 0.8s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.hero-content {
  color: white;
}

.hero-badge {
  display: inline-block;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 24px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}

.hero-title {
  font-size: 56px;
  font-weight: 800;
  margin: 0 0 24px;
  line-height: 1.2;
}

.gradient-text {
  background: linear-gradient(135deg, #fff 0%, #a5b4fc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-desc {
  font-size: 18px;
  line-height: 1.8;
  opacity: 0.9;
  margin-bottom: 40px;
  max-width: 500px;
}

.hero-buttons {
  display: flex;
  gap: 16px;
}

.btn {
  padding: 16px 32px;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn-primary {
  background: white;
  color: #667eea;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-3px);
}

/* Hero 视觉区 */
.hero-visual {
  position: relative;
  height: 400px;
}

.floating-card {
  position: absolute;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 24px;
  padding: 24px 32px;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  animation: float 3s ease-in-out infinite;
}

.card-1 {
  top: 20px;
  left: 20px;
  animation-delay: 0s;
}

.card-2 {
  top: 150px;
  right: 20px;
  animation-delay: 1s;
}

.card-3 {
  bottom: 20px;
  left: 150px;
  animation-delay: 2s;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

.card-icon {
  font-size: 48px;
}

.card-text {
  font-size: 16px;
  font-weight: 600;
}

/* 使用流程 */
.process-section {
  background: white;
  padding: 100px 20px;
}

.section-header {
  text-align: center;
  max-width: 600px;
  margin: 0 auto 60px;
}

.section-title {
  font-size: 36px;
  font-weight: 800;
  color: #1f2937;
  margin: 0 0 12px;
}

.section-desc {
  font-size: 18px;
  color: #6b7280;
  margin: 0;
}

.process-steps {
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.process-step {
  display: flex;
  align-items: center;
  gap: 40px;
  padding: 32px;
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
  border-radius: 20px;
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
}

.process-step:hover {
  transform: translateX(10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.step-number {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 800;
  flex-shrink: 0;
}

.step-content {
  flex: 1;
}

.step-title {
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 8px;
}

.step-desc {
  font-size: 15px;
  color: #6b7280;
  margin: 0;
  line-height: 1.6;
}

.step-icon {
  font-size: 48px;
  flex-shrink: 0;
}

/* 功能卡片 */
.features-section {
  background: #f9fafb;
  padding: 100px 20px;
}

.features-grid {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
}

.feature-card {
  background: white;
  border-radius: 24px;
  padding: 40px 32px;
  transition: all 0.4s ease;
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 6px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.feature-card:hover::before {
  opacity: 1;
}

.feature-icon {
  font-size: 56px;
  margin-bottom: 20px;
}

.feature-title {
  font-size: 24px;
  font-weight: 800;
  color: #1f2937;
  margin: 0 0 12px;
}

.feature-desc {
  font-size: 15px;
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 24px;
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 0 0 32px;
}

.feature-list li {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
  font-size: 14px;
  color: #4b5563;
}

.check-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 12px;
  flex-shrink: 0;
}

.feature-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  font-size: 15px;
  transition: all 0.3s ease;
}

.feature-link:hover {
  gap: 12px;
}

.feature-link .arrow {
  transition: transform 0.3s ease;
}

.feature-link:hover .arrow {
  transform: translateX(4px);
}

/* 数据统计 */
.stats-section {
  background: white;
  padding: 100px 20px;
}

.stats-container {
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: 40px;
}

.stat-item {
  text-align: center;
  flex: 1;
}

.stat-number {
  font-size: 64px;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 12px;
}

.stat-label {
  font-size: 16px;
  color: #6b7280;
  margin-bottom: 16px;
}

.stat-icon {
  font-size: 32px;
}

.stat-divider {
  width: 2px;
  height: 80px;
  background: linear-gradient(180deg, transparent 0%, #e5e7eb 50%, transparent 100%);
}

/* 底部 CTA */
.cta-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 100px 20px;
  text-align: center;
  color: white;
}

.cta-title {
  font-size: 40px;
  font-weight: 800;
  margin: 0 0 16px;
}

.cta-desc {
  font-size: 18px;
  opacity: 0.9;
  margin: 0 0 40px;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.cta-buttons {
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

.cta-btn {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 16px 32px;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.cta-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

/* 响应式 */
@media (max-width: 1024px) {
  .hero-section {
    grid-template-columns: 1fr;
    gap: 40px;
    padding: 60px 20px;
  }
  
  .hero-visual {
    height: 300px;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-container {
    flex-direction: column;
    gap: 40px;
  }
  
  .stat-divider {
    width: 80px;
    height: 2px;
    background: linear-gradient(90deg, transparent 0%, #e5e7eb 50%, transparent 100%);
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 36px;
  }
  
  .hero-buttons {
    flex-direction: column;
  }
  
  .btn {
    justify-content: center;
  }
  
  .section-title {
    font-size: 28px;
  }
  
  .process-step {
    flex-direction: column;
    text-align: center;
    gap: 20px;
  }
  
  .cta-title {
    font-size: 28px;
  }
  
  .cta-buttons {
    flex-direction: column;
  }
}
</style>
