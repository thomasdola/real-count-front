import delay from './delay';


const scheduled = true;

export default class EnrolmentApi{
    static checkBid(data){
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({valid: true, bid: 'ZGH1234567', official: {
                    region: 3, district: 28, location: 373, module: 1, rank: 2
                }});
            }, delay);
        });
    }

    static enrol(data){
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({beneficiary: "fakdlfkajskdfjkalsdjj", scheduled});
            }, delay);
        });
    }
}