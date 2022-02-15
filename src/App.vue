<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import CourseCalendar from './components/CourseCalendar.vue'
import CourseEdit from './components/CourseEdit.vue'
</script>

<template>
  <div id="navbar">编辑课表</div>
  <div id="main-container">
    <div class="pane" id="pane-left">
      <CourseCalendar />
    </div>
    <div class="pane" id="pane-right">
      <CourseEdit />
    </div>
  </div>
</template>

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
</style>
