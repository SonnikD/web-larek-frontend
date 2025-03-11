import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { Component } from "../base/Сomponent"


// Класс реализует модальное окно

interface IModalData {
  content: HTMLElement;
}

export class Modal extends Component<IModalData> {
  protected _closeButton: HTMLButtonElement;
  protected _content: HTMLElement;
  protected _events: IEvents;
  protected _pageWrapper: HTMLElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);

    this._events = events;
    this._content = ensureElement('.modal__content', container);
    this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
    this._pageWrapper = document.querySelector('.page__wrapper');

    this.container.addEventListener('click', () => this.closeModal()) 
    this._closeButton.addEventListener('click', (e) => {
      e.stopPropagation()
      this.closeModal()
    }) 
    this._content.addEventListener('click', (e) => e.stopPropagation()) 
  }
    
  set locked(value: boolean) {
      if (value) {
        this._pageWrapper.classList.add('page__wrapper_locked');
      } else {
        this._pageWrapper.classList.remove('page__wrapper_locked');
      }
    }  
    
  set content(value: HTMLElement) {
    this._content.replaceChildren(value);
  }
  
  // открыть модальное окно
  openModal(): void {
    this.toggleClass(this.container, 'modal_active')
    this._events.emit('modal:open')
  }

  // закрыть модальное окно
  closeModal(): void {
    this.toggleClass(this.container, 'modal_active')
    this._events.emit('modal:close')
  }

  // рендер модального окна
  renderModal(data: IModalData): HTMLElement {
    this.content = data.content;
    this.openModal()
    return super.render()
  }
}