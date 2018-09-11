import delay from './delay';

const db = {
    locations: [
        {
            id: 1,
            name: 'Amasaman',
            code: '001001001',
            region_id: 1,
            district_id: 1
        },
        {
            id: 2,
            name: 'Madina',
            code: '001001001',
            region_id: 1,
            district_id: 1
        },
        {
            id: 3,
            name: 'Pokuase',
            code: '001001001',
            region_id: 1,
            district_id: 1
        },
        {
            id: 4,
            name: 'New Town',
            code: '001001001',
            region_id: 1,
            district_id: 1
        }
    ]
};

export default class LocationApi {
    static all(){
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({
                    data: db.locations,
                    meta: {
                        pagination: {
                            total: db.locations.length,
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