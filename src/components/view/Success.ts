import { ISuccess } from "../../types";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { Component } from "../base/Сomponent";

// Класс для отображения модального окна успешного оформления заказа.

export class Success extends Component<ISuccess> {

  protected _description: HTMLElement;
  protected _closeButton: HTMLButtonElement;

  constructor (container: HTMLElement, events: IEvents) {
    super(container);

    this._description = ensureElement('.order-success__description', this.container);
    this._closeButton = ensureElement<HTMLButtonElement>('.order-success__close', this.container)
  
    this._closeButton.addEventListener('click', () => events.emit('success:close'))
  }

  set total(value: number) {
    this.setText(this._description, `Списано ${value} синапсов`)
  }
}