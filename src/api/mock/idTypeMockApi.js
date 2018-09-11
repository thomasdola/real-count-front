import delay from './delay';

const db = {
    types: [
        {
            id: 1,
            name: 'National ID'
        },
        {
            id: 2,
            name: 'Voter ID'
        }
    ]
};

export default class IDTypeApi {
    static all(){
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(db.types)
            }, delay);
        });
    }
}