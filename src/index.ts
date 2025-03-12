import { Success } from './components/view/Success';
import { AppData } from './components/model/AppData';
import './scss/styles.scss';
import { API_URL, CDN_URL } from './utils/constants';
import { WebLarekApi } from './components/model/WebLarekApi';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Modal } from './components/view/Modal';
import { EventEmitter } from './components/base/events';
import { IAppData, IContactsForm, IOrderForm, IOrderRequest, IProduct, PaymentType } from './types';
import { ContactsForm } from './components/view/ContactsForm';
import { OrderForm } from './components/view/OrderForm';
import { Basket } from './components/view/Basket';
import { Card } from './components/view/Card';
import { Page } from './components/view/Page';


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
const page = new Page(document.body, events)

// Для отладки
// events.onAll(({ eventName, data }) => {
//   console.log(eventName, data);
// })

// Бизнес-логика

events.on('catalog:change', () => {
   page.catalog = appData.catalog.map((product) => {
    const card = new Card(cloneTemplate(cardCatalogTemplate), {onClick: () => events.emit('card:click', product)})
    return card.render(product)
  })
})

events.on('card:click', (product: IProduct) => {
  appData.setPreview(product);
  const cardPreview = new Card(cloneTemplate(cardPreviewTemplate), {
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
  })}
);


events.on('basket:change', () => {
  const basketItems = appData.basket.map((id, index) => {
  const item = appData.catalog.find((item) => item.id === id)
  const cardBasket = new Card(cloneTemplate(cardBasketTemplate), {onClick: () => {
    appData.removeFromBasket(item)
  }})
  cardBasket.itemIndex = index + 1
  return cardBasket.render(item)
  })

  basket.items = basketItems;
  basket.total = appData.getTotal();
  page.counter = appData.basket.length;
});

events.on('basket:checkout', () => {
  orderForm.paymentMethod = 'online';
  modal.renderModal({ // в функции renderModal() есть вызов функции openModal(), но он почему-то не работает
    content: orderForm.renderForm({
			payment: 'online',
			address: '',
			valid: false,
			errors: [],
		})
  });

  modal.openModal(); //и приходится повторно вызывать openModal(), не могу понять в чем причина...
});

events.on('order:submit', () => {
  modal.renderModal({
    content: contactsForm.renderForm({
			phone: '',
			email: '',
			valid: false,
			errors: [],
		})
  });

  modal.openModal();
});

events.on('contacts:submit', () => {
  const pricedItems = appData.basket.filter((id) => {
    const item = appData.catalog.find((item) => item.id === id)
    return item && item.price != null 
  })

  const orderRequest: IOrderRequest = {
    ...appData.order, 
      items: pricedItems,
      total: appData.getTotal()
  }
  api.postOrder(orderRequest).then((data) => {
    modal.renderModal({
      content: success.render({
        total: data.total,
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
    if (data.field === 'payment') {
      orderForm.paymentMethod = data.value as PaymentType;
    }

    orderForm.renderForm({
      valid: appData.validateOrder(), 
      errors: Object.values(appData.formErrors)
    });
  
});

events.on(/^contacts\..*:change$/, (data: { field: keyof IContactsForm; value: string }) => {
  appData.setContatcsForm(data.field, data.value);

  contactsForm.renderForm({
    valid: appData.validateContacts(), 
    errors: Object.values(appData.formErrors)
  });

});

events.on('modal:open', () => {
  page.locked = true;
})

events.on('modal:close', () => {
  page.locked = false;
})

events.on('basket:open', () => {
  modal.renderModal({
    content: basket.render()
  })
})

api.getProductList().then((response) => appData.setCatalog(response)).catch((error) => console.error(error))