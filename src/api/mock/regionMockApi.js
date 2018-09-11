import delay from './delay';

const db = {
    regions: [
        {
            id: 1,
            name: 'Greater Accra',
            code: '001'
        },
        {
            id: 2,
            name: 'Volta',
            code: '002'
        }
    ]
};

export default class RegionApi {
    static all(){
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(db.regions)
            }, delay);
        });
    }
}