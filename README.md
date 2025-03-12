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

Абстрактный базовый класс, предназначенный для создания компонентов пользовательского интерфейса. Он предоставляет общие методы для управления DOM-элементами. **Наследуется** всеми классами представления (`View`).

**Методы:**

- `setText(element: HTMLElement, text: string): void` — установить текстовое содержание для компонента;
- `setImage(element: HTMLElement, src: string, alt?: string): void` — установить изображение компонента;
- `setHidden(element: HTMLElement): void` — скрыть компонент;
- `setVisible(element: HTMLElement): void` — отобразить компонент;
- `toggleClass(element: HTMLElement, className: string, force?: boolean): void` — добавить или удалить класс, в зависимости от текущего состояния;
- `toggleDisabled(element: HTMLElement, state: boolean): void` — добавить или удалить атрибут disabled
- `render((data?: Partial<T>): HTMLElement` — вернуть DOM-элемент, переданный в конструкторе.

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

**Класс реализует интерфейс**: `IAppData`

**Поля:**

- `catalog: IProduct[]` — массив объектов типа IProduct, который представляет товары в каталоге;
- `basket: string[]` — массив строк, который содержит id товаров, добавленные в корзину;
- `order: IOrderDetails` — объект, который содержит данные о заказе;
- `formErrors: FormErrorsType` — объект, содержащий ошибки формы;
- `preview: IProduct` — объект, который содержит товар, выбранный для предварительного просмотра

**Методы:**

- `addToBasket(item: IProduct): void` — добавить в корзину;
- `removeFromBasket(item: IProduct): void` — удалить из корзины;
- `clearBasket(): void` — очистить корзину;
- `isInBasket(product: IProduct): boolean` — проверить есть ли товар в корзине;
- `setCatalog(products: IProduct[]): void` — загружает список товаров;
- `setContactsForm(field: keyof IContactsForm, value: string): void` — сохранить контактные данные из формы;
- `setPreview(product: IProduct): void` — сохранить текущий выбранный товар для предварительного просмотра;
- `setOrderForm(field: keyof IOrderForm, value: string): void` — сохранить данные формы заказа;
- `validateOrder(): boolean` — проверить корректность заполнения формы заказа;
- `validateContacts(): boolean` — проверить корректность заполнения формы с контактными данными;
- `clearOrder(): void` — очистить объект заказа;
- `getTotal(): number` — вычислить общую сумму товаров в корзине;

**Конструктор:**
`constructor(protected events: IEvents)` — создать объект, с переданными брокером события;

### **Класс`WebLarekApi`**

Класс представляет методы для взаимодействия с API приложения. **Наследуется** от `Api`

**Класс реализует интерфейс**: `IWebLarekApi`

**Поля:**

- `cdn: string` — URL адрес, по которому будут скачиваться все файлы;

**Методы:**

- `getProductList(): Promise<IProduct[]>` — получить список товаров с сервера;
- `getProduct(id: string): Promise<IProduct>` — получить товар по его id;
- `postOrder(order: IOrderRequest): Promise<IOrderSuccess>` — отправить заказ на сервер;

**Конструктор:**
`constructor(cdn: string, baseUrl: string, options: RequestInit = {})` — создать объект, который расширяет базовый API-класс, добавляя поддержку CDN для работы с изображениями или файлами;

## Слой View (общие классы)

### **Класс`Modal`**

Класс отвечает за реализацию модального окна. **Наследуется** от `Component`

**Класс реализует интерфейс**: `IModalData`

**Поля:**

- `closeButton: HTMLButtonElement` — кнопка закрытия модального окна;
- `content: HTMLElement` — элемент, который содержит контент модального окна;

**Свойства-аксессоры:**

- `set content(value: HTMLElement)` — сеттер, который устанавливает содержимое модального окна

**Методы:**

- `openModal(): void` — открыть модальное окно;
- `closeModal(): void` — закрыть модальное окно;
- `renderModal(data: IModalData): HTMLElement` — настроить структуру и содержимое формы.

**Конструктор:**
`constructor(container: HTMLElement, protected events: IEvents)` — создать экземпляр класса, с переданными брокером события и DOM-элементом;

### **Класс`Form`**

Класс отвечает за реализацию формы. **Наследуется** от `Component`

**Класс реализует интерфейс**: `IFormValid`

**Поля:**

- `_submitForm: HTMLButtonElement` — кнопка отправки формы;
- `_errorsForm: HTMLElement` — элемент, в котором будут отображаться ошибки формы;

**Свойства-аксессоры:**

- `set valid(isValid: boolean)` — сеттер, который отключает кнопку форму, в случае невалидности;
- `set errors(errors: string[])` — сеттер, который изменяет форму, показывая ошибки.

**Методы:**

- `onInputChange(field: keyof T, value: string): void` — слушать изменения в полях формы;
- `renderForm(content: HTMLElement)` — настроить структуру и содержимое формы.
- **Конструктор:**
  `constructor(protected container: HTMLFormElement, protected events: IEvents)` — создать экземпляр класса, с переданной формой и брокером события;

### **Класс`Success`**

Класс для отображения модального окна успешного оформления заказа. Наследуется от `Component`.

**Класс реализует интерфейс**: `ISuccess`

**Поля:**

- `_description: HTMLElement` — элемент, который отвечает за списанную сумму синапсов;
- `_closeButton: HTMLButtonElement` — кнопка, которая закрывает модальное окно;

**Свойства-аксессоры:**

- `set total(value: number)` — сеттер, который устанавливает число списанных синапсов на элемент

**Конструктор:**
`constructor (container: HTMLElement, events: IEvents)` — создать экземпляр класса успешного оформления заказа, который будет отображать подтверждение заказа, обрабатывать события.

## Слой View (проектные классы)

### **Класс`Page`**

Класс отвечает за реализацию страницы, в том числе каталога товаров, счетчика корзины и блокировки страницы.. **Наследуется** от `Component`

**Класс реализует интерфейс**: `IPage`

**Поля:**

- `_pageWrapper: HTMLElement` — элемент, который содержит основной контент страницы;
- `_catalog: HTMLElement` — элемент, который содержит контент каталога товаров;
- `_basket: HTMLElement` — элемент, по нажатию на которого откроется корзина;
- `_counter: HTMLElement` — элемент, который отвечает за счётчик товаров на элементе корзины;

**Свойства-аксессоры:**

- `set locked(value: boolean)` — сеттер, который отвечает за блокировку прокрутки страницы
- `set catalog(items: HTMLElement[])` — сеттер, который выводит каталог товаров
- `set counter(count: number)` — сеттер, который устанавливает значение счётчика товаров в корзине

**Конструктор:**
`constructor(container: HTMLElement, protected events: IEvents)` — создать экземпляр класса, с переданными брокером события и DOM-элементом;

### **Класс`Card`**

Класс реализует карточку товара (используется на главной, в модальном окне и в корзине). **Наследуется** от `Component`

**Класс реализует интерфейс**: `IProduct`

**Поля:**

- `_title: HTMLElement` — элемент содержит название товара;
- `_description?: HTMLElement` — элемент содержит текстовое описание товара;
- `_image?: HTMLImageElement` — элемент содержит изображение товара;
- `_category?: HTMLElement` — элемент содержит категорию товара;
- `_price: HTMLElement` — элемент содержит цену товара;
- `_button?: HTMLButtonElement` — элемент содержит кнопку "в корзину";
- `_itemIndex: HTMLElement` — элемент содержит порядковый номер товара в корзине;

**Свойства-аксессоры:**

- `set title(title: string)` — сеттер, который меняет содержимое заголовка на полученное;
- `set description(description: string)` — сеттер, который меняет содержимое контейнера с описанием на полученное;
- `set image(imageUrl: string)` — сеттер, который меняет изображение в карточке;
- `set category(category: string)` — сеттер, который меняет содержимое контейнера с категорией на полученное;
- `set price(price: number)` — сеттер, который меняет содержимое заголовка на полученное;
- `set button(text: string)` — сеттер, который устанавливает тестовое содержимое кнопке;
- `set itemIndex(index: number)` — сеттер, который устанавливает тестовое содержимое порядковому номеру у товара в корзине;

**Конструктор:**
`constructor(container: HTMLElement, actions?: ICardActions)` — создать экземпляр класса, с переданными контейнером и объектом с функциями, которые могут быть выполнены при взаимодействии пользователя с компонентом;

### **Класс`Basket`**

Класс реализует корзину с товарами. **Наследуется** от `Component`.

**Поля:**

- `_list: HTMLElement` — элемент содержит список товаров, добавленных в корзину;
- `_buttonOrder: HTMLButtonElement` — элемент содержит кнопку перехода к окну OrderForm;
- `_total: HTMLElement` — 'элемент содержит общую сумму товаров в корзине;

**Свойства-аксессоры:**

- `set items(items: HTMLElement[])` — сеттер, который устанавливает товары в корзине;
- `set total(total: number)` — сеттер, который устанавливает общую цену товаров в корзине;

**Конструктор:**
`constructor (container: HTMLElement, events: IEvents)` — создать экземпляр класса, с переданными брокером события;

### **Класс`OrderForm`**

Класс реализует форму заказа. **Наследуется** от `Form`.

**Класс реализует интерфейс**: `IOrderForm`

**Поля:**

- `_onlineButton: HTMLButtonElement` — элемент содержит кнопку способа оплаты "онлайн";
- `_onDeliveryButton: HTMLButtonElement` — элемент содержит кнопку способа оплаты "При получении";
- `_addressInput: HTMLInputElement` — HTMLInputElement для ввода адреса доставки;

**Свойства-аксессоры:**

- `set paymentMethod(value: PaymentType)` — сеттер, который изменяет классы кнопок, чтобы визуально отобразить текущий выбор;
- `set address(address: string)` — сеттер, который устанавливает адрес доставки.

**Конструктор:**
`constructor(container: HTMLFormElement, events: IEvents)` — создать экземпляр класса, и привязать его к HTML-элементу (форме) с переданным брокером событием;

### **Класс`ContactsForm`**

Класс реализует форму с контактными данными. **Наследуется** от `Form`.

**Класс реализует интерфейс**: `IContactsForm`

**Поля:**

- `_emailInput: HTMLInputElement` — элемент содержит электронной почты пользователя;
- `_phoneInput: HTMLInputElement` — элемент содержит номера телефона пользователя;

**Свойства-аксессоры:**

- `set email(email: string)` — сеттер, который устанавливает электронную почту;
- `set phone(phone: string)` — сеттер, который устанавливает номер телефона.

**Конструктор:**
`constructor(container: HTMLFormElement, events: IEvents)` — создать экземпляр класса, и привязать его к HTML-элементу (форме) с переданным брокером событием;

## Presenter

Код, который управляет взаимодействием компонентов и координирует логику приложения находится в `index.ts`. Само взаимодействие происходит за счет брокера событий (`EventEmitter`), который их отслеживает.

## Программный интерфейс

### Интерфейс состояния приложения

```ts
interface IAppData {
	catalog: IProduct[];
	basket: string[];
	order: IOrderDetails;
	formErrors: FormErrorsType;
	preview: IProduct;

	addToBasket(item: IProduct): void;
	removeFromBasket(item: IProduct): void;
	clearBasket(): void;
	getTotal(): number;
	setContatcsForm(field: keyof IContactsForm, value: string): void;
	setOrderForm(field: keyof IOrderForm, value: string): void;
	setCatalog(products: IProduct[]): void;
	setPreview(product: IProduct): void;
	validateOrder(): boolean;
	validateContacts(): boolean;
	clearOrder(): void;
	isInBasket(product: IProduct): boolean;
}
```

### Интерфейс представляет методы для взаимодействия с API приложения

```ts
interface IWebLarekApi {
	cdn: string;
	getProductList(): Promise<IProduct[]>;
	getProduct(id: string): Promise<IProduct>;
	postOrder(order: IOrderRequest): Promise<IOrderSuccess>;
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
	payment: PaymentType;
	address: string;
}
```

### Интерфейс заказа, для отправки на сервер

```ts
interface IOrder extends IOrderForm, IContactsForm {
	total: number;
	items: string[];
}
```

### Интерфейс валидности формы

```ts
interface IFormValid {
	valid: boolean;
	errors: string[];
}
```

### Интерфейс деталей заказа, собранных с полей форм

```ts
interface IOrderDetails extends IOrderForm, IContactsForm {}
```

### Интерфейс заказа, для отправки на сервер

```ts
interface IOrderRequest extends IOrderForm, IContactsForm {
	items: string[];
	total: number;
}
```

### Интерфейс успешного ответа сервера при оформлении заказа

```ts
interface IOrderSuccess {
	id: string;
	total: number;
}
```

### Интерфейс модального окна успешного оформления заказа

```ts
interface ISuccess {
	total: number;
}
```

### Интерфейс ошибки сервера

```ts
interface IApiError {
	error: string;
}
```

### Интерфейс описывает структуру объекта с методом для обработки кликов на карточке товара

```ts
interface ICardActions {
	onClick(): void;
}
```

### Интерфейс описывает контент модального окна

```ts
interface IModalData {
	content: HTMLElement;
}
```

### Интерфейс описывает главную страницу

```ts
interface IPage {
	catalog: HTMLElement[];
	counter: number;
	locked: boolean;
}
```

## Типы данных

- `PaymentType` — тип оплаты (`online`, `onDelivery`);
- `FormErrorsType` — ошибки валидации формы;
- `ApiListResponse<T>` — обобщенный тип ответа сервера со списком элементов;
- `ApiPostMethods` — тип HTTP-методов (`POST`, `PUT`, `DELETE`).
