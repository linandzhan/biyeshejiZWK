import axios from '@/framework/http/axios'
const model = 'area';
let getUrl = `api/${model}/get`;
let searchUrl = `api/${model}/searchAreaIsSpare`;
let countUrl = `api/${model}/count`;
let deleteUrl = `api/${model}/delete`;
let batchDeleteUrl = `api/${model}/delete`;
let enableUrl = `api/${model}/enable`;
let disableUrl = `api/${model}/disable`;
let saveUrl = `api/${model}/save`
let searchAreaUrl = `api/${model}/searchAreaIsSpare`

export function get(param, callback) {
  axios.post(`api/${model}/get`, param).then(data => {
    if (data !== undefined && data !== '' && data !== null) {
      // callback when data is exist
      callback(data)
    }
  })
}

export function search(param, callback) {
  axios.post(searchUrl, param).then(data => {
    if (data !== undefined && data !== '' && data !== null) {
      // callback when data is exist
      callback(data)
    }
  })
}

export function saveArea(param, callback) {
  axios.post(saveUrl, param).then(data => {
    if (data !== undefined && data !== '' && data !== null) {
      // callback when data is exist
      callback(data)
    }
  })
}

export function searchArea(param, callback) {
  axios.post(`api/${model}/searchArea`, param).then(data => {
    if (data !== undefined && data !== '' && data !== null) {
      // callback when data is exist
      callback(data)
    }
  })
}

export function areaSearch(param, callback) {
  axios.post(searchAreaUrl, param).then(data => {
    if (data !== undefined && data !== '' && data !== null) {
      // callback when data is exist
      callback(data)
    }
  })
}

export function count(param, callback) {
  axios.post(`api/${model}/count`, param).then(data => {
    if (data !== undefined && data !== '' && data !== null) {
      // callback when data is exist
      callback(data)
    }
  })
}

export function  del(param, callback) {
  axios.post(`api/${model}/delete`, param).then(data => {
    if (data !== undefined && data !== '' && data !== null) {
      // callback when data is exist
      callback(data)
    }
  })
}

export function save(param, callback) {
  axios.post( `api/orders/save`, param).then(data => {
    if (data !== undefined && data !== '' && data !== null) {
      // callback when data is exist
      callback(data)
    }
  })
}searchUserType

export function searchUserType(param, callback) {
  axios.post( `api/user/searchUserType`, param).then(data => {
    if (data !== undefined && data !== '' && data !== null) {
      // callback when data is exist
      callback(data)
    }
  })
}


export function update(param, callback) {
  axios.post(`api/${model}/update`, param).then(data => {
    if (data !== undefined && data !== '' && data !== null) {
      // callback when data is exist
      callback(data)
    }
  })
}


export function periodIdSearch(param,callback) {
  axios.post(`api/period/search`, param).then(data => {
    if (data !== undefined && data !== '' && data !== null) {
      // callback when data is exist
      callback(data)
    }
  })
}
