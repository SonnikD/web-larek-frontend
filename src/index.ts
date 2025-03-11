import { Success } from './components/view/Success';
import { AppData } from './components/model/AppData';
import './scss/styles.scss';
import { API_URL, CDN_URL } from './utils/constants';
import { WebLarekApi } from './components/model/WebLarekApi';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Modal } from './components/view/Modal';
import { EventEmitter, IEvents } from './components/base/events';
import { IAppData, IContactsForm, IOrder, IOrderForm, IProduct, PaymentType } from './types';
import { ContactsForm } from './components/view/ContactsForm';
import { OrderForm } from './components/view/OrderForm';
import { Basket } from './components/view/Basket';
import { Card } from './components/view/Card';


// Api приложения
const api = new WebLarekApi(CDN_URL, API_URL);

// Брокер события
const events = new EventEmitter();

// Модель данных
const appData: IAppData = new AppData(events);

// Шаблоны 
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const modalCardTemplate = ensureElement<HTMLTemplateElement>('#modal-container');

// Объекты
const modal = new Modal(modalCardTemplate, events);
const contactsForm = new ContactsForm(cloneTemplate(contactsTemplate), events);
const orderForm = new OrderForm(cloneTemplate(orderTemplate), events);
const success = new Success(cloneTemplate(successTemplate), events);
const basket = new Basket(cloneTemplate(basketTemplate), events)

// Для отладки
// events.onAll(({ eventName, data }) => {
//   console.log(eventName, data);
// })

// Бизнес-логика

events.on('catalog:change', () => {
   appData.catalog.forEach((product) => {
    const card = new Card(cloneTemplate(cardCatalogTemplate), events, {onClick: () => events.emit('card:click', product)})
    ensureElement('.gallery').append(card.render(product))
    
  })
})

events.on('card:click', (product: IProduct) => {
  appData.setPreview(product);
  const cardPreview = new Card(cloneTemplate(cardPreviewTemplate), events, {
    onClick: () => {
      if (appData.isInBasket(product)) {
        appData.removeFromBasket(product)
      } else {
        appData.addToBasket(product)
      }
      cardPreview.button = appData.isInBasket(product) ? 'Удалить из корзины' : 'В корзину';
    } 
  });
  cardPreview.button = appData.isInBasket(product) ? 'Удалить из корзины' : 'В корзину';
  modal.renderModal({
    content: cardPreview.render(product)
  })});


events.on('basket:change', () => {
  const basketItems = appData.basket.map((item) => {
  const cardBasket = new Card(cloneTemplate(cardBasketTemplate), events, {onClick: () => {
    appData.removeFromBasket(item)
  }})
  return cardBasket.render(item)
  })

  basket.items = basketItems;
  basket.counter = appData.basket.length;
  basket.total = appData.getTotal();
});

events.on('basket:checkout', () => {
  modal.renderModal({
    content: orderForm.render()
  });

  modal.openModal();
});

events.on('order:submit', () => {
  modal.renderModal({
    content: contactsForm.render()
  });
  modal.openModal();

});

events.on('contacts:submit', () => {
  api.postOrder(appData.order).then((data) => {
    modal.renderModal({
      content: success.render({
        total: data.total
      })
    })
    appData.clearBasket();
    appData.clearOrder()
    modal.openModal();
  }).catch((error) => console.error(error))

});

events.on('success:close', () => {
  modal.closeModal();
});

events.on(/^order\..*:change$/, (data: { field: keyof IOrderForm; value: string }) => {
    appData.setOrderForm(data.field, data.value);
    orderForm.updateField(data.field, data.value);

    orderForm.renderForm({
      valid: appData.validateOrder(), 
      errors: Object.values(appData.formErrors)
    });
  
});

events.on(/^contacts\..*:change$/, (data: { field: keyof IContactsForm; value: string }) => {
  appData.setContatcsForm(data.field, data.value);
  contactsForm.updateField(data.field, data.value);

  contactsForm.renderForm({
    valid: appData.validateContacts(), 
    errors: Object.values(appData.formErrors)
  });

});

events.on('modal:open', () => {
  modal.locked = true;
})

events.on('modal:close', () => {
  modal.locked = false;
})

events.on('basket:open', () => {
  modal.renderModal({
    content: basket.render()
  })
})



api.getProductList().then((response) => appData.setCatalog(response)).catch((error) => console.error(error))