/**
 * Vinyl-M - Professional Sound & Light Equipment Rental
 * Complete multilingual website functionality
 */

document.addEventListener('DOMContentLoaded', function () {
    // =============================================
    // LANGUAGE MANAGEMENT SYSTEM
    // =============================================

    const languageSystem = {
        currentLang: 'en',
        supportedLangs: ['en', 'sr', 'ru'],

        init: function () {
            this.detectBrowserLanguage();
            this.setupLanguageButtons();
            this.applyLanguage(this.currentLang);
            this.setupMobileMenu();
            this.setupSmoothScrolling();
        },

        detectBrowserLanguage: function () {
            const browserLang = navigator.language.substring(0, 2).toLowerCase();
            this.currentLang = this.supportedLangs.includes(browserLang) ? browserLang : 'en';
        },

        setupLanguageButtons: function () {
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

        applyLanguage: function (lang) {
            // Активная кнопка
            document.querySelectorAll('.lang-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.lang === lang);
            });

            // Показ/скрытие элементов
            document.querySelectorAll('[data-lang]').forEach(element => {
                element.style.display = (element.dataset.lang === lang)
                    ? this.getDisplayValue(element)
                    : 'none';
            });

            // Обновляем <html lang="">
            document.documentElement.lang = lang;

            // Плейсхолдеры в формах
            this.updateFormPlaceholders(lang);
        },

        getDisplayValue: function (element) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                return 'block';
            }
            return element.classList.contains('btn') ? 'inline-block' : 'block';
        },

        updateFormPlaceholders: function (lang) {
            document.querySelectorAll('form').forEach(form => {
                form.querySelectorAll('input, textarea').forEach(input => {
                    const placeholderText = input.getAttribute(`data-placeholder-${lang}`);
                    if (placeholderText) input.placeholder = placeholderText;
                });
            });
        },

        // =============================================
        // MOBILE MENU TOGGLE
        // =============================================

        setupMobileMenu: function () {
            const toggle = document.createElement('div');
            toggle.className = 'mobile-menu-toggle';
            toggle.innerHTML = '<i class="fas fa-bars"></i>';

            const header = document.querySelector('header .container');
            if (header) {
                header.appendChild(toggle);

                toggle.addEventListener('click', () => {
                    const nav = document.querySelector('nav');
                    const icon = toggle.querySelector('i');
                    nav.classList.toggle('active');
                    icon.classList.toggle('fa-bars');
                    icon.classList.toggle('fa-times');
                });

                // Автоматическое закрытие при клике по ссылке
                document.querySelectorAll('nav a').forEach(link => {
                    link.addEventListener('click', () => {
                        if (window.innerWidth <= 768) {
                            const nav = document.querySelector('nav');
                            const icon = toggle.querySelector('i');
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

        setupSmoothScrolling: function () {
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    const targetId = this.getAttribute('href');
                    if (targetId === '#' || targetId === '#!') return;

                    const target = document.querySelector(targetId);
                    if (target) {
                        const offset = document.querySelector('header').offsetHeight;
                        const scrollTo = target.offsetTop - offset;

                        window.scrollTo({
                            top: scrollTo,
                            behavior: 'smooth'
                        });

                        // Обновление URL без перезагрузки
                        history.pushState?.(null, null, targetId);
                    }
                });
            });
        },

        // =============================================
        // Utility
        // =============================================

        debounce: function (func, wait = 100) {
            let timeout;
            return function (...args) {
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(this, args), wait);
            };
        }
    };

    // Инициализация
    languageSystem.init();

    // =============================================
    // ДОПОЛНИТЕЛЬНЫЙ ФУНКЦИОНАЛ СТРАНИЦЫ
    // =============================================

    // Галерея: наведение
    document.querySelectorAll('.gallery-item .overlay').forEach(overlay => {
        const item = overlay.closest('.gallery-item');
        item?.addEventListener('mouseenter', () => overlay.style.opacity = '1');
        item?.addEventListener('mouseleave', () => overlay.style.opacity = '0');
    });

    // Категории оборудования
    document.querySelectorAll('.category h3').forEach(header => {
        header.addEventListener('click', () => {
            header.nextElementSibling?.classList.toggle('active');
        });
    });

    // Обработка отправки форм
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            let isValid = true;
            this.querySelectorAll('input[required], textarea[required]').forEach(input => {
                if (!input.value.trim()) {
                    input.classList.add('error');
                    isValid = false;
                } else {
                    input.classList.remove('error');
                }
            });

            if (isValid) {
                const msg = languageSystem.currentLang === 'en' ? 'Thank you for your message!' :
                    languageSystem.currentLang === 'sr' ? 'Hvala na vašoj poruci!' :
                        'Спасибо за ваше сообщение!';
                alert(msg);
                this.reset();
            }
        });
    });

    // Закрытие меню при ресайзе окна
    window.addEventListener('resize', languageSystem.debounce(() => {
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
