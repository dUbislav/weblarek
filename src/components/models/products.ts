import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class Products {
    protected _items: IProduct[] = [];
    protected _currentItem: IProduct | null = null;
    events?: IEvents;

    constructor(events: IEvents) {
        this.events = events;
    }

    setItems(items: IProduct[]): void {
        this._items = items;
        this.events?.emit('products.update');
    }

    getItems(): IProduct[] {
        return this._items;
    }

    getItemById(id: string): IProduct | undefined {
        return this._items.find(item => item.id === id);
    }

    setCurrentItem(product: IProduct): void {
        this._currentItem = product;
        this.events?.emit('products.current');
    }

    getCurrentItem(): IProduct | null {
        return this._currentItem;
    }
}

