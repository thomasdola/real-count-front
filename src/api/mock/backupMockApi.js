import delay from './delay';

const db = {
    backups: [
        { name: "Bad Backup name",
            date: "12/12/1992", health: 0,
            url: 'https://github.com/chris1610/pbpython/blob/master/output/sales-report.xlsx' },
        { name: "Backup name",
            date: "12/12/1992", health: 1,
            url: 'https://github.com/chris1610/pbpython/blob/master/output/sales-report.xlsx' },
        { name: "Healthy Backup name",
            date: "12/12/1992", health: 2,
            url: 'https://github.com/chris1610/pbpython/blob/master/output/sales-report.xlsx' },
    ],
    schedules: [
        { id: 1, frequency: "Daily", active: true },
        { id: 2, frequency: "Weekly", active: true },
        { id: 3, frequency: "Monthly", active: false },
        { id: 4, frequency: "Quarterly", active: false },
    ]
};

const scheduled = true;

export default class BackupApi{
    static list(params){
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(
                    {data: db.backups,
                        pagination:{
                            total: db.backups.length,
                            per_page: 20,
                            current_page: 1,
                            total_pages: 20,
                        }})
            }, delay);
        });
    }

    static create(data){
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({created: true, scheduled});
            }, delay);
        });
    }

    static download(backup){
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({path: "", name: ""});
            }, delay);
        });
    }

    static delete(backup){
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({deleted: true, scheduled});
            }, delay);
        });
    }

    static restore(backup){
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({restored: true, scheduled: false});
            }, delay);
        });
    }

    static schedules(){
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(db.schedules);
            }, delay);
        });
    }

    static updateSchedule(schedule, data){
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({updated: true});
            }, delay);
        });
    }
}