const { getSceneById } = require('../../utils/scenes');
const { startDemoSession, submitDemoUtterance, generateDemoReport } = require('../../utils/demo-engine');
const { requestAliyunASR, requestAliyunTTS } = require('../../utils/aliyun');

function getEnergyLevel(errorRate) {
  if (errorRate < 20) {
    return { level: 'green', label: '稳定输出' };
  }
  if (errorRate <= 50) {
    return { level: 'yellow', label: '还能更准' };
  }
  return { level: 'red', label: '需要调整' };
}

Page({
  data: {
    scene: {},
    session: null,
    currentStage: {},
    messages: [],
    stageProgressText: '',
    errorRate: 24,
    energyLevel: 'yellow',
    energyLabel: '还能更准',
    energyWidth: 76,
    feedbackSuggestion: '',
    draftText: '',
    showTransition: false,
    transitionTitle: '',
    transitionStageText: '',
    scrollTop: 99999
  },

  onLoad(query) {
    const scene = getSceneById(query.sceneId);
    const session = startDemoSession(scene.id);

    this.setData({
      scene,
      session,
      currentStage: scene.stages[0],
      messages: session.messages,
      stageProgressText: 'Stage 1 / ' + scene.stages.length
    });

    requestAliyunTTS(scene.stages[0].aiOpening).catch(() => {});
  },

  handleInput(event) {
    this.setData({ draftText: event.detail.value });
  },

  handleQuickReply(event) {
    this.setData({ draftText: event.currentTarget.dataset.text });
  },

  async handleMockAsr() {
    const { currentStage } = this.data;
    const response = await requestAliyunASR();
    const sample = currentStage.quickReplies[0] || response.note;
    this.setData({ draftText: sample });
  },

  handleSubmit() {
    const { draftText, session, scene } = this.data;
    const text = String(draftText || '').trim();

    if (!text) {
      wx.showToast({ title: '先说一句再继续', icon: 'none' });
      return;
    }

    const { session: nextSession, uiFeedback } = submitDemoUtterance(session, text);
    const stageAdvanced = nextSession.currentStageIndex !== session.currentStageIndex;
    const currentStage = scene.stages[nextSession.currentStageIndex];
    const energy = getEnergyLevel(uiFeedback.errorRate);
    const lastAiMessage = nextSession.messages[nextSession.messages.length - 1];

    this.setData({
      session: nextSession,
      currentStage,
      messages: nextSession.messages,
      stageProgressText: 'Stage ' + (nextSession.currentStageIndex + 1) + ' / ' + scene.stages.length,
      errorRate: uiFeedback.errorRate,
      energyLevel: energy.level,
      energyLabel: energy.label,
      energyWidth: Math.max(16, 100 - uiFeedback.errorRate),
      feedbackSuggestion: '💡 ' + uiFeedback.suggestion,
      draftText: '',
      scrollTop: this.data.scrollTop + 600
    });

    requestAliyunTTS(lastAiMessage.text).catch(() => {});

    if (uiFeedback.transitionTitle) {
      this.showTransition(uiFeedback.transitionTitle, currentStage.title, stageAdvanced);
    }

    if (uiFeedback.sessionComplete) {
      setTimeout(() => {
        this.finishSession(nextSession);
      }, 900);
    }
  },

  showTransition(title, stageName, stageAdvanced) {
    this.setData({
      showTransition: true,
      transitionTitle: title,
      transitionStageText: stageAdvanced ? '进入 ' + stageName : '当前关卡完成'
    });

    setTimeout(() => {
      this.setData({ showTransition: false });
    }, 1100);
  },

  handleFinishEarly() {
    const { session } = this.data;
    this.finishSession(session);
  },

  finishSession(session) {
    const report = generateDemoReport(session);
    getApp().globalData.currentSessionReport = report;
    wx.navigateTo({
      url: '/pages/report/index'
    });
  }
});
