// Интерфейс модели данных приложения
interface IAppData { 
  catalog: IProduct[];
  basket: IProduct[];
  order: IOrder;
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

// Интерфейс товара
interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number;
}

// Общий интерфейс для работы с товаром
interface IProductContainer {
  items: IProduct[]; 
}

// Интерфейс для каталога товаров
interface ICatalog extends IProductContainer {}

// Интерфейс для корзины 
interface IBasket extends IProductContainer {}


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

// Интерфейс заказа, для отправки на сервер
interface IOrder extends IOrderForm, IContactsForm {
  total: number;
  items: string[]
}

// Интерфейс успешного ответа сервера при оформлении заказа
interface IOrderSuccess {
  id: string;
  total: number;
}

// Интерфейс ошибки сервера 
interface IApiError {
  error: string;
}

// Тип ошибки в форме при заполнении
type FormErrorsType = Partial<Record<keyof IOrder, string>>;

export {
  IAppData, IProduct, ICatalog, IBasket, IOrderForm, PaymentType, 
  IContactsForm, IOrder, IOrderSuccess, IApiError, FormErrorsType
}






