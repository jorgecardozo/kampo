// Models
import { Application } from './Application.model'
import { LoginUser } from './LoginUser.model'
import { Permission } from './Permission.model'
import { PointOfSaleFull } from './PointOfSaleFull.model'
import { PointOfSaleMVP } from './PointOfSaleMVP.model'
import { Request } from './Request.model'
import { RoleFull } from './RoleFull.model'
import { User } from './User.model'
import { UserRequest } from './UserRequest.model'
import { UserMVP } from './UserMVP.model'

export interface AppState {
  usuario: any
  requests: {
    list: Request[]
    selected: Request | null
  }
  pointsOfSales: {
    list: PointOfSaleFull[]
    selected: PointOfSaleFull | null
  }
  users: {
    list: User[]
    selected: UserRequest | null
    applicationSelected: Application
  }
  usersMvp: UserMVP
  pointsOfSalesMvp: PointOfSaleMVP
  user: LoginUser
  applications: {
    list: Application[]
    selected: Application
  }
  roles: {
    list: RoleFull[]
  }
  permissions: {
    list: Permission[]
  }
  tabs: { [key: string]: string }
}
