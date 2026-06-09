const sceneList = [
  {
    id: 'interview',
    title: '外企面试',
    subtitle: '从自我介绍到项目深挖的高压闯关。',
    tag: '求职高频',
    accent: '#7ca7ff',
    atmosphere: '冷静、专业、逐级递进',
    stages: [
      {
        id: 'intro',
        title: '自我介绍',
        goal: '在 30 秒内说清角色、年限、优势。',
        coachHint: '提到 current role、years of experience、strength。',
        aiOpening: 'Welcome. Please give me a short self-introduction and tell me why you are a strong fit for this role.',
        quickReplies: [
          'I am a product manager with three years of experience in consumer apps.',
          'My strength is turning unclear needs into clear product plans.',
          'I have led one growth project from zero to launch.'
        ],
        expectedKeywords: ['product', 'experience', 'strength', 'role']
      },
      {
        id: 'project',
        title: '项目深挖',
        goal: '解释项目目标、动作、结果。',
        coachHint: '用 STAR 或目标-动作-结果结构回答。',
        aiOpening: 'Tell me about a project you are most proud of. What exactly did you do and what changed after your work?',
        quickReplies: [
          'The goal was to increase activation in the first week.',
          'I redesigned onboarding and worked with design and engineering closely.',
          'As a result, activation improved by fifteen percent.'
        ],
        expectedKeywords: ['goal', 'result', 'team', 'improved']
      },
      {
        id: 'challenge',
        title: '场景追问',
        goal: '展示分析与取舍能力。',
        coachHint: '给出判断框架，再说优先级。',
        aiOpening: 'Imagine user retention drops after a new release. How would you diagnose the issue and decide what to do first?',
        quickReplies: [
          'I would first check the data funnel and major drop-off points.',
          'Then I would compare user feedback with behavior data.',
          'I would prioritize the issue with the biggest impact and fastest validation.'
        ],
        expectedKeywords: ['data', 'feedback', 'prioritize', 'impact']
      },
      {
        id: 'reverse',
        title: '反问面试官',
        goal: '主动提问，完成收尾。',
        coachHint: '提成长空间、协作方式、成功标准。',
        aiOpening: 'Good. Do you have any questions for me about the role or the team?',
        quickReplies: [
          'Yes. What does success look like in the first six months?',
          'How does the product team work with design and engineering?',
          'What is the biggest challenge for the team right now?'
        ],
        expectedKeywords: ['success', 'team', 'challenge', 'role']
      }
    ]
  },
  {
    id: 'restaurant',
    title: '餐厅点餐',
    subtitle: '完成入座、特殊要求、结账的完整闭环。',
    tag: '生活实战',
    accent: '#6de7c8',
    atmosphere: '轻松、自然、服务对话',
    stages: [
      {
        id: 'seat',
        title: '入座点菜',
        goal: '清楚说出人数、想吃的菜和饮品。',
        coachHint: '用 for two / I would like / could we have。',
        aiOpening: 'Good evening. Table for how many? And are you ready to order?',
        quickReplies: [
          'A table for two, please.',
          'I would like grilled salmon and a salad.',
          'Could we have sparkling water as well?'
        ],
        expectedKeywords: ['table', 'like', 'water', 'please']
      },
      {
        id: 'diet',
        title: '特殊饮食要求',
        goal: '表达忌口与替换需求。',
        coachHint: '提 allergic to / without / instead of。',
        aiOpening: 'Of course. Do you have any dietary restrictions or anything you would like to change?',
        quickReplies: [
          'I am allergic to peanuts.',
          'Could you make it without cheese?',
          'Can I have brown rice instead of fries?'
        ],
        expectedKeywords: ['allergic', 'without', 'instead', 'change']
      },
      {
        id: 'checkout',
        title: '付款结账',
        goal: '顺利完成账单与支付。',
        coachHint: '练习 Could I get the bill? / split / card。',
        aiOpening: 'Certainly. Is there anything else? If not, I can bring the bill whenever you are ready.',
        quickReplies: [
          'Could I get the bill, please?',
          'Can we split the bill?',
          'I will pay by card.'
        ],
        expectedKeywords: ['bill', 'split', 'card', 'ready']
      }
    ]
  },
  {
    id: 'meeting',
    title: '英文会议',
    subtitle: '会议开场、答疑、收尾一气呵成。',
    tag: '职场核心',
    accent: '#ffb773',
    atmosphere: '高效、正式、结构清晰',
    stages: [
      {
        id: 'opening',
        title: '会议介绍',
        goal: '说明议题与会议目标。',
        coachHint: '先欢迎，再说 agenda 和 goal。',
        aiOpening: 'Let us begin. Could you briefly introduce today\'s agenda and what outcome you want from this meeting?',
        quickReplies: [
          'Today we will review launch progress and next steps.',
          'The goal is to align on timeline and risks.',
          'Thank you everyone for joining the meeting.'
        ],
        expectedKeywords: ['agenda', 'goal', 'timeline', 'meeting']
      },
      {
        id: 'qa',
        title: '问题回答',
        goal: '回应追问并给出行动方案。',
        coachHint: '说明现状、风险、下一步。',
        aiOpening: 'One concern is that engineering capacity is tight. How would you respond and keep the project on track?',
        quickReplies: [
          'I would clarify the current blockers first.',
          'Then I would adjust scope based on impact and urgency.',
          'We can keep the key milestone and move lower priority items.'
        ],
        expectedKeywords: ['blocker', 'scope', 'impact', 'milestone']
      },
      {
        id: 'close',
        title: '会议结束',
        goal: '总结结论并确认责任人。',
        coachHint: '用 summary + owner + next step 收尾。',
        aiOpening: 'Great. Please wrap up the meeting with a short summary and next actions.',
        quickReplies: [
          'To summarize, we aligned on the timeline and scope.',
          'The design lead will update the prototype tomorrow.',
          'I will send the notes and next steps after the meeting.'
        ],
        expectedKeywords: ['summarize', 'next', 'timeline', 'update']
      }
    ]
  },
  {
    id: 'daily',
    title: '日常闲聊',
    subtitle: '与同学、家人自然聊天，不再开口发紧。',
    tag: '轻量陪练',
    accent: '#f596ff',
    atmosphere: '亲切、生活化、低压力',
    stages: [
      {
        id: 'classmate',
        title: '与同学对话',
        goal: '聊最近课程与安排。',
        coachHint: '说课程感受、作业安排、接下来的计划。',
        aiOpening: 'Hey, how has school been lately? Anything interesting or stressful this week?',
        quickReplies: [
          'My classes have been busy but interesting.',
          'We have a group project due next week.',
          'I plan to finish most of the work this weekend.'
        ],
        expectedKeywords: ['class', 'project', 'week', 'plan']
      },
      {
        id: 'family',
        title: '与家人闲聊',
        goal: '表达近况、情绪和关心。',
        coachHint: '自然表达 feelings 和 small updates。',
        aiOpening: 'That sounds full. How are things at home? Have you talked with your family recently?',
        quickReplies: [
          'Yes, I called my parents last night.',
          'We talked about work and weekend plans.',
          'I feel better after talking with them.'
        ],
        expectedKeywords: ['family', 'called', 'plans', 'feel']
      },
      {
        id: 'wrap',
        title: '轻松收尾',
        goal: '自然结束对话并约定下次交流。',
        coachHint: '试试 talk later / catch up / take care。',
        aiOpening: 'Nice catching up. Before we finish, how would you end the conversation naturally?',
        quickReplies: [
          'It was great talking with you.',
          'Let us catch up again soon.',
          'Take care and have a good evening.'
        ],
        expectedKeywords: ['great', 'soon', 'care', 'talking']
      }
    ]
  }
];

function getSceneById(sceneId) {
  return sceneList.find((scene) => scene.id === sceneId) || sceneList[0];
}

module.exports = {
  sceneList,
  getSceneById
};
