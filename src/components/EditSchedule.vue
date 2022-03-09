<template>
  <div class="container">
    <ol class="edit-nav">
      <li class="disabled">
        <router-link :to="{ name: 'edit-semester' }">编辑校历</router-link>
      </li>
      <li>编辑课表</li>
      <li class="disabled">
        <router-link :to="{ name: 'save-and-export' }">保存和导出</router-link>
      </li>
    </ol>

    <div class="gridbox">
      <div class="calendar">
        <CourseCalendar />
      </div>
      <div class="edit">
        <EditCourses />
        <div class="buttons">
          <button class="button" @click="prevStep">上一步</button>
          <button class="button" @click="nextStep">下一步</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'pinia'
import { defineComponent } from 'vue'
import CourseCalendar from './CourseCalendar.vue'
import EditCourses from './EditScheduleCourses.vue'
import { useSemesterStore } from '../stores/semester'

export default defineComponent({
  components: {
    CourseCalendar,
    EditCourses,
  },
  computed: {
    ...mapState(useSemesterStore, ['timeslots']),
  },
  methods: {
    prevStep() {
      this.$router.push({ name: 'edit-semester' })
    },
    nextStep() {
      this.$router.push({ name: 'save-and-export' })
    },
  },
})
</script>

<style scoped>
.container {
  height: auto;
}
.gridbox {
  height: auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}
.gridbox .calendar {
  height: calc(100vh - 125px);
  min-height: 500px;
  position: sticky;
  top: 10px;
}

.edit {
  margin-bottom: 20px;
}
@media (max-width: 960px) {
  .gridbox {
    grid-template-columns: 1fr;
  }
  .gridbox .calendar {
    height: calc(v-bind('timeslots.length') * 40px);
    position: static;
  }
}
</style>
