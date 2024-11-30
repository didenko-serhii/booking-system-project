# Базовий образ для Deno
FROM denoland/deno:latest

# Робоча директорія всередині контейнера
WORKDIR /app

# Копіюємо залежності (наприклад, файли імпорту) та перевіряємо їх
COPY . .

RUN deno cache main.js

RUN deno task db:generate && echo "db:generate succeeded"
RUN deno task db:migrate && echo "db:migrate succeeded"

# Відкриваємо порт (якщо API запускається, наприклад, на 8000 порту)
EXPOSE 8000

# Команда для запуску проекту
CMD ["task", "start:prod"]
