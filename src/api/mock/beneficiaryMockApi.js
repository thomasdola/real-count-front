import delay from './delay';
import {IBeneficiaryApi} from '../interfaces/IBeneficiaryApi';

const db = {
    beneficiaries: [
        {
            bid: "ZGH1234567",
            uuid: "fjaldjflasdf",
            full_name: "Jane Doe",
            module: "Module",
            rank: "Rank",
            region: "Region",
            district: "District",
            location: "Location",
            status: "inactive",
            valid: "valid"
        },
        {
            bid: "ZGH1237567",
            uuid: "fjaldjhhjasdf",
            full_name: "John Doe",
            module: "Module",
            rank: "Rank",
            region: "Region",
            district: "District",
            location: "Location",
            status: "inactive",
            valid: "invalid"
        }
    ],
    beneficiary: {
        uuid: "jfaksdjfasle",
        bid: "ZGH1234567",
        surname: "Jane",
        forenames: "Ama Doe",
        date_of_birth: "12/12/1998",
        gender: "0",
        phone_number: "0244589657",
        address: "Amasaman",
        identification_id: "1",
        identification_number: "4548797984687987",
        bank_name: "EcoBank",
        bank_branch: "Amasaman",
        account_number: "878946546465498456465",
        allowance: "100",
        region_id: "1",
        district_id: "1",
        location_id: "1",
        module_id: "1",
        rank_id: "1",
        status: 'inactive',
        valid: 'invalid'
    },
    bio: {
        socket: {
            thumb_left: {fmd: '', encoded: ''},
            thumb_right: {fmd: '', encoded: ''},
            index_left: {fmd: '', encoded: ''},
            index_right: {fmd: '', encoded: ''},
            portrait: {encoded: ''},
            form: {encoded: ''},
        },
        server: {
            thumb_left: {uuid: '', path: ''},
            thumb_right: {uuid: '', path: ''},
            index_left: {uuid: '', path: ''},
            index_right: {uuid: '', path: ''},
            portrait: {uuid: '', path: ''},
            form: {uuid: '', path: ''},
        }
    }
};

const scheduled = true;

export default class BeneficiaryApi implements IBeneficiaryApi {
    static all(params){
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({
                    data: db.beneficiaries,
                    meta: {
                        pagination: {
                            total: db.beneficiaries.length,
                            per_page: 20,
                            current_page: 1,
                            total_pages: 30
                        }
                    }
                })
            }, delay);
        });
    }

    static create(data){
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({created: true});
            }, delay);
        });
    }

    static single(beneficiary){
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({beneficiary: db.beneficiary, bio: db.bio.server});
            }, delay);
        });
    }

    static update(beneficiary, data){
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({updated: true, scheduled});
            }, delay);
        });
    }

    static remove(beneficiary){
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({deleted: true});
            }, delay);
        });
    }
}