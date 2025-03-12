import { IModalData } from "../../types";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { Component } from "../base/Сomponent"


// Класс реализует модальное окно

export class Modal extends Component<IModalData> {
  protected _closeButton: HTMLButtonElement;
  protected _content: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this._content = ensureElement('.modal__content', container);
    this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);

    this.container.addEventListener('click', () => this.closeModal()) 
    this._closeButton.addEventListener('click', (e) => {
      e.stopPropagation()
      this.closeModal()
    }) 
    this._content.addEventListener('click', (e) => e.stopPropagation()) 
  }
  
  set content(value: HTMLElement) {
    this._content.replaceChildren(value);
  }
  
  // открыть модальное окно
  openModal(): void {
    this.toggleClass(this.container, 'modal_active')
    this.events.emit('modal:open')
  }

  // закрыть модальное окно
  closeModal(): void {
    this.toggleClass(this.container, 'modal_active')
    this.events.emit('modal:close')
  }

  // рендер модального окна
  renderModal(data: IModalData): HTMLElement {
    this.content = data.content;
    this.openModal()
    return super.render()
  }
}