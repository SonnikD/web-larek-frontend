// Интерфейс модели данных приложения
interface IAppData { 
  catalog: IProduct[];
  basket: string[];
  order: IOrderDetails;
  formErrors: FormErrorsType;
  preview: IProduct;
  
  addToBasket(item: IProduct): void
  removeFromBasket(item: IProduct): void
  clearBasket(): void 
  getTotal(): number
  setContatcsForm(field: keyof IContactsForm, value: string): void
  setOrderForm(field: keyof IOrderForm, value: string): void 
  setCatalog(products: IProduct[]): void 
  setPreview(product: IProduct): void
  validateOrder(): boolean
  validateContacts(): boolean 
  clearOrder(): void 
  isInBasket(product: IProduct): boolean
}

// Интерфейс представляет методы для взаимодействия с API приложения
interface IWebLarekApi {
  cdn: string;
  getProductList(): Promise<IProduct[]>;
  getProduct(id: string): Promise<IProduct>;
  postOrder(order: IOrderRequest): Promise<IOrderSuccess>;
}

// Интерфейс товара
interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number;
}

// Интерфейс формы заказа
interface IOrderForm {
  payment: PaymentType;
  address: string;
}

// Тип оплаты 
type PaymentType = "online" | "onDelivery";

// Интерфейс формы с контактными данными
interface IContactsForm {
  email: string;
  phone: string;
}

// Интерфейс валидности формы
interface IFormValid {
  valid: boolean;
  errors: string[];
}

// Интерфейс деталей заказа, собранных с полей форм
interface IOrderDetails extends IOrderForm, IContactsForm {}

// Интерфейс заказа, для отправки на сервер
interface IOrderRequest extends IOrderForm, IContactsForm {
  items: string[],
  total: number
}

// Интерфейс успешного ответа сервера при оформлении заказа
interface IOrderSuccess {
  id: string;
  total: number;
}

// Интерфейс модального окна успешного оформления заказа
interface ISuccess {
  total: number;
}

// Интерфейс ошибки сервера 
interface IApiError {
  error: string;
}

// Тип ошибки в форме при заполнении
type FormErrorsType = Partial<Record<keyof IOrderDetails, string>>;

// Интерфейс описывает структуру объекта с методом для обработки кликов на карточке товара
interface ICardActions {
  onClick (): void;
}

// Интерфейс описывает контент модального окна
interface IModalData {
  content: HTMLElement;
}

// Интерфейс описывает главную страницу
interface IPage {
  catalog: HTMLElement[],
  counter: number, 
  locked: boolean
}

export {
  IAppData, IProduct, IOrderForm, PaymentType, ICardActions, IFormValid, IModalData, IPage, ISuccess,
  IContactsForm, IOrderDetails, IOrderRequest, IOrderSuccess, IApiError, FormErrorsType, IWebLarekApi
}






