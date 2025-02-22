# Проектная работа "Веб-ларек"

## Содержание

1. [Используемый стек](#стек)
2. [Структура проекта](#структура-проекта)
3. [Важные файлы](#важные-файлы)
4. [Установка и запуск](#установка-и-запуск)
5. [Сборка](#сборка)
6. [Архитектура](#архитектура)
7. [Взаимодействие между слоями](#взаимодействие-между-слоями)
8. [Описание базовых классов](#описание-базовых-классов)
9. [Слой Model](#слой-model)
10. [Слой View (общие классы)](<#слой-view-(общие-классы)>)
11. [Слой View (проектные классы)](<#слой-view-(проектные-классы)>)
12. [Presenter](#presenter)
13. [Программный интерфейс](#программный-интерфейс)
14. [Типы данных](#типы-данных)

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

## Взаимодействие между слоями

1. `Presenter` подписывается на изменения `Model` через `EventEmitter`.
2. `Model` хранит и изменяет данные, затем оповещает `Presenter`.
3. `Presenter` обновляет `View` на основе изменений в `Model`.
4. `View` отправляет события `Presenter` при взаимодействии пользователя.
5. `Presenter` запрашивает или отправляет данные через `Api`, когда требуется работа с сервером.
6. `Api` выполняет запрос и передает данные в `Presenter`, после чего `Presenter` передает результат в `Model` для обновления данных.

## Описание базовых классов

### **Класс`Component`**

Абстрактный базовый класс, предназначенным для создания компонентов пользовательского интерфейса. Он предоставляет общие методы для управления DOM-элементами. **Наследуется** всеми классами представления (`View`).

**Методы:**

- `setText(text: string): void` — установить текстовое содержание для компонента;
- `setImage(src: string, alt?: string): void` — установить изображение компонента;
- `setHidden(): void` — скрыть компонент;
- `setVisible(): void` — отобразить компонент;
- `toggleClass(className: string): void` — добавить или удалить класс, в зависимости от текущего состояния;
- `render(): HTMLElement` — вернуть DOM-элемент, переданный в конструкторе.

**Конструктор:**

`constructor(container: HTMLElement)` — создать экземпляр класса с переданным DOM-элементом;

### **Класс`Api`**

Базовый класс для взаимодействия с сервером через API, поддерживая базовые методы работы с HTTP-запросами и обработки ответов.

**Поля:**

- `baseUrl: string` — URL для всех запросов;
- `options: RequestInit` — дополнительные параметры для запроса (например, заголовки, методы и т.д.).

**Методы:**

- `get(uri: string): Promise<object>` — выполнить GET-запрос, то есть запросить данные с сервера;
- `post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` — выполнить POST-запрос, то есть получить данные с сервера;
- `handleResponse(response: Response): Promise<object>` — обработать ответ сервера: спарсить JSON или вернуть ошибку;

**Конструктор:**

`constructor(baseUrl: string, options: RequestInit = {})` — создать экземпляр класса с базовым URL API и объектом с настройками запроса (заголовки, метод запроса и т.д.);

### **Класс`EventEmitter`**

Брокер событий, который позволяет подписываться на события и уведомлять подписчиков о наступлении события. Он используется для связи слоя данных (`Model`) и представления (`View`).

**Класс реализует интерфейс**: `IEvents`

**Поля:**

- `_events: Map<EventName, Set<Subscriber>>` — служит для хранения всех подписок на события в виде "событие: множество подписчиков";

**Методы:**

- `on<T extends object>(eventName: EventName, callback: (event: T) => void): void` — подписаться на событие;
- `off(eventName: EventName, callback: Subscriber): void` — отписаться от события;
- `emit<T extends object>(eventName: string, data?: T): void` — уведомить подписчика о наступлении события;
- `onAll(callback: (event: EmitterEvent) => void): void` — подписаться на все события;
- `offAll(): void` — отписаться от всех событий;
- `trigger<T extends object>(eventName: string, context?: Partial<T>): (event: object) => void` — создать функцию, которая при вызове сгенерирует событие с переданными данными;

**Конструктор:**
`constructor()` — создать объект, который будет хранить подписчиков события;

## Слой Model

### **Класс`AppData`**

Класс отвечает за хранение и управление данными приложения. **Наследуется** от `IAppData`

**Поля:**

- `catalog: IProduct[]` — массив объектов типа IProduct, который представляет товары в каталоге;
- `basket: IProduct[]` — массив объектов типа IProduct, который содержит товары, добавленные в корзину;
- `order: IOrder` — объект, который содержит данные о заказе;
- `formErrors: FormErrorsType` — объект, содержащий ошибки формы;

**Методы:**

- `addToBasket(item: IProduct): void` — добавить в корзину;
- `removeFromBasket(item: IProduct): void` — удалить из корзины;
- `clearBasket(): void` — очистить корзину;
- `setCatalog(products: IProduct[]): void` — загружает список товаров;
- `setContactsForm(data: IContactsForm): void` — сохранить контактные данные из формы;
- `setOrderForm(orderData: IOrderForm): void` — сохранить данные формы заказа;
- `validateOrder(): boolean` — проверить корректность заполнения формы;
- `clearOrder(): void` — очистить объект заказа;
- `getTotal(): number` — вычислить общую сумму товаров в корзине;

**Конструктор:**
`constructor(protected events: IEvents)` — создать объект, с переданными брокером события;

## Слой View (общие классы)

### **Класс`Modal`**

Класс отвечает за реализацию модального окна. **Наследуется** от `Component`

**Поля:**

- `_closeButton: HTMLButtonElement` — кнопка закрытия модального окна;
- `_content: HTMLElement` — элемент, который содержит контент модального окна;

**Методы:**

- `openModal(content: HTMLElement): void` — открыть модальное окно;
- `closeModal(): void` — закрыть модальное окно;
- `renderModal(content: HTMLElement): void` — настроить структуру и содержимое формы.

**Конструктор:**
`constructor(container: HTMLElement, protected events: IEvents)` — создать экземпляр класса, с переданными брокером события и DOM-элементом;

### **Класс`Form`**

Класс отвечает за реализацию формы. **Наследуется** от `Component`

**Поля:**

- `_submitForm: HTMLButtonElement` — кнопка отправки формы;
- `_errors: HTMLElement` — элемент, в котором будут отображаться ошибки формы;

**Свойства-аксессоры:**

- `set valid(isValid: boolean): void` — сеттер, который отключает кнопку форму, в случае невалидности;
- `set errors(errors: string[]): void` — сеттер, который изменяет форму, показывая ошибки.

**Методы:**

- `onInputChange(event: EmitterEvent): void` — слушать изменения в полях формы;
- `renderForm(content: HTMLElement): void` — настроить структуру и содержимое формы.

**Конструктор:**
`constructor(protected container: HTMLFormElement, protected events: IEvents)` — создать экземпляр класса, с переданной формой и брокером события;

### **Класс`Success`**

Класс для отображения модального окна успешного оформления заказа. Наследуется от `Component`.

**Класс реализует интерфейс**: `IOrderSuccess`

**Поля:**

- `id: string` — идентификатор заказа;
- `totalPrice: number` — общая стоимость заказа;

**Конструктор:**
`constructor (container: HTMLElement, events: IEvents, actions: ISuccessActions)` — создать экземпляр класса успешного оформления заказа, который будет отображать подтверждение заказа, обрабатывать события и выполнять переданные действия.

## Слой View (проектные классы)

### **Класс`Page`**

Класс отвечает за реализацию главной страницы. **Наследуется** от `Component`

**Класс реализует интерфейс**: `IPage`

**Поля:**

- `countBasket: number` — поле-счетчик, хранит количество товаров в корзине;
- `catalog: ICatalog` — поле представляет каталог товаров;

**Свойства-аксессоры:**

- `set countBasket(count: number): void` — сеттер, устанавливает значение счетчика в корзине;
- `set catalog(items: HTMLElement[]): void` — сеттер, который устанавливает массив элементов HTML, представляющих товары в каталоге;
- `set locked(value: boolean): void` — сеттер, который устанавливает или снимает блокировку страницы.

**Конструктор:**
`constructor(container: HTMLElement, events: IEvents)` — создать экземпляр класса, с переданными брокером события и DOM-элементом;

### **Класс`Card`**

Класс реализует карточку товара (используется на главной, в модальном окне и в корзине). **Наследуется** от `Component`

**Класс реализует интерфейс**: `IProduct`

**Поля:**

- `id: string` — уникальный идентификатор товара;
- `description: string` — строка, которая содержит текстовое описание товара;
- `image: string` — строка, содержащая ссылку на изображение товара;
- `title: string` — название товара;
- `category: string` — категория товара;
- `price: number` — цена товара;

**Свойства-аксессоры:**

- `set id(id: string): void` — сеттер, который устанавливает id карточки;
- `set title(title: string): void` — сеттер, который меняет содержимое заголовка на полученное;
- `set description(description: string): void` — сеттер, который меняет содержимое контейнера с описанием на полученное;
- `set image(imageUrl: string): void` — сеттер, который меняет изображение в карточке;
- `set category(category: string): void` — сеттер, который меняет содержимое контейнера с категорией на полученное;
- `set price(price: number): void` — сеттер, который меняет содержимое заголовка на полученное;

**Конструктор:**
`constructor(container: HTMLElement, actions?: ICardActions)` — создать экземпляр класса, с переданными брокером события и опционально с добавить обработчик событий;

### **Класс`Basket`**

Класс реализует корзину с товарами. **Наследуется** от `Component`.
**Класс реализует интерфейс**: `IBasket`

**Поля:**

- `items: IProduct[]` — список товаров, добавленных в корзину;
- `totalPrice: number` — общая стоимость всех товаров в корзине;

**Свойства-аксессоры:**

- `set items(items: HTMLElement[]): void` — сеттер, который устанавливает товары в корзине;
- `set totalPrice(totalPrice: number): void` — сеттер, который устанавливает и отображает общую стоимость товаров в корзине.

**Конструктор:**
`constructor(protected events: IEvents)` — создать экземпляр класса, с переданными брокером события;

### **Класс`OrderForm`**

Класс реализует форму заказа. **Наследуется** от `Component`.

**Класс реализует интерфейс**: `IOrderForm`

**Поля:**

- `paymentMethod: PaymentType` — способ оплаты для заказа (online/onDelivery);
- `address: string` — адрес доставки заказа;

**Свойства-аксессоры:**

- `set paymentMethod(paymentMethod: PaymentType)` — сеттер, который изменяет классы кнопок, чтобы визуально отобразить текущий выбор;
- `set address(address: string): void` — сеттер, который устанавливает адрес доставки.

**Конструктор:**
`constructor(container: HTMLFormElement, events: IEvents)` — создать экземпляр класса, и привязать его к HTML-элементу (форме) с переданным брокером событием;

### **Класс`ContactsForm`**

Класс реализует форму с контактными данными. **Наследуется** от `Component`.

**Класс реализует интерфейс**: `IContactsForm`

**Поля:**

- `email: string` — электронная почта пользователя;
- `phone: string` — номер телефона пользователя;

**Свойства-аксессоры:**

- `set email(email: string): void` — сеттер, который устанавливает электронную почту;
- `set phone(phone: string): void` — сеттер, который устанавливает номер телефона.

**Конструктор:**
`constructor(container: HTMLFormElement, events: IEvents)` — создать экземпляр класса, и привязать его к HTML-элементу (форме) с переданным брокером событием;

## Presenter

Управляет взаимодействием компонентов и координирует логику приложения. Само взаимодействие происходит за счет брокера событий (`EventEmitter`), который их отслеживает.

## Программный интерфейс

### Интерфейс состояния приложения

```ts
interface IAppData {
	catalog: IProduct[];
	basket: IProduct[];
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

### Общий интерфейс для работы с товаром

```ts
interface IProductContainer {
	items: IProduct[];
}
```

### Интерфейс каталога товаров

```ts
interface ICatalog extends IProductContainer {
	totalProducts: number;
}
```

### Интерфейс корзины

```ts
interface IBasket extends IProductContainer {
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

### Интерфейс главной страницы

```ts
interface IPage {
	countBasket: number;
	catalog: ICatalog;
}
```

## Типы данных

- `PaymentType` — тип оплаты (`online`, `onDelivery`);
- `FormErrorsType` — ошибки валидации формы;
- `ApiListResponse<T>` — обобщенный тип ответа сервера со списком элементов;
- `ApiPostMethods` — тип HTTP-методов (`POST`, `PUT`, `DELETE`).
