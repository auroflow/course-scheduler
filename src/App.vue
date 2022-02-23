<template>
  <div id="root">
    <the-navbar @my-reset="reset" @clear="clear"></the-navbar>
    <div id="main-container">
      <div class="pane" id="pane-left">
        <CourseCalendar @section-selected="selected = 1" />
      </div>
      <div class="pane" id="pane-right">
        <div class="switch-pane">
          <button
            v-for="(pane, pidx) in panes"
            :key="pane.name"
            class="switch"
            :class="{ selected: selected === pidx }"
            @click="selected = pidx"
          >
            {{ pane.name }}
          </button>
        </div>
        <div class="form-pane">
          <component :is="panes[selected].component"></component>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import TheNavbar from './components/TheNavbar.vue'
import CourseCalendar from './components/CourseCalendar.vue'
import CourseEdit from './components/CourseEdit.vue'
import QuarterEdit from './components/QuarterEdit.vue'

import { useScheduleStore } from './stores/schedule'
import { useSemesterStore } from './stores/semester'
import { useTimetableStore } from './stores/timetable'

export default defineComponent({
  setup() {
    let scheduleStore = useScheduleStore()
    let semesterStore = useSemesterStore()
    let timetableStore = useTimetableStore()

    return {
      stores: [scheduleStore, semesterStore, timetableStore],
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
html,
body,
#app,
#root {
  height: 100%;
  margin: 0;
}

button:hover {
  cursor: pointer;
}
</style>

<style scoped>
#main-container {
  padding: 0 20px 10px;
  display: grid;
  height: calc(100% - 2 * 13px - 20px - 20px);
  box-sizing: border-box;
  grid-template-columns: minmax(600px, 3fr) minmax(400px, 2fr);
  column-gap: 10px;
}

.pane {
  overflow-y: auto;
}

.switch-pane {
  position: sticky;
  top: 0;
  display: flex;
}

.pane-right {
  display: flex;
  flex-direction: column;
}

.switch {
  flex: auto;
  border: none;
  padding: 5px 0;
  margin-bottom: 10px;
  background-color: rgb(235, 235, 235);
  font-size: 14px;
}

.selected {
  background-color: lightgrey;
  font-weight: bold;
}
</style>
