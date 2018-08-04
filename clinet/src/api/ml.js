import axios from '../config/axios-client';
function getDefaultData() {
	const res = axios.get('/api/ml/getDefaultData?id=1');
	return new Promise((resolve, reject) => {
		res
			.then((result) => {
				if (result.status === 200) {
					return result.data;
				} else {
					reject(result.status)
				}
			})
			.then((json) => {
				if (json.code === 0) {
					resolve(json.data);
				} else {
					reject(json.message);
				}
			})
			.catch((e) => {
				reject(e.toString());
			})
	})
}

function saveData(data) {
	const res = axios.post('/api/ml/saveData', data);
	return new Promise((resolve, reject) => {
		res
			.then((result) => {
				if (result.status === 200) {
					return result.data;
				} else {
					reject(result.status)
				}
			})
			.then((json) => {
				if (json.code === 0) {
					resolve(json.data);
				} else {
					reject(json.message);
				}
			})
			.catch((e) => {
				reject(e.toString());
			})
	})
}
export { getDefaultData, saveData }