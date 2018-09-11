import delay from './delay';

const getFile = format => format === 'pdf'
    ? "http://www.garudadigitalnet.com/caf.pdf"
    : "https://github.com/chris1610/pbpython/blob/master/output/sales-report.xlsx";

export default class ReportApi {
    static generate({format}){
        const url = getFile(format);
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({url, path: '/sales-report.xlsx'})
            }, delay);
        });
    }
}