// Текущий язык и тема
let currentLang = 'ru';
let currentTheme = 'light';

// Переключение поиска
function toggleSearch() {
    const searchBar = document.getElementById('search-bar');
    if (searchBar) {
        searchBar.classList.toggle('active');
        if (searchBar.classList.contains('active')) {
            document.getElementById('search-input').focus();
        }
    }
}

// Переключение темы
function toggleTheme() {
    console.log('🌙 toggleTheme() вызвана');
    console.log('Текущая тема:', document.body.dataset.theme);
    
    // Переключаем тему
    currentTheme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
    document.body.dataset.theme = currentTheme;
    localStorage.setItem('theme', currentTheme);
    
    console.log('Новая тема:', currentTheme);
    console.log('body[data-theme]:', document.body.dataset.theme);
    
    // Обновляем иконку
    const themeBtn = document.querySelector('.theme-toggle i');
    if (themeBtn) {
        themeBtn.className = currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        console.log('✅ Иконка обновлена:', themeBtn.className);
    } else {
        console.error('❌ Кнопка темы не найдена!');
    }
    
    // Показываем уведомление
    const message = currentTheme === 'dark' 
        ? 'Включена тёмная тема (для слабовидящих)' 
        : 'Включена светлая тема';
    showNotification(message);
    
    console.log('✅ Тема успешно изменена');
}

// Переключение языка
function toggleLanguage() {
    console.log('🌐 toggleLanguage() вызвана');
    console.log('Текущий язык:', currentLang);
    
    // Переключаем язык
    currentLang = currentLang === 'ru' ? 'en' : 'ru';
    console.log('Новый язык:', currentLang);
    
    // Обновляем кнопку
    const currentLangEl = document.getElementById('current-lang');
    const altLangEl = document.getElementById('alt-lang');
    
    if (currentLangEl && altLangEl) {
        if (currentLang === 'ru') {
            currentLangEl.textContent = 'Eng';
            altLangEl.textContent = 'Rus';
        } else {
            currentLangEl.textContent = 'Rus';
            altLangEl.textContent = 'Eng';
        }
        console.log('✅ Текст кнопки обновлён');
    } else {
        console.error('❌ Элементы языка не найдены!');
    }
    
    // Применяем переводы ко всей странице
    if (window.i18n && window.i18n.applyTranslations) {
        window.i18n.applyTranslations(currentLang);
        console.log('✅ Переводы применены');
    } else {
        console.warn('⚠️ Модуль i18n не загружен');
    }
    
    // Сохраняем
    localStorage.setItem('lang', currentLang);
    console.log('✅ Язык сохранён в localStorage');
    
    // Показываем уведомление
    const message = currentLang === 'en' 
        ? 'Language changed to English' 
        : 'Язык изменён на русский';
    showNotification(message);
}

// Уведомление
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: #3498db;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 2000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 2000);
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Инициализация ML-Project-Bambuk...');
    
    // Восстанавливаем тему
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.dataset.theme = savedTheme;
    currentTheme = savedTheme;
    console.log('✅ Тема восстановлена:', savedTheme);
    
    const themeBtn = document.querySelector('.theme-toggle i');
    if (themeBtn) {
        themeBtn.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        console.log('✅ Иконка темы установлена');
    }
    
    // Восстанавливаем язык
    const savedLang = localStorage.getItem('lang') || 'ru';
    currentLang = savedLang;
    console.log('✅ Язык восстановлен:', savedLang);
    
    // Обновляем кнопку языка
    const currentLangEl = document.getElementById('current-lang');
    const altLangEl = document.getElementById('alt-lang');
    if (currentLangEl && altLangEl) {
        if (savedLang === 'ru') {
            currentLangEl.textContent = 'Eng';
            altLangEl.textContent = 'Rus';
        } else {
            currentLangEl.textContent = 'Rus';
            altLangEl.textContent = 'Eng';
        }
    }
    
    // Применяем переводы
    if (window.i18n && window.i18n.applyTranslations) {
        window.i18n.applyTranslations(savedLang);
        console.log('✅ Переводы применены при загрузке');
    }
    
    // Активная секция при скролле
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= (sectionTop - 100)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
    
    console.log('✅ ML-Project-Bambuk loaded successfully!');
});
