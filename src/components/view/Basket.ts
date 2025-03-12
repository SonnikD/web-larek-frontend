import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { Component } from "../base/Сomponent";

export class Basket extends Component<string[]> {
  protected _list: HTMLElement;
  protected _buttonOrder: HTMLButtonElement;
  protected _total: HTMLElement; 

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container)

    this._list = ensureElement('.basket__list', this.container);
    this._buttonOrder = ensureElement<HTMLButtonElement>('.basket__button', this.container);
    this._total = ensureElement('.basket__price', this.container);

    this._buttonOrder.addEventListener('click', (() => events.emit('basket:checkout')))

  }
  
  set items(items: HTMLElement[] ) {
    if (items.length) {
      this._list.replaceChildren(...items)
      this._buttonOrder.removeAttribute('disabled')
      this.toggleDisabled(this._buttonOrder, false)
    }
    else {
      this.setText(this._list, 'Корзина пуста')
      this.toggleDisabled(this._buttonOrder, true)
    }
  }

  set total(total: number) {
    this.setText(this._total, `${total} синапсов`);
  }

}