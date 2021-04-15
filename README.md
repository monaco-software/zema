[![Github Actions CI](https://github.com/monaco-software/zooma/workflows/ci/badge.svg)](https://github.com/monaco-software/zooma/actions?query=workflow%3Aci)
![David](https://img.shields.io/david/dev/monaco-software/zooma)
[![Heroku](https://img.shields.io/badge/website-zooma--deluxe-brightgreen)](https://zooma-deluxe.herokuapp.com/)
[![GitHub Issues](https://img.shields.io/github/issues/monaco-software/zooma.svg)](https://github.com/monaco-software/zooma/issues)
![status](https://img.shields.io/badge/status-pre--alpha-red)
[![mit license](https://img.shields.io/badge/license-MIT-50CB22.svg)](https://opensource.org/licenses/MIT)

# Zooma

> Проектная работа по программе **Мидл фронтенд-разработчик** от **Яндекс.Практикум**

## Описание

###### Всем хорошо известная [Zuma](https://ru.wikipedia.org/wiki/Zuma) на HTML Canvas.

- Для начала игры необходима регистрация
- В игре ведется [подсчет очков](#подсчет-очков)
- Лучшие игроки могут попасть на [пьедестал](https://zooma-deluxe.herokuapp.com/leaderboard) в тройку лидеров
- Для обсуждения игрового процесса предусмотрен [форум](https://zooma-deluxe.herokuapp.com/forum)

## О проекте
<details><summary>Скриншоты</summary>

<p align="center">
<img src="/src/pages/game/assets/images/thumbnails/level_1_thumb.webp">
<img src="/src/pages/game/assets/images/thumbnails/level_2_thumb.webp">
<img src="/src/pages/game/assets/images/thumbnails/level_3_thumb.webp">
</p>

</details>

<details><summary>Библиотеки и технологии</summary>

- TypeScript
- React
- Redux
- Canvas
- CSS
- Webpack
- ESLint
- Docker
- Jest
- Web Workers
- Fullscreen API
- LocalStorage API

</details>

<details><summary>Общая структура проекта</summary>

```
.
├── middlewares               # промежуточные обработчики Express
└── src                       # исходники TypeScript
    ├── api                   # внешние сервисы
    ├── common                # общие модули и типы
    ├── components            # переиспользуемые компоненты
    ├── pages                 # конечные точки маршрутизации
    |   ├── account           # настройки пользователя
    |   ├── forum             # форум
    |   ├── game              # игра
    |   ├── gameLevels        # страница уровней
    |   ├── gameOver          # для проигравших
    |   ├── leaderboard       # достижения
    |   ├── root              # лэндинг
    |   ├── signin            # авторизация
    |   └── signup            # регистрация
    ├── pwa                   # прогрессивное web-приложение
    └── store                 # хранилище Redux
```

</details>

<details><summary>Структура игрового движка</summary>

```
game
├── assets
│   ├── fonts
│   ├── images
│   └── sounds
├── UserInterface             # взаимодействие с пользователем
├── Layers                    # компоненты Canvas
├── lib                       # классы и утилиты
├── constants.ts              # константы и перечисления
├── Game.tsx                  # точка входа
├── levels.ts                 # настройка уровней
└── setup.ts                  # настройки движка
```

</details>

<details><summary>Работа с памятью</summary>


1. Устранены утечки памяти при работе с сайд-эффектами React
   - определены ссылки на
     - setTimeout()
     - setInterval()
     - requestAnimationFrame()
   - на выходе ресурсы освобождаются вызовом соответствующих функций

1. Обнаружены и устранены наложения длительных сайд-эффектов

1. В классах спрайтов введены статические переменные для изображений, что позволило отказаться от `new Image()` в конструкторах.

1. Расчеты изменены таким образом, чтобы не использовать `slice()` для массивов.

1. В игре для устранения коротких фризов при работе Garbage Collector были введены массивы для хранения удаленных объектов. Ресурсы высвобождаются после завершения уровня.

</details>

## Использование
клонируйте репозиторий
```shell script
git clone https://github.com/monaco-software/zooma.git
cd zooma
```
установите пакеты
```shell script
npm install # или yarn
```
запуск локального сервера
```shell script
npm start
```
запуск сервера разработкаи
```shell script
npm run dev
```
запуск тестов
```
npm run test
```
проверка типов
```shell script
npm run typecheck
```
проверка синтаксиса
```shell script
npm run lint
```

## Подсчет очков
- Минимальное количество выбиваемых шаров равно трем
- За выбитые шары начисляются очки в размере квадрата их суммы
```
3 шара = 3² = 9 очкам
4 шара = 4² = 16 очкам
и т.д.
```
- После исчезновения выбитых шаров остается промежуток на который быстро возвращаются оставшиеся шары
- В том случае, если сталкиваются шары одного цвета и их количество не меньше трех, также начисляются дополнительный бонус. Очки за столкнувшиеся шары увеличиваются кратно выбитым группам

```
3 шара * 2х комбо = 3² * 2 = 18 очкам
4 шара * 3х комбо = 4² * 3 = 48 очкам
и т.д.
```
___

## Лицензия
Продукт распространяется по [лицензии Массачусетского технологического института](https://opensource.org/licenses/MIT). Изменение, копирование, вырезание и вставка разрешены при соблюденни условий данной лицензии.

___

## Дисклаймер

Изображения, звуки, шрифты и другие ресурсы, используемые в проекте, взяты из открытых источников. Все события и персонажи вымышлены, любые совпадения случайны.

<p align="center">
<img src="/src/pages/game/assets/images/frog.webp" width="35" height="35">
</p>

