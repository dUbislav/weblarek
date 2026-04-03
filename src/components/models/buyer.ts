import { IBuyer, TPayment, IValidationResult } from "../../types";
import { IEvents } from "../base/Events";

export class Buyer {
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
            this.events?.emit('buyer.changed');
        }

        if (data.address !== undefined) {
            this._address = data.address;
            this.events?.emit('buyer.changed');
        }

        if (data.phone !== undefined) {
            this._phone = data.phone;
            this.events?.emit('buyer.changed');
        }

        if (data.email !== undefined) {
            this._email = data.email;
            this.events?.emit('buyer.changed');
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

        this.events?.emit('buyer.changed');
    }

    validateData(): IValidationResult {
        const errors: IValidationResult = {};

        if (!this._payment) {
            errors.payment = 'Выберите способ оплаты';
        }

        if (!this._address) {
            errors.address = 'Введите адрес';
        }

        if (!this._email) {
            errors.email = 'Введите email';
        }

        if (!this._phone) {
            errors.phone = 'Введите номер телефона';
        }

        return errors;
    }
}
