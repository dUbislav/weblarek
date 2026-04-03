import './scss/styles.scss';
import { EventEmitter} from './components/base/Events';
import { Products} from './components/models/products';
import { IBuyer, IProduct, IValidationResult } from './types';
import { CardBasket, CardCatalog, CardPreview } from './components/views/card';
import { cloneTemplate } from './utils/utils';
import { Gallery } from './components/views/gallery';
import { Modal } from './components/views/modal';
import { Basket } from './components/views/basket';
import { Cart } from './components/models/cart';
import { ContactsForm , OrderForm } from './components/views/form';
import { Success } from './components/views/success';
import { Buyer } from './components/models/buyer';
import { Header } from './components/views/header';
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';
import { orderApi } from './components/models/apiOrder';

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
const preview = new CardPreview(events, cloneTemplate<HTMLElement>('#card-preview'));
const api = new Api(API_URL);
const ordersApi = new orderApi(api);

const getStepErrors = (
    errors: IValidationResult,
    fields: (keyof IValidationResult)[]
): string[] => fields
    .map((field) => errors[field])
    .filter((error): error is string => Boolean(error));

events.on('products.update', () => {
    const items = products.getItems();
    const cards = items.map(item => {
        const card = new CardCatalog(cloneTemplate<HTMLElement>('#card-catalog'),
            {
                onClick: () => events.emit('card.select', item),
            }
        );

        return card.render({
            id: item.id,
            title: item.title,
            category: item.category,
            image: item.image,
            price: item.price,
        });
    });
    gallery.items = cards;
});

events.on<IProduct>('card.select', (product) => {
    products.setCurrentItem(product);
});

events.on('products.current', () => {
    const currentProduct = products.getCurrentItem();
    if (!currentProduct) {
        return;
    }

    const isUnavailable = currentProduct.price === null;
    const isInCart = cart.checkInCart(currentProduct.id);
    modal.content = preview.render({
        id: currentProduct.id,
        title: currentProduct.title,
        category: currentProduct.category,
        image: currentProduct.image,
        price: currentProduct.price,
        description: currentProduct.description,
        buttonDisabled: isUnavailable,
        buttonText: isUnavailable
            ? 'Недоступно'
            : isInCart
                ? 'Удалить из корзины'
                : 'Купить',
    });
    modal.open();
});

events.on('cart.update', () => {
    const items = cart.getItems();
    const basketItems = items.map((item, index) => {
        const basketItem = new CardBasket(cloneTemplate<HTMLElement>('#card-basket'),
            {
                onClick: () => events.emit('basket.remove', { id: item.id }),
            }
        );
        return basketItem.render({
            id: item.id,
            title: item.title,
            price: item.price,
            index: index + 1
        });
    });
    basket.items = basketItems;
    basket.total = cart.getTotalPrice();
    basket.buttonDisabled = cart.getTotalCount() === 0;
    header.counter = cart.getTotalCount();
});

events.on<Partial<IBuyer>>('order.change', (data) => {
  buyer.setData({
    ...buyer.getData(),
    ...data,
  });
});

events.on<{ email?: string; phone?: string }>('contacts.change', (data) => {
  buyer.setData({
    ...buyer.getData(),
    ...data,
  });
});


events.on('buyer.changed', () => {
    const data = buyer.getData();
    orderForm.address = data.address;
    orderForm.payment = data.payment;
    contactsForm.phone = data.phone;
    contactsForm.email = data.email;

    const errors = buyer.validateData();
    events.emit('order.validation', {
        valid: !errors.payment && !errors.address,
        errors: getStepErrors(errors, ['payment', 'address']),
    });
    events.emit('contacts.validation', {
        valid: !errors.email && !errors.phone,
        errors: getStepErrors(errors, ['email', 'phone']),
    });
});

events.on<{ valid: boolean; errors: string[] }>('order.validation', ({ valid, errors }) => {
    orderForm.valid = valid;
    orderForm.errors = errors;
});

events.on<{ valid: boolean; errors: string[] }>('contacts.validation', ({ valid, errors }) => {
    contactsForm.valid = valid;
    contactsForm.errors = errors;
});

events.on('basket.add', () => {
    const product = products.getCurrentItem();
    if (!product) {
        return;
    }

    if (cart.checkInCart(product.id)) {
        cart.deleteItem(product.id);
    } else {
        cart.addItem(product);
    }

    modal.close();
});

events.on<{ id: string }>('basket.remove', ({ id }) => {
    const product = products.getItemById(id);
    if (product) {
        cart.deleteItem(product.id);
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

events.on('contacts.submit', async () => {
    const orderData: IBuyer = buyer.getData();
    const order = {
        ...orderData,
        items: cart.getItems().map((item) => item.id),
        total: cart.getTotalPrice(),
    };

    try {
        const result = await ordersApi.postOrder(order);

        modal.content = success.render({
            total: result.total
        });
        modal.open();
        cart.clearCart();
        buyer.clearData();
    } catch (error) {
        console.error('Не удалось отправить заказ:', error);
    }
});

events.on('success.close', () => {
    modal.close();
});

basket.buttonDisabled = cart.getTotalCount() === 0;

async function loadProducts(): Promise<void> {
    try {
        const data = await ordersApi.getOrder();
        products.setItems(data.items);
    } catch (error) {
        console.error('Не удалось загрузить товары:', error);
    }
}

void loadProducts();
