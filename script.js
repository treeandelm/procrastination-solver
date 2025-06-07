document.addEventListener('DOMContentLoaded', function() {
    // 设置步骤数量
    const totalSteps = 4;
    let currentStep = 1;
    
    // 获取DOM元素
    const nextBtn = document.getElementById('next-btn');
    const currentStepEl = document.getElementById('current-step');
    const totalStepsEl = document.getElementById('total-steps');
    const progressBar = document.getElementById('progress-bar');
    const contentArea = document.getElementById('content-area');
    const container = document.querySelector('.container');
    
    // 设置总步骤数
    totalStepsEl.textContent = totalSteps;
    
    // 存储用户输入
    const userData = {
        task: '',
        reasons: []
    };
    
    // 添加页面加载动画
    setTimeout(() => {
        document.body.classList.add('loaded');
        container.classList.add('fade-in');
    }, 200);
    
    // 步骤内容
    const stepContents = [
        // 步骤1已在HTML中定义
        
        // 步骤2
        `<div class="step-content" id="step-2">
            <h2>为什么拖延？</h2>
            <p>请选择你拖延这个任务的原因（可多选）</p>
            <div class="checkbox-group">
                <label><input type="checkbox" name="reason" value="complex"> <span><i class="fa-solid fa-layer-group"></i> 任务太复杂</span></label>
                <label><input type="checkbox" name="reason" value="start"> <span><i class="fa-solid fa-hourglass-start"></i> 不知道从哪开始</span></label>
                <label><input type="checkbox" name="reason" value="fear"> <span><i class="fa-solid fa-face-worried"></i> 害怕失败</span></label>
                <label><input type="checkbox" name="reason" value="boring"> <span><i class="fa-solid fa-face-meh"></i> 觉得很无聊</span></label>
                <label><input type="checkbox" name="reason" value="other"> <span><i class="fa-solid fa-ellipsis"></i> 其他原因</span></label>
            </div>
            <div id="other-reason-container" class="form-group" style="display: none;">
                <textarea id="other-reason" class="input-field textarea" placeholder="请输入其他原因..."></textarea>
            </div>
            <div class="hint">
                <i class="fa-solid fa-info-circle"></i>
                <span>了解拖延原因有助于制定更有效的行动方案</span>
            </div>
        </div>`,
        
        // 步骤3
        `<div class="step-content" id="step-3">
            <h2>正在分析...</h2>
            <div class="loading-container">
                <div class="loading-spinner"></div>
                <p class="loading-text">正在分析任务并生成行动方案</p>
                <p class="loading-subtext">这可能需要几秒钟时间</p>
                <div class="typing-animation">
                    <span class="dot"></span>
                    <span class="dot"></span>
                    <span class="dot"></span>
                </div>
            </div>
        </div>`,
        
        // 步骤4
        `<div class="step-content" id="step-4">
            <h2>拆解后的行动方案</h2>
            <div id="action-plan">
                <!-- 这里将动态生成行动方案 -->
            </div>
            <div class="hint result-hint">
                <i class="fa-solid fa-lightbulb"></i>
                <span>建议：把这些步骤添加到你的待办事项应用中，设置提醒以保持动力</span>
            </div>
            <div class="final-action">
                <button id="restart-btn" class="btn" style="min-width:140px;"><i class="fa-solid fa-arrow-rotate-left" style="margin-right:8px;"></i> 重新开始</button>
                <button id="share-btn" class="btn btn-secondary" style="min-width:140px;"><i class="fa-solid fa-share-nodes" style="margin-right:8px;"></i> 分享</button>
            </div>
        </div>`
    ];
    
    // 添加步骤内容到DOM
    for (let i = 0; i < stepContents.length; i++) {
        contentArea.innerHTML += stepContents[i];
    }
    
    // 添加输入框动画效果
    const taskInput = document.getElementById('task-input');
    if (taskInput) {
        taskInput.addEventListener('focus', function() {
            this.parentElement.classList.add('input-focused');
        });
        
        taskInput.addEventListener('blur', function() {
            this.parentElement.classList.remove('input-focused');
        });
    }
    
    // 点击"下一步"按钮
    nextBtn.addEventListener('click', function() {
        // 验证当前步骤输入
        if (!validateCurrentStep()) {
            return;
        }
        
        // 添加按钮点击效果
        nextBtn.classList.add('btn-clicked');
        setTimeout(() => nextBtn.classList.remove('btn-clicked'), 300);
        
        // 隐藏当前步骤
        const currentStepEl = document.getElementById(`step-${currentStep}`);
        currentStepEl.classList.add('step-exit');
        
        setTimeout(() => {
            currentStepEl.classList.remove('active', 'step-exit');
            
            // 更新当前步骤
            currentStep++;
            
            // 更新步骤指示器
            document.getElementById('current-step').textContent = currentStep;
            progressBar.style.width = `${(currentStep / totalSteps) * 100}%`;
            
            // 显示新的当前步骤
            const nextStepEl = document.getElementById(`step-${currentStep}`);
            nextStepEl.classList.add('active', 'step-enter');
            
            setTimeout(() => {
                nextStepEl.classList.remove('step-enter');
            }, 500);
            
            // 更新按钮文本
            if (currentStep === 2) {
                nextBtn.innerHTML = '分析 <i class="fa-solid fa-chevron-right"></i>';
            }
            
            // 如果是最后一步或者是分析步骤，隐藏"下一步"按钮
            if (currentStep === totalSteps || currentStep === 3) {
                nextBtn.style.display = 'none';
            }
            
            // 如果是分析步骤，调用DeepSeek API
            if (currentStep === 3) {
                // 准备拖延原因文本
                const reasonsText = userData.reasons.map(r => r.text).join('、');
                
                // 模拟思考动画
                animateThinking();
                
                // 调用DeepSeek API
                setTimeout(() => {
                    callDeepSeekAPI(userData.task, reasonsText)
                        .then(response => {
                            // 生成行动方案
                            generateActionPlanFromAI(response);
                            
                            // 隐藏当前步骤
                            document.getElementById(`step-${currentStep}`).classList.add('step-exit');
                            
                            setTimeout(() => {
                                document.getElementById(`step-${currentStep}`).classList.remove('active', 'step-exit');
                                
                                // 更新当前步骤
                                currentStep++;
                                
                                // 更新步骤指示器
                                document.getElementById('current-step').textContent = currentStep;
                                progressBar.style.width = `${(currentStep / totalSteps) * 100}%`;
                                
                                // 显示新的当前步骤
                                const finalStepEl = document.getElementById(`step-${currentStep}`);
                                finalStepEl.classList.add('active', 'step-enter');
                                
                                setTimeout(() => {
                                    finalStepEl.classList.remove('step-enter');
                                    animateActionPlan();
                                }, 500);
                            }, 400);
                        })
                        .catch(error => {
                            console.error('调用API出错:', error);
                            // 如果API调用失败，回退到本地生成行动方案
                            generateActionPlan();
                            
                            // 隐藏当前步骤
                            document.getElementById(`step-${currentStep}`).classList.add('step-exit');
                            
                            setTimeout(() => {
                                document.getElementById(`step-${currentStep}`).classList.remove('active', 'step-exit');
                                
                                // 更新当前步骤
                                currentStep++;
                                
                                // 更新步骤指示器
                                document.getElementById('current-step').textContent = currentStep;
                                progressBar.style.width = `${(currentStep / totalSteps) * 100}%`;
                                
                                // 显示新的当前步骤
                                const finalStepEl = document.getElementById(`step-${currentStep}`);
                                finalStepEl.classList.add('active', 'step-enter');
                                
                                setTimeout(() => {
                                    finalStepEl.classList.remove('step-enter');
                                    animateActionPlan();
                                }, 500);
                            }, 400);
                        });
                }, 2000); // 延迟2秒再调用API，让动画更自然
            }
        }, 400);
    });
    
    // 思考动画
    function animateThinking() {
        const dots = document.querySelectorAll('.typing-animation .dot');
        dots.forEach((dot, index) => {
            dot.style.animationDelay = `${index * 0.2}s`;
        });
    }
    
    // 行动方案动画
    function animateActionPlan() {
        const planSections = document.querySelectorAll('.plan-section');
        planSections.forEach((section, index) => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                section.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }, 300 + (index * 200));
        });
    }
    
    // 监听"其他原因"复选框
    document.addEventListener('change', function(e) {
        if (e.target && e.target.name === 'reason' && e.target.value === 'other') {
            const otherReasonContainer = document.getElementById('other-reason-container');
            if (e.target.checked) {
                otherReasonContainer.style.display = 'block';
                setTimeout(() => {
                    otherReasonContainer.style.opacity = '1';
                    otherReasonContainer.style.transform = 'translateY(0)';
                }, 10);
            } else {
                otherReasonContainer.style.opacity = '0';
                otherReasonContainer.style.transform = 'translateY(10px)';
                setTimeout(() => {
                    otherReasonContainer.style.display = 'none';
                }, 300);
            }
        }
    });
    
    // 重新开始按钮功能
    document.addEventListener('click', function(e) {
        if (e.target && (e.target.id === 'restart-btn' || e.target.closest('#restart-btn'))) {
            // 按钮动画
            const btn = document.getElementById('restart-btn');
            btn.classList.add('btn-clicked');
            setTimeout(() => btn.classList.remove('btn-clicked'), 300);
            
            // 当前步骤淡出
            document.getElementById(`step-${currentStep}`).classList.add('step-exit');
            
            setTimeout(() => {
                // 隐藏当前步骤
                document.getElementById(`step-${currentStep}`).classList.remove('active', 'step-exit');
                
                // 清空用户数据
                userData.task = '';
                userData.reasons = [];
                
                // 重置表单
                document.getElementById('task-input').value = '';
                const reasonCheckboxes = document.querySelectorAll('input[name="reason"]');
                reasonCheckboxes.forEach(checkbox => checkbox.checked = false);
                document.getElementById('other-reason').value = '';
                document.getElementById('other-reason-container').style.display = 'none';
                document.getElementById('other-reason-container').style.opacity = '0';
                document.getElementById('other-reason-container').style.transform = 'translateY(10px)';
                
                // 重置为第一步
                currentStep = 1;
                
                // 更新步骤指示器
                document.getElementById('current-step').textContent = currentStep;
                progressBar.style.width = `${(currentStep / totalSteps) * 100}%`;
                
                // 显示第一步
                const firstStepEl = document.getElementById(`step-1`);
                firstStepEl.classList.add('active', 'step-enter');
                
                setTimeout(() => {
                    firstStepEl.classList.remove('step-enter');
                }, 500);
                
                // 显示"下一步"按钮并重置文本
                nextBtn.style.display = 'flex';
                nextBtn.innerHTML = '下一步 <i class="fa-solid fa-chevron-right"></i>';
            }, 400);
        }
        
        // 分享按钮功能
        if (e.target && (e.target.id === 'share-btn' || e.target.closest('#share-btn'))) {
            const btn = document.getElementById('share-btn');
            btn.classList.add('btn-clicked');
            setTimeout(() => btn.classList.remove('btn-clicked'), 300);
            
            const shareText = `我使用拖延症任务拆解器拆解了我的任务"${userData.task}"，这真的很有帮助！`;
            
            if (navigator.share) {
                navigator.share({
                    title: '拖延症任务拆解器',
                    text: shareText,
                    url: window.location.href
                })
                .catch(error => {
                    console.error('分享失败:', error);
                    copyToClipboard(shareText + ' ' + window.location.href);
                    showMessage('已复制到剪贴板，你可以手动分享');
                });
            } else {
                copyToClipboard(shareText + ' ' + window.location.href);
                showMessage('已复制到剪贴板，你可以手动分享');
            }
        }
    });
    
    // 复制到剪贴板
    function copyToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }
    
    // 显示消息
    function showMessage(message) {
        const messageEl = document.createElement('div');
        messageEl.className = 'message';
        messageEl.innerHTML = `<i class="fa-solid fa-check-circle"></i> ${message}`;
        
        document.body.appendChild(messageEl);
        
        setTimeout(() => {
            messageEl.classList.add('message-show');
        }, 10);
        
        setTimeout(() => {
            messageEl.classList.remove('message-show');
            messageEl.classList.add('message-hide');
            
            setTimeout(() => {
                document.body.removeChild(messageEl);
            }, 300);
        }, 3000);
    }
    
    // 验证当前步骤输入
    function validateCurrentStep() {
        if (currentStep === 1) {
            const taskInput = document.getElementById('task-input');
            if (!taskInput.value.trim()) {
                showError('请输入你正在拖延的任务');
                taskInput.focus();
                return false;
            }
            userData.task = taskInput.value.trim();
        }
        else if (currentStep === 2) {
            const reasonCheckboxes = document.querySelectorAll('input[name="reason"]:checked');
            if (reasonCheckboxes.length === 0) {
                showError('请至少选择一个拖延原因');
                return false;
            }
            
            // 收集拖延原因
            userData.reasons = [];
            reasonCheckboxes.forEach(checkbox => {
                if (checkbox.value === 'other') {
                    const otherReason = document.getElementById('other-reason').value.trim();
                    if (otherReason) {
                        userData.reasons.push({value: 'other', text: otherReason});
                    }
                } else {
                    userData.reasons.push({value: checkbox.value, text: checkbox.parentElement.querySelector('span').textContent.trim()});
                }
            });
        }
        return true;
    }
    
    // 显示错误信息
    function showError(message) {
        const errorEl = document.createElement('div');
        errorEl.className = 'error-message';
        errorEl.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> ${message}`;
        
        const contentArea = document.querySelector('.content-area');
        contentArea.appendChild(errorEl);
        
        // 添加摇晃动画
        contentArea.classList.add('shake');
        setTimeout(() => {
            contentArea.classList.remove('shake');
        }, 500);
        
        // 自动消失
        setTimeout(() => {
            errorEl.classList.add('fade-out');
            setTimeout(() => {
                contentArea.removeChild(errorEl);
            }, 300);
        }, 3000);
    }
    
    // 调用DeepSeek API
    async function callDeepSeekAPI(task, reasons) {
        // 获取配置
        const config = window.APP_CONFIG || {};
        const apiKey = config.DEEPSEEK_API_KEY || '';
        const apiUrl = config.DEEPSEEK_API_URL || 'https://api.deepseek.com/v1/chat/completions';
        const modelName = config.MODEL_NAME || 'deepseek-chat';
        const apiParams = config.API_PARAMS || { temperature: 0.7, max_tokens: 1000 };
        
        // 构建prompt
        const prompt = `根据福格行为模型，将任务'${task}'拆解成10个以上的具体步骤。用户拖延原因是'${reasons}'。每个步骤要足够小和具体，让人容易开始行动。`;
        
        // 如果没有API密钥，抛出错误
        if (!apiKey) {
            throw new Error('缺少DeepSeek API密钥，请在config.js中配置DEEPSEEK_API_KEY');
        }
        
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: modelName,
                    messages: [
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    temperature: apiParams.temperature,
                    max_tokens: apiParams.max_tokens
                })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`API响应错误: ${errorData.error?.message || response.statusText}`);
            }
            
            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            console.error('API调用失败:', error);
            throw error;
        }
    }
    
    // 从AI响应生成行动方案
    function generateActionPlanFromAI(aiResponse) {
        const actionPlanContainer = document.getElementById('action-plan');
        let actionPlanHTML = '';
        
        // 添加任务和原因部分
        actionPlanHTML += `<div class="plan-section">
            <h3><i class="fa-solid fa-file-alt"></i> 你的任务</h3>
            <p class="task-summary">${userData.task}</p>
        </div>`;
        
        actionPlanHTML += `<div class="plan-section">
            <h3><i class="fa-solid fa-magnifying-glass"></i> 拖延原因</h3>
            <ul class="reasons-list">`;
        
        userData.reasons.forEach(reason => {
            actionPlanHTML += `<li>${reason.text}</li>`;
        });
        
        actionPlanHTML += `</ul>
        </div>`;
        
        // 添加AI生成的行动方案
        actionPlanHTML += `<div class="plan-section">
            <h3><i class="fa-solid fa-list-check"></i> 行动方案 (基于福格行为模型)</h3>
            <div class="ai-response">
                ${formatAIResponse(aiResponse)}
            </div>
        </div>`;
        
        // 更新行动方案
        actionPlanContainer.innerHTML = actionPlanHTML;
    }
    
    // 格式化AI响应
    function formatAIResponse(response) {
        // 替换换行符为HTML换行
        let formatted = response.replace(/\n/g, '<br>');
        
        // 尝试识别编号列表并添加样式
        formatted = formatted.replace(/(\d+\.\s.*?)(?=<br>\d+\.|$)/g, '<div class="step-item">$1</div>');
        
        return formatted;
    }
    
    // 本地生成行动方案 (API调用失败时的备选方案)
    function generateActionPlan() {
        const actionPlanContainer = document.getElementById('action-plan');
        let actionPlanHTML = '';
        
        // 根据任务和拖延原因生成行动方案
        actionPlanHTML += `<div class="plan-section">
            <h3><i class="fa-solid fa-file-alt"></i> 你的任务</h3>
            <p class="task-summary">${userData.task}</p>
        </div>`;
        
        actionPlanHTML += `<div class="plan-section">
            <h3><i class="fa-solid fa-magnifying-glass"></i> 拖延原因</h3>
            <ul class="reasons-list">`;
        
        userData.reasons.forEach(reason => {
            actionPlanHTML += `<li>${reason.text}</li>`;
        });
        
        actionPlanHTML += `</ul>
        </div>`;
        
        actionPlanHTML += `<div class="plan-section">
            <h3><i class="fa-solid fa-list-check"></i> 行动方案</h3>
            <ol class="action-steps">`;
        
        // 根据不同的拖延原因给出不同的建议
        const hasComplexReason = userData.reasons.some(r => r.value === 'complex');
        const hasStartReason = userData.reasons.some(r => r.value === 'start');
        const hasFearReason = userData.reasons.some(r => r.value === 'fear');
        const hasBoringReason = userData.reasons.some(r => r.value === 'boring');
        
        if (hasComplexReason) {
            actionPlanHTML += `<li>
                <strong><i class="fa-solid fa-puzzle-piece"></i> 将任务分解成更小的部分</strong>
                <p>把"${userData.task}"拆分成以下几个小步骤，每个不超过25分钟：</p>
                <ol class="sub-steps">
                    <li>分析任务需求（25分钟）</li>
                    <li>列出所有需要完成的部分（25分钟）</li>
                    <li>按重要性和优先级排序（15分钟）</li>
                    <li>专注于完成第一个小部分（25分钟）</li>
                </ol>
            </li>`;
        }
        
        if (hasStartReason) {
            actionPlanHTML += `<li>
                <strong><i class="fa-solid fa-play"></i> 创建一个简单的开始点</strong>
                <p>为"${userData.task}"设定一个极其简单的第一步：</p>
                <ul class="sub-steps">
                    <li>只花5分钟时间，写下你对这个任务的初步想法</li>
                    <li>设置一个舒适的工作环境</li>
                    <li>承诺自己只工作5分钟，然后决定是否继续</li>
                </ul>
            </li>`;
        }
        
        if (hasFearReason) {
            actionPlanHTML += `<li>
                <strong><i class="fa-solid fa-shield-halved"></i> 应对失败恐惧</strong>
                <p>尝试以下方法来减轻对"${userData.task}"的焦虑：</p>
                <ul class="sub-steps">
                    <li>承认完美是不可能的，设定"足够好"的标准</li>
                    <li>想象最坏的情况，并制定应对计划</li>
                    <li>回忆你过去成功完成的类似任务</li>
                </ul>
            </li>`;
        }
        
        if (hasBoringReason) {
            actionPlanHTML += `<li>
                <strong><i class="fa-solid fa-gamepad"></i> 增加任务的趣味性</strong>
                <p>让"${userData.task}"变得更有吸引力：</p>
                <ul class="sub-steps">
                    <li>边听喜欢的音乐边完成任务</li>
                    <li>使用番茄工作法：25分钟工作，5分钟休息</li>
                    <li>设置完成后的奖励</li>
                    <li>与朋友一起完成或分享进度</li>
                </ul>
            </li>`;
        }
        
        // 针对所有情况的通用建议
        actionPlanHTML += `<li>
            <strong><i class="fa-solid fa-calendar-check"></i> 制定具体的行动计划</strong>
            <p>为完成"${userData.task}"设定明确的时间和地点：</p>
            <ul class="sub-steps">
                <li>明确指定什么时间开始（例如：今天下午2:00）</li>
                <li>选择一个没有干扰的环境</li>
                <li>设置一个现实的截止日期</li>
                <li>每完成一个小步骤就给自己一个小奖励</li>
            </ul>
        </li>`;
        
        actionPlanHTML += `</ol>
        </div>`;
        
        // 更新行动方案
        actionPlanContainer.innerHTML = actionPlanHTML;
    }
}); 