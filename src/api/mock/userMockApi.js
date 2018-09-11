import delay from './delay';

const db = {
    users: [
        {
            id: 1,
            uuid: "fjaldjflasdf",
            name: "Jane Doe",
            username: "janedoe@email.com",
            role: {
                id: 1,
                uuid: 'kfajkdjfl',
                name: 'MANAGEMENT'
            },
            status: "active"
        },
        {
            id: 2,
            uuid: "fjaldjhhjasdf",
            name: "John Doe",
            username: 'johndoe@email.com',
            role: {
                id: 1,
                uuid: 'jfaksdflanv',
                name: 'MANAGEMENT'
            },
            status: "active"
        },
        {
            id: 3,
            uuid: "jfakddjfalkd",
            name: "John Fish",
            username: 'johnfish@email.com',
            pin: '1234',
            role: {
                id: 2,
                uuid: 'fkjkldsfa',
                name: 'Operation @ DISTRICT'
            },
            status: "inactive"
        }
    ],
    danglingUsers: [
        {
            id: 1,
            uuid: "urajfangaud",
            name: "Jane Pop",
            status: "dangling"
        },
        {
            id: 2,
            uuid: "pmmgdfaureh",
            name: "John Pop",
            status: "dangling"
        },
    ]
};

export default class UserApi{
    static list(params){
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({
                    data: params['f'] === 'dangling|1' ? db.danglingUsers : db.users,
                    meta: {
                        pagination: {
                            total: db.users.length,
                            per_page: 20,
                            current_page: 1,
                            total_pages: 20
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

    static edit(user, data){
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({updated: true});
            }, delay);
        });
    }

    static delete(user){
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({deleted: true});
            }, delay);
        });
    }
}