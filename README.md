# Hammond Speaking Demo

《哈蒙口语》微信小程序 demo，采用微信原生小程序结构实现，包含：

- 场景选择与练习机制引导
- 游戏化多阶段口语闯关
- 练习中实时能量条与轻量纠错提示
- 练习后量化总结报告
- 阿里云 LLM / TTS / ASR 前端接入占位封装

## 目录

- `miniprogram/`: 微信小程序源码
- `miniprogram/utils/demo-engine.js`: demo 会话引擎与报告生成逻辑
- `miniprogram/utils/aliyun.js`: 阿里云接口封装占位

## 本地打开

1. 打开微信开发者工具。
2. 导入项目根目录 `/workspace`。
3. `AppID` 可先使用测试号或 `touristappid`。
4. 编译后即可查看首页、练习页、报告页完整 demo 流程。

## 阿里云接入说明

当前 demo 默认使用 `mock` 模式，原因是：

- 真实 `API Key` 不应直接硬编码在小程序前端。
- 阿里云实时 ASR / TTS 一般需要服务端签发临时凭证或做 WebSocket 中转。

你可以在 `miniprogram/utils/aliyun.js` 中：

1. 通过 `setAliyunConfig({ apiKey, useMockByDefault: false })` 打开真实 LLM 请求。
2. 将 `requestAliyunASR()` 与 `requestAliyunTTS()` 替换为你自己的服务端对接逻辑。

## Demo 流程

`选择场景 -> 阅读机制引导 -> 进入练习 -> 输入一句英文 -> 触发能量条和纠错提示 -> 自动切关 -> 生成报告`
