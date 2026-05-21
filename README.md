# React Native Check Generator

Мобильное приложение на React Native (Expo) с маршрутизацией на основе файлов, кастомной UI-библиотекой, интеграцией RuStore, работой с камерой/файлами и генерацией PDF.

## 🚀 Основной стек

- **Фреймворк:** React Native 0.81.5 + Expo SDK 54
- **Навигация:** `expo-router` (файловая система)
- **UI/стили:** `@gluestack-ui/themed` + `lucide-react-native`
- **Формы:** `react-hook-form`
- **База данных/бэкенд:** `@supabase/supabase-js`
- **Хранение:** `@react-native-async-storage/async-storage`
- **Графика:** `react-native-svg` + `react-native-qrcode-svg`
- **Медиа:** `expo-image-picker`, `expo-media-library`, `expo-file-system`
- **Нативные жесты/анимация:** `react-native-gesture-handler` + `react-native-reanimated`
- **Обновления (RuStore):** кастомная SDK (`react-native-rustore-update`)
- **Линтинг/форматирование:** ESLint + Prettier

## Запуск проекта

Обновить зависимости:

```bash
npx expo install --fix
```

Установить зависимости:

```bash
npm install
```

Запуск проекта

```bash
npx expo start
```
