// Models
import { Field } from './Field.model'

export interface PointOfSaleMVP {
  processed?: number
  ok?: number
  error?: number
  fields?: Field[]
}
