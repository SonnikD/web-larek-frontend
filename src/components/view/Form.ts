import { IFormValid } from "../../types";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { Component } from "../base/Сomponent";

// Класс реализует стандартную форму

export class Form<T> extends Component<IFormValid> {
  protected _submitForm: HTMLButtonElement;
  protected _errorsForm: HTMLElement;

  constructor(container: HTMLFormElement, protected events: IEvents) {
    super(container)

    this._submitForm = ensureElement<HTMLButtonElement>('.button[type=submit]', this.container)
    this._errorsForm = ensureElement<HTMLElement>('.form__errors', this.container)

    this.container.addEventListener('submit', ((e) => {
      if (this.container instanceof HTMLFormElement) {
        e.preventDefault();
        this.events.emit(`${this.container.name}:submit`)
      }
    }))

    this.container.addEventListener('input', ((e) => {
      const target = e.target as HTMLInputElement;
      const value = target.value;
      const field = target.name;
      this.onInputChange(field as keyof T, value);
    }))
  }

  set valid(isValid: boolean) {
    this.toggleDisabled(this._submitForm, !isValid)
  }
  
  set errors(errors: string) {
    this.setText(this._errorsForm, errors)
  }

  // слушать изменения в полях формы
  onInputChange(field: keyof T, value: string): void {
    if (this.container instanceof HTMLFormElement) {
      this.events.emit(`${this.container.name}.${String(field)}:change`, {field, value})
    }
  }

  // рендер формы
  renderForm(data: Partial<T> & IFormValid) {
    const { valid, errors, ...inputs } = data;
    super.render({ valid, errors }); 
    Object.assign(this, inputs); 
    return this.container;  
  }
  
}