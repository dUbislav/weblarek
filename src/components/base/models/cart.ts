import { IProduct } from "../../../types";

export class Cart {
    protected _items: IProduct[] = [];

    сonstructor() {
    }
    
    getItems(): IProduct[]{
        return this._items;
    }

    addItem(item: IProduct): void {
        this._items.push(item);
    }

    deleteItem(id: string): void {
        this._items = this._items.filter(item => item.id !== id);
    }

    clearCart(): void {
        this._items = [];
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