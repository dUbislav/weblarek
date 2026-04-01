import { Component } from "../Component";

interface IGallery {
    items: HTMLElement[];
}

export class Gallery extends Component<IGallery> {
    protected galleryElement: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        this.galleryElement = this.container;
    }

    set items(items: HTMLElement[]) {
        this.galleryElement.replaceChildren(...items);
    }
}
