import { IProduct } from "../../../types";

export class Products {
    protected _items: IProduct[] = [];
    protected _currentItem: IProduct | null = null;

    constructor() {
    }

    setItems(items: IProduct[]): void {
        this._items = items;
    }

    getItems(): IProduct[] {
        return this._items;
    }

    getItemById(id: string): IProduct | undefined {
        return this._items.find(item => item.id === id);
    }

    setCurrentItem(product: IProduct): void {
        this._currentItem = product;
    }

    getCurrentItem(): IProduct | null {
        return this._currentItem;
    }
}

