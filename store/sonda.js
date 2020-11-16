export const state = () => ({
  isProd: false,
  queryData: false,
  queryCurrentProgramData: true,
  historicAlerts: {},
  historicWarnings: {},
  currentProgram: '',
  currentProgramMos: '-',
  currentProgramMosClass: '',
  vodProgramMos: '-',
  mosConfigValues: null,
  journeyNotif: {alerts: null, warnings: null},
  updateCurrent: 1000,
  updateJourney: 1000,
  updatePrevious: 1000,
  dashboardDisplays: {alerts: [], warnings:[]},
  alerts: {currentProgram: [], currentJourney: [], previousProgram: [], previousJourney: []},
  warnings: {currentProgram: [], currentJourney: [], previousProgram: [], previousJourney: []}
})

export const mutations = {
    toggleStatus(state){
      state.queryData = state.queryData || false;
    },
    setQueryCurrentProgramData(state, status){
      state.queryCurrentProgramData = status;
    },
    setHistoricAlerts(state, alerts){
      state.historicAlerts = alerts;
    },
    setHistoricWarnings(state, warnings){
      state.historicWarnings = warnings;
    },
    setQueryDataStatus(state, status){
      state.queryData = status;
      if (!status)
        state.queryCurrentProgramData = true;
    },
    setUpdateCurrent(state, interval){
      state.updateCurrent = interval;
    },
    setUpdateJourney(state, interval){
      state.updateJourney = interval;
    },
    setUpdatePrevious(state, interval){
      state.updatePrevious = interval;
    },
    setCurrentProgram(state, program){
      state.currentProgram = program;
    },
    setCurrentProgramMos(state, mos){          
      state.currentProgramMos = mos.value;
      state.currentProgramMosClass = mos.class;
    },
    setVodProgramMos(state, mos){          
      state.vodProgramMos = mos
    },
    setMosConfigValues(state, config){
      state.mosConfigValues = config;
    },
    setJourneyNotif(state, notif){
      state.journeyNotif.alerts = notif.alert_number;
      state.journeyNotif.warnings = notif.warning_number;
    },
    addDashboarAlerts(state, newObj){
      if (newObj.type == 'currentProgram'){
        state.dashboardDisplays.alerts = newObj.alerts 
      }
    },
    addDashboarWarnings(state, newObj){
      if (newObj.type == 'currentProgram'){
        state.dashboardDisplays.warnings = newObj.warnings 
      }

    }
}
