const { sceneList } = require('../../utils/scenes');

Page({
  data: {
    scenes: sceneList,
    selectedSceneId: sceneList[0].id,
    showGuide: false
  },

  handleSelectScene(event) {
    const { id } = event.currentTarget.dataset;
    this.setData({ selectedSceneId: id });
  },

  handleOpenGuide() {
    this.setData({ showGuide: true });
  },

  handleCloseGuide() {
    this.setData({ showGuide: false });
  },

  handleStartPractice() {
    const { selectedSceneId } = this.data;
    this.setData({ showGuide: false });
    wx.navigateTo({
      url: '/pages/practice/index?sceneId=' + selectedSceneId
    });
  },

  noop() {}
});
