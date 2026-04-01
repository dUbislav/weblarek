import './scss/styles.scss';
import { EventEmitter} from './components/base/Events';
import { Products} from './components/base/models/products';
import { IBuyer, IProduct, TPayment } from './types';
import { Card, CardBasket, CardPreview } from './components/base/views/card';
import { cloneTemplate } from './utils/utils';
import { Gallery } from './components/base/views/gallery';
import { apiProducts } from './utils/data';
import { Modal } from './components/base/views/modal';
import { Basket } from './components/base/views/basket';
import { Cart } from './components/base/models/cart';
import { ContactsForm , OrderForm } from './components/base/views/form';
import { Success } from './components/base/views/success';
import { Buyer } from './components/base/models/buyer';
import { Header } from './components/base/views/header';

const events = new EventEmitter();
const products = new Products(events);
const gallery = new Gallery(document.querySelector('.gallery') as HTMLElement);
const modal = new Modal(events, document.querySelector('#modal-container') as HTMLElement);
const basket = new Basket(events, cloneTemplate<HTMLElement>('#basket'));
const contactsForm = new ContactsForm(events, cloneTemplate<HTMLFormElement>('#contacts'));
const orderForm = new OrderForm(events, cloneTemplate<HTMLFormElement>('#order'));
const success = new Success(events, cloneTemplate<HTMLElement>('#success'));
const cart = new Cart(events);
const buyer = new Buyer(events);
const header = new Header(events, document.querySelector('.header') as HTMLElement);

events.on<{items: IProduct[]}>('products.update', ({items}) => {
    const cards = items.map(item => {
        const cardElement = cloneTemplate<HTMLElement>('#card-catalog');
        const card = new Card(events, cardElement);
        return card.render({
            id: item.id,
            title: item.title,
            category: item.category,
            image: item.image,
            price: item.price
        })
    });
    gallery.items = cards;
});

events.on<{ id: string }>('card.select', ({ id }) => {
    const product = products.getItemById(id);
    if (product) {
        products.setCurrentItem(product);
    }
});

events.on<{ item: IProduct | null }>('products.current', ({item}) => {
    if (!item) return;
    const previewElement = cloneTemplate<HTMLElement>('#card-preview');
    const preview = new CardPreview(events, previewElement);
    modal.content = preview.render({
        id: item.id,
        title: item.title,
        category: item.category,
        image: item.image,
        price: item.price,
        description: item.description,
        selected: cart.checkInCart(item.id),
    });
    modal.open();
});

events.on<{items: IProduct[]}>('cart.update', ({ items }) => {
    const basketItems = items.map((item, index) => {
        const basketItemElement = cloneTemplate<HTMLElement>('#card-basket');
        const basketItem = new CardBasket(events, basketItemElement);
        return basketItem.render({
            id: item.id,
            title: item.title,
            price: item.price,
            index: index + 1
        })
    });
    basket.items = basketItems;
    basket.total = cart.getTotalPrice();
    header.counter = cart.getTotalCount();
});

events.on<{ payment: TPayment }>('payment.change', ({ payment }) => {
  buyer.setData({
    ...buyer.getData(),
    payment,
  });
});

events.on<{ address: string }>('order.change', ({ address }) => {
  buyer.setData({
    ...buyer.getData(),
    address,
  });
});

events.on<{ email?: string; phone?: string }>('contacts.change', (data) => {
  buyer.setData({
    ...buyer.getData(),
    ...data,
  });
});


events.on<Partial<IBuyer>>('buyer.changed', (data) => {
    if (data.address !== undefined) {
        orderForm.address = data.address;
    }
    if (data.payment !== undefined) {
        orderForm.payment = data.payment;
    }

    if(data.phone !== undefined) {
        contactsForm.phone = data.phone;
    }

    if(data.email !== undefined) {
        contactsForm.email = data.email;
    }

    const orderErrors = Object.values(buyer.validateOrder()) as string[];
    orderForm.valid = orderErrors.length === 0;
    orderForm.errors = orderErrors;

    const contactsErrors = Object.values(buyer.validateContacts()) as string[];
    contactsForm.valid = contactsErrors.length === 0;
    contactsForm.errors = contactsErrors;
});

events.on<{ id: string }>('basket.add', ({ id }) => {
    const product = products.getItemById(id);
    if (!product) {
        return;
    }

    if (cart.checkInCart(id)) {
        cart.deleteItem(id);
    } else {
        cart.addItem(product);
    }

    products.setCurrentItem(product);
});

events.on<{ id: string }>('basket.remove', ({ id }) => {
    cart.deleteItem(id);

    const product = products.getItemById(id);
    if (product) {
        products.setCurrentItem(product);
    }
});

events.on('basket.open', () => {
    modal.content = basket.render();
    modal.open();
});

events.on('basket.buy', () => {
    modal.content = orderForm.render();
    modal.open();
});

events.on('order.submit', () => {
    modal.content = contactsForm.render();
    modal.open();
});

events.on('contacts.submit', () => {
    modal.content = success.render({
        total: cart.getTotalPrice()
    });
    modal.open();
    cart.clearCart();
});

events.on('modal.close', () => {
    modal.close();
});

events.on('success.close', () => {
    modal.close();
});

products.setItems(apiProducts.items);
header.counter = cart.getTotalCount();
