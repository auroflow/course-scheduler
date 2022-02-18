<template>
  <div id="navbar">编辑课表</div>
  <div id="main-container">
    <div class="pane" id="pane-left">
      <CourseCalendar />
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
</template>

<script>
import { defineComponent } from 'vue'
import CourseCalendar from './components/CourseCalendar.vue'
import CourseEdit from './components/CourseEdit.vue'
import QuarterEdit from './components/QuarterEdit.vue'

export default defineComponent({
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
    CourseCalendar,
    CourseEdit,
    QuarterEdit,
  },
})
</script>

<style>
html,
body,
#app {
  height: 100%;
  margin: 0;
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

#navbar {
  position: relative;
  width: 100%;
  padding: 13px;
  font-size: 20px;
  background-color: gainsboro;
  box-sizing: border-box;
  margin-bottom: 10px;
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
