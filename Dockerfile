# Базовий образ для Deno
FROM denoland/deno:latest

# Робоча директорія всередині контейнера
WORKDIR /app

# Копіюємо залежності (наприклад, файли імпорту) та перевіряємо їх
COPY main.js .
RUN deno cache main.js

# Копіюємо весь код проекту в контейнер
COPY . .

# Відкриваємо порт (якщо API запускається, наприклад, на 8000 порту)
EXPOSE 8000

# Команда для запуску проекту
CMD ["run", "--allow-net", "--allow-env", "--allow-read", "--allow-write", "main.js"]
