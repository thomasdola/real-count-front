import delay from './delay';

const db = {
    districts: [
        {
            id: 1,
            name: 'Ga West',
            code: '001001',
            region_id: 1
        },
        {
            id: 2,
            name: 'Ga North',
            code: '001002',
            region_id: 1
        }
    ]
};

export default class DistrictApi {
    static all(){
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({
                    data: db.districts,
                    meta: {
                        pagination: {
                            total: db.districts.length,
                            perPage: 20,
                            currentPage: 1,
                            nextPage: false,
                            previousPage: false
                        }
                    }
                })
            }, delay);
        });
    }
}