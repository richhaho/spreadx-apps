import axios_lite from "@/plugins/axios_lite";
import { useUiStore } from "@/store/uiStore";
const uiStore = useUiStore();

import {
  defineStore,
} from "pinia";
import {
  ref,
} from "vue";

const v1 =
  import.meta.env.VITE_API_V1

const v2 =
  import.meta.env.VITE_API_V2


export const useUserStore = defineStore("useUserStore", () => {

  const isUserSaving = ref(false)
  const isPermissionSaving = ref(false)
  const isPermissionDialogue = ref(false);

  const users = ref([])
  const user = ref({})
  const roles = ref([])
  const isRoleSaving = ref(false)
  const userTotal = ref()
  const permissions = ref([])
  const permissionsScopes = ref([])
  const scopeValues = ref([])
  const isDepartmentSaving = ref(false);
  const departments = ref([]);
  const departmentTotal=ref(0)
  const isAddPermissionDialogue = ref(false);
  const isAddDialogue = ref(false);

  const getUsers = (params => {
    axios_lite
      .get(`${v1}/paginated-employees`,
        params,
      )
      .then(response => {
        users.value = response.data.data.data
        userTotal.value = response.data.data.total
      })
      .catch(error => {

      })
  })

  const getUser = (id => {
    axios_lite
      .get(`${v1}employees/${id}`)
      .then(response => {
        user.value = response.data.data
      })
      .catch(error => {

      })
  })



  const getDepartment = (async params => {
    return await axios_lite
      .get(`${v1}/get_department/${params}`, params)
      .then(response => {
        return response;
      })
      .catch(error => {
        isDepartmentSaving.value = false;
        throw error
      })
      .finally(() => {
        isDepartmentSaving.value = false;
      });
  })


  


  const getDepartments = (params => {
    axios_lite
      .get(`${v1}/list_department`, params)
      .then(response => {
        console.log(response.data.data.data)
        departments.value = response.data.data.data;
        departmentTotal.value = response.data.data;
      })
      .catch(error => {

      }).finally()
  })

  const storeDepartment = ( async params => {
    return await axios_lite
      .post(`${v1}/store_new_department`, params)
      .then(response => {
        getDepartments();
        return response.data;
      })
      .catch(error => {
        console.error('Error in storeDepartment:', error);
        isDepartmentSaving.value = false;
        throw error
      })
      .finally(() => {
        isDepartmentSaving.value = false;
      });
  })

  const updateDepartment = (async params => {
    return await axios_lite
      .post(`${v1}/update_department/${params.id}`, params)
      .then(response => {
        uiStore.setSnackBar(true,'success','Department updated Successfully')
        getDepartments();
        return response.data;
      })
      .catch(error => {
        isDepartmentSaving.value = false;
        throw error
      })
      .finally(() => {
        isDepartmentSaving.value = false;
      });
  })

  const storeUser = (params => {
    axios_lite
      .post(`${v1}/employees`,
        params,
      )
      .then(response => {
        console.log();
        if (response.data.status == false){
          uiStore.setSnackBar(true, 'error', response.data.errors.message)
        }else {
          console.log(response.data)
          uiStore.setSnackBar(true, 'success', response.data.message)
          getUsers()
          router.push('list');
        }
      })
      .catch(error => {
        uiStore.setSnackBar(true, 'error', error.response.data.errors.message)
      }).finally(() => isUserSaving.value = false)
  })

  const updateUser = ((params, id) => {
    axios_lite
      .post(`${v1}/employees/${id}`,
        params,
      )
      .then(response => {
        getUsers()
      })
      .catch(error => {
      }).finally(() => isUserSaving.value = false)
  })




  const getRoles = (params => {
    axios_lite
      .get(`${v2}role/list`,
        params,
      )
      .then(response => {
        roles.value = response.data.data
      })
      .catch(error => {
        console.log("=>" + error)
      })
  })

  const getPermissions = (params => {
    axios_lite.get(`${v2}permission/list`,
      { params: params }
    )
      .then(response => {
        permissions.value = response.data.data.data
      })
      .catch(error => {

      })
  })

  const storePermission = (params => {
    axios_lite
      .post(`${v2}permission/add`, params)
      .then(response => {
        isPermissionDialogue.value = false;
        roles.value = response.data.data
      })
      .catch(error => { }).finally(() => isPermissionSaving.value = false)
  })


  const storeUserRole = (params => {
    axios_lite
      .post(`${v2}role/add`, params)
      .then(response => {
        isUserSaving.value = false
        isAddPermissionDialogue.value = false
        isAddDialogue.value = false
        uiStore.setSnackBar(true, 'success', 'Role Saved Successfully')
        getRoles()
      })
      .catch(error => { 
        uiStore.setSnackBar(true, 'error', error)
      })
  })
  function getScopes(params) {
    return axios_lite
      .get(`${v2}permission/scope`, { params: params })
      .then(response => {
        permissionsScopes.value = response.data.data
      })
      .catch(error => { })
  }
  function getValuesByScopeId(params) {
    return axios_lite
      .get(`${v2}permission/get_scope_values`, { params: params })
      .then(response => {
        scopeValues.value = response.data.data
      })
      .catch(error => { })
  }

  return {
    isUserSaving,
    user,
    users,
    userTotal,
    isRoleSaving,
    storeUserRole,
    storeUser,
    getUsers,
    getRoles,
    getUser,
    getPermissions,
    permissions,
    permissionsScopes,
    roles,
    departments,
    isPermissionSaving,
    storePermission,
    isPermissionDialogue,
    isDepartmentSaving,
    getDepartments,
    storeDepartment,
    updateUser,
    getScopes,
    isAddPermissionDialogue,
    isAddDialogue,
    getValuesByScopeId,
    departmentTotal,
    scopeValues,
    updateDepartment,
    getDepartment,
  }
})
