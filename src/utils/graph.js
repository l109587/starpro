/**
 * 在树结构中通过子ID查找父ID
 * @param {object} treeData
 * @param {string} childId
 * @returns {string}
 */
export function findParentIdByChildId(treeData, childId) {
  console.log(treeData, '---', childId)
  let parentId = null
  const rootData = [treeData]
  const rev = (list) => {
    const matched = list.forEach(({ id }) => id === childId)
    if (matched) {
    }
  }
  rev(rootData)

  return parentId
}
