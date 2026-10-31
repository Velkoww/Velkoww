
document.addEventListener('DOMContentLoaded', () => {
    // 1. Highlight active menu link
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    document.querySelectorAll('#desktop-menu .nav-tab').forEach(link => {
        const linkPage = link.getAttribute('href');
        if (currentPage === linkPage || (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        }
    });

    // 2. Fix Mobile Menu Logic (Robust Toggle)
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if(mobileBtn && mobileMenu) {
        mobileBtn.addEventListener('click', (e) => {
            e.preventDefault();
            mobileMenu.classList.toggle('hidden');
        });
    }

    // 3. Robust Typewriter Effect via DOM Nodes (No regex parsing issues)
    const typewriterElement = document.getElementById('typewriter');
    const cursor = document.getElementById('cursor');
    
    if(typewriterElement) {
        // Define exact chunks of text and their colors to avoid syntax matching bugs
        const codeChunks = [
            { text: "const ", color: "text-syntaxPink" },
            { text: "developer ", color: "text-syntaxBlue" },
            { text: "= {\n", color: "text-white" },
            
            { text: "  име: ", color: "text-[#7EE787]" },
            { text: "'Денис Велков'", color: "text-syntaxGreen" },
            { text: ",\n", color: "text-white" },
            
            { text: "  професия: ", color: "text-[#7EE787]" },
            { text: "'Уеб Разработчик'", color: "text-syntaxGreen" },
            { text: ",\n", color: "text-white" },
            
            { text: "  умения: ", color: "text-[#7EE787]" },
            { text: "['HTML', 'CSS', 'JS']", color: "text-syntaxGreen" },
            { text: ",\n", color: "text-white" },
            
            { text: "  архитектура: ", color: "text-[#7EE787]" },
            { text: "'Cloudflare & GitHub'", color: "text-syntaxGreen" },
            { text: ",\n", color: "text-white" },
            
            { text: "  суперсила: ", color: "text-[#7EE787]" },
            { text: "'Google Local SEO'", color: "text-syntaxGreen" },
            { text: "\n};", color: "text-white" }
        ];

        let chunkIdx = 0;
        let charIdx = 0;
        let currentSpan = null;

        function typeNextChar() {
            if (chunkIdx < codeChunks.length) {
                // Create a new span when starting a new chunk
                if (charIdx === 0) {
                    currentSpan = document.createElement('span');
                    currentSpan.className = codeChunks[chunkIdx].color;
                    typewriterElement.appendChild(currentSpan);
                }
                
                // Add next character
                currentSpan.textContent += codeChunks[chunkIdx].text.charAt(charIdx);
                charIdx++;
                
                // Move to next chunk if finished
                if (charIdx >= codeChunks[chunkIdx].text.length) {
                    chunkIdx++;
                    charIdx = 0;
                }
                
                // Dynamic typing speed for realism (15ms to 45ms)
                setTimeout(typeNextChar, Math.random() * 30 + 15);
            } else {
                // Done typing
                if(cursor) {
                    cursor.classList.remove('animate-ping');
                    cursor.classList.add('animate-pulse');
                }
            }
        }
        
        // Start typing after short delay
        setTimeout(typeNextChar, 600);
    }
});
