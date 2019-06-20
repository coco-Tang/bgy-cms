import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistense from 'vuex-persistedstate'
import getters from './getters'

Vue.use(Vuex)

// https://webpack.js.org/guides/dependency-management/#requirecontext
const modulesFiles = require.context('./modules', false, /\.js$/)

// you do not need `import app from './modules/app'`
// it will auto require all vuex module from modules file
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  // set './app.js' => 'app'
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath)
  modules[moduleName] = value.default
  return modules
}, {})

const vuexLocal = new VuexPersistense({
  storage: localStorage,
  reducer: val => {
    return {
      //引入app模板，对象里面可配置需要持久化的status
      user: {
        account: val.user.account,
      }
    }
  }
})

const store = new Vuex.Store({
  modules,
  getters,
  plugins: [vuexLocal]
})

export default store
