import delay from './delay';

const db = {
    regions: [
        {
            name: "Greater Accra",
            code: "002325",
            id: 1
        }
    ],
    districts: [
        {
            name: "District",
            code: "00232563",
            id: 1,
            region: {
                name: "Greater Accra",
                code: "002325",
                id: 1
            }
        }
    ],
    cities: [
        {
            name: "City",
            code: "02157878",
            id: 1,
            district: {
                name: "District",
                code: "00232563",
                id: 1,
                region: {
                    name: "Greater Accra",
                    code: "002325",
                    id: 1
                }
            }
        }
    ]
};

export class BranchRegionApi{
    static list(params){
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({data: db.regions,
                    meta: {
                    pagination: {
                        total: db.regions.length,
                        perPage: 20,
                        currentPage: 1,
                        nextPage: false,
                        previousPage: false
                    }}});
            }, delay);
        });
    }
}

export class BranchDistrictApi{
    static list(params){
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({data: db.districts,
                    meta: {
                    pagination: {
                        total: db.districts.length,
                        perPage: 20,
                        currentPage: 1,
                        nextPage: false,
                        previousPage: false
                    }}});
            }, delay);
        });
    }

    static add(data){
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({added: true});
            }, delay);
        });
    }

    static edit(district, data){
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({updated: true});
            }, delay);
        });
    }

    static delete(district){
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({deleted: true});
            }, delay);
        });
    }
}

export class BranchCityApi{
    static list(params){
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({data: db.cities,
                    meta: {
                    pagination: {
                        total: db.cities.length,
                        perPage: 20,
                        currentPage: 1,
                        nextPage: false,
                        previousPage: false
                    }}});
            }, delay);
        });
    }

    static add(data){
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({added: true});
            }, delay);
        });
    }

    static edit(district, data){
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({updated: true});
            }, delay);
        });
    }

    static delete(district){
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({deleted: true});
            }, delay);
        });
    }
}