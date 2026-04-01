import { IProduct } from "../../../types";
import { IEvents } from "../Events";

export class Cart {
    protected _items: IProduct[] = [];
    events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
    }
    
    getItems(): IProduct[]{
        return this._items;
    }

    addItem(item: IProduct): void {
        this._items.push(item);
        this.events.emit('cart.update', { items: this._items });
    }

    deleteItem(id: string): void {
        this._items = this._items.filter(item => item.id !== id);
        this.events.emit('cart.update', { items: this._items });
    }

    clearCart(): void {
        this._items = [];
        this.events.emit('cart.update', { items: this._items });
    }

    getTotalPrice(): number {
        return this._items.reduce((sum, item) => sum = sum + (item.price || 0), 0);
    }

    getTotalCount(): number {
        return this._items.length;
    }

    checkInCart(id: string): boolean {
        return this._items.some(item => item.id === id);
    }
}