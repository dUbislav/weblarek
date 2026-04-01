import { Component } from "../Component";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../Events";
import { CDN_URL, categoryMap } from "../../../utils/constants";

interface ICard {
    id: string;
    title: string;
    category: string;
    image: string;
    price: number | null;
}

interface ICardPreview extends ICard {
    description: string;
    selected: boolean;
}

interface ICardBasket extends ICard {
    index: number;
}

export class Card<T extends ICard> extends Component<T> {
    protected _id!: string;
    protected titleElement: HTMLElement;
    protected imageElement?: HTMLImageElement;
    protected categoryElement?: HTMLElement;
    protected priceElement: HTMLElement;
    protected buttonElement?: HTMLButtonElement;

    constructor(protected events: IEvents, container: HTMLElement) {
        super(container);
        this.titleElement = ensureElement<HTMLElement>('.card__title', this.container);
        this.priceElement = ensureElement<HTMLElement>('.card__price', this.container);
        this.imageElement = this.container.querySelector<HTMLImageElement>('.card__image') || undefined;
        this.categoryElement = this.container.querySelector<HTMLElement>('.card__category') || undefined;
        this.buttonElement = this.container.querySelector<HTMLButtonElement>('.card__button') || undefined;

        if (this.container.classList.contains('gallery__item')) {
            this.container.addEventListener('click', () => {
                this.events.emit('card.select', { id: this.id });
            });
        }
    }

    set id(value: string) {
        this._id = value;
    }

    get id(): string {
        return this._id;
    }

    set title(value: string) {
        this.titleElement.textContent = value;
    }

    set price(value: number | null) {
        this.priceElement.textContent = value !== null ? `${value} синапсов` : 'недоступно';
    }

    set image(value: string) {
        if (this.imageElement) {
            this.setImage(this.imageElement, `${CDN_URL}${value}`);
        }
    }

    set category(value: string) {
        if (this.categoryElement) {
            this.categoryElement.textContent = value;
            const categoryClass = categoryMap[value as keyof typeof categoryMap];
            this.categoryElement.classList.add(categoryClass);
        }
    }
}

export class CardPreview extends Card<ICardPreview> {
    protected descriptionElement: HTMLElement;

    constructor(events: IEvents, container: HTMLElement) {
        super(events, container);
        this.descriptionElement = ensureElement<HTMLElement>('.card__text', this.container);

        this.buttonElement?.addEventListener('click', () => {
            this.events.emit('basket.add', { id: this.id });
        });
    }

    set description(value: string) {
        this.descriptionElement.textContent = value;
    }

    set selected(value: boolean) {
        if (this.buttonElement) {
            this.buttonElement.textContent = value ? 'Удалить из корзины' : 'Купить';
        }
    }
}

export class CardBasket extends Card<ICardBasket> {
    protected indexElement: HTMLElement;
    protected cardButton: HTMLButtonElement;

    constructor(events: IEvents, container: HTMLElement) {
        super(events, container);
        this.indexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
        this.cardButton = ensureElement<HTMLButtonElement>('.basket__item-delete.card__button', this.container);

        this.cardButton.addEventListener('click', () => {
            this.events.emit('basket.remove', { id: this.id });
        });
    }

    set index(value: number) {
        this.indexElement.textContent = `${value}`;
    }
}
