import axios from 'axios';
const csrfToken = document.getElementsByTagName('meta')[0].content;

let instance = axios.create({
    headers: {'X-CSRF-TOKEN': csrfToken}
});

instance.interceptors.response.use(({data}) => data, error => Promise.reject(error));

export default instance;

