import request from '@/utils/request'

// 查询物料列表
export function listMdItem(query) {
  return request({
    url: '/mes/md/mditem/list',
    method: 'get',
    params: query
  })
}

// 查询物料详细
export function getMdItem(itemId) {
  return request({
    url: '/mes/md/mditem/' + itemId,
    method: 'get'
  })
}

// 新增物料
export function addMdItem(data) {
  return request({
    url: '/mes/md/mditem',
    method: 'post',
    data: data
  })
}

// 修改物料
export function updateMdItem(data) {
  return request({
    url: '/mes/md/mditem',
    method: 'put',
    data: data
  })
}

// 删除物料
export function delMdItem(itemId) {
  return request({
    url: '/mes/md/mditem/' + itemId,
    method: 'delete'
  })
}

// 获取sku关联信息
export function getSkuActiveItems() {
  return request({
    url: '/getActiveItems',
    method: 'post',
  })
}


//修改产线和工序
export function updateActiveItems(data) {
  return request({
    url: '/updateActiveItems',
    method: 'post',
    data: data
  })
}
