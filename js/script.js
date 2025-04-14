/**
 * Vinyl-M - Professional Sound & Light Equipment Rental
 * Complete multilingual website functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // =============================================
    // LANGUAGE MANAGEMENT SYSTEM
    // =============================================
    
    const languageSystem = {
        currentLang: 'en',
        supportedLangs: ['en', 'sr', 'ru'],
        
        init: function() {
            this.detectBrowserLanguage();
            this.setupLanguageButtons();
            this.applyLanguage(this.currentLang);
            this.setupMobileMenu();
            this.setupSmoothScrolling();
        },
        
        detectBrowserLanguage: function() {
            // Get browser language (first 2 characters)
            const browserLang = navigator.language.substring(0, 2).toLowerCase();
            
            // Check if browser language is supported
            if (this.supportedLangs.includes(browserLang)) {
                this.currentLang = browserLang;
            } else {
                // Default to English if browser language not supported
                this.currentLang = 'en';
            }
        },
        
        setupLanguageButtons: function() {
            const langButtons = document.querySelectorAll('.lang-btn');
            
            langButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const lang = btn.dataset.lang;
                    if (this.supportedLangs.includes(lang)) {
                        this.currentLang = lang;
                        this.applyLanguage(lang);
                    }
                });
            });
        },
        
        applyLanguage: function(lang) {
            // 1. Update active state of language buttons
            document.querySelectorAll('.lang-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.lang === lang);
            });
            
            // 2. Show/hide language-specific elements
            document.querySelectorAll('[data-lang]').forEach(element => {
                const displayValue = element.dataset.lang === lang ? 
                    this.getDisplayValue(element) : 'none';
                element.style.display = displayValue;
            });
            
            // 3. Update HTML lang attribute
            document.documentElement.lang = lang;
            
            // 4. Update form placeholders
            this.updateFormPlaceholders(lang);
        },
        
        getDisplayValue: function(element) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                return 'block';
            }
            return element.classList.contains('btn') ? 'inline-block' : 'block';
        },
        
        updateFormPlaceholders: function(lang) {
            // This would be more comprehensive in a real implementation
            const forms = document.querySelectorAll('form');
            forms.forEach(form => {
                const inputs = form.querySelectorAll('input, textarea');
                inputs.forEach(input => {
                    const placeholderText = input.getAttribute(`data-placeholder-${lang}`);
                    if (placeholderText) {
                        input.placeholder = placeholderText;
                    }
                });
            });
        },
        
        // =============================================
        // MOBILE MENU TOGGLE
        // =============================================
        
        setupMobileMenu: function() {
            const mobileMenuToggle = document.createElement('div');
            mobileMenuToggle.className = 'mobile-menu-toggle';
            mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            
            const headerContainer = document.querySelector('header .container');
            if (headerContainer) {
                headerContainer.appendChild(mobileMenuToggle);
                
                mobileMenuToggle.addEventListener('click', () => {
                    const nav = document.querySelector('nav');
                    const icon = mobileMenuToggle.querySelector('i');
                    
                    nav.classList.toggle('active');
                    icon.classList.toggle('fa-bars');
                    icon.classList.toggle('fa-times');
                });
                
                // Close menu when clicking on links
                document.querySelectorAll('nav a').forEach(link => {
                    link.addEventListener('click', () => {
                        if (window.innerWidth <= 768) {
                            const nav = document.querySelector('nav');
                            const icon = mobileMenuToggle.querySelector('i');
                            nav.classList.remove('active');
                            icon.classList.add('fa-bars');
                            icon.classList.remove('fa-times');
                        }
                    });
                });
            }
        },
        
        // =============================================
        // SMOOTH SCROLLING
        // =============================================
        
        setupSmoothScrolling: function() {
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                    e.preventDefault();
                    const targetId = this.getAttribute('href');
                    
                    if (targetId === '#' || targetId === '#!') return;
                    
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        const headerHeight = document.querySelector('header').offsetHeight;
                        const targetPosition = targetElement.offsetTop - headerHeight;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                        
                        // Update URL without page reload
                        if (history.pushState) {
                            history.pushState(null, null, targetId);
                        } else {
                            location.hash = targetId;
                        }
                    }
                });
            });
        },
        
        // =============================================
        // ADDITIONAL UTILITIES
        // =============================================
        
        debounce: function(func, wait = 100) {
            let timeout;
            return function(...args) {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    func.apply(this, args);
                }, wait);
            };
        }
    };
    
    // Initialize all functionality
    languageSystem.init();
    
    // =============================================
    // ADDITIONAL PAGE-SPECIFIC FUNCTIONALITY
    // =============================================
    
    // Gallery image hover effects (if gallery exists on page)
    if (document.querySelector('.gallery-item')) {
        document.querySelectorAll('.gallery-item').forEach(item => {
            item.addEventListener('mouseenter', function() {
                this.querySelector('.overlay').style.opacity = '1';
            });
            
            item.addEventListener('mouseleave', function() {
                this.querySelector('.overlay').style.opacity = '0';
            });
        });
    }
    
    // Equipment category toggles (if equipment lists exist)
    if (document.querySelector('.category')) {
        document.querySelectorAll('.category h3').forEach(header => {
            header.addEventListener('click', function() {
                this.nextElementSibling.classList.toggle('active');
            });
        });
    }
    
    // Form submission handling (if forms exist)
    if (document.querySelector('form')) {
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Basic form validation
                let isValid = true;
                const inputs = this.querySelectorAll('input[required], textarea[required]');
                
                inputs.forEach(input => {
                    if (!input.value.trim()) {
                        isValid = false;
                        input.classList.add('error');
                    } else {
                        input.classList.remove('error');
                    }
                });
                
                if (isValid) {
                    // In a real implementation, you would send the form data to a server
                    alert(languageSystem.currentLang === 'en' ? 'Thank you for your message!' :
                          languageSystem.currentLang === 'sr' ? 'Hvala na vašoj poruci!' :
                          'Спасибо за ваше сообщение!');
                    this.reset();
                }
            });
        });
    }
    
    // Responsive adjustments on window resize
    window.addEventListener('resize', languageSystem.debounce(function() {
        // Close mobile menu if window is resized to desktop size
        if (window.innerWidth > 768) {
            const nav = document.querySelector('nav');
            const toggle = document.querySelector('.mobile-menu-toggle');
            if (nav && toggle) {
                nav.classList.remove('active');
                toggle.querySelector('i').classList.add('fa-bars');
                toggle.querySelector('i').classList.remove('fa-times');
            }
        }
    }));
});
// Проверка работы языкового переключателя
document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const lang = this.dataset.lang;
        console.log(`Selected language: ${lang}`);
        
        // Показываем все элементы с data-lang для выбранного языка
        document.querySelectorAll('[data-lang]').forEach(el => {
            if(el.dataset.lang === lang) {
                el.style.display = 'block';
            } else {
                el.style.display = 'none';
            }
        });
    });
});
console.log(document.querySelectorAll('.lang-btn').length);
// Должно вывести 3 (количество кнопок)