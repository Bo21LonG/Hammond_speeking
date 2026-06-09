const DASHSCOPE_BASE_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';

const aliyunConfig = {
  apiKey: '',
  model: 'qwen-plus',
  useMockByDefault: true
};

function setAliyunConfig(nextConfig) {
  Object.assign(aliyunConfig, nextConfig || {});
}

function request(options) {
  return new Promise((resolve, reject) => {
    wx.request({
      ...options,
      success: resolve,
      fail: reject
    });
  });
}

async function requestAliyunLLM(messages, extra = {}) {
  if (aliyunConfig.useMockByDefault || !aliyunConfig.apiKey) {
    return {
      mock: true,
      content: '当前为 demo mock 模式。接入阿里云后，这里会返回模型生成的场景回复。'
    };
  }

  const response = await request({
    url: DASHSCOPE_BASE_URL,
    method: 'POST',
    header: {
      Authorization: 'Bearer ' + aliyunConfig.apiKey,
      'Content-Type': 'application/json'
    },
    data: {
      model: aliyunConfig.model,
      messages,
      temperature: extra.temperature || 0.7
    }
  });

  const content = (((response || {}).data || {}).choices || [])[0];
  return {
    mock: false,
    raw: response.data,
    content: content && content.message ? content.message.content : ''
  };
}

async function requestAliyunTTS(text) {
  return {
    mock: true,
    text,
    note: '微信小程序里的 TTS 正式接入建议通过服务端签发临时凭证，再调用阿里云语音服务。'
  };
}

async function requestAliyunASR() {
  return {
    mock: true,
    note: '微信小程序里的实时 ASR 正式接入建议通过服务端 token + WebSocket 中转。demo 先保留前端接口形态。'
  };
}

module.exports = {
  aliyunConfig,
  setAliyunConfig,
  requestAliyunLLM,
  requestAliyunTTS,
  requestAliyunASR
};
