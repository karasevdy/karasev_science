# ML Portfolio Website

## Запуск проекта:

### 1. Главная страница

Открой `index.html` в браузере.

### 2. Админ-панель

**Шаг 1: Установи зависимости**

```bash
cd backend
pip install -r requirements.txt --break-system-packages
```

**Шаг 2: Запусти backend**

```bash
python app.py
```

**Шаг 3: Открой админку**

Открой `admin/index.html` в браузере.

**Данные для входа:**
- Логин: `admin`
- Пароль: `admin123`

## Структура:

```
ML-Project-Bambuk/
├── index.html              # Главная страница
├── admin/                  # Админ-панель
│   └── index.html
├── backend/                # Backend API
│   ├── app.py
│   └── requirements.txt
├── css/                    # Стили
├── js/                     # JavaScript
├── projects/               # Страницы проектов
└── data/                   # Данные (графы)
```

## Функции:

✅ Темная тема  
✅ Переключение языка (RU/EN)  
✅ Защищённая админ-панель  
✅ JWT авторизация  
✅ Rate limiting  

## Смена пароля:

```python
import hashlib
new_password = "your_password"
hash = hashlib.sha256(new_password.encode()).hexdigest()
print(hash)
```

Затем обнови в `admin.db`:

```sql
UPDATE users SET password_hash = '<новый_хеш>' WHERE username = 'admin';
```
