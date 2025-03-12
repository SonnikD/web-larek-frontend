// Базовый класс, предназначенный для создания компонентов пользовательского интерфейса.

export abstract class Component<T> {
  protected container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  // Установить текстовое содержимое
  setText(element: HTMLElement, text: string): void {
    if (element) {
      element.textContent = text;
    }
  }

  // Установить изображение
  setImage(element: HTMLImageElement, src: string, alt?: string): void {
    if (element) {
      element.src = src;

      if (alt) {
        element.alt = alt;
      }
    }
  }

  // Скрыть элемент
  setHidden(element: HTMLElement): void {
    element.style.display = "none";
  }
  
  // Отобразить элемент
  setVisible(element: HTMLElement): void {
    element.style.removeProperty("none");
  }

  // Переключить класс на элементе
  toggleClass(element: HTMLElement, className: string, force?: boolean): void {
    if (element) {
      element.classList.toggle(className, force)
    }
  }

  // Переключить атрибут disabled на элементе
  toggleDisabled(element: HTMLElement, state: boolean): void {
    if (state) {
      element.setAttribute('disabled', 'disabled')
    } else {
      element.removeAttribute('disabled')
    }
  }

  // Вернуть DOM-элемент, переданный в конструкторе
  render(data?: Partial<T>): HTMLElement {
    Object.assign(this as object, data ?? {});
		return this.container;
  
	}
}