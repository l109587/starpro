import request from '@/utils/request'

export async function getTopLevelCategories(params = {}) {
  return request('/console/GetTopLevelCategories', {
    method: 'GET',
    params,
  })
}

export async function getCategories(params = {}) {
  return request('/console/GetCategories', {
    method: 'GET',
    params,
  })
}

export async function getCategoriesCountStat(params = {}) {
  return request('/console/GetCategoriesCountStat', {
    method: 'GET',
    params,
  })
}

export async function getTopTags(params = {}) {
  return request('/console/GetTopTags', {
    method: 'GET',
    params,
  })
}

export async function getCategoryApisDistribution(params = {}) {
  return request('/console/GetCategoryApisDistribution', {
    method: 'GET',
    params,
  })
}

export async function getCategoryApis(params = {}) {
  return request('/console/GetCategoryApis', {
    method: 'GET',
    params,
  })
}

export async function getUnclassifiedApis(params = {}) {
  return request('/console/GetUnclassifiedApis', {
    method: 'GET',
    params,
  })
}

export async function getCategoryApiTagsClustered(params = {}) {
  return request('/console/GetCategoryApiTagsClustered', {
    method: 'GET',
    params,
  })
}

export async function getCategoryApiTagEntitiesClustered(params = {}) {
  return request('/console/GetCategoryApiTagEntitiesClustered', {
    method: 'GET',
    params,
  })
}

export async function deleteCategoryApis(data = {}, params = {}) {
  return request('/console/DeleteCategoryApis', {
    method: 'POST',
    data,
    params,
  })
}

export async function createCategory(data = {}, params = {}) {
  return request('/console/CreateCategory', {
    method: 'POST',
    data,
    params,
  })
}

export async function renameCategory(data = {}, params = {}) {
  return request('/console/RenameCategory', {
    method: 'POST',
    data,
    params,
  })
}

export async function deleteCategory(data = {}, params = {}) {
  return request('/console/DeleteCategory', {
    method: 'POST',
    data,
    params,
  })
}

export async function addApisToCategory(data = {}, params = {}) {
  return request('/console/AddApisToCategory', {
    method: 'POST',
    data,
    params,
  })
}
