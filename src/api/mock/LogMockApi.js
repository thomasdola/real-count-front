import delay from './delay';

const db = {
    logs: [
        {
            date: "12/12/1992",
            time: "05:20 pm",
            user: {
                uuid: "fjkdjflkajskd",
                full_name: "Jane Doe",
                role: {
                    uuid: "jfkasjdlkffda",
                    name: "IT"
                }
            },
            entity: "User",
            action: "Delete ✔"
        },
        {
            date: "12/12/1992",
            time: "05:20 pm",
            user: {
                uuid: "jfkadjflkasd",
                full_name: "John Doe",
                role: {
                    uuid: "jfkadjflk",
                    name: "Accounting"
                }
            },
            entity: "Report On Beneficiaries",
            action: "Generate ✔"
        },
        {
            date: "12/12/1992",
            time: "05:20 pm",
            user: {
                uuid: "fjakdjflas",
                full_name: "Jean Fish",
                role: {
                    uuid: "falsdkjfalkd",
                    name: "Management"
                }
            },
            entity: "Report On Beneficiaries",
            action: "Generate ✗"
        },
    ]
};

export default class BackupApi{
    static list(params){
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({data: db.logs, meta: {
                        pagination:
                            {
                                total: db.logs.length,
                                per_page: 20,
                                current_page: 1,
                                total_pages: 20,
                            }
                    }})
            }, delay);
        });
    }

    static export(params){
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({
                    path: "chris1610/pbpython/blob/master/output/sales-report.xlsx",
                    url: "https://github.com/chris1610/pbpython/blob/master/output/sales-report.xlsx"});
            }, delay);
        });
    }
}