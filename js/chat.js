document.addEventListener('DOMContentLoaded', () => {
    const chatBtn = document.getElementById('chat-toggle-btn');
    const chatContainer = document.getElementById('chatbot-container');
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const chatSendBtn = document.getElementById('chat-send-btn');

    // Dynamic Knowledge Base
    const dynamicKB = [];

    // Build Knowledge Base from DOM
    const buildKnowledgeBase = () => {
        // Scrape Projects & Experience (Timeline and Project Cards)
        const timelineItems = document.querySelectorAll('.timeline-item, .project-card');
        timelineItems.forEach(item => {
            const titleEl = item.querySelector('.company-name, .project-title');
            const descEl = item.querySelector('.role-description, .project-desc');
            if (titleEl && descEl) {
                const title = titleEl.textContent.trim();
                dynamicKB.push({
                    type: 'project',
                    keywords: title.toLowerCase().split(/\s+/),
                    title: title,
                    answer: `Regarding <strong>${title}</strong>: ${descEl.textContent.trim()}`
                });
            }
        });

        // Scrape Tech Categories
        const techCategories = document.querySelectorAll('.tech-category');
        techCategories.forEach(cat => {
            const titleEl = cat.querySelector('.tech-category-title');
            const listItems = cat.querySelectorAll('.tech-list li');
            if (titleEl && listItems.length > 0) {
                const title = titleEl.textContent.trim();
                const techsArray = Array.from(listItems).map(li => li.textContent.trim());
                const techs = techsArray.join(', ');
                dynamicKB.push({
                    type: 'skill',
                    // Include specific technology names in keywords to allow matching on specific queries!
                    keywords: title.toLowerCase().split(/\s+/)
                        .concat(techsArray.map(t => t.toLowerCase()))
                        .concat(['tech', 'skills', 'languages']),
                    title: title,
                    answer: `Under <strong>${title}</strong>, my skills include: ${techs}.`
                });
            }
        });

        // Scrape Location
        const locationBadge = document.querySelector('.location-badge');
        if (locationBadge) {
            const locationText = locationBadge.textContent.replace(/[\u2190-\u21FF\u2B50-\u2BFF\u2500-\u257F]/g, '').trim();
            dynamicKB.push({
                type: 'location',
                keywords: ['based', 'location', 'live', 'where', 'country', 'city', 'india', 'from'],
                title: 'Location',
                answer: `I am currently <strong>${locationText}</strong>.`
            });
        }

        // Scrape Important Links (Socials, CV, Contact)
        const links = document.querySelectorAll('a[href^="http"], a[href^="mailto"]');
        const addedLinks = new Set(); // Prevent duplicates
        links.forEach(link => {
            // Get text or title, remove arrow symbols like ↗ and trim
            const title = (link.textContent.trim() || link.title || '').replace(/[\u2190-\u21FF\u2B50-\u2BFF\u2500-\u257F]/g, '').trim(); 
            if (title.length > 2 && !addedLinks.has(title.toLowerCase())) {
                addedLinks.add(title.toLowerCase());
                dynamicKB.push({
                    type: 'link',
                    keywords: title.toLowerCase().split(/\s+/),
                    title: title,
                    answer: `You can check out my <strong>${title}</strong> here: <a href="${link.href}" target="_blank">Link</a>`
                });
            }
        });
    };

    buildKnowledgeBase();

    // Bot Responses Intents
    const intents = {
        greetings: ['hi', 'hello', 'hey', 'sup', 'good morning', 'good evening'],
        contact: ['contact', 'email', 'phone', 'reach', 'hire', 'message', 'connect'],
        projects: ['project', 'work', 'portfolio', 'built', 'experience'],
        skills: ['skill', 'tech', 'stack', 'language', 'framework', 'tools', 'react', 'node', 'java'],
        resume: ['resume', 'cv', 'download'],
        about: ['about', 'who', 'background', 'bio', 'story'],
        github: ['github', 'git', 'repo', 'repository', 'code']
    };

    const getBotResponse = (message) => {
        const lowerMsg = message.toLowerCase();
        
        // 1. Check for specific dynamic matches in Knowledge Base (Projects/Skills/Links)
        const stopWords = ['the', 'and', 'for', 'you', 'are', 'can', 'with', 'about', 'tell', 'what', 'how', 'who', 'why', 'where', 'when', 'me', 'my', 'is', 'in', 'on', 'of', 'to', 'do', 'does', 'did', 'have', 'has', 'had', 'any', 'some', 'this', 'that', 'these', 'those'];
        const userWords = lowerMsg.split(/[\s,?.!]+/).filter(w => w.length > 2 && !stopWords.includes(w));
        
        for (const item of dynamicKB) {
            const significantKeywords = item.keywords.filter(k => k.length > 2 && !stopWords.includes(k));
            
            // Check for exact matches or bidirectional substring matches (for plurals/prefixes)
            // Example: user types "database" (userWord) -> matches "databases" (keyword) because "databases".includes("database")
            // Example: user types "mail" (userWord) -> matches "email" (keyword) because "email".includes("mail")
            let isMatch = userWords.some(userWord => 
                significantKeywords.some(k => k === userWord || k.includes(userWord) || userWord.includes(k))
            );
            
            if (isMatch) {
                return item.answer;
            }
        }

        // 2. Fallback to general intents
        if (intents.github.some(k => lowerMsg.includes(k))) {
            return `You can find all my code and open-source contributions on my <a href="https://github.com/yashhh-23" target="_blank">GitHub Profile</a>.`;
        }
        if (intents.contact.some(k => lowerMsg.includes(k))) {
            return `You can reach me via email at <a href="mailto:yashdedhia05@gmail.com">yashdedhia05@gmail.com</a> or connect with me on <a href="https://www.linkedin.com/in/yashdedhia05" target="_blank">LinkedIn</a>.`;
        }
        if (intents.projects.some(k => lowerMsg.includes(k))) {
            return `I've built several full-stack projects including ATLAS, WhiteboardWeb, and a PDF Tools Suite. You can ask me about a specific project by name, or check the <a href="#projects">Projects section</a>!`;
        }
        if (intents.skills.some(k => lowerMsg.includes(k))) {
            return `My core stack includes Node.js, Express, React, Java, PostgreSQL, and MongoDB. Ask me about specific categories like "databases" or "AI", or check the <a href="#technologies">Technologies section</a>!`;
        }
        if (intents.resume.some(k => lowerMsg.includes(k))) {
            return `You can view or download my CV from the <a href="#about">About section</a>.`;
        }
        if (intents.about.some(k => lowerMsg.includes(k))) {
            return `I'm Yash Dedhia, a Full Stack Developer and Open Source Contributor. I build interfaces that feel alive and robust backends!`;
        }
        if (intents.greetings.some(k => lowerMsg.includes(k))) {
            return `Sri Hari! How can I help you today? You can ask about specific projects (like "ATLAS"), my skills, or how to contact me.`;
        }
        
        // 3. Default response
        return `I apologize, but I don't have that exact information. Try asking about a specific project by name (e.g., "WhiteboardWeb"), or please <a href="mailto:yashdedhia05@gmail.com">contact Yash directly</a>!`;
    };

    // Persistence Helpers
    const saveChatHistory = () => {
        const messages = [];
        chatMessages.querySelectorAll('.message:not(.typing)').forEach(msg => {
            messages.push({
                text: msg.innerHTML,
                sender: msg.classList.contains('user') ? 'user' : 'bot'
            });
        });
        sessionStorage.setItem('portfolio_chat_history', JSON.stringify(messages));
    };

    const loadChatHistory = () => {
        const saved = sessionStorage.getItem('portfolio_chat_history');
        if (saved) {
            try {
                const messages = JSON.parse(saved);
                messages.forEach(msg => {
                    addMessage(msg.text, msg.sender, false);
                });
            } catch (e) {
                console.error('Error loading chat history:', e);
            }
        }
    };

    // Typing Indicator Helpers
    const showTypingIndicator = () => {
        removeTypingIndicator(); // Ensure no duplicates
        const typingDiv = document.createElement('div');
        typingDiv.classList.add('message', 'bot', 'typing');
        typingDiv.id = 'chat-typing-indicator';
        typingDiv.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    const removeTypingIndicator = () => {
        const indicator = document.getElementById('chat-typing-indicator');
        if (indicator) {
            indicator.remove();
        }
    };

    const addMessage = (message, sender, shouldSave = true) => {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender);
        messageDiv.innerHTML = message;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        if (shouldSave) {
            saveChatHistory();
        }
    };

    const handleSend = () => {
        const message = chatInput.value.trim();
        if (message === '') return;

        // Add user message
        addMessage(message, 'user', true);
        chatInput.value = '';

        // Show typing indicator
        showTypingIndicator();

        // Simulate typing delay
        setTimeout(() => {
            removeTypingIndicator();
            const botReply = getBotResponse(message);
            addMessage(botReply, 'bot', true);
        }, 1000);
    };

    // Event Listeners
    if(chatBtn && chatContainer) {
        chatBtn.addEventListener('click', () => {
            chatContainer.classList.toggle('open');
            if (chatContainer.classList.contains('open')) {
                chatInput.focus();
                if (chatMessages.querySelectorAll('.message').length === 0) {
                    // Initial greeting (only if no saved history)
                    setTimeout(() => {
                        addMessage("Hi! I'm Yash's assistant. How can I help you?", 'bot', true);
                    }, 300);
                }
            }
        });
    }

    if(chatSendBtn) {
        chatSendBtn.addEventListener('click', handleSend);
    }

    if(chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleSend();
            }
        });
    }

    // Load history on page load
    loadChatHistory();
});
