import { IOrderForm, PaymentType } from "../../types";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { Form } from "./Form";

// Класс реализует форму заказа

export class OrderForm extends Form<IOrderForm> {
  private _paymentMethod: PaymentType = 'online'; 
  private _address: string = ''; 

  protected onlineButton: HTMLButtonElement;
  protected onDeliveryButton: HTMLButtonElement;
  protected addressInput: HTMLInputElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

    this.onlineButton = ensureElement<HTMLButtonElement>('.button[name=card]', this.container);
    this.onDeliveryButton = ensureElement<HTMLButtonElement>('.button[name=cash]', this.container);
    this.addressInput = ensureElement<HTMLInputElement>('.form__input[name=address]', this.container);
    this.toggleClass(this.onlineButton, 'button_alt-active');

    this.address = this.addressInput.value;

    this.onlineButton.addEventListener('click', () => {
      this.paymentMethod = 'online';
      this.onInputChange('payment', 'online');
    });
    
    this.onDeliveryButton.addEventListener('click', () => {
      this.paymentMethod = 'onDelivery';
      this.onInputChange('payment', 'onDelivery');
    });
    
  }

  get paymentMethod() {
    return this._paymentMethod; 
  }

  set paymentMethod(value: PaymentType) {
    this._paymentMethod = value; 
    this.toggleClass(this.onlineButton, 'button_alt-active', value === 'online');
    this.toggleClass(this.onDeliveryButton, 'button_alt-active', value === 'onDelivery');
  }

  set address(address: string) {
    this._address = address
  }

  get address() {
    return this._address;
  }
}
