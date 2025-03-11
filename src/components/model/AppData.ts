import { FormErrorsType, IAppData, IContactsForm, IOrder, IOrderForm, IProduct, PaymentType } from "../../types";
import { IEvents } from "../base/events";

export class AppData implements IAppData {
  catalog: IProduct[] = [];
  basket: IProduct[] = [];
  order: IOrder = {
    payment: 'online',
    address: '', 
    email: '',
    phone: '',
    total: 0, 
    items: []
  };
  formErrors: FormErrorsType = {};
  preview: IProduct | null;
  
  protected events: IEvents;

  constructor(events: IEvents) {
    this.events = events;
  }

  // Добавить товар в корзину
  addToBasket(item: IProduct): void {
    this.basket.push(item);
    this.order.items.push(item.id)
    this.events.emit('basket:change', this.basket)
  }

  // Удалить товар из корзины
  removeFromBasket(item: IProduct): void {
    this.basket = this.basket.filter((product) => product.id != item.id)
    this.events.emit('basket:change', this.basket)
  }

  // Очистить корзину
  clearBasket(): void {
    this.basket = [] 
    this.events.emit('basket:change')
  }

  // Вычислить общую сумму товаров в корзине
  getTotal(): number {
    this.order.total = this.basket.reduce((accum, product) => {
     return product.price + accum;
    }, 0)
    return this.order.total
    
  }

  // Проверить, есть ли товар в корзине
  isInBasket(product: IProduct): boolean {
    return this.basket.some((item) => item.id === product.id)
  }

  // Загрузить список товаров (каталог)
  setCatalog(products: IProduct[]): void {
    this.catalog = products;
    this.events.emit('catalog:change')
  }

  // Сохранить контактные данные из формы 
  setContatcsForm(field: keyof IContactsForm, value: string): void {
    this.order[field] = value;

    if (this.validateContacts) {
      this.events.emit('contacts:valid')
    }
  }

  // Сохранить данные формы заказа
  setOrderForm(field: keyof IOrderForm, value: string): void {
    if (field === "payment" && (value === 'online' || value === "onDelivery")) {
      this.order[field] = value;
    } else if (field !== "payment") {
      this.order[field] = value;
    }

    if (this.validateOrder()) {
      this.events.emit('order:valid')
    }
  }

  // Предварительный просмотр выбранного товара
  setPreview(product: IProduct): void {
    this.preview = product;
  }

  // Проверить корректность заполнения формы заказа
  validateOrder(): boolean {
    const errors: FormErrorsType = {};

    if (!this.order.address) {
      errors.address = "Необходимо указать адрес доставки"
    }
    this.formErrors = errors;
    return Object.keys(errors).length === 0
  }

  // Проверить корректность заполнения формы с контактными данными
  validateContacts(): boolean {
    const errors: FormErrorsType = {};
   
    if (!this.order.email) {
      errors.email = "Необходимо указать электронную почту"
    }

    if (!this.order.phone) {
      errors.phone = "Необходимо указать номер телефона"
    }
    this.formErrors = errors;
    return Object.keys(errors).length === 0
  }

  // Очистить объект заказа
  clearOrder(): void {
    this.order = {  
      payment: 'online',
      address: '', 
      email: '',
      phone: '',
      total: 0, 
      items: []
    }
    }
  }
