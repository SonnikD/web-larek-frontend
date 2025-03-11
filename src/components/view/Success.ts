import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { Component } from "../base/Сomponent";

// Класс для отображения модального окна успешного оформления заказа.

interface ISuccess {
  total: number;
}

export class Success extends Component<ISuccess> {

  protected description: HTMLElement;
  protected closeButton: HTMLButtonElement;

  constructor (container: HTMLElement, events: IEvents) {
    super(container);

    this.description = ensureElement('.order-success__description', this.container);
    this.closeButton = ensureElement<HTMLButtonElement>('.order-success__close', this.container)
  
    this.closeButton.addEventListener('click', () => events.emit('success:close'))
  }

  set total(value: number) {
    this.setText(this.description, `Списано ${value} синапсов`)
  }
}