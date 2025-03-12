import { ICardActions, IProduct } from "../../types";
import { categories } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Сomponent";

// Класс реализует карточку товара (используется на главной, в модальном окне и в корзине).

export class Card extends Component<IProduct> {
  protected _title: HTMLElement;
  protected _description?: HTMLElement;
  protected _image?: HTMLImageElement;
  protected _category?: HTMLElement;
  protected _price: HTMLElement;
  protected _button?: HTMLButtonElement;
  protected _itemIndex: HTMLElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);
    this._title = ensureElement('.card__title', this.container)
    this._description = container.querySelector('.card__text');
    this._image = container.querySelector('.card__image')
    this._category = container.querySelector('.card__category')
    this._price = container.querySelector('.card__price')
    this._button = container.querySelector('.card__button')
    this._itemIndex = container.querySelector('.basket__item-index');

    if (actions) {
      if (this._button) {
        this._button.addEventListener('click', actions.onClick)
      } else {
        container.addEventListener('click', actions.onClick)
      }
    }
  }

  set title(title: string){
    this.setText(this._title, title)
  }

  set description(description: string){
    this.setText(this._description, description)
  }

  set image(imageUrl: string){
    this.setImage(this._image, imageUrl)
  }

  set category(category: string) {
    this.setText(this._category, category)
    this.toggleClass(this._category, categories.get(category), true)
  }

  set price(price: number) {
    if (price) {
      this.setText(this._price, `${price} синапсов`)
    } else {
      this.setText(this._price, `Бесценно`)
    }
  }

  set button(text: string) {
    this.setText(this._button, text)
  }

  set itemIndex(index: number) {
    this.setText(this._itemIndex, String(index));
  }
}