import { IBuyer, TPayment, IValidationResult } from "../../../types";
import { IEvents } from "../Events";

export class Buyers {
    protected _payment: TPayment = null;
    protected _address: string = '';
    protected _phone: string = '';
    protected _email: string = '';
    protected events?: IEvents;

    constructor(events?: IEvents) {
        this.events = events;
    }

    setData(data: IBuyer): void {
        if (data.payment !== undefined) {
            this._payment = data.payment;
            this.events?.emit('buyer.changed', { payment: this._payment });
        }

        if (data.address !== undefined) {
            this._address = data.address;
            this.events?.emit('buyer.changed', { address: this._address });
        }

        if (data.phone !== undefined) {
            this._phone = data.phone;
            this.events?.emit('buyer.changed', { phone: this._phone });
        }

        if (data.email !== undefined) {
            this._email = data.email;
            this.events?.emit('buyer.changed', { email: this._email });
        }
    }

    getData(): IBuyer {
        return {
            payment: this._payment,
            email: this._email,
            phone: this._phone,
            address: this._address
        };
    }

    clearData(): void {
        this._address = '';
        this._email = '';
        this._payment = null;
        this._phone = '';

        this.events?.emit('buyer.changed', this.getData());
    }

    validateOrder(): IValidationResult {
        const errors: IValidationResult = {};

        if (!this._payment) {
            errors.payment = 'Выберите способ оплаты';
        }

        if (!this._address.trim()) {
            errors.address = 'Введите адрес';
        }

        return errors;
    }

    validateContacts(): IValidationResult {
        const errors: IValidationResult = {};

        if (!this._email.trim()) {
            errors.email = 'Введите email';
        }

        if (!this._phone.trim()) {
            errors.phone = 'Введите номер телефона';
        }

        return errors;
    }
}
