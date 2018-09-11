import delay from './delay';

const db = {
    gates: [
        {id: 1, name: 'Users'},
        {id: 2, name: 'Beneficiaries'},
        {id: 3, name: 'Devices'},
    ],
    entities: [
        {id: 1, name: 'User'},
        {id: 2, name: 'Beneficiary'},
        {id: 3, name: 'Device'}
    ],
    actions: [
        {id: 1, name: 'add'},
        {id: 2, name: 'edit'},
        {id: 3, name: 'delete'},
    ]
};

export default class RoleDependencyApi{
    static gates(params){
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(db.gates);
            }, delay);
        });
    }

    static entities(params){
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(db.entities);
            }, delay);
        });
    }

    static actions(params){
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(db.actions);
            }, delay);
        });
    }
}