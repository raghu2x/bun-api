export interface PaginationQuery {
  page?: number
  size?: number
  limit?: number
  sortBy?: string
  ascending?: boolean | string
}

export interface Query extends PaginationQuery {
  search?: string[]
}

// type QueryType = 'like' | 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte'

type QueryObject = Record<string, any>

const getQuery = (q: string = ''): QueryObject => {
  const [field, queryType, searchTerm] = q.split(' ')

  const regex = new RegExp(searchTerm, 'i')
  switch (queryType) {
    case 'like':
      return { [field]: { $regex: regex } }
    case 'eq':
      return { [field]: searchTerm }
    case 'ne':
      return { [field]: { $ne: searchTerm } }
    case 'gt':
      return { [field]: { $gt: searchTerm } }
    case 'gte':
      return { [field]: { $gte: searchTerm } }
    case 'lt':
      return { [field]: { $lt: searchTerm } }
    case 'lte':
      return { [field]: { $lte: searchTerm } }
    default:
      return {}
  }
}

const queryBuilder = (query: string[] = []): QueryObject => {
  const q = query.map(element => {
    const [field, queryType, searchTerm] = element.split(' ')
    if (queryType === 'gt' || queryType === 'gte' || queryType === 'lt' || queryType === 'lte') {
      const existingQuery = getQuery(`${field} ${queryType} ${searchTerm}`)
      return { $and: [{ [field]: { $exists: true } }, existingQuery] }
    }
    return getQuery(element)
  })
  if (q.length === 0) return {}
  return { $or: q }
}

export { queryBuilder }
