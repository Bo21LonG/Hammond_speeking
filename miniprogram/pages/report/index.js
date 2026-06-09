Page({
  data: {
    report: {
      sceneTitle: '练习场景',
      summary: '完成一轮口语练习后，这里会展示你的量化结果。',
      totalScore: 0,
      fluencyScore: 0,
      grammarScore: 0,
      vocabularyScore: 0,
      passedStages: 0,
      totalStages: 1,
      correctionBoard: [],
      goldPhrases: []
    },
    progressPercent: 0
  },

  onShow() {
    const app = getApp();
    const report = app.globalData.currentSessionReport || this.data.report;
    const progressPercent = Math.round((report.passedStages / Math.max(1, report.totalStages)) * 100);

    this.setData({
      report,
      progressPercent
    });
  },

  handleRestart() {
    wx.redirectTo({
      url: '/pages/home/index'
    });
  },

  onShareAppMessage() {
    const { report } = this.data;
    return {
      title: '我刚完成了《哈蒙口语》' + report.sceneTitle + '练习，得分 ' + report.totalScore,
      path: '/pages/home/index'
    };
  }
});
