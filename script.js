// Variáveis globais
const menuToggle = document.querySelector('.menu-toggle');
const navList = document.querySelector('.nav-list');
const dropdowns = document.querySelectorAll('.dropdown');
const cardFlipButtons = document.querySelectorAll('.card-flip-btn');
const shareButtons = document.querySelectorAll('.share-btn');
const newsletterForm = document.querySelector('.newsletter-form');

// Variáveis do carrossel
const carouselTrack = document.querySelector('.carousel-track');
const carouselPages = document.querySelectorAll('.carousel-page');
const prevButton = document.querySelector('.carousel-button-left');
const nextButton = document.querySelector('.carousel-button-right');
const paginationIndicators = document.querySelectorAll('.pagination-indicator');

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    initializeMenu();
    initializeCards();
    initializeCarousel();
    initializeShareButtons();
    initializeNewsletterForm();
});

// Inicializar menu responsivo
function initializeMenu() {
    // Toggle menu no mobile
    menuToggle.addEventListener('click', () => {
        navList.classList.toggle('active');
        
        // Animar o ícone do hambúrguer
        const hamburger = menuToggle.querySelector('.hamburger');
        hamburger.classList.toggle('active');
    });

    // Gerenciar dropdowns no mobile
    dropdowns.forEach(dropdown => {
        const dropdownToggle = dropdown.querySelector('.dropdown-toggle');
        
        dropdownToggle.addEventListener('click', (e) => {
            // Apenas no mobile
            if (window.innerWidth <= 768) {
                e.preventDefault();
                dropdown.classList.toggle('active');
                
                // Fechar outros dropdowns
                dropdowns.forEach(otherDropdown => {
                    if (otherDropdown !== dropdown) {
                        otherDropdown.classList.remove('active');
                    }
                });
            }
        });
    });

    // Fechar menu ao clicar fora
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.main-nav') && !e.target.closest('.menu-toggle')) {
            navList.classList.remove('active');
        }
    });

    // Ajustar menu ao redimensionar a janela
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            navList.classList.remove('active');
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });
}

// Inicializar cards com efeito flip
function initializeCards() {
    cardFlipButtons.forEach(button => {
        button.addEventListener('click', () => {
            const card = button.closest('.card');
            card.classList.toggle('flipped');
        });
    });
}

// Inicializar carrossel paginado
function initializeCarousel() {
    let currentPage = 0;
    const pageCount = carouselPages.length;
    let autoplayInterval;
    let isAutoPlaying = true;
    
    // Configurar páginas iniciais
    updateCarousel();
    
    // Iniciar autoplay
    startAutoplay();
    
    // Evento para botão anterior
    prevButton.addEventListener('click', () => {
        pauseAutoplay();
        moveToPage(currentPage - 1);
    });
    
    // Evento para botão próximo
    nextButton.addEventListener('click', () => {
        pauseAutoplay();
        moveToPage(currentPage + 1);
    });
    
    // Eventos para indicadores de paginação
    paginationIndicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            pauseAutoplay();
            moveToPage(index);
        });
    });
    
    // Eventos de toque para dispositivos móveis
    let touchStartX = 0;
    let touchEndX = 0;
    
    carouselTrack.addEventListener('touchstart', (e) => {
        pauseAutoplay();
        touchStartX = e.changedTouches[0].screenX;
    });
    
    carouselTrack.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    // Pausar autoplay ao passar o mouse sobre o carrossel
    document.querySelector('.carousel-container').addEventListener('mouseenter', pauseAutoplay);
    document.querySelector('.carousel-container').addEventListener('mouseleave', startAutoplay);
    
    // Função para lidar com swipe
    function handleSwipe() {
        const swipeThreshold = 50;
        if (touchEndX < touchStartX - swipeThreshold) {
            // Swipe para esquerda (próxima página)
            moveToPage(currentPage + 1);
        } else if (touchEndX > touchStartX + swipeThreshold) {
            // Swipe para direita (página anterior)
            moveToPage(currentPage - 1);
        }
    }
    
    // Função para mover para uma página específica
    function moveToPage(index) {
        // Lidar com índices fora dos limites
        if (index < 0) {
            index = pageCount - 1;
        } else if (index >= pageCount) {
            index = 0;
        }
        
        currentPage = index;
        updateCarousel();
    }
    
    // Função para atualizar o carrossel
    function updateCarousel() {
        // Mover o track para mostrar a página atual
        carouselTrack.style.transform = `translateX(-${currentPage * 100}%)`;
        
        // Atualizar indicadores de paginação
        paginationIndicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentPage);
        });
        
        // Atualizar visibilidade dos botões de navegação
        if (pageCount <= 1) {
            prevButton.style.display = 'none';
            nextButton.style.display = 'none';
        } else {
            prevButton.style.display = 'flex';
            nextButton.style.display = 'flex';
        }
    }
    
    // Função para iniciar autoplay
    function startAutoplay() {
        if (!isAutoPlaying && pageCount > 1) {
            autoplayInterval = setInterval(() => {
                moveToPage(currentPage + 1);
            }, 5000);
            isAutoPlaying = true;
        }
    }
    
    // Função para pausar autoplay
    function pauseAutoplay() {
        clearInterval(autoplayInterval);
        isAutoPlaying = false;
    }
    
    // Ajustar carrossel ao redimensionar a janela
    window.addEventListener('resize', () => {
        updateCarousel();
    });
}

// Inicializar botões de compartilhamento
function initializeShareButtons() {
    shareButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Obter informações do card
            const card = button.closest('.card');
            const title = card.querySelector('.card-title').textContent;
            const description = card.querySelector('.card-description').textContent.trim();
            const url = window.location.href;
            
            // Determinar a rede social
            const isInstagram = button.classList.contains('instagram');
            const isLinkedin = button.classList.contains('linkedin');
            
            // Compartilhar nas redes sociais
            if (isInstagram) {
                shareToInstagram(title, description, url);
            } else if (isLinkedin) {
                shareToLinkedin(title, description, url);
            }
        });
    });
}

// Compartilhar no Instagram (simulação)
function shareToInstagram(title, description, url) {
    // No navegador, o Instagram não permite compartilhamento direto via URL
    // Normalmente seria necessário usar a API do Instagram
    // Esta é uma simulação para fins de demonstração
    
    alert(`Compartilhando no Instagram:\n\nTítulo: ${title}\nDescrição: ${description}\nURL: ${url}\n\nNota: O Instagram não permite compartilhamento direto via navegador. Em um ambiente real, isso abriria o aplicativo Instagram ou usaria a API.`);
}

// Compartilhar no LinkedIn
function shareToLinkedin(title, description, url) {
    // Criar URL de compartilhamento do LinkedIn
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(description)}`;
    
    // Abrir em uma nova janela
    window.open(linkedinUrl, '_blank', 'width=600,height=600');
}

// Inicializar formulário de newsletter
function initializeNewsletterForm() {
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            const email = emailInput.value;
            
            // Simulação de envio
            if (email) {
                // Aqui seria feita uma chamada AJAX para um servidor
                alert(`Obrigado por se inscrever com o e-mail: ${email}`);
                emailInput.value = '';
            }
        });
    }
}

// Animações ao scroll
window.addEventListener('scroll', () => {
    const resources = document.querySelectorAll('.resource-item');
    
    // Função para verificar se elemento está visível na viewport
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
            rect.bottom >= 0
        );
    }
    
    // Animar recursos quando visíveis
    resources.forEach((resource, index) => {
        if (isElementInViewport(resource) && !resource.classList.contains('animated')) {
            resource.classList.add('animated');
            setTimeout(() => {
                resource.style.opacity = '1';
                resource.style.transform = 'translateY(0)';
            }, index * 100);
        }
    });
});

// Inicializar animações
function initializeAnimations() {
    const resources = document.querySelectorAll('.resource-item');
    
    // Configurar estado inicial
    resources.forEach(resource => {
        resource.style.opacity = '0';
        resource.style.transform = 'translateY(20px)';
        resource.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    // Disparar verificação inicial
    setTimeout(() => {
        window.dispatchEvent(new Event('scroll'));
    }, 100);
}

// Inicializar animações após carregamento
window.addEventListener('load', initializeAnimations);

// Smooth scroll para links de âncora
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        // Não aplicar para dropdowns no mobile
        if (this.classList.contains('dropdown-toggle') && window.innerWidth <= 768) {
            return;
        }
        
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            // Fechar menu mobile se estiver aberto
            navList.classList.remove('active');
            
            // Scroll suave
            window.scrollTo({
                top: targetElement.offsetTop - 80, // Ajuste para o cabeçalho fixo
                behavior: 'smooth'
            });
        }
    });
});
