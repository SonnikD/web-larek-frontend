import { IContactsForm } from "../../types";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { Form } from "./Form";

// Класс реализует форму с контактными данными

export class ContactsForm extends Form<IContactsForm> {
  protected _emailInput: HTMLInputElement;
  protected _phoneInput: HTMLInputElement;


  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events)
    
    this._emailInput = ensureElement<HTMLInputElement>('.form__input[name=email]', this.container)
    this._phoneInput = ensureElement<HTMLInputElement>('.form__input[name=phone]', this.container)

    this.email = this._emailInput.value;
    this.phone = this._phoneInput.value;
  }

  set email(email: string) {
    this._emailInput.value = email;
  }

  set phone(phone: string) {
    this._phoneInput.value = phone;
  }
}
