import request from '@/utils/request'

// 查询工装夹具类型列表
export function listTooltype(query) {
  return request({
    url: '/mes/tm/tooltype/list',
    method: 'get',
    params: query
  })
}

// 获取SalesOrder的接口数据
export function getSaleOrders(query) {
  return request({
    url: '/sales-orders/getSaleOrders',
    method: 'post',
    params: query
  })
}

// 查询所有工装夹具类型
export function listAllTooltype() {
  return request({
    url: '/mes/tm/tooltype/listAll',
    method: 'get',
  })
}

// 查询工装夹具类型详细
export function getTooltype(toolTypeId) {
  return request({
    url: '/mes/tm/tooltype/' + toolTypeId,
    method: 'get'
  })
}

// 新增工装夹具类型
export function addTooltype(data) {
  return request({
    url: '/mes/tm/tooltype',
    method: 'post',
    data: data
  })
}

// 修改工装夹具类型
export function updateTooltype(data) {
  return request({
    url: '/mes/tm/tooltype',
    method: 'put',
    data: data
  })
}

// 删除工装夹具类型
export function delTooltype(toolTypeId) {
  return request({
    url: '/mes/tm/tooltype/' + toolTypeId,
    method: 'delete'
  })
}

// 下载图片
export function downImage(url) {
  return request({
    url: '/down'+"?url="+url,
    method: 'post'
  })
}

// 改变销售订单状态
export function cgSeller(query) {
  return request({
    url: '/sales-orders/updatePlatformStatus',
    method: 'put',
    params: query
  })
}

// 创建生产工单
export function createOrders(data) {
  return request({
    url: '/productionOrders/createOrder',
    method: 'post',
    data: data
  })
}

//批量改变销售订单
export function updateState(data) {
  return request({
    url: '/sales-orders-sku/updateTongGuo',
    method: 'put',
    data: data
  })
}

//查询销售订单全部数据
export function selectAll() {
  return request({
    url: '/sales-orders-sku/selectAll',
    method: 'get'
  })
}

//查询sku
export function selectsku(data) {
  return request({
    url: 'https://openapi.lingxing.com/basicOpen/multiplatform/shopify/variantList',
    method: 'post',
    params: data
  })
}

//erp接口参数
export function erpParams() {
  return request({
    url: '/erpParams',
    method: 'get'
  })
}

