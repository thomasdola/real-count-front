import delay from './delay';

// const resp = {
//     level: 'country',
//     entity: 'beneficiaries',
//     data: {
//         total: 1200,
//         valid: 200
//     }
// };

// const resp = {
//     level: 'region',
//     name: 'GREATER ACCRA',
//     entity: 'chart',
//     data: [
//         {name: 'Week A', beneficiaries: 4000, attendance: 2400},
//         {name: 'Week B', beneficiaries: 3000, attendance: 1398},
//         {name: 'Week C', beneficiaries: 2000, attendance: 9800},
//         {name: 'Week D', beneficiaries: 2780, attendance: 3908},
//     ]
// };

const db = {
    data: {
        regions: [
            {
                name: 'WESTERN',
                beneficiaries: {
                    valid: 20,
                    total: 2000
                },
                attendance: 20,
                chart: [
                    {name: 'Week A', beneficiaries: 4000, attendance: 2400},
                    {name: 'Week B', beneficiaries: 3000, attendance: 1398},
                    {name: 'Week C', beneficiaries: 2000, attendance: 9800},
                    {name: 'Week D', beneficiaries: 2780, attendance: 3908},
                ]
            },
            {
                name: 'CENTRAL',
                beneficiaries: {
                    valid: 20,
                    total: 2000
                },
                attendance: 20,
                chart: [
                    {name: 'Week A', beneficiaries: 4000, attendance: 2400},
                    {name: 'Week B', beneficiaries: 3000, attendance: 1398},
                    {name: 'Week C', beneficiaries: 2000, attendance: 9800},
                    {name: 'Week D', beneficiaries: 2780, attendance: 3908},
                ]
            },
            {
                name: 'Greater Accra',
                beneficiaries: {
                    valid: 20,
                    total: 2000
                },
                attendance: 20,
                chart: [
                    {name: 'Week A', beneficiaries: 4000, attendance: 2400},
                    {name: 'Week B', beneficiaries: 3000, attendance: 1398},
                    {name: 'Week C', beneficiaries: 2000, attendance: 9800},
                    {name: 'Week D', beneficiaries: 2780, attendance: 3908},
                ]
            },
            {
                name: 'VOLTA',
                beneficiaries: {
                    valid: 20,
                    total: 2000
                },
                attendance: 20,
                chart: [
                    {name: 'Week A', beneficiaries: 4000, attendance: 2400},
                    {name: 'Week B', beneficiaries: 3000, attendance: 1398},
                    {name: 'Week C', beneficiaries: 2000, attendance: 9800},
                    {name: 'Week D', beneficiaries: 2780, attendance: 3908},
                ]
            },
            {
                name: 'Western',
                beneficiaries: {
                    valid: 20,
                    total: 2000
                },
                attendance: 20,
                chart: [
                    {name: 'Week A', beneficiaries: 4000, attendance: 2400},
                    {name: 'Week B', beneficiaries: 3000, attendance: 1398},
                    {name: 'Week C', beneficiaries: 2000, attendance: 9800},
                    {name: 'Week D', beneficiaries: 2780, attendance: 3908},
                ]
            },
            {
                name: 'ASHANTI',
                beneficiaries: {
                    valid: 20,
                    total: 2000
                },
                attendance: 20,
                chart: [
                    {name: 'Week A', beneficiaries: 4000, attendance: 2400},
                    {name: 'Week B', beneficiaries: 3000, attendance: 1398},
                    {name: 'Week C', beneficiaries: 2000, attendance: 9800},
                    {name: 'Week D', beneficiaries: 2780, attendance: 3908},
                ]
            },
            {
                name: 'BRONG AHAFO',
                beneficiaries: {
                    valid: 20,
                    total: 2000
                },
                attendance: 20,
                chart: [
                    {name: 'Week A', beneficiaries: 4000, attendance: 2400},
                    {name: 'Week B', beneficiaries: 3000, attendance: 1398},
                    {name: 'Week C', beneficiaries: 2000, attendance: 9800},
                    {name: 'Week D', beneficiaries: 2780, attendance: 3908},
                ]
            },
            {
                name: 'NORTHERN',
                beneficiaries: {
                    valid: 20,
                    total: 2000
                },
                attendance: 20,
                chart: [
                    {name: 'Week A', beneficiaries: 4000, attendance: 2400},
                    {name: 'Week B', beneficiaries: 3000, attendance: 1398},
                    {name: 'Week C', beneficiaries: 2000, attendance: 9800},
                    {name: 'Week D', beneficiaries: 2780, attendance: 3908},
                ]
            },
            {
                name: 'UPPER EAST',
                beneficiaries: {
                    valid: 20,
                    total: 2000
                },
                attendance: 20,
                chart: [
                    {name: 'Week A', beneficiaries: 4000, attendance: 2400},
                    {name: 'Week B', beneficiaries: 3000, attendance: 1398},
                    {name: 'Week C', beneficiaries: 2000, attendance: 9800},
                    {name: 'Week D', beneficiaries: 2780, attendance: 3908},
                ]
            },
            {
                name: 'UPPER WEST',
                beneficiaries: {
                    valid: 20,
                    total: 2000
                },
                attendance: 20,
                chart: [
                    {name: 'Week A', beneficiaries: 4000, attendance: 2400},
                    {name: 'Week B', beneficiaries: 3000, attendance: 1398},
                    {name: 'Week C', beneficiaries: 2000, attendance: 9800},
                    {name: 'Week D', beneficiaries: 2780, attendance: 3908},
                ]
            }
        ],
        country: {
            beneficiaries: {
                total: 1200,
                valid: 200
            },
            devices: {
                total: 20,
                online: 10
            },
            attendance: {
                daily: 300,
                monthly: 1000
            }
        }
    }
};

export default class DashboardApi{

    static data(){
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({data: db.data});
            }, delay);
        });
    }
}