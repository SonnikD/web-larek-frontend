import { IBasket } from "../../types";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { Component } from "../base/Сomponent";

export class Basket extends Component<IBasket> {
  protected _list: HTMLElement;
  protected _buttonOrder: HTMLButtonElement;
  protected _total: HTMLElement; 
  protected _buttonBasket: HTMLElement; 
  protected _counter: HTMLElement;
  private _totalValue: number = 0;
  private _items: HTMLElement[] = [];

  constructor(container: HTMLElement, protected events: IEvents) {
   super(container)

   this._list = ensureElement('.basket__list', this.container)
   this._buttonOrder = ensureElement<HTMLButtonElement>('.basket__button', this.container)
   this._total = ensureElement('.basket__price', this.container)
   this._buttonBasket = document.querySelector('.header__basket')
   this._counter = this._buttonBasket.querySelector('.header__basket-counter')

   this._buttonBasket.addEventListener('click', () => { this.events.emit('basket:open') });
   this._buttonOrder.addEventListener('click', (() => events.emit('basket:checkout')))

   this.items = []
  }
  
  get items() {
    return this._items;
  }

  set items(items: HTMLElement[] ) {
    if (items.length) {
      this._list.replaceChildren(...items)
      this._buttonOrder.removeAttribute('disabled')
    }
    else {
      this._buttonOrder.setAttribute('disabled', 'disabled')
      this.setText(this._list, 'Корзина пуста')
    }
    this._items = items;
  }

  get total() {
    return this._totalValue;
  }

  set total(total: number) {
   this._totalValue = total;
    this.setText(this._total, `${total} синапсов`)
  }

  set counter(count: number) {
   this.setText(this._counter, String(count))
  }
}