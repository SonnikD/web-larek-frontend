import { IProduct, IOrderSuccess, IOrderRequest, IWebLarekApi } from "../../types";
import { Api, ApiListResponse } from "../base/api";

// Класс представляет методы для взаимодействия с API приложения.

export class WebLarekApi extends Api implements IWebLarekApi {
  cdn: string;
  
  constructor(cdn: string, baseUrl: string, options: RequestInit = {}) {
    super(baseUrl, options)
    this.cdn = cdn;

  }
  
  // Получить список товаров с сервера
  getProductList(): Promise<IProduct[]> {
   return this.get('/product').then((data: ApiListResponse<IProduct>) => 
    data.items.map((item) => ({
      ...item,
      image: this.cdn + item.image,
    }))
  );
  }
 
  // Получить товар по его id
  getProduct(id: string): Promise<IProduct> {
   return this.get(`/product/${id}`).then((product: IProduct) => ({
      ...product,
      image: this.cdn + product.image,
    }))
  }

  // Отправить сформированный заказ на сервер
  postOrder(order: IOrderRequest): Promise<IOrderSuccess> {
     return this.post('/order', order).then((result: IOrderSuccess) => result)
  }
}