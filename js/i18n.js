// Система переводов
const translations = {
    ru: {
        // Навигация
        'nav.home': 'Главная',
        'nav.biography': 'Биография',
        'nav.publications': 'Публикации',
        'nav.projects': 'Проекты',
        'nav.contact': 'Контакты',
        
        // Home секция
        'home.title': 'Ваше Имя, PhD',
        'home.subtitle': 'Senior Data Scientist - ML Research',
        'home.affiliation': 'University Name',
        'home.biography': 'Биография',
        'home.bio1': 'Я учёный-компьютерщик с исследовательским интересом в области искусственного интеллекта. Недавно окончил CMU со степенью PhD в области социальных вычислений.',
        'home.bio2': 'Сейчас я исследую методы представления информации и помогаю создавать современные технологии для приложений, используемых аналитиками безопасности.',
        'home.download': 'Скачать CV',
        'home.interests': 'Интересы',
        'home.interest1': 'Генерация с дополнением поиском',
        'home.interest2': 'Мультимодальные эмбеддинги',
        'home.interest3': 'Анализ сетей',
        'home.education': 'Образование',
        'home.phd': 'PhD, 2023',
        'home.bs': 'BS, 2017',
        
        // Biography секция
        'biography.title': 'Биография',
        'biography.text': 'Здесь подробная биография. Опишите ваш путь в науке, важные проекты, публикации.',
        
        // Publications секция
        'publications.title': 'Публикации',
        
        // Projects секция
        'projects.title': 'Проекты',
        'projects.main.title': 'Анализ социальных сетей и ML',
        'projects.main.desc': 'Исследование структуры социальных сетей с использованием графовых методов и машинного обучения.',
        'projects.main.badge': 'Основной проект',
        'projects.project2.title': 'NLP и анализ текста',
        'projects.project2.desc': 'Разработка моделей для анализа текстов.',
        
        // Contact секция
        'contact.title': 'Контакты',
        
        // Footer
        'footer.rights': 'Все права защищены',
        
        // Уведомления
        'notification.lang': 'Язык изменён на русский',
        'notification.theme.dark': 'Включена тёмная тема',
        'notification.theme.light': 'Включена светлая тема'
    },
    
    en: {
        // Navigation
        'nav.home': 'Home',
        'nav.biography': 'Biography',
        'nav.publications': 'Publications',
        'nav.projects': 'Projects',
        'nav.contact': 'Contact',
        
        // Home section
        'home.title': 'Your Name, PhD',
        'home.subtitle': 'Senior Data Scientist - ML Research',
        'home.affiliation': 'University Name',
        'home.biography': 'Biography',
        'home.bio1': 'I am a computer scientist with a research interest in artificial intelligence. I recently graduated from CMU with a PhD in Societal Computing.',
        'home.bio2': 'Now I research information representation techniques and help build state-of-the-art technologies into applications that are deployed and used by security analysts.',
        'home.download': 'Download CV',
        'home.interests': 'Interests',
        'home.interest1': 'Retrieval Augmented Generation',
        'home.interest2': 'Multi-Modal Embedding',
        'home.interest3': 'Network Analysis',
        'home.education': 'Education',
        'home.phd': 'PhD, 2023',
        'home.bs': 'BS, 2017',
        
        // Biography section
        'biography.title': 'Biography',
        'biography.text': 'Here is a detailed biography. Describe your path in science, important projects, publications.',
        
        // Publications section
        'publications.title': 'Publications',
        
        // Projects section
        'projects.title': 'Projects',
        'projects.main.title': 'Social Network Analysis and ML',
        'projects.main.desc': 'Research on social network structure using graph methods and machine learning.',
        'projects.main.badge': 'Main Project',
        'projects.project2.title': 'NLP and Text Analysis',
        'projects.project2.desc': 'Development of models for text analysis.',
        
        // Contact section
        'contact.title': 'Contact',
        
        // Footer
        'footer.rights': 'All rights reserved',
        
        // Notifications
        'notification.lang': 'Language changed to English',
        'notification.theme.dark': 'Dark theme enabled',
        'notification.theme.light': 'Light theme enabled'
    }
};

// Функция получения перевода
function t(key, lang) {
    return translations[lang][key] || key;
}

// Функция применения переводов к странице
function applyTranslations(lang) {
    console.log('📝 Применяю переводы для языка:', lang);
    
    // Находим все элементы с атрибутом data-i18n
    const elements = document.querySelectorAll('[data-i18n]');
    
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = t(key, lang);
        
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
            element.placeholder = translation;
        } else {
            element.textContent = translation;
        }
    });
    
    console.log(`✅ Переведено ${elements.length} элементов`);
}

// Экспорт для использования в main.js
window.i18n = {
    translations,
    t,
    applyTranslations
};
