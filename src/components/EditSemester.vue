<template>
  <div class="container">
    <ol class="edit-nav">
      <li>编辑校历</li>
      <li class="disabled"><button @click="nextStep">编辑课表</button></li>
      <li class="disabled"><button @click="jumpTo('save-and-export')">保存和导出</button></li>
    </ol>

    <form class="gridbox" @submit.prevent @change="validate">
      <div class="left">
        <p>在创建课表之前，你需要完善本学期的校历信息。</p>
        <!-- <p>
          或者，你也可以选择<a href="https://www.baidu.com">他人发布的校历</a>，并在此基础上更改。
        </p> -->
        <section>
          <h2>学期起止</h2>
          <ol>
            <li v-for="(quarter, qidx) in quarters" :key="qidx" class="row">
              <span>第 {{ qidx + 1 }} 学期</span>
              <label :for="`input-quarter-name-${qidx}`">学期名</label>
              <input :id="`input-quarter-name-${qidx}`" v-model="quarter.name" style="flex: 0.75" />
              <label :for="`input-quarter-start-${qidx}`">开始于</label>
              <input :id="`input-quarter-start-${qidx}`" type="date" v-model="quarter.start" />
              <label :for="`input-quarter-end-${qidx}`">结束于</label>
              <input :id="`input-quarter-end-${qidx}`" type="date" v-model="quarter.end" />
              <button @click="deleteQuarter(quarter)" v-if="!initDone">
                <font-awesome-icon icon="trash-can" aria-hidden="true" />
                <span class="sr-only">删除</span>
              </button>
              <template v-if="errors.quarters[qidx]?.length">
                <div v-for="error in errors.quarters[qidx]" :key="error" class="error">
                  {{ error }}
                </div>
              </template>
            </li>
          </ol>
          <div v-if="errors.quarter" class="error standalone">
            {{ errors.quarter }}
          </div>
          <button @click="addQuarter" v-if="!initDone">
            <font-awesome-icon icon="circle-plus" aria-hidden="true" fixed-width />
            添加学期
          </button>
        </section>

        <p>
          <small v-if="!showAdvanced">
            <button @click="showAdvanced = true">
              <font-awesome-icon icon="caret-right" aria-hidden="true" fixed-width />显示高级选项
            </button>
          </small>
          <small v-else>
            <button @click="showAdvanced = false">
              <font-awesome-icon
                icon="caret-down"
                aria-hidden="true"
                fixed-width
              />隐藏并禁用高级选项
            </button>
          </small>
        </p>

        <section v-if="showAdvanced">
          <h2>调课安排</h2>
          <p>Under construction</p>
        </section>
      </div>

      <div class="right">
        <section>
          <h2>课程时间</h2>
          <ol class="timetable">
            <li v-for="(timeslot, tidx) in timeslots" :key="tidx">
              <span>第 {{ tidx + 1 }} 节</span>
              <input :id="`input-start-${tidx}`" v-model="timeslot.startTime" type="time" />
              <label>-</label>
              <input v-model="timeslot.endTime" type="time" />
              <button @click="deleteTimeslot(timeslot)" v-if="!initDone">
                <font-awesome-icon icon="trash-can" aria-hidden="true" />
                <span class="sr-only">删除</span>
              </button>
              <template v-if="errors.timeslots[tidx]?.length">
                <div v-for="error in errors.timeslots[tidx]" :key="error" class="error">
                  {{ error }}
                </div>
              </template>
            </li>
          </ol>
          <div v-if="errors.timeslot" class="error standalone">
            {{ errors.timeslot }}
          </div>
          <button @click="addTimeslot" v-if="!initDone">
            <font-awesome-icon icon="circle-plus" aria-hidden="true" fixed-width />
            添加时段
          </button>
        </section>
      </div>
    </form>

    <div class="buttons">
      <button class="button" @click="clearConfirm = true">清空内容</button>
      <button class="button" @click="resetConfirm = true">加载样例</button>
      <button class="button" @click="nextStep">下一步</button>
    </div>

    <FullScreenConfirm v-model="clearConfirm" @confirm="clear">
      是否删除所有校历和课表信息？
    </FullScreenConfirm>
    <FullScreenConfirm v-model="resetConfirm" @confirm="reset">
      是否加载样例内容？当前所有校历和课表信息将会丢失。
    </FullScreenConfirm>
    <FullScreenConfirm v-model="nextConfirm" @confirm="submit">
      进入下一步后，你将不能再更改学期数和每日课程数。是否继续？
    </FullScreenConfirm>
  </div>
</template>

<script>
import { useTimetableStore } from '../stores/timetable'
import { useSemesterStore } from '../stores/semester'
import { defineComponent } from 'vue'
import { mapState, mapStores } from 'pinia'
import FullScreenConfirm from './FullScreenConfirm.vue'

export default defineComponent({
  data: () => ({
    showAdvanced: false,
    nextConfirm: false,
    clearConfirm: false,
    resetConfirm: false,
    errors: {
      timeslots: [],
      quarters: [],
      timeslot: '',
      quarter: '',
    },
  }),

  computed: {
    ...mapStores(useSemesterStore, useTimetableStore),
    ...mapState(useSemesterStore, ['quarters', 'timeslots', 'initDone']),
  },

  methods: {
    addQuarter() {
      this.semesterStore.addQuarter()
    },

    deleteQuarter(quarter) {
      this.semesterStore.deleteQuarter(quarter)
    },

    sortQuarters() {
      this.semesterStore.sortQuarters
    },

    addTimeslot() {
      this.semesterStore.addTimeslot()
    },

    deleteTimeslot(timeslot) {
      this.semesterStore.deleteTimeslot(timeslot)
    },

    sortTimeslots() {
      this.semesterStore.sortTimeslots()
    },

    clearErrors() {
      this.errors = {
        timeslots: [],
        quarters: [],
        timeslot: '',
        quarter: '',
      }
    },

    addError(array, index, message) {
      if (array[index] === null || array[index] === undefined) {
        array[index] = []
      }
      array[index].push(message)
    },

    async validate() {
      // returns false if no error is found
      this.clearErrors()
      let hasErrors = false

      if (!this.timeslots.length) {
        this.errors.timeslot = '请至少添加一个时段。'
        hasErrors = true
      } else {
        for (let i = 0; i < this.timeslots.length; i++) {
          if (!this.timeslots[i].startTime) {
            this.addError(this.errors.timeslots, i, '请输入开始时间。')
            hasErrors = true
          }
          if (!this.timeslots[i].endTime) {
            this.addError(this.errors.timeslots, i, '请输入结束时间。')
            hasErrors = true
          }
          if (
            i > 0 &&
            this.timeslots[i].startTime &&
            this.timeslots[i - 1].endTime &&
            this.timeslots[i].startTime <= this.timeslots[i - 1].endTime
          ) {
            this.addError(this.errors.timeslots, i, `第 ${i + 1} 节上课时间应晚于前一节下课时间。`)
            hasErrors = true
          }
          if (
            this.timeslots[i].startTime &&
            this.timeslots[i].endTime &&
            this.timeslots[i].startTime >= this.timeslots[i].endTime
          ) {
            this.addError(this.errors.timeslots, i, `第 ${i + 1} 节下课时间应晚于上课时间。`)
            hasErrors = true
          }
        }
      }

      if (!this.quarters.length) {
        this.errors.quarter = '请至少添加一个学期。'
        hasErrors = true
      } else {
        for (let i = 0; i < this.quarters.length; i++) {
          if (!this.quarters[i].name) {
            this.addError(this.errors.quarters, i, '请输入学期名。')
            hasErrors = true
          }
          if (!this.quarters[i].start) {
            this.addError(this.errors.quarters, i, '请输入开始日期。')
            hasErrors = true
          }
          if (!this.quarters[i].end) {
            this.addError(this.errors.quarters, i, '请输入结束日期。')
            hasErrors = true
          }
          if (
            i > 0 &&
            this.quarters[i].start &&
            this.quarters[i - 1].end &&
            this.quarters[i].start <= this.quarters[i - 1].end
          ) {
            this.addError(this.errors.quarters, i, `第 ${i + 1} 学期开始时间应晚于上学期结束时间。`)
            hasErrors = true
          }
          if (
            this.quarters[i].start &&
            this.quarters[i].end &&
            this.quarters[i].start >= this.quarters[i].end
          ) {
            this.addError(this.errors.quarters, i, `第 ${i + 1} 学期结束时间应晚于开始时间。`)
            hasErrors = true
          }
        }
      }

      return hasErrors
    },

    async nextStep() {
      this.sortQuarters()
      this.sortTimeslots()
      if (!(await this.validate())) {
        if (!this.initDone) {
          this.nextConfirm = true
        } else {
          this.submit()
        }
      }
    },

    async jumpTo(name) {
      if (!this.initDone) {
        await this.nextStep()
      } else {
        if (!(await this.validate())) {
          this.$router.push({ name: name })
        }
      }
    },

    submit() {
      this.semesterStore.initDone = true
      this.confirm = false
      this.$router.push({ name: 'edit-schedule' })
    },

    clear() {
      this.$emit('clear')
    },

    reset() {
      this.$emit('reset')
    },
  },
  components: { FullScreenConfirm: FullScreenConfirm },
})
</script>

<style>
:root {
  --color-enabled: rgb(230, 230, 230);
  --color-disabled: rgb(245, 245, 245);
}
</style>

<style scoped>
/* overall layout */
.container {
  padding-bottom: 2rem;
}
.gridbox {
  display: grid;
  gap: 2rem;
  grid-template-columns: 1fr max(400px);
}

.timetable {
  max-width: 400px;
  margin: 0 auto;
}
@media (max-width: 960px) {
  .gridbox {
    grid-template-columns: 1fr;
    gap: 0;
  }
}
/* form */
section h2 {
  font-size: 1.2rem;
}
section ol {
  list-style-type: none;
  padding: 0;
  margin: 0;
}
section li {
  display: flex;
  flex-flow: row wrap;
  gap: 0.5em;
  margin: 0.5rem 0;
}
section li span {
  flex-basis: 5rem;
  display: flex;
  justify-content: left;
  align-items: center;
}
section li label {
  flex-basis: content;
  display: flex;
  justify-content: center;
  align-items: center;
}
section input,
section select {
  width: 100%;
  flex: 1;
}
/* error message */
.error {
  font-size: 12px;
  line-height: 1;
  flex-basis: 100%;
  display: block;
  margin-left: 5.5rem;
  color: red;
}
.error.standalone {
  margin-left: 0;
  line-height: 2;
}
/* inline button */
.gridbox button {
  background-color: transparent;
  border: none;
  font-size: 1rem;
  display: flex;
  align-items: center;
  padding: 0;
  margin: 0;
  color: rgb(3, 89, 160);
}
.gridbox button:active {
  position: relative;
  left: 1px;
  top: 1px;
}
</style>
