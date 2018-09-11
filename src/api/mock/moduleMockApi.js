import delay from './delay';

const db = {
    modules: [
        {
            id: 1,
            name: 'GYEDA',
        }
    ]
};

export default class ModuleApi {
    static all(){
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(db.modules)
            }, delay);
        });
    }
}