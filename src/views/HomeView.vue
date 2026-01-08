<template>
  <div class="page home-page">
    <section class="home-hero">
      <div>
        <p class="eyebrow">Multi-Agent AI Studio</p>
        <h1>一个入口，连接产品、工程、医疗三种 AI 助手</h1>
        <p class="sub">
          先挑选适合的角色，再把上下文交给 AI。它会记住你的需求、表单和对话内容，帮助你更快落地想法。
        </p>
        <div class="hero-actions">
          <router-link class="primary" to="/pm">开始写 PRD</router-link>
          <router-link class="ghost" to="/dev">查 BUG / 优化</router-link>
        </div>
      </div>
      <div class="hero-panel">
        <div class="hero-panel-title">使用流程</div>
        <ol>
          <li v-for="(step, idx) in steps" :key="idx">
            <span class="badge">{{ idx + 1 }}</span>
            <div>
              <div class="step-title">{{ step.title }}</div>
              <div class="step-desc">{{ step.desc }}</div>
            </div>
          </li>
        </ol>
      </div>
    </section>

    <section class="role-grid">
      <article v-for="role in roles" :key="role.id" class="role-card">
        <div class="role-head">
          <span class="emoji">{{ role.emoji }}</span>
          <div>
            <div class="role-title">{{ role.title }}</div>
            <div class="role-desc">{{ role.desc }}</div>
          </div>
        </div>
        <ul>
          <li v-for="(point, idx) in role.points" :key="idx">{{ point }}</li>
        </ul>
        <router-link class="role-cta" :to="role.to">{{ role.cta }}</router-link>
      </article>
    </section>

    <section class="home-stats">
      <div class="stat">
        <div class="stat-value">3</div>
        <div class="stat-label">场景化助手</div>
      </div>
      <div class="stat">
        <div class="stat-value">5 min</div>
        <div class="stat-label">即可准备首版 PRD / 方案</div>
      </div>
      <div class="stat">
        <div class="stat-value">本地保存</div>
        <div class="stat-label">自动记住对话，随时恢复</div>
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
        { title: '选择助手', desc: '根据场景挑选产品经理、程序员或寻医问诊' },
        { title: '提交上下文', desc: '用表单一次性输入背景、需求、症状等关键信息' },
        { title: '对话细化', desc: '与 AI 往返沟通，补齐缺失点，生成文档/建议' },
      ],
      roles: [
        {
          id: 'pm',
          emoji: '📝',
          title: '产品经理助手',
          desc: '结构化表单 + GPT 风格对话，快速产出 PRD。',
          points: ['支持多种 PRD 模板', '可生成 Markdown 并下载', '记录风险 / 边界 / 里程碑'],
          to: '/pm',
          cta: '进入 PRD 流程',
        },
        {
          id: 'dev',
          emoji: '🧑‍💻',
          title: '程序员助手',
          desc: '提交日志/代码，AI 协助定位问题并给出修复建议。',
          points: ['最小复现 & 排查步骤', '性能/安全提示', '自动生成可执行 ToDo'],
          to: '/dev',
          cta: '去查 BUG',
        },
        {
          id: 'doctor',
          emoji: '🩺',
          title: '寻医问诊助手',
          desc: '整理症状、评估风险，并提示就医时机（非医疗结论）。',
          points: ['结构化采集症状/用药', '家庭护理建议', '高风险信号提醒'],
          to: '/doctor',
          cta: '填写症状',
        },
      ],
    };
  },
};
</script>
