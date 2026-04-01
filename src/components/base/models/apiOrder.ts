import { IApi, IProductsList, IOrder, IOrderResult } from '../../../types';

export class orderApi {
    private _api: IApi;

    constructor(api: IApi) {
        this._api = api;
    }

    getOrder(): Promise<IProductsList> {
        return this._api.get<IProductsList>('/product/');
    }

    postOrder(order: IOrder): Promise<IOrderResult> {
        return this._api.post<IOrderResult>('/order/', order);
    }
}