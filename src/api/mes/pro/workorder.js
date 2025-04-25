import request from '@/utils/request'

// 查询生产工单列表
export function listWorkorder(query) {
  return request({
    url: '/mes/pro/workorder/list',
    method: 'get',
    params: query
  })
}

// 查询生产工单详细
export function getWorkorder(workorderId) {
  return request({
    url: '/mes/pro/workorder/' + workorderId,
    method: 'get'
  })
}

//查询生产工单，并携带每个生产工单下生产任务的情况
export function listWithTaskJson(query) {
  return request({
    url: '/mes/pro/workorder/listWithTaskJson',
    method: 'get',
    params: query
  })
}

// 新增生产工单
export function addWorkorder(data) {
  return request({
    url: '/mes/pro/workorder',
    method: 'post',
    data: data
  })
}

// 修改生产工单
export function updateWorkorder(data) {
  return request({
    url: '/mes/pro/workorder',
    method: 'put',
    data: data
  })
}

// 删除生产工单
export function delWorkorder(workorderId) {
  return request({
    url: '/mes/pro/workorder/' + workorderId,
    method: 'delete'
  })
}

// 查询物料依赖列表
export function listItems(query) {
  return request({
    url: '/mes/pro/workorder/listItems',
    method: 'get',
    params: query
  })
}

export function dofinish(workorderId){
  return request({
    url: '/mes/pro/workorder/'+workorderId,
    method: 'put'
  })
}

// 查询生产计划单
export function getProductPlan(query) {
  return request({
    url: '/productionOrders/returnProductionOrder',
    method: 'post',
    params: query
  })
}


// 批量修改生产工单
export function updateorderWork(data) {
  return request({
    url: '/productionWorks/updateorderWork',
    method: 'post',
    data: data
  })
}

//修改备注-生产计划
export function updateremack(data) {
  return request({
    url: '/productionOrders/updateremack',
    method: 'post',
    params: data
  })
}

//修改备注-生产工单
export function updateremackWork(data) {
  return request({
    url: '/productionWorks/updateremackWork',
    method: 'post',
    params: data
  })
}


//修改上传工单图片
export function updateImg(data) {
  return request({
    url: '/productionWorks/updateImg',
    method: 'post',
    params: data
  })
}

export function img1(data) {
  return request({
    url: '/productionWorks/img1',
    method: 'post',
    data: data
  })
}


export function one(data) {
  return request({
    url: '/productionWorks/one',
    method: 'post',
    params: data,
    responseType: 'blob'
  })
}

