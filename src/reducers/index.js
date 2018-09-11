import { combineReducers } from 'redux';
import authUser from './authUserReducer';
import {list as beneficiaries, single as beneficiary, pagination as beneficiariesPagination, bio, loadingBeneficiaries,
    addingBeneficiary, deletingBeneficiary, loadingBeneficiary, updatingBeneficiary, capturingBio} from './beneficiaryReducer';
import {list as countries, single as country} from './countryReducer';
import {list as regions, single as filterRegion, filterList as filterRegions} from './regionReducer';
import {list as districts, single as filterDistrict, filterList as filterDistricts} from './districtReducer';
import {list as locations, single as filterLocation, filterList as filterLocations} from './locationReducer';
import {list as modules} from './moduleReducer';
import {list as ranks} from './rankReducer';
import {list as idTypes} from './idTypeReducer';
import {list as forms,
    single as formPreset,
    pagination as formsPagination,
    clearingHistory, generatingForms, loadingForms, generatingPendingForms, generatedForm} from './formReducer';
import {list as dailyAttendance, weeklyBeneficiaryAttendance, loadingBeneficiaryWeeklyAttendance,
    loadingDailyAttendance, weeklyAttendanceFor, pagination as attendancePagination} from "./attendanceReducer";
import {list as devices, assistants, logs as deviceLogs, addingDevice, addingDeviceSupervisorAssistant, deletingDevice,
    removingDeviceSupervisorAssistant, editingDevice, loadingDeviceLogs, loadingDevices, mappingDevice,
    loadingDeviceSupervisorAssistants, deviceOperators, loadingDeviceOperators, devicesPagination,
    logsPagination as deviceLogsPagination, selectedDevice
} from './deviceReducer';
import {list as userGroups, loadingGroups, single as selectedUserGroup, addingGroup, deletingGroup, editingGroup,
    pagination as userGroupsPagination
} from "./userGroupReducer";
import {list as gates, single as gate, loadingGates} from './gateReducer';
import {list as entities, single as entity, actions, loadingActions, loadingEntities} from './entityReducer';
import {list as policies, groupPolicies, loadingPolicies, addingPolicy, deletingPolicy, editingPolicy
} from './policyReducer';
import {list as users, single as user, groupUsers, loadingUsers, addingUser, deletingUser, editingUser,
    danglingUsers, loadingDanglingUsers, pagination as usersPagination} from './userReducer';
import {list as logs, loadingLogs, exportingLogs, pagination as logsPagination} from './logReduer';
import {list as backups, schedules, creatingBackup, deletingBackup, loadingBackups, loadingBackupSchedules,
    updatingBackupSchedule, downloadingBackup, pagination as backupsPagination, restoringBackup} from "./backupReduer";
import {locationRegions, locationCities, addingLocationCity, addingLocationDistrict, deletingLocationCity,
    deletingLocationDistrict, editingLocationCity, editingLocationDistrict, editingRegion, loadingLocationCities,
    loadingLocationDistricts, loadingLocationRegions, locationCitiesPagination, locationDistricts,
    locationDistrictsPagination, locationRegionsPagination} from './branchReducer';
import {generatingReport, report} from './reportReducer';
import {checkingBid, allowToEnroll, enrolledBeneficiary, enrollingBeneficiary} from './enrolmentReducer';
import {socket, enrolmentSocket} from './socketReducer';
import {failed as OPERATION_FAILED, successful as OPERATION_SUCCESSFUL} from './operationReducer';
import {loadingDashboardSectionData, liveStats} from "./dashboardReducer";


export default combineReducers({
    authUser,

    loadingDashboardSectionData, liveStats,

    socket, enrolmentSocket,

    checkingBid, allowToEnroll, enrolledBeneficiary, enrollingBeneficiary,

    beneficiaries, beneficiary, beneficiariesPagination, beneficiaryBio: bio, addingBeneficiary, updatingBeneficiary,
        deletingBeneficiary, loadingBeneficiaries, loadingBeneficiary, capturingBio,

    countries, country,

    regions, filterRegion, filterRegions,

    districts, filterDistrict, filterDistricts,

    locations, filterLocation, filterLocations,

    modules,

    ranks,

    idTypes,

    forms, formPreset, formsPagination, clearingHistory, generatingForms, loadingForms, generatingPendingForms,
        generatedForm,

    dailyAttendance, attendancePagination, weeklyBeneficiaryAttendance, loadingBeneficiaryWeeklyAttendance,
        loadingDailyAttendance, weeklyAttendanceFor,

    devices, deviceLogs, assistants, addingDevice, editingDevice, deletingDevice, loadingDevices, loadingDeviceLogs,
        loadingDeviceSupervisorAssistants, addingDeviceSupervisorAssistant, removingDeviceSupervisorAssistant,
        mappingDevice, deviceOperators, loadingDeviceOperators, devicesPagination, deviceLogsPagination, selectedDevice,

    userGroups, loadingGroups, selectedUserGroup, addingGroup, editingGroup, deletingGroup, userGroupsPagination,

    policies, groupPolicies, loadingPolicies, addingPolicy, editingPolicy, deletingPolicy,

    gates, gate, loadingGates,

    entities, entity, actions, loadingActions, loadingEntities,

    users, user, groupUsers, loadingUsers, addingUser, editingUser, deletingUser, danglingUsers, loadingDanglingUsers,
        usersPagination,

    logs, loadingLogs, exportingLogs, logsPagination,

    backups, schedules, loadingBackups, loadingBackupSchedules, creatingBackup, deletingBackup, downloadingBackup,
        updatingBackupSchedule, backupsPagination, restoringBackup,

    locationRegions, locationCities, addingLocationCity, addingLocationDistrict, deletingLocationCity,
        deletingLocationDistrict, editingLocationCity, editingLocationDistrict, editingRegion, loadingLocationCities,
        loadingLocationDistricts, loadingLocationRegions, locationCitiesPagination, locationDistricts,
        locationDistrictsPagination, locationRegionsPagination,

    report, generatingReport,

    OPERATION_FAILED, OPERATION_SUCCESSFUL,

});