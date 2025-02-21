// Интерфейс модели данных приложения
interface IAppState { 
  catalog: IProductList;
  basket: IBasket;
  order: IOrder;
  formErrors: FormErrorsType;
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

// Интерфейс каталога товаров
interface IProductList {
  items: IProduct[];
  totalProducts: number;
}

// Интерфейс корзины товаров
interface IBasket {
  items: IProduct[];
  totalPrice: number
}

// Интерфейс формы заказа
interface IOrderForm {
  paymentMethod: PaymentType;
  address: string;
}

// Тип оплаты 
type PaymentType = "online" | "onDelivery";

// Интерфейс формы с контактными данными
interface IContactsForm {
  email: string;
  phone: string;
}

// Интерфейс заказа
interface IOrder extends IOrderForm, IContactsForm {
  totalPrice: number;
}

// Интерфейс успешного ответа сервера при оформлении заказа
interface IOrderSuccess {
  id: string;
  totalPrice: number;
}

// Интерфейс ошибки сервера 
interface IApiError {
  error: string;
}

// Тип ошибки в форме при заполнении
type FormErrorsType = Partial<Record<keyof IOrder, string>>;

// Интерфейс главной страницы
interface IPage {
countBasket: number;
catalog: IProductList;
}

export {
  IAppState, IProduct, IProductList, IBasket, IOrderForm, PaymentType, 
  IContactsForm, IOrder, IOrderSuccess, IApiError, FormErrorsType, IPage
}

