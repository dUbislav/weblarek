import { IBuyer, TPayment, IValidationResult } from "../../../types";

export class Buyers {
    protected _payment: TPayment = null;
    protected _address: string = '';
    protected _phone: string = '';
    protected _email: string = '';

    сonstructor() {
    }
    
    setData(data: IBuyer): void {
        if (data.payment !== undefined) this._payment = data.payment;
        if (data.address !== undefined) this._address = data.address;
        if (data.phone !== undefined) this._phone = data.phone;
        if (data.email !== undefined) this._email = data.email;
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
    }

    validateData(): IValidationResult {
        const errors: IValidationResult = {}
        if (!this._payment) {
            errors.payment = 'Выберите способ оплаты';
        }

        if (!this._phone) {
            errors.phone = 'Введите номер телефона';
        }

        if (!this._address) {
            errors.address = 'Введите адрес';
        }

        return errors
    }
}