import delay from './delay';

const db = {
    todayAttendance: [{
        bid: "ZGH123456",
        full_name: "John Doe",
        location: "AMASAMAN",
        in: "05:18 am",
        out: "09:30 am",
        uuid: "fjasdjflajdf"
    }],
    weekAttendance: {
        calendar: [
            {
                time: "12 am",
                monday: null,
                tuesday: null,
                wednesday: null,
                thursday: null,
                friday: null,
                saturday: null,
                sunday: null
            },
            {
                time: "02 am",
                monday: null,
                tuesday: null,
                wednesday: null,
                thursday: null,
                friday: null,
                saturday: null,
                sunday: null
            },
            {
                time: "04 am",
                monday: {time: "05:00 am", in: true},
                tuesday: {time: "05:18 am", in: true},
                wednesday: null,
                thursday: null,
                friday: {time: "05:03 am", in: true},
                saturday: null,
                sunday: null
            },
            {
                time: "06 am",
                monday: null,
                tuesday: null,
                wednesday: {time: "06:06 am", in: true},
                thursday: {time: "07:12 am", in: true},
                friday: null,
                saturday: null,
                sunday: null
            },
            {
                time: "08 am",
                monday: null,
                tuesday: null,
                wednesday: null,
                thursday: null,
                friday: {time: "09:18 pm", in: false},
                saturday: {time: "08:24 am", in: true},
                sunday: null
            },
            {
                time: "10 am",
                monday: null,
                tuesday: null,
                wednesday: {time: "11:03 pm", in: false},
                thursday: null,
                friday: null,
                saturday: null,
                sunday: null
            },
            {
                time: "12 pm",
                monday: {time: "12:18 pm", in: false},
                tuesday: {time: "12:04 pm", in: false},
                wednesday: null,
                thursday: {time: "1:12 pm", in: false},
                friday: null,
                saturday: {time: "12:18 pm", in: true},
                sunday: null
            },
            {
                time: "02 pm",
                monday: null,
                tuesday: null,
                wednesday: null,
                thursday: null,
                friday: null,
                saturday: null,
                sunday: null
            },
            {
                time: "04 pm",
                monday: null,
                tuesday: null,
                wednesday: null,
                thursday: null,
                friday: null,
                saturday: null,
                sunday: null
            },
            {
                time: "06 pm",
                monday: null,
                tuesday: null,
                wednesday: null,
                thursday: null,
                friday: null,
                saturday: null,
                sunday: null
            },
            {
                time: "08 pm",
                monday: null,
                tuesday: null,
                wednesday: null,
                thursday: null,
                friday: null,
                saturday: null,
                sunday: null
            },
            {
                time: "10 pm",
                monday: null,
                tuesday: null,
                wednesday: null,
                thursday: null,
                friday: null,
                saturday: null,
                sunday: null
            }
        ],
        chart: [
            {day: 'Mon', in: '05:10 am', out: '05:45 pm', duration: 3},
            {day: 'Tue', in: '05:45 am', out: '12:07 pm', duration: 4},
            {day: 'Wed', in: '06:10 am', out: '11:16 am', duration: 7},
            {day: 'Thu', in: '07:20 am', out: '01:20 pm', duration: 5},
            {day: 'Fri', in: '05:06 am', out: '09:30 am', duration: 2},
            {day: 'Sat', in: '08:40 am', out: '12:30 pm', duration: 3},
            {day: 'Sun', in: null, out: null, duration: 0},
        ]
    }
};

export default class AttendanceApi{
    static todayAttendance(params){
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({data: db.todayAttendance,
                    meta: {
                    pagination: {
                        total: db.todayAttendance.length,
                        per_page: 30,
                        current_page: 1,
                        total_pages: 30
                    }}});
            }, delay);
        });
    }

    static beneficiaryWeeklyAttendance(uuid, params){
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(db.weekAttendance);
            }, delay);
        });
    }
}