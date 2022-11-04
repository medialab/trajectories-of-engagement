import ax from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/';



export const checkAuth = (password, id) => {
  return ax({
    method: 'PUT',
    url: `${API_URL}checkauth/${id || ''}`,
    data: {password}
  })
}

const axios = (params, password) => {
  const tok = `doe:${password}`;
  const hash = btoa(tok);
  const Basic = 'Basic ' + hash;
  
  return new Promise((resolve, reject) => {
    ax({
      ...params,
      headers: {
        ...params.headers,
        'Authorization': Basic
      }
    })
      .then(({ data }) => resolve(data))
      .catch(reject)
  })
}

export const getTrajectories = (password) => {
  return axios({
    method: 'GET',
    url: `${API_URL}trajectories`
  }, password)
}

export const getTrajectory = (id, password) => {
  return axios({
    method: 'GET',
    url: `${API_URL}trajectory/${id}`
  }, password)
}

export const createTrajectory = (data, password) => {
  return axios({
    method: 'POST',
    url: `${API_URL}trajectory/${data.id}`,
    data: { data }
  }, password)
}

export const updateTrajectory = (data, password) => {
  return axios({
    method: 'PUT',
    url: `${API_URL}trajectory/${data.id}`,
    data: { data }
  }, password)
}

export const updateTrajectoryPassword = (id, newPassword, password) => {
  return axios({
    method: 'PUT',
    url: `${API_URL}trajectory/password/${id}`,
    data: {password: newPassword}
  }, password)
}

export const deleteTrajectory = (id, password) => {
  return axios({
    method: 'DELETE',
    url: `${API_URL}trajectory/${id}`,
  }, password)
}

