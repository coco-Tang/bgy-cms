import request from '@/utils/request'
const url = "/importvoice/task";

export function getUser(params) {
  return request({
    url: "/user/findAllUser",
    method: 'GET',
    params
  })
}

export function createUser(params) {
  return request({
    url: '/user/register',
    method: 'POST',
    params
  })
}

export function resetUser(params) {
  return request({
    url: '/user/resetPwd',
    method: 'PUT',
    params
  })
}

export function deleteUser(id) {
  return request({
    url: `/user/deleteById/${id}`,
    method: 'DELETE'
  })
}

export function validTaskid() {
  return request({
    url: "/importvoice/batchids",
    method: 'GET'
  })
}

export function validTaskname() {
  return request({
    url: "/importvoice/batchnames",
    method: 'GET'
  })
}
