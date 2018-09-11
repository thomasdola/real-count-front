// @flow

export interface IBeneficiaryApi{
    static all(queryParams: {}): Promise<any>;

    static single(beneficiaryId: string): Promise<any>;

    static create(data: {}): Promise<any>;

    static update(beneficiaryId: string, data: {}): Promise<any>;

    static remove(beneficiaryId: string): Promise<any>;
}