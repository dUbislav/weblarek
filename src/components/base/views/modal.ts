import { Component } from "../Component";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../Events";

interface IModal {
    content: HTMLElement;
}

export class Modal extends Component<IModal> {
    protected closeButton: HTMLButtonElement;
    protected modalContent: HTMLElement;

    constructor(protected events: IEvents, container: HTMLElement) {
        super(container);
        this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);
        this.modalContent = ensureElement<HTMLElement>('.modal__content', this.container);

        this.closeButton.addEventListener('click', () => {
            this.events.emit('modal.close');
        });
    }

    set content(value: HTMLElement) {
        this.modalContent.replaceChildren(value);
    }
    
    open() {
        this.container.classList.add('modal_active');
    }

    close() {
        this.container.classList.remove('modal_active');
    }
}
