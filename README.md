# Проектная работа "Веб-ларек"

## Содержание

1. [Используемый стек](#стек)
2. [Структура проекта](#структура-проекта)
3. [Важные файлы](#важные-файлы)
4. [Установка и запуск](#установка-и-запуск)
5. [Сборка](#сборка)
6. [Архитектура](#архитектура)
7. [Описание компонентов](#описание-компонентов)
8. [Взаимодействие компонентов](#взаимодействие-компонентов)
9. [Программный интерфейс](#программный-интерфейс)
10. [Типы данных](#типы-данных)


## Стек

- `HTML`;
- `SCSS`;
- `TypeScript`;
- `Webpack`;


## Структура проекта

- `src/` — исходные файлы проекта
- `src/components/` — папка с компонентами
- `src/components/base/` — папка с базовыми компонентами
- `src/pages/` — файлы страниц
- `src/types/` — файлы с типами данных
- `src/utils/` — вспомогательные утилиты
- `src/scss/` — стили проекта

## Важные файлы

- `src/pages/index.html` — HTML-файл главной страницы
- `src/types/index.ts` — файл с типами данных
- `src/index.ts` — точка входа приложения
- `src/scss/styles.scss` — корневой файл стилей
- `src/utils/constants.ts` — файл с константами
- `src/utils/utils.ts` — файл с утилитами


## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды:

```
npm install
npm run start
```

или

```
yarn
yarn start
```

## Сборка

```
npm run build
```

или

```
yarn build
```

## Архитектура

**Архитектура проекта основывается на паттерне `MVP`**.

- **`Model`** — слой данных, отвечает за хранение и изменение данных;
- **`View`** — слой представления, отвечает за отображение данных на странице;
- **`Presenter`** — презентер, отвечает за связь представления и данных.

Каждый слой имеет слабую связанность и выполняет только свою зону ответственности.

## Описание компонентов

### **`EventEmitter`**

Класс `EventEmitter` обеспечивает работу с событиями. Его функции:

- возможность добавлять и удалять слушателей событий;
- вызов слушателей при возникновении события.

### **`Api`**

Класс `Api` реализует работу с сервером. Его функции:

- выполняет запросы `GET`, `POST`, `PUT`, `DELETE`;
- обрабатывает ответы сервера и ошибки.

## Взаимодействие компонентов

1. `Presenter` подписывается на изменения `Model` через `EventEmitter`.
2. `Model` хранит и изменяет данные, затем оповещает `Presenter`.
3. `Presenter` обновляет `View` на основе изменений в `Model`.
4. `View` отправляет события `Presenter` при взаимодействии пользователя.
5. `Presenter` запрашивает или отправляет данные через `Api`, когда требуется работа с сервером.
6. `Api` выполняет запрос и передает данные в `Model`, после чего `Model` обновляет состояние и оповещает `Presenter`.

## Программный интерфейс

### Интерфейс состояния приложения

```ts
interface IAppState {
	catalog: IProductList;
	basket: IBasket;
	order: IOrder;
	formErrors: FormErrorsType;
}
```

### Интерфейс товара

```ts
interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number;
}
```

### Интерфейс корзины

```ts
interface IBasket {
	items: IProduct[];
	totalPrice: number;
}
```

### Интерфейс формы с контактными данными

```ts
interface IContactsForm {
	email: string;
	phone: string;
}
```

### Интерфейс формы заказа

```ts
interface IOrderForm {
	paymentMethod: PaymentType;
	address: string;
}
```

### Интерфейс заказа

```ts
interface IOrder extends IOrderForm, IContactsForm {
	totalPrice: number;
}
```

### Интерфейс успешного ответа сервера при оформлении заказа

```ts
interface IOrderSuccess {
	id: string;
	totalPrice: number;
}
```

## Типы данных

- `PaymentType` — тип оплаты (`online`, `onDelivery`);
- `FormErrorsType` — ошибки валидации формы;
- `ApiListResponse<T>` — обобщенный тип ответа сервера со списком элементов;
- `ApiPostMethods` — тип HTTP-методов (`POST`, `PUT`, `DELETE`).
