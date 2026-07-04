import { useAppContext } from 'store'

const useSelectors = () => {
  const { state } = useAppContext()

  return {
    usuario: state.usuario,
    requests: state.requests.list,
    selectedRequest: state.requests.selected,
    selectedPointOfSale: state.pointsOfSales.selected,
    pointsOfSales: state.pointsOfSales,
    pointsOfSalesMvp: state.pointsOfSalesMvp,
    users: state.users.list,
    applicationSelectedInUser: state.users.applicationSelected,
    selectedUser: state.users.selected,
    usersMvp: state.usersMvp,
    applications: state.applications.list,
    selectedApplication: state.applications.selected,
    roles: state.roles.list,
    permissions: state.permissions.list,
    tabs: state.tabs,
  }
}

export { useSelectors }
