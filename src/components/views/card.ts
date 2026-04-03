import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { CDN_URL, categoryMap } from "../../utils/constants";

interface ICard {
    id: string;
    title: string;
    price: number | null;
}

interface ICardCatalog extends ICard {
    category: string;
    image: string;
}

interface ICardPreview extends ICardCatalog {
    description: string;
    buttonText: string;
    buttonDisabled: boolean;
}

interface ICardBasket extends ICard {
    index: number;
}

export interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export interface ICardBasketActions {
    onClick: (event: MouseEvent) => void;
}

export class Card<T extends ICard> extends Component<T> {
    protected titleElement: HTMLElement;
    protected priceElement: HTMLElement;
    protected buttonElement?: HTMLButtonElement;

    constructor(container: HTMLElement) {
        super(container);
        this.titleElement = ensureElement<HTMLElement>('.card__title', this.container);
        this.priceElement = ensureElement<HTMLElement>('.card__price', this.container);
        this.buttonElement = this.container.querySelector<HTMLButtonElement>('.card__button') || undefined;
    }

    set title(value: string) {
        this.titleElement.textContent = value;
    }

    set price(value: number | null) {
        this.priceElement.textContent = value !== null ? `${value} синапсов` : 'Бесценно';
    }
}

export class CardCatalog<ICard extends ICardCatalog> extends Card<ICard> {
    protected imageElement?: HTMLImageElement;
    protected categoryElement?: HTMLElement;
    protected actions?: ICardActions;
    
    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);
        this.imageElement = this.container.querySelector<HTMLImageElement>('.card__image') || undefined;
        this.categoryElement = this.container.querySelector<HTMLElement>('.card__category') || undefined;
        this.actions = actions;

        this.container.addEventListener('click', (event) => {
            this.actions?.onClick?.(event);
        });
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

export class CardPreview extends CardCatalog<ICardPreview> {
    protected descriptionElement: HTMLElement;
    protected buttonElement: HTMLButtonElement;
    protected events: IEvents;

    constructor(events: IEvents, container: HTMLElement) {
        super(container);
        this.events = events;
        this.descriptionElement = ensureElement<HTMLElement>('.card__text', this.container);
        this.buttonElement = ensureElement<HTMLButtonElement>('.card__button', this.container);

        this.buttonElement.addEventListener('click', (event) => {
            event.stopPropagation();
            this.events.emit('basket.add');
        });
    }

    set description(value: string) {
        this.descriptionElement.textContent = value;
    }

    set buttonText(value: string) {
        if (this.buttonElement) {
            this.buttonElement.textContent = value;
        }
    }

    set buttonDisabled(value: boolean) {
        if (this.buttonElement) {
            this.buttonElement.disabled = value;
        }
    }
}

export class CardBasket extends Card<ICardBasket> {
    protected indexElement: HTMLElement;
    protected cardButton: HTMLButtonElement;
    protected actions?: ICardBasketActions;

    constructor(container: HTMLElement, actions?: ICardBasketActions) {
        super(container);
        this.actions = actions;
        this.indexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
        this.cardButton = ensureElement<HTMLButtonElement>('.basket__item-delete.card__button', this.container);

        this.cardButton.addEventListener('click', (event) => {
            this.actions?.onClick?.(event);
        });
    }

    set index(value: number) {
        this.indexElement.textContent = `${value}`;
    }
}
