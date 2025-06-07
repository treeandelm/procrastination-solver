// DeepSeek API 配置
const CONFIG = {
    // 在这里填入你的DeepSeek API密钥
    DEEPSEEK_API_KEY: '',
    
    // DeepSeek API URL
    DEEPSEEK_API_URL: 'https://api.deepseek.com/v1/chat/completions',
    
    // 使用的模型名称
    MODEL_NAME: 'deepseek-chat',
    
    // 配置 DeepSeek API 参数
    API_PARAMS: {
        temperature: 0.7,
        max_tokens: 1000
    }
};

// 防止直接修改配置
Object.freeze(CONFIG);

// 导出配置
window.APP_CONFIG = CONFIG; 