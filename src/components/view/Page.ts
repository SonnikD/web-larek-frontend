import { IPage } from "../../types";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { Component } from "../base/Сomponent";

// Класс реализует главную страницу

export class Page extends Component<IPage> {
  protected _pageWrapper: HTMLElement;
  protected _catalog: HTMLElement;
  protected _basket: HTMLElement;
  protected _counter: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container)
    
    this._pageWrapper = ensureElement('.page__wrapper');
    this._catalog = ensureElement('.gallery');
    this._basket = ensureElement('.header__basket')
    this._counter = ensureElement('.header__basket-counter')
    
    this._basket.addEventListener('click', () => this.events.emit('basket:open'))
  }

  set locked(value: boolean) {
    if (value) {
      this._pageWrapper.classList.add('page__wrapper_locked');
    } else {
      this._pageWrapper.classList.remove('page__wrapper_locked');
    }
  }  

  set catalog(items: HTMLElement[]) {
    this._catalog.replaceChildren(...items)
  }

  set counter(count: number) {
    this.setText(this._counter, String(count))
   }
}