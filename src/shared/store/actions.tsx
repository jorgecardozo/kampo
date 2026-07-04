// Models
import { PointOfSaleFull } from 'models/PointOfSaleFull.model'
import { Approval } from 'models/Approval.model'
import { LoginUser } from 'models/LoginUser.model'
import { Application } from 'models/Application.model'
import { Permission } from 'models/Permission.model'
import { Role } from 'models/Role.model'
import { UserRequest } from 'models/UserRequest.model'
import { User } from 'models/User.model'

// Store
import { useAppContext } from 'store'
import * as actions from './actions/index'

const useActions = () => {
  const { dispatch } = useAppContext()

  // Roles
  const obtenerRoles = async () => actions.obtenerRoles()

  // Usuarios
  const obtenerUsuario = async (id: number) => actions.obtenerUsuario(id)
  const editarUsuario = async ({ id, usuario }) =>
    actions.editarUsuario({ id, usuario })
  const subirImagen = async ({ id, formData }) =>
    actions.subirImagen({ id, formData })

  // Approval
  const getRequests = async (page: number, size: number, query: string) =>
    actions.getRequests(dispatch, page, size, query)
  const rejectRequest = async (payload: Approval) =>
    actions.rejectRequest(payload)
  const setSelectedRequest = async (payload: Approval) =>
    actions.setSelectedRequest(dispatch, payload)
  const approveRequest = async (
    request: Approval,
    pointOfSalesIds: Array<number>
  ) => actions.approveRequest(request, pointOfSalesIds)

  // Upload
  const uploadDocumentPointsOfSales = async (payload: { data: FormData }) =>
    actions.uploadDocumentPointsOfSales(dispatch, payload)
  const uploadDocumentUsers = async (payload: { data: FormData }) =>
    actions.uploadDocumentUsers(dispatch, payload)

  // Download
  const downloadDocumentPointOfSale = async () =>
    actions.downloadDocumentPointOfSale()
  const downloadDocumentUser = async () => actions.downloadDocumentUser()

  // User data
  const setUserData = (payload: LoginUser) =>
    actions.setUserData(dispatch, payload)
  const clearUserData = () => actions.clearUserData(dispatch)
  const setSelectedUser = async (payload: User) =>
    actions.setSelectedUser(dispatch, payload)

  // Points of sales Full
  const getPointsOfSales = async (
    page: number,
    size: number,
    query: string,
    active = null
  ) => actions.getPointsOfSales(dispatch, page, size, query, active)
  const getPointsOfSalesCodes = async (query: string) =>
    actions.getPointsOfSalesCodes(query)
  const setSelectedPointOfSale = async (payload: PointOfSaleFull) =>
    actions.setSelectedPointOfSale(dispatch, payload)
  const setPointOfSalesStatus = async (payload: PointOfSaleFull) =>
    actions.setPointOfSalesStatus(payload)
  const editPointOfSale = async (payload: PointOfSaleFull) =>
    actions.editPointOfSale(payload)
  const deletePointOfSale = async (payload: PointOfSaleFull) =>
    actions.deletePointOfSale(payload)
  const addPointOfSale = async (payload: PointOfSaleFull) =>
    actions.addPointOfSale(payload)
  const downloadPointsOfSale = async (type: string) =>
    actions.downloadPointsOfSale(type)

  // Applications
  const getApplications = async (includeInactive = true) =>
    actions.getApplications(dispatch, includeInactive)
  const setApplicationSelected = async (application: Application) =>
    actions.setApplicationSelected(dispatch, application)

  // Application
  const addApplication = async (application: Application) =>
    actions.addApplication(application)
  const editApplication = async (application: Application) =>
    actions.editApplication(application)
  const deleteApplication = async (application: Application) =>
    actions.deleteApplication(application)
  const setApplicationStatus = async (appCode: string) =>
    actions.setApplicationStatus(appCode)

  // Users
  const getUsers = async (
    code: string,
    page: number,
    size: number,
    query: string
  ) => actions.getUsers(dispatch, code, page, size, query)
  const addUser = async (payload: UserRequest) => actions.addUser(payload)
  const editUser = async (appCode: string, user: User) =>
    actions.editUser(appCode, user)
  const editUserRoles = async (
    appCode: string,
    userId: number | string,
    roles: Array<string>
  ) => actions.editUserRoles(appCode, userId, roles)
  const setApplicationSelectedInUsers = async (application: Application) =>
    actions.setApplicationSelectedInUsers(dispatch, application)
  const setUserStatus = async (appCode: string, user: User) =>
    actions.setUserStatus(appCode, user)
  const getUser = async (
    appCode: string,
    user: User,
    includePointsOfSale: boolean
  ) => actions.getUser(appCode, user, includePointsOfSale)
  const editUserPointsOfSales = async (
    user: User,
    pointOfSalesIds: Array<number>
  ) => actions.editUserPointsOfSales(user, pointOfSalesIds)
  const downloadUsers = async (appCode: string, type: string) =>
    actions.downloadUsers(appCode, type)

  // Roles
  const getRoles = async (code: string) => actions.getRoles(dispatch, code)

  // Role
  const editRole = async (appCode: string, role: Role) =>
    actions.editRole(appCode, role)
  const deleteRole = async (appCode: string, role: Role) =>
    actions.deleteRole(appCode, role)
  const addRole = async (appCode: string, role: Role) =>
    actions.addRole(appCode, role)

  // Permissions
  const getPermissions = async (code: string) =>
    actions.getPermissions(dispatch, code)
  const editPermissions = async (
    appCode: string,
    roleCode: string,
    permissions: Array<{ permission_code: string; granted: boolean }>
  ) => actions.editPermissions(appCode, roleCode, permissions)
  const editUserPermissions = async (
    appCode: string,
    userId: string,
    permissions: Array<{ permission_code: string; granted: boolean }>
  ) => actions.editUserPermissions(appCode, userId, permissions)

  // Permission
  const editPermission = async (
    appCode: string,
    permissionCode: string,
    permission: Permission
  ) => actions.editPermission(appCode, permissionCode, permission)
  const deletePermission = async (appCode: string, permissionCode: string) =>
    actions.deletePermission(appCode, permissionCode)
  const addPermission = async (appCode: string, permission: Permission) =>
    actions.addPermission(appCode, permission)

  // Tabs
  const setTab = async (tabView: string, tabValue: string) =>
    actions.setTab(dispatch, tabView, tabValue)

  // Email
  const forwardEmail = async (email: string, applicationCode: string) =>
    actions.forwardEmail(email, applicationCode)

  // Login
  const login = async (loginData) => actions.login(loginData)

  // Employees
  const getEmployees = async (data) => actions.getEmployees(data)

  // Cajas
  const obtenerCajas = async (data) => actions.obtenerCajas(data)
  const crearCaja = async () => actions.crearCaja()
  const cerrarCaja = async (data) => actions.cerrarCaja(data)

  // Productos
  const obtenerProductos = async (data) => actions.obtenerProductos(data)
  const crearProducto = async (data) => actions.crearProducto(data)
  const actualizarProducto = async (data) => actions.actualizarProducto(data)

  // Calidades
  const obtenerCalidades = async (data) => actions.obtenerCalidades(data)
  const crearCalidad = async (data) => actions.crearCalidad(data)
  const editarCalidad = async (data) => actions.editarCalidad(data)
  const cambiarEstadoCalidad = async (data) => actions.cambiarEstadoCalidad(data)

  // Calidades
  const obtenerMediosDePago = async (data) => actions.obtenerMediosDePago(data)
  const crearMedioDePago = async (data) => actions.crearMedioDePago(data)
  const editarMedioDePago = async (data) => actions.editarMedioDePago(data)
  const cambiarEstadoMedioDePago = async (data) => actions.cambiarEstadoMedioDePago(data)

  // Ventas
  const obtenerVentas = async (data) => actions.obtenerVentas(data)
  const anularVenta = async (data) => actions.anularVenta(data)

  // Stock
  const obtenerStock = async (data) => actions.obtenerStock(data)
  const crearStock = async (data) => actions.crearStock(data)

  // Lotes
  const obtenerLotes = async (data) => actions.obtenerLotes(data)
  const obtenerEstadoLotes = async (data) => actions.obtenerEstadoLotes(data)
  const obtenerOperativoLotes = async (data) => actions.obtenerOperativoLotes(data)
  const dividirLote = async (data) => actions.dividirLote(data)

  // Proveedores
  const obtenerProveedores = async (data) => actions.obtenerProveedores(data)
  const crearProveedor = async (data) => actions.crearProveedor(data)
  const actualizarProveedor = async (data) => actions.actualizarProveedor(data)

  // Proveedores
  const obtenerClientes = async (data) => actions.obtenerClientes(data)
  const crearCliente = async (data) => actions.crearCliente(data)
  const actualizarCliente = async (data) => actions.actualizarCliente(data)

  // Movimientos Stock
  const obtenerMovimientosStock = async (data) =>
    actions.obtenerMovimientosStock(data)

  // Employee
  const createEmployee = async (employee: any) =>
    actions.createEmployee(employee)
  const updateEmployee = async (employee: any) =>
    actions.updateEmployee(employee)
  const deleteEmployee = async (employeeId) =>
    actions.deleteEmployee(employeeId)

  // Harvests
  const getHarvests = async (data) => actions.getHarvests(data)

  // harvestById
  const getHarvestById = async (baggingId) => actions.getHarvestById(baggingId)

  // Harvest
  const createHarvest = async (harvest: any) => actions.createHarvest(harvest)
  const updateHarvest = async (harvest: any) => actions.updateHarvest(harvest)
  const deleteHarvest = async (harvestId) => actions.deleteHarvest(harvestId)

  // Bag prices
  const getBagPrices = async (data) => actions.getBagPrices(data)

  // BagPrice
  const createBagPrice = async (bagPrice: any) =>
    actions.createBagPrice(bagPrice)
  const updateBagPrice = async (bagPrice: any) =>
    actions.updateBagPrice(bagPrice)
  const deleteBagPrice = async (bagPriceId) =>
    actions.deleteBagPrice(bagPriceId)

  // Products
  const getProducts = async (page = null, size = null, query = '') =>
    actions.getProducts(page, size, query)

  // LaborUnits
  const getLaborUnits = async (data) => actions.getLaborUnits(data)

  // BagTypes
  const getBagTypes = async (data) => actions.getBagTypes(data)

  // BagType
  const createBagType = async (bagType: any) => actions.createBagType(bagType)
  const updateBagType = async (bagType: any) => actions.updateBagType(bagType)
  const deleteBagType = async (bagTypeId) => actions.deleteBagType(bagTypeId)

  // BagSizes
  const getBagSizes = async (data) => actions.getBagSizes(data)

  // BagSize
  const createBagSize = async (bagSize: any) => actions.createBagSize(bagSize)
  const updateBagSize = async (bagSize: any) => actions.updateBagSize(bagSize)
  const deleteBagSize = async (bagSizeId) => actions.deleteBagSize(bagSizeId)

  // Baggings
  const getBaggings = async (data) => actions.getBaggings(data)

  // BaggingById
  const getBaggingById = async (baggingId) => actions.getBaggingById(baggingId)

  // Bagging
  const createBagging = async (bagging: any) => actions.createBagging(bagging)
  const updateBagging = async (bagging: any) => actions.updateBagging(bagging)
  const deleteBagging = async (baggingId) => actions.deleteBagging(baggingId)

  // Harvest prices
  const getHarvestPrices = async (data) => actions.getHarvestPrices(data)

  // HarvestPrice
  const createHarvestPrice = async (harvestPrice: any) =>
    actions.createHarvestPrice(harvestPrice)
  const updateHarvestPrice = async (harvestPrice: any) =>
    actions.updateHarvestPrice(harvestPrice)
  const deleteHarvestPrice = async (harvestPriceId) =>
    actions.deleteHarvestPrice(harvestPriceId)

  // Daily prices
  const getDailyPrices = async (data) => actions.getDailyPrices(data)

  // DailyPrice
  const createDailyPrice = async (dailyPrice: any) =>
    actions.createDailyPrice(dailyPrice)
  const updateDailyPrice = async (dailyPrice: any) =>
    actions.updateDailyPrice(dailyPrice)
  const deleteDailyPrice = async (dailyPriceId) =>
    actions.deleteDailyPrice(dailyPriceId)

  // DailyWorks
  const getDailyWorks = async (data) => actions.getDailyWorks(data)

  // DailyWorkById
  const getDailyWorkById = async (dailyWorkId) =>
    actions.getDailyWorkById(dailyWorkId)

  // DailyWork
  const createDailyWork = async (dailyWork: any) =>
    actions.createDailyWork(dailyWork)
  const updateDailyWork = async (dailyWork: any) =>
    actions.updateDailyWork(dailyWork)
  const deleteDailyWork = async (dailyWorkId) =>
    actions.deleteDailyWork(dailyWorkId)

  // FarmFields
  const getFarmFields = async (data = {}) => actions.getFarmFields(data)

  // FarmField
  const createFarmField = async (farmField: any) =>
    actions.createFarmField(farmField)
  const updateFarmField = async (farmField: any) =>
    actions.updateFarmField(farmField)
  const deleteFarmField = async (farmFieldId) =>
    actions.deleteFarmField(farmFieldId)

  // PaymentInvoices
  const getPaymentInvoices = async (data) => actions.getPaymentInvoices(data)

  // PaymentInvoice
  const createPaymentInvoice = async (paymentInvoice) =>
    actions.createPaymentInvoice(paymentInvoice)
  const updatePaymentInvoice = async (bagging: any) =>
    actions.updatePaymentInvoice(bagging)

  // UserInvoices
  const getUserInvoices = async (data) => actions.getUserInvoices(data)

  return {
    getRequests,
    uploadDocumentPointsOfSales,
    uploadDocumentUsers,
    downloadDocumentPointOfSale,
    downloadDocumentUser,
    setUserData,
    clearUserData,
    getPointsOfSales,
    getPointsOfSalesCodes,
    setPointOfSalesStatus,
    editPointOfSale,
    deletePointOfSale,
    addPointOfSale,
    getApplications,
    setApplicationSelected,
    getUsers,
    getUser,
    addUser,
    editUser,
    editUserRoles,
    setUserStatus,
    setApplicationSelectedInUsers,
    setSelectedUser,
    rejectRequest,
    setSelectedRequest,
    approveRequest,
    editUserPointsOfSales,
    setSelectedPointOfSale,
    getRoles,
    addRole,
    editRole,
    deleteRole,
    getPermissions,
    editPermissions,
    editUserPermissions,
    editPermission,
    addPermission,
    deletePermission,
    addApplication,
    editApplication,
    deleteApplication,
    setApplicationStatus,
    setTab,
    forwardEmail,
    downloadUsers,
    downloadPointsOfSale,
    login,
    getEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    getBaggings,
    getBaggingById,
    getBagPrices,
    createBagPrice,
    updateBagPrice,
    deleteBagPrice,
    getProducts,
    getLaborUnits,
    createBagging,
    updateBagging,
    deleteBagging,
    getBagTypes,
    createBagType,
    updateBagType,
    deleteBagType,
    getBagSizes,
    createBagSize,
    updateBagSize,
    deleteBagSize,
    getHarvests,
    getHarvestById,
    createHarvest,
    updateHarvest,
    deleteHarvest,
    getHarvestPrices,
    createHarvestPrice,
    updateHarvestPrice,
    deleteHarvestPrice,
    getDailyPrices,
    createDailyPrice,
    updateDailyPrice,
    deleteDailyPrice,
    getDailyWorks,
    getDailyWorkById,
    createDailyWork,
    updateDailyWork,
    deleteDailyWork,
    getFarmFields,
    createFarmField,
    updateFarmField,
    deleteFarmField,
    createPaymentInvoice,
    updatePaymentInvoice,
    getPaymentInvoices,
    getUserInvoices,

    obtenerRoles,
    obtenerUsuario,
    editarUsuario,
    subirImagen,
    obtenerCajas,
    crearCaja,
    cerrarCaja,
    obtenerProductos,
    crearProducto,
    actualizarProducto,
    obtenerProveedores,
    crearProveedor,
    actualizarProveedor,
    obtenerClientes,
    crearCliente,
    actualizarCliente,
    obtenerMovimientosStock,
    obtenerCalidades,
    crearCalidad,
    editarCalidad,
    cambiarEstadoCalidad,
    obtenerLotes,
    obtenerEstadoLotes,
    obtenerOperativoLotes,
    dividirLote,
    obtenerVentas,
    anularVenta,
    obtenerStock,
    crearStock,
    obtenerMediosDePago,
    crearMedioDePago,
    editarMedioDePago,
    cambiarEstadoMedioDePago
  }
}

export { useActions }
