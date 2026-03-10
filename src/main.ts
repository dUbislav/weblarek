import './scss/styles.scss';
import { Buyers } from './components/base/models/buyer';
import { Products } from './components/base/models/products';
import { Cart } from './components/base/models/cart';
import { orderApi } from './components/base/Api';
import { apiProducts } from './utils/data';
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';

const buyer = new Buyers();
const products = new Products();
const cart = new Cart();

buyer.setData({
    payment: 'card',
    email: 'anclave@yandex.ru',
    phone: '+7 (920) 681-55-44',
    address: 'Voronezh, Russia, 394000, ul. 20-letiya Oktyabrya, 117'
});
console.log('Buyer data:', buyer.getData());
console.log('Buyer validation:', buyer.validateData());
buyer.clearData();
console.log('Buyer after clear:', buyer.getData());

products.setItems(apiProducts.items);
console.log('All products:', products.getItems());

const firstProduct = apiProducts.items[0];
const secondProduct = apiProducts.items[1];

if (firstProduct) {
    console.log('Product by id:', products.getItemById(firstProduct.id));
}

if (secondProduct) {
    products.setCurrentItem(secondProduct);
}
console.log('Current product:', products.getCurrentItem());

if (firstProduct) {
    cart.addItem(firstProduct);
}
if (secondProduct) {
    cart.addItem(secondProduct);
}
console.log('Cart items:', cart.getItems());
console.log('Cart total price:', cart.getTotalPrice());
console.log('Cart total count:', cart.getTotalCount());

if (firstProduct) {
    console.log('Is first in cart:', cart.checkInCart(firstProduct.id));
    cart.deleteItem(firstProduct.id);
}
console.log('Cart after delete:', cart.getItems());

cart.clearCart();
console.log('Cart after clear:', cart.getItems());

const api = new Api(API_URL);
const orderApiInstance = new orderApi(api);

orderApiInstance.getOrder()
    .then((productsList) => {
        products.setItems(productsList.items);
        console.log('Products from model:', products.getItems());
    })
    .catch((error) => {
        console.error('Error fetching products:', error);
    });

const emptyBuyer = new Buyers();
console.log('Empty buyer data:', emptyBuyer.getData());
console.log('Empty buyer validation:', emptyBuyer.validateData());
