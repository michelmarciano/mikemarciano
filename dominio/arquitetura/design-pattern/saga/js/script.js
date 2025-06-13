document.addEventListener('DOMContentLoaded', function() {
    // Elementos DOM
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const currentSlideEl = document.getElementById('current-slide');
    const totalSlidesEl = document.getElementById('total-slides');
    const menuBtn = document.getElementById('menu-btn');
    const closeMenuBtn = document.getElementById('close-menu');
    const sideMenu = document.getElementById('side-menu');
    const slideItems = document.querySelectorAll('.slide-item');
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    const presentationContainer = document.querySelector('.presentation-container');
    
    // Variáveis de estado
    let currentSlideIndex = 0;
    const totalSlides = slides.length;
    
    // Inicialização
    function init() {
        // Atualizar contador de slides
        currentSlideEl.textContent = currentSlideIndex + 1;
        totalSlidesEl.textContent = totalSlides;
        
        // Configurar estado inicial
        updateSlides();
        
        // Adicionar event listeners
        prevBtn.addEventListener('click', goToPrevSlide);
        nextBtn.addEventListener('click', goToNextSlide);
        menuBtn.addEventListener('click', toggleMenu);
        closeMenuBtn.addEventListener('click', toggleMenu);
        
        // Event listeners para itens do menu
        slideItems.forEach(item => {
            item.addEventListener('click', function() {
                const slideIndex = parseInt(this.getAttribute('data-slide')) - 1;
                goToSlide(slideIndex);
                toggleMenu();
            });
        });
        
        // Event listener para tela cheia
        fullscreenBtn.addEventListener('click', toggleFullscreen);
        
        // Event listener para teclas
        document.addEventListener('keydown', handleKeyPress);
    }
    
    // Atualizar a exibição dos slides
    function updateSlides() {
        slides.forEach((slide, index) => {
            slide.classList.remove('active', 'prev');
            
            if (index === currentSlideIndex) {
                slide.classList.add('active');
            } else if (index < currentSlideIndex) {
                slide.classList.add('prev');
            }
        });
        
        // Atualizar o contador de slides
        currentSlideEl.textContent = currentSlideIndex + 1;
        
        // Atualizar o item ativo no menu
        slideItems.forEach((item, index) => {
            if (index === currentSlideIndex) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
        
        // Atualizar estado dos botões de navegação
        prevBtn.disabled = currentSlideIndex === 0;
        nextBtn.disabled = currentSlideIndex === totalSlides - 1;
        
        // Adicionar efeito de fade-in para o slide atual
        slides[currentSlideIndex].classList.add('fade-in');
    }
    
    // Ir para o slide anterior
    function goToPrevSlide() {
        if (currentSlideIndex > 0) {
            currentSlideIndex--;
            updateSlides();
        }
    }
    
    // Ir para o próximo slide
    function goToNextSlide() {
        if (currentSlideIndex < totalSlides - 1) {
            currentSlideIndex++;
            updateSlides();
        }
    }
    
    // Ir para um slide específico
    function goToSlide(index) {
        if (index >= 0 && index < totalSlides) {
            currentSlideIndex = index;
            updateSlides();
        }
    }
    
    // Alternar menu lateral
    function toggleMenu() {
        sideMenu.classList.toggle('open');
    }
    
    // Alternar modo tela cheia
    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            if (presentationContainer.requestFullscreen) {
                presentationContainer.requestFullscreen();
            } else if (presentationContainer.mozRequestFullScreen) { // Firefox
                presentationContainer.mozRequestFullScreen();
            } else if (presentationContainer.webkitRequestFullscreen) { // Chrome, Safari e Opera
                presentationContainer.webkitRequestFullscreen();
            } else if (presentationContainer.msRequestFullscreen) { // IE/Edge
                presentationContainer.msRequestFullscreen();
            }
            presentationContainer.classList.add('fullscreen');
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
            presentationContainer.classList.remove('fullscreen');
        }
    }
    
    // Manipular teclas de atalho
    function handleKeyPress(e) {
        switch (e.key) {
            case 'ArrowLeft':
                goToPrevSlide();
                break;
            case 'ArrowRight':
                goToNextSlide();
                break;
            case 'Escape':
                if (sideMenu.classList.contains('open')) {
                    toggleMenu();
                }
                break;
            case 'f':
                toggleFullscreen();
                break;
            case 'm':
                toggleMenu();
                break;
        }
    }
    
    // Adicionar animações aos elementos dos slides
    function animateSlideElements() {
        const activeSlide = document.querySelector('.slide.active');
        const elements = activeSlide.querySelectorAll('h1, h2, h3, p, .google-colors, .two-columns, .grid-container');
        
        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, 100 * (index + 1));
        });
    }
    
    // Observer para animações quando o slide muda
    const slideObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                if (mutation.target.classList.contains('active')) {
                    animateSlideElements();
                }
            }
        });
    });
    
    // Observar mudanças nos slides
    slides.forEach(slide => {
        slideObserver.observe(slide, { attributes: true });
    });
    
    // Adicionar funcionalidade de arrastar (swipe) para dispositivos móveis
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    document.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        if (touchEndX < touchStartX - swipeThreshold) {
            // Swipe para a esquerda (próximo slide)
            goToNextSlide();
        }
        
        if (touchEndX > touchStartX + swipeThreshold) {
            // Swipe para a direita (slide anterior)
            goToPrevSlide();
        }
    }
    
    // Inicializar a apresentação
    init();
});

