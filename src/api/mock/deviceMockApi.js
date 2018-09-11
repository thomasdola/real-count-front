import delay from './delay';
import _find from 'lodash/find';
import format from 'date-fns/format';

const db = {
    devices: [
        {
            code: "000000000000000",
            uuid: "jfakdjfkajdk",
            name: "Device @ MADINA",
            supervisor: {
                uuid: "jfakdjflah",
                full_name: "John Doe",
                type: 'user'
            },
            assistants: 1,
            district: "District",
            status: "online",
            active: true,
            date: format(new Date(), 'YYYY/MM/DD')
        },
        {
            code: "000005236500000",
            uuid: "jfakdjfkbjdk",
            name: "Device @ AMASAMAN",
            supervisor: {
                uuid: "jfakdjflvh",
                full_name: "Jane Doe",
                type: 'beneficiary'
            },
            assistants: 1,
            district: "District",
            status: "offline",
            active: true,
            date: format(new Date(), 'YYYY/MM/DD')
        },
        {
            code: "000005236500000",
            uuid: "jfakdjfkbjdk",
            name: "Device @ POKUASE",
            supervisor: null,
            assistants: 0,
            district: "N/A",
            status: "offline",
            active: false,
            date: format(new Date(), 'YYYY/MM/DD')
        }
    ],
    logs: [
        {
            date: "12 jan 2012",
            in: "04:30 am",
            out: "02:00 pm"
        },
        {
            date: "12 jan 2012",
            in: "04:30 am",
            out: "02:00 pm"
        },
        {
            date: "12 jan 2012",
            in: "04:30 am",
            out: "02:00 pm"
        },
        {
            date: "12 jan 2012",
            in: "04:30 am",
            out: "02:00 pm"
        },
        {
            date: "12 jan 2012",
            in: "04:30 am",
            out: "02:00 pm"
        },
        {
            date: "12 jan 2012",
            in: "04:30 am",
            out: "02:00 pm"
        },
        {
            date: "12 jan 2012",
            in: "04:30 am",
            out: "02:00 pm"
        },
        {
            date: "12 jan 2012",
            in: "04:30 am",
            out: "02:00 pm"
        },
        {
            date: "12 jan 2012",
            in: "04:30 am",
            out: "02:00 pm"
        },
        {
            date: "12 jan 2012",
            in: "04:30 am",
            out: "02:00 pm"
        },
        {
            date: "12 jan 2012",
            in: "04:30 am",
            out: "02:00 pm"
        },
        {
            date: "12 jan 2012",
            in: "04:30 am",
            out: "02:00 pm"
        },
        {
            date: "12 jan 2012",
            in: "04:30 am",
            out: "02:00 pm"
        }
    ],
    assistants: [
        {uuid: 'fjaldfjalsdf', name: 'John Doe', type: 'user', location: "Location"},
        {uuid: 'uiorehfadhfl', name: 'Jane Doe', type: 'beneficiary', location: "Location"},
    ],
    operators: [
        {uuid: 'fjaldfjalsdf', name: 'John Doe', type: 'user', available: true, assistant: false},
        {uuid: 'uiorehfadhfl', name: 'Jane Doe', type: 'beneficiary', available: true, assistant: true},
        {uuid: 'pmafsdeyrehf', name: 'Jane Fish', type: 'beneficiary', available: false, assistant: false},
    ]
};

export default class DeviceApi {
    static list(params){
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({data: db.devices, meta: {
                    pagination: {
                        total: db.devices.length,
                        per_page: 30,
                        current_page: 1,
                        total_pages: 20
                    }
                }});
            }, delay);
        });
    }

    static logs(device, params){
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({data: db.logs, meta: {
                    pagination: {
                        total: db.logs.length,
                        per_page: 15,
                        current_page: 1,
                        total_pages: 20
                    }
                    }});
            }, delay);
        });
    }

    static single(device){
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(_find(db.devices, {uuid: device}));
            }, delay);
        });
    }

    static assistants(device){
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(db.assistants);
            }, delay);
        });
    }

    static deviceOperators(){
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(db.operators);
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

    static map(device, data){
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({mapped: true});
            }, delay);
        });
    }

    static edit(device, data){
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({updated: true});
            }, delay);
        });
    }

    static delete(device){
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({deleted: true});
            }, delay);
        });
    }

    static addAssistant(device, data){
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({added: true});
            }, delay);
        });
    }

    static removeAssistant(device, data){
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({removed: true});
            }, delay);
        });
    }
}