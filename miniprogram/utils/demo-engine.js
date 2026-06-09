const { getSceneById } = require('./scenes');

function clone(data) {
  return JSON.parse(JSON.stringify(data));
}

function buildAiMessage(scene, stageIndex, text) {
  return {
    role: 'ai',
    text,
    sceneId: scene.id,
    stageIndex,
    createdAt: Date.now()
  };
}

function buildUserMessage(text) {
  return {
    role: 'user',
    text,
    createdAt: Date.now()
  };
}

function startDemoSession(sceneId) {
  const scene = getSceneById(sceneId);
  const stage = scene.stages[0];

  return {
    sceneId: scene.id,
    sceneTitle: scene.title,
    startedAt: Date.now(),
    currentStageIndex: 0,
    passedStages: [],
    turnCount: 0,
    totalErrorRate: 0,
    correctionBoard: [],
    messages: [buildAiMessage(scene, 0, stage.aiOpening)]
  };
}

function pick(array, index) {
  if (!array.length) {
    return '';
  }
  return array[index % array.length];
}

function evaluateUtterance(text, stage, turnCount) {
  const normalized = String(text || '').trim();
  const lower = normalized.toLowerCase();
  const words = lower.split(/\s+/).filter(Boolean);
  const matchedKeywords = stage.expectedKeywords.filter((keyword) => lower.includes(keyword.toLowerCase()));
  const grammarSignals = [
    { bad: /\bi have go\b/i, good: 'I have been', reason: '完成时要搭配过去分词。' },
    { bad: /\bhe go to\b/i, good: 'he goes to', reason: '第三人称单数现在时需要加 s。' },
    { bad: /\bi very like\b/i, good: 'I really like', reason: '副词位置更自然。' },
    { bad: /\bmake it no\b/i, good: 'make it without', reason: '餐饮场景里常用 without 表示去掉。' },
    { bad: /\bmore better\b/i, good: 'better', reason: 'better 本身已经是比较级。' }
  ];

  const hit = grammarSignals.find((item) => item.bad.test(normalized));
  const brevityPenalty = words.length < 6 ? 18 : 0;
  const keywordPenalty = Math.max(0, 26 - matchedKeywords.length * 8);
  const structureBonus = /because|so|then|as a result|first|finally|summary|summarize/i.test(normalized) ? 8 : 0;
  let errorRate = Math.min(82, Math.max(8, brevityPenalty + keywordPenalty - structureBonus));

  if (hit) {
    errorRate = Math.min(88, errorRate + 16);
  }

  const suggestion = hit
    ? '建议：将 "' + hit.bad.source.replace(/\\b/g, '') + '" 替换为 "' + hit.good + '"。'
    : matchedKeywords.length >= 2
      ? '建议：继续补充结果、原因或具体数字，让表达更完整。'
      : '建议：加入本关关键词和连接词，让回答更像真实交流。';

  const stageCompleted = matchedKeywords.length >= 2 || (words.length >= 10 && turnCount >= 1);

  return {
    errorRate,
    suggestion,
    correction: hit
      ? {
          wrong: normalized,
          right: normalized.replace(hit.bad, hit.good),
          reason: hit.reason
        }
      : null,
    stageCompleted,
    matchedKeywords
  };
}

function buildAiReply(scene, stageIndex, userText, analysis) {
  const stage = scene.stages[stageIndex];

  if (analysis.stageCompleted && stageIndex < scene.stages.length - 1) {
    const nextStage = scene.stages[stageIndex + 1];
    return {
      reply: 'Nice job. You completed this stage well. Next, ' + nextStage.aiOpening,
      transitionTitle: 'Stage Clear',
      nextStageIndex: stageIndex + 1,
      sessionComplete: false
    };
  }

  if (analysis.stageCompleted && stageIndex === scene.stages.length - 1) {
    return {
      reply: 'Excellent. You completed the full mission. Let us wrap up and review your performance.',
      transitionTitle: 'Mission Complete',
      nextStageIndex: stageIndex,
      sessionComplete: true
    };
  }

  const followUps = [
    'Could you make that more specific?',
    'What happened next, and what was the result?',
    'Please add one more detail so I can judge your communication more clearly.',
    'Try to say it in a fuller sentence and include your main point first.'
  ];

  return {
    reply: pick(followUps, userText.length + stageIndex + analysis.matchedKeywords.length),
    transitionTitle: '',
    nextStageIndex: stageIndex,
    sessionComplete: false
  };
}

function submitDemoUtterance(sessionInput, userText) {
  const session = clone(sessionInput);
  const scene = getSceneById(session.sceneId);
  const stage = scene.stages[session.currentStageIndex];
  const analysis = evaluateUtterance(userText, stage, session.turnCount);
  const aiReplyMeta = buildAiReply(scene, session.currentStageIndex, userText, analysis);

  session.messages.push(buildUserMessage(userText));
  session.messages.push(buildAiMessage(scene, aiReplyMeta.nextStageIndex, aiReplyMeta.reply));
  session.turnCount += 1;
  session.totalErrorRate += analysis.errorRate;

  if (analysis.correction) {
    session.correctionBoard.push(analysis.correction);
  }

  if (analysis.stageCompleted && !session.passedStages.includes(stage.id)) {
    session.passedStages.push(stage.id);
  }

  session.currentStageIndex = aiReplyMeta.nextStageIndex;

  return {
    session,
    uiFeedback: {
      errorRate: analysis.errorRate,
      suggestion: analysis.suggestion,
      transitionTitle: aiReplyMeta.transitionTitle,
      stageCompleted: analysis.stageCompleted,
      sessionComplete: aiReplyMeta.sessionComplete
    }
  };
}

function average(values) {
  if (!values.length) {
    return 0;
  }
  return Math.round(values.reduce((sum, item) => sum + item, 0) / values.length);
}

function generateDemoReport(sessionInput) {
  const session = clone(sessionInput);
  const scene = getSceneById(session.sceneId);
  const turnBase = Math.max(1, session.turnCount);
  const averageErrorRate = Math.round(session.totalErrorRate / turnBase);
  const grammar = Math.max(42, 100 - averageErrorRate);
  const fluency = Math.min(96, 58 + session.turnCount * 9);
  const vocabulary = Math.min(95, 55 + session.passedStages.length * 10);
  const total = Math.round(grammar * 0.38 + fluency * 0.32 + vocabulary * 0.3);

  const goldPhrases = [
    'I would like to structure my answer in three parts.',
    'From my perspective, the key issue is impact versus urgency.',
    'To summarize, we aligned on the goal, the owner, and the next step.',
    'Would it be possible to make a small adjustment here?',
    'What does success look like from your point of view?'
  ].slice(0, 5);

  return {
    sceneTitle: scene.title,
    totalScore: total,
    fluencyScore: fluency,
    grammarScore: grammar,
    vocabularyScore: vocabulary,
    passedStages: session.passedStages.length,
    totalStages: scene.stages.length,
    correctionBoard: session.correctionBoard.length
      ? session.correctionBoard
      : [
          {
            wrong: 'I very like this role.',
            right: 'I really like this role.',
            reason: '副词位置更自然，也更符合面试表达。'
          }
        ],
    goldPhrases,
    summary: session.passedStages.length === scene.stages.length
      ? '你完成了完整关卡，表达已经具备连续输出能力。下一步重点是把结果、数字和连接词说得更稳。'
      : '你已经建立了场景表达框架，但仍需要补充更完整的细节和承接句，才能更稳地通关。'
  };
}

module.exports = {
  startDemoSession,
  submitDemoUtterance,
  generateDemoReport
};
