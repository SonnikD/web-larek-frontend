import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { Component } from "../base/Сomponent";

// Класс реализует стандартную форму

interface IFormValid {
  valid: boolean;
  errors: string[];
}

export class Form<T> extends Component<IFormValid> {
  protected _submitForm: HTMLButtonElement;
  protected _errorsForm: HTMLElement;
  protected _events: IEvents;
  private _isValid: boolean = false;
  private _errors: string = '';


  constructor(container: HTMLFormElement, events: IEvents) {
    super(container)

    this._events = events;
    this._submitForm = ensureElement<HTMLButtonElement>('.button[type=submit]', this.container)
    this._errorsForm = ensureElement<HTMLElement>('.form__errors', this.container)


    this.container.addEventListener('submit', ((e) => {
      if (this.container instanceof HTMLFormElement) {
        e.preventDefault();
        this._events.emit(`${this.container.name}:submit`)
      }
    }))


    this.container.addEventListener('input', ((e) => {
      const target = e.target as HTMLInputElement;
      const value = target.value;
      const field = target.name;
      this.onInputChange(field as keyof T, value);
    }))
  }

  get valid(): boolean {
    return this._isValid;
  }

  set valid(isValid: boolean) {
    this._isValid = isValid;
    this._submitForm.disabled = !isValid;
  }
  
  get errors(): string {
    return this._errors;
  }

  set errors(errors: string) {
    this._errors = errors;
    this.setText(this._errorsForm, errors)
  }

  // обновлять значение полей формы 
  updateField(field: keyof T, value: string) {
    if (field in this) {
      (this as any)[field] = value;
    }
  }

  // слушать изменения в полях формы
  onInputChange(field: keyof T, value: string): void {
    if (this.container instanceof HTMLFormElement) {
      this._events.emit(`${this.container.name}.${String(field)}:change`, {field, value})
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