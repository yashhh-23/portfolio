document.addEventListener('DOMContentLoaded', () => {
    const chatBtn = document.getElementById('chat-toggle-btn');
    const chatContainer = document.getElementById('chatbot-container');
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const chatSendBtn = document.getElementById('chat-send-btn');

    // Bot Responses Knowledge Base
    const responses = {
        greetings: ['hi', 'hello', 'hey', 'sup', 'good morning', 'good evening'],
        contact: ['contact', 'email', 'phone', 'reach', 'hire', 'message', 'connect'],
        projects: ['project', 'work', 'portfolio', 'built', 'experience'],
        skills: ['skill', 'tech', 'stack', 'language', 'framework', 'tools', 'react', 'node', 'java'],
        resume: ['resume', 'cv', 'download'],
        about: ['about', 'who', 'background', 'bio', 'story']
    };

    const getBotResponse = (message) => {
        const lowerMsg = message.toLowerCase();
        
        // Check for contact
        if (responses.contact.some(keyword => lowerMsg.includes(keyword))) {
            return `You can reach me via email at <a href="mailto:yashdedhia05@gmail.com">yashdedhia05@gmail.com</a> or connect with me on <a href="https://www.linkedin.com/in/yashdedhia05" target="_blank">LinkedIn</a>.`;
        }
        // Check for projects
        if (responses.projects.some(keyword => lowerMsg.includes(keyword))) {
            return `I've built several full-stack projects including a Multi-Agent Debate Engine (ATLAS), a collaborative WhiteboardWeb, and a PDF Tools Suite. Check out the <a href="#projects">Projects section</a> above!`;
        }
        // Check for skills
        if (responses.skills.some(keyword => lowerMsg.includes(keyword))) {
            return `My core stack includes Node.js, Express, React, Next.js, Java, PostgreSQL, and MongoDB. I also specialize in AI integrations and distributed systems.`;
        }
        // Check for resume
        if (responses.resume.some(keyword => lowerMsg.includes(keyword))) {
            return `You can view or download my CV from the <a href="#about">About section</a>.`;
        }
        // Check for about
        if (responses.about.some(keyword => lowerMsg.includes(keyword))) {
            return `I'm Yash Dedhia, a Full Stack Developer and Open Source Contributor. I build interfaces that feel alive and robust backends!`;
        }
        // Check for greetings
        if (responses.greetings.some(keyword => lowerMsg.includes(keyword))) {
            return `Sri Hari! How can I help you today? You can ask about my projects, skills, or how to contact me.`;
        }
        
        // Default response
        return `I apologize, but I don't have that information. For more specific queries, please <a href="mailto:yashdedhia05@gmail.com">contact Yash directly</a>!`;
    };

    const addMessage = (message, sender) => {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender);
        messageDiv.innerHTML = message;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    const handleSend = () => {
        const message = chatInput.value.trim();
        if (message === '') return;

        // Add user message
        addMessage(message, 'user');
        chatInput.value = '';

        // Simulate typing delay
        setTimeout(() => {
            const botReply = getBotResponse(message);
            addMessage(botReply, 'bot');
        }, 500);
    };

    // Event Listeners
    if(chatBtn && chatContainer) {
        chatBtn.addEventListener('click', () => {
            chatContainer.classList.toggle('open');
            if (chatContainer.classList.contains('open')) {
                chatInput.focus();
                if (chatMessages.children.length === 0) {
                    // Initial greeting
                    setTimeout(() => {
                        addMessage("Hi! I'm Yash's assistant. How can I help you?", 'bot');
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
});
