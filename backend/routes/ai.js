const express = require('express');
const router = express.Router();
const axios = require('axios');

/**
 * 通义千问 AI 对话接口
 * POST /api/ai/chat
 */

// 系统提示词 - 设定AI为湖北旅游助手
const SYSTEM_PROMPT = `你是湖北智能旅游平台的AI助手。你的名字叫"小旅"。

你应该专注于回答与湖北旅游相关的问题，包括：
- 景点推荐（武汉、黄鹤楼、武当山、三峡、恩施等）
- 路线规划（从某个城市到景点的行程安排）
- 美食推荐（湖北特色美食如热干面、鸭脖、藕汤等）
- 住宿建议
- 交通信息（高铁、自驾、公共交通等）
- 旅游注意事项

回答要求：
1. 如果用户问的是湖北旅游相关问题，给出具体、有用的建议
2. 如果用户问的问题与湖北旅游无关，礼貌地将话题引导回旅游相关领域
3. 回复使用友好的语气，可以适当使用emoji
4. 路线规划要具体，包含起终点、交通方式、时间安排
5. 用Markdown格式组织回复，使其易读`;

// 通义千问 API 调用
const callDashScopeAPI = async (messages) => {
  const apiKey = process.env.DASHSCOPE_API_KEY;
  
  if (!apiKey || apiKey === 'your-api-key-here') {
    throw new Error('未配置通义千问API Key，请在backend/.env中设置DASHSCOPE_API_KEY');
  }

  const response = await axios.post(
    'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
    {
      model: 'qwen-turbo',
      messages: messages,
      temperature: 0.7,
      max_tokens: 1000
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      }
    }
  );

  return response.data.choices[0].message.content;
};

// AI对话接口
router.post('/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        success: false,
        message: '请提供有效的消息数组'
      });
    }

    // 构建完整的消息列表（包含系统提示词）
    const fullMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages
    ];

    // 调用通义千问 API
    const aiResponse = await callDashScopeAPI(fullMessages);

    res.json({
      success: true,
      data: {
        role: 'assistant',
        content: aiResponse
      }
    });

  } catch (error) {
    console.error('AI对话错误:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'AI服务暂时不可用，请稍后重试'
    });
  }
});

module.exports = router;
