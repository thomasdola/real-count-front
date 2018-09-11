import delay from './delay';

const db = {
    policies: [
        {
            id: 1,
            uuid: "fgsfgsfdg",
            name: "Can Edit and Delete Users",
            gate: {id: 1, name: "Users"},
            entity: {id: 1, name: "User"},
            actions: [
                {id: 2, name: "edit"},
                {id: 3, name: "delete"},
            ],
            description: "Can Edit and Delete Users",
            roles: [1]
        },
        {
            id: 2,
            uuid: "irpqejkfjadf",
            name: "Can Add and Delete Devices",
            gate: {id: 3, name: "Devices"},
            entity: {id: 3, name: "Device"},
            actions: [
                {id: 2, name: "add"},
                {id: 3, name: "delete"},
            ],
            description: "Can Add and Delete Devices",
            roles: []
        },
        {
            id: 3,
            uuid: "urqnwerhfasdf",
            name: "Can Use Device",
            gate: {id: 3, name: "Devices"},
            entity: {id: 3, name: "Device"},
            actions: [
                {id: 4, name: "operate"},
            ],
            description: "Users with this policy can OPERATE a Device",
            roles: [2]
        },
    ]
};

export default class PolicyApi{
    static list(params){
        console.log('params', params);
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const policies = params.f === 'role|1'
                    ? [db.policies[0]]
                    : (params.f === "role|2"
                        ? [db.policies[2]]
                        : db.policies);
                resolve(policies);
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

    static edit(policy, data){
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({updated: true});
            }, delay);
        });
    }

    static delete(policy){
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({deleted: true});
            }, delay);
        });
    }
}