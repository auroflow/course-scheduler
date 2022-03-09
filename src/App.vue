<template>
  <div id="root" @click="clearSelect">
    <TheNavbar></TheNavbar>
    <div id="main-container">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import TheNavbar from './components/TheNavbar.vue'
import CourseCalendar from './components/CourseCalendar.vue'
import CourseEdit from './components/CourseEdit.vue'
import QuarterEdit from './components/QuarterEdit.vue'

import { useScheduleStore } from './stores/schedule'
import { useSemesterStore } from './stores/semester'

export default defineComponent({
  setup() {
    let scheduleStore = useScheduleStore()
    let semesterStore = useSemesterStore()

    return {
      stores: [scheduleStore, semesterStore],
    }
  },

  mounted() {
    window.onload = (e) => {
      this.load()
    }

    window.onbeforeunload = (e) => {
      this.save()
    }
  },

  data: () => ({
    panes: [
      {
        component: 'QuarterEdit',
        name: '学期',
      },
      {
        component: 'CourseEdit',
        name: '课程',
      },
    ],

    selected: 0,
  }),

  components: {
    TheNavbar,
    CourseCalendar,
    CourseEdit,
    QuarterEdit,
  },

  methods: {
    clearSelect() {
      this.stores[0].select(null, null) // schedule store
    },

    reset() {
      if (window.confirm('确定还原样例内容？')) {
        for (let store of this.stores) {
          store.$reset()
        }
      }
    },

    clear() {
      if (window.confirm('确定清空所有内容？')) {
        for (let store of this.stores) {
          store.clear()
        }
      }
    },

    save() {
      localStorage.setItem('version', '0.2')
      for (let store of this.stores) {
        store.save()
      }
    },

    load() {
      for (let store of this.stores) {
        store.load()
      }
    },
  },
})
</script>

<style>
html {
  box-sizing: border-box;
  font-size: 14px;
  overflow-y: scroll;
  scroll-behavior: smooth;
}

@media screen and (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
}

html,
body,
#app,
#root {
  height: 100%;
  margin: 0;
}

* {
  box-sizing: inherit;
  font-family: 'Noto Sans SC', serif;
}

.button {
  display: inline-block;
  margin: 0;
  position: relative;
  border: none;
  padding: 0.25rem 1rem;
  background-color: rgb(231, 231, 231);
}

.button + .button {
  margin-left: 10px;
}

.button:active {
  left: 2px;
  top: 2px;
  background-color: rgb(211, 211, 211);
}

button:hover {
  cursor: pointer;
}

.buttons {
  display: flex;
  flex: row wrap;
  justify-content: center;
}

.sr-only {
  border: 0 !important;
  clip: rect(1px, 1px, 1px, 1px) !important; /* 1 */
  -webkit-clip-path: inset(50%) !important;
  clip-path: inset(50%) !important; /* 2 */
  height: 1px !important;
  margin: -1px !important;
  overflow: hidden !important;
  padding: 0 !important;
  position: absolute !important;
  width: 1px !important;
  white-space: nowrap !important; /* 3 */
}

/* edit navbar */

.edit-nav {
  display: flex;
  padding: 0;
  flex-flow: row wrap;
  justify-content: center;
  align-items: center;
}
.edit-nav li {
  position: relative;
  list-style-type: none;
  margin: 0;
  padding: 0 2rem 0 2.5rem;
  background-color: var(--color-enabled);
  height: 2rem;
  display: flex;
  line-height: 1;
  align-items: center;
}
.edit-nav li:not(:last-child)::after {
  content: '';
  display: block;
  border-style: solid;
  border-width: 1rem 0 1rem 0.75rem;
  border-color: transparent transparent transparent var(--color-enabled);
  position: absolute;
  left: 100%;
  z-index: 1;
}
.edit-nav li:not(:first-child)::before {
  content: '';
  display: block;
  position: absolute;
  left: 0;
  border-style: solid;
  border-width: 1.4rem 0 1.4rem 1.05rem;
  border-color: transparent transparent transparent white;
}
.edit-nav li.disabled {
  color: grey;
  background-color: var(--color-disabled);
}
.edit-nav li.disabled::after {
  border-color: transparent transparent transparent var(--color-disabled);
}

/* form */
input:not([type='radio']):not([type='checkbox']),
select {
  height: 2em;
  background-color: white;
  color: black;
  border: 1px solid grey;
  border-radius: 4px;
  font-size: 0.9rem;
}
</style>

<style scoped>
#main-container {
  max-width: 1280px;
  margin: 0 auto;
  height: auto;
}
@media (max-width: 1280px) {
  #main-container {
    padding-left: 10px;
    padding-right: 10px;
  }
}
</style>
