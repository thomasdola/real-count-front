//@flow
export default class Downloader{
    static fromUrl(url: string, onFileDownloaded: (data: Blob) => void, onFileDownloading: (progress: number) => void){
        let x = new XMLHttpRequest({mozSystem: true});

        x.open("POST", url, true); // CAN BE GET TOO

        x.responseType = 'blob';

        x.onload = () => onFileDownloaded(x.response);

        x.addEventListener('progress', evt => {
            if(evt.lengthComputable) {
                let percentComplete = evt.loaded / evt.total;
                onFileDownloading(percentComplete);
            }
        }, false);

        x.send();
    }

    static futch(url, opts = {}, onProgress) {
        return new Promise( (resolve, reject) => {
            var xhr = new XMLHttpRequest();

            xhr.open(opts.method || 'get', url);

            for (var k in opts.headers||{})
                xhr.setRequestHeader(k, opts.headers[k]);

            xhr.responseType = 'blob';

            xhr.onload = () => resolve(xhr.response);

            xhr.onerror = reject;

            if (xhr.upload && onProgress)
                xhr.upload.onprogress = onProgress; // event.loaded / event.total * 100 ; //event.lengthComputable
            
            xhr.send(opts.body);
        });
    }
}