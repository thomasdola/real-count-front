import delay from './delay';


const db = {
    roles: [
        {
            id: 1,
            name: "Management",
            users: 2,
            uuid: "jfaldjfalsd",
            policies: 1,
            description: '',
            level: {type: 'Region', id: 3}
        },
        {
            id: 2,
            name: "Operation @ DISTRICT",
            users: 0,
            uuid: "ytwrhjfhakdjfh",
            policies: 1,
            description: '',
            level: {type: 'District', id: 23}
        }
    ]
};

export default class RoleApi{
    static list(params){
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({
                    data: db.roles,
                    meta: {
                        pagination: {
                            total: db.roles.length,
                            perPage: 20,
                            currentPage: 1,
                            nextPage: false,
                            previousPage: false
                        }
                    }
                });
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

    static edit(role, data){
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({updated: true});
            }, delay);
        });
    }

    static delete(role){
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({deleted: true});
            }, delay);
        });
    }
}