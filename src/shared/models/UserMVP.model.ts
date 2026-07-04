// Models
import { Field } from './Field.model'

export interface UserMVP {
  processed?: number
  ok?: number
  error?: number
  fields?: Field[]
}
