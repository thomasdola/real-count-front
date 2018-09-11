import delay from './delay';

const db = {
    ranks: [
        {
            id: 1,
            name: 'SWEEPER',
            multiple: true
        },
        {
            id: 2,
            name: 'LEADER',
            multiple: false
        }
    ]
};

export default class RankApi {
    static all(){
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(db.ranks)
            }, delay);
        });
    }
}