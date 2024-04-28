import { type Document, type Query } from 'mongoose'
import { type Query as APIQuery, type PaginationQuery } from './helper'

class APIFeatures<T extends Document> {
  query: Query<T[], T>
  queryString: APIQuery
  pagination: PaginationQuery = {}

  constructor(query: Query<T[], T>, queryString: APIQuery) {
    this.query = query
    this.queryString = queryString
  }

  sort(): this {
    const { sortBy, ascending } = this.queryString
    const isAscending = ascending === 'true' || ascending === true

    if (sortBy !== undefined && sortBy !== '') {
      this.query = this.query.sort({ [sortBy]: isAscending ? 1 : -1 })
    }

    this.pagination.sortBy = sortBy
    this.pagination.ascending = isAscending
    return this
  }

  paginate(): this {
    const page = Number(this.queryString.page ?? 1)
    const limit = Number(this.queryString.limit ?? 10)
    const skip = (page - 1) * limit

    this.query = this.query.skip(skip).limit(limit)

    this.pagination.page = page
    this.pagination.limit = limit
    return this
  }

  // Field Limiting ex: -----/user?fields=name,email,address
  // limitFields() {
  //   if (this.queryString.fields) {
  //     const fields = this.queryString.fields.split(',').join(' ')
  //     this.query = this.query.select(fields)
  //   }
  //   return this
  // }
}

export default APIFeatures
