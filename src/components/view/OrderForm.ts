import { IOrderForm, PaymentType } from "../../types";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { Form } from "./Form";

// Класс реализует форму заказа

export class OrderForm extends Form<IOrderForm> {

  protected _onlineButton: HTMLButtonElement;
  protected _onDeliveryButton: HTMLButtonElement;
  protected _addressInput: HTMLInputElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

    this._onlineButton = ensureElement<HTMLButtonElement>('.button[name=card]', this.container);
    this._onDeliveryButton = ensureElement<HTMLButtonElement>('.button[name=cash]', this.container);
    this._addressInput = ensureElement<HTMLInputElement>('.form__input[name=address]', this.container);
    this.toggleClass(this._onlineButton, 'button_alt-active');

    this.address = this._addressInput.value;

    this._onlineButton.addEventListener('click', () => {
      this.onInputChange('payment', 'online');
    });
    
    this._onDeliveryButton.addEventListener('click', () => {
      this.onInputChange('payment', 'onDelivery');
    });
  }

  set paymentMethod(value: PaymentType) {
    this.toggleClass(this._onlineButton, 'button_alt-active', value === 'online');
    this.toggleClass(this._onDeliveryButton, 'button_alt-active', value === 'onDelivery');
  }

  set address(address: string) {
    this._addressInput.value = address
  }
}
