import delay from './delay';

const db = {
    groups: [
        {
            uuid: "fjlakdjflkasjdkf",
            name: "Forms for POKUASE table",
            region: {id: 1, name: "Region"},
            district: {id: 1, name: "District"},
            location: {id: 1, name: "Location"},
            module: {id: 1, name: "Module"},
            rank: {id: 1, name: "Rank"},
            count: {
                total: 20,
                enrolled: 15,
                pending: 5
            }
        },
        {
            uuid: "uroqueiorjkfajsd",
            name: "Forms for AMASAMAN table",
            region: {id: 1, name: "Region"},
            district: {id: 1, name: "District"},
            location: {id: 1, name: "Location"},
            module: {id: 1, name: "Module"},
            rank: {id: 1, name: "Rank"},
            count: {
                total: 20,
                enrolled: 20,
                pending: 0
            }
        }
    ],
    file: "https://localhost/storage/file.pdf",
    // file: "https://cauc.edu.gh/images/downloads/ADMISSION%20fORMS%20MATURED%20APPLICANTS.pdf"
};

const scheduled = true;

export default class FormGroupApi {
    static all(queryParams){
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({
                    data: db.groups,
                    meta: {
                        pagination: {
                            total: db.groups.length,
                            perPage: 20,
                            currentPage: 1,
                            nextPage: false,
                            previousPage: false
                        }
                    }
                })
            }, delay);
        });
    }

    static generate(formData){
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({scheduled, url: db.file, name: "Name given to the form", path: "/cat.pdf"});
            }, delay)
        });
    }

    static clearHistory(){
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, delay)
        });
    }

    static reGenerate(formUuid){
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({scheduled, url: db.file, name: "Name given to the form", path: "/caf.pdf"});
            }, delay)
        });
    }
}