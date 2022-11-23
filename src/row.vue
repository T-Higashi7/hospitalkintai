
<!-- 編集して自動計算した結果をtest.vueへ送る。 -->
<template>
  <div class="container mx-auto container-fluid" style="background-color: #FFFCFB">
    <SelectWork v-model="work" @change="topTimeChange"></SelectWork>
    <SelectNew v-model="startValue" :topTime="topStartTime" @change='changeStart'></SelectNew>
    <SelectNew v-model="endValue" :topTime="topEndTime" @change='changeEnd'></SelectNew>
    <p>従業時間：{{ workTime }}</p>
    <p>残業時間：{{ overTime }}</p>
    <p>22時～翌日5時の従業時間：{{ midnightWorkTime }}</p>
    <p>22時～翌日5時にかかる残業時間：{{ midnightOverTime }}</p>
  </div>
</template>


<script>

import SelectWork from './components/SelectWork.vue'
import SelectNew from './components/SelectNew.vue'

//休憩時間を入れた従業時間を計算する。
const calculateWorkTime = (start, end) => {
  console.log(start)
  console.log(end)

  let lunchTime = 0
  let workTime = (end.value - start.value) / 60;
  //勤務時間が8時間以上の場合は、勤務時間は勤務時間-休憩1時間とする。
  if (workTime >= 8) {
    lunchTime = 1;
  }
  //勤務時間が6時間以上かつ8時間未満の場合は、勤務時間は勤務時間-休憩45分とする。
  else if (workTime >= 6) {
    lunchTime = 0.75;
  }
  workTime = (workTime - lunchTime);
  return workTime < 0 ? 0 : workTime;
}


//休憩時間を入れない従業時間を計算する。
const calculateTotalTime = (start, end) => {
  const totalTime = end.value - start.value < 0 ? 0 : (end.value - start.value) / 60;
  return totalTime;
}


/*残業時間
を算出する。*/
const overTime = (totalTime, work) => {

  let fixedWorkingHours = 0;
  const fullWork = ["〇", "〇/当", "深夜"];
  const herfWork = ["A/公", "公/A", "A/有", "有/A"];

  if (fullWork.includes(work) && totalTime > 9) {
    fixedWorkingHours = 9;
  }
  else if (herfWork.includes(work) && totalTime > 5) {
    fixedWorkingHours = 5;
  }
  else {
    fixedWorkingHours = totalTime;
  }
  return totalTime - fixedWorkingHours;
}


/*従業時間が22時から5時にかかる時間
を算出する。*/
const midnightWorkTime = (start, end) => {

  //開始時間が22時前かどうかチェックする。
  const startTimeCheck = start.value / 60 < 22;
  //終了時間が22時前かどうかチェックする。
  const endTimeCheck = end.value / 60 < 22;

  //開始時間が22時より前かつ終了時間も22時より前の場合は0にする。
  if (startTimeCheck == true && endTimeCheck == true) {
    return 0;
  }

  //開始時間が22時前なら計算する開始時間を22時とする。
  const startTime = startTimeCheck == true ? 22 * 60 : start.value;
  //計算する終了時間を定義する。
  const endTime = end.value >= ((24 + 5) * 60) ? ((24 + 5) * 60) : end.value;

  //休憩を入れた従業時間を算出する。
  const workTime = calculateWorkTime(start, end);
  //結果、終了時間-開始時間(workTimeと比較して休憩時間も考慮するように)
  const result = (endTime - startTime) / 60 > workTime ? workTime : (endTime - startTime) / 60;
  return result;
}


/*残業時間がPM22時から翌日のAM5時にかかる時間
を算出する*/
const midnightOverTime = (work, totalTime, start, end) => {

  const fullWork = ["〇", "〇/当", "深夜"];

  //1日勤務の場合は残業の基準となる時間は勤務開始から9時間後、それ以外の勤務の場合は勤務開始から5時間後とする。
  const overStandardTime = fullWork.includes(work) ? start.value + (60 * 9) : start.value + (60 * 5);

  //結果を求める。
  //残業時間を算出する。残業時間が0の場合と勤務終了時間が22時より前の場合は0を返す。
  const over = overTime(totalTime, work);
  if (over == 0 || end.value < 22 * 60) {
    return 0;
  }

  //残業があり、勤務終了が5時より後の場合は
  if (end.value > (24 + 5) * 60) {
    //勤務終了時間がAM5時を超えた時間をendOverFiveTimeとする。
    const endOverFiveTime = (end.value - (24 + 5) * 60) > 0 ? (end.value - (24 + 5) * 60) : 0;
    return (end.value - (22 * 60) - endOverFiveTime - (overStandardTime - (22 * 60))) / 60;
  }
  //残業があり勤務終了が5時より前の場合、かつ残業の基準時間が22時を超える場合
  else if (overStandardTime > (22 * 60)) {
    return (end.value - (22 * 60) - (overStandardTime - (22 * 60))) / 60
  }
  //残業があり勤務終了が5時より前の場合、かつ残業の基準時間が22時を超えない場合
  else {
    const midnightWorkTime = midnightWorkTime(start, end);
    return midnightWorkTime;
  }
}


export default {
  props: ['element'],
  emits: ['calculate'],
  components: {
    SelectWork,
    SelectNew,
  },
  data() {
    return {
      //セレクトボックスで選んだものを受け取る。v-model
      work: "〇",

      //オブジェクトを受け取る場合は初期値nullになる。
      // start: null,

      /*初期値がnullだとstartまたはendだけ入力されている状態だとメソッド実行時に入力していない側のvalueが無い状態となりエラーとなる。
      その為初期値をオブジェクトの形としvalueを初期値0とする。*/
      start: [{
        hour: null,
        minute: null,
        time: null,
        value: 0
      }
      ],
      startValue: 0,
      // end: null,
      end: [{
        hour: null,
        minute: null,
        time: null,
        value: 0
      }
      ],
      endValue: 0,
      topStartTime: 435,
      topEndTime: 735,
      //休憩時間を入れた従業時間はwoekTime
      workTime: 0,
      midnightWorkTime: 0,
      //休憩時間を入れない従業時間はtotalTime
      totalTime: 0,
      overTime: 0,
      midnightOverTime: 0
    };
  },
  mounted() {

  },

  methods: {

    //セレクトボックスで選んだ勤務種別によってセレクトボックス内の開始時間を変更する。
    topTimeChange() {
      if (this.work == "深夜") {
        this.start = [{
           hour: null,
           minute: null,
           time: null,
           value: 0
         }
        ],
        this.end = [{
           hour: null,
           minute: null,
           time: null,
           value: 0
         }
        ],
        this.startValue = 0;
        this.endValue = 0;
        this.workTime = 0;
        this.totalTime = 0;
        this.midnightWorkTime = 0;
        this.overTime = 0;
        this.midnightOverTime = 0;
        this.topStartTime = 1065;
        this.topEndTime = 1275;
      }
      else {
        this.start = [{
           hour: null,
           minute: null,
           time: null,
           value: 0
         }
        ],
        this.end = [{
           hour: null,
           minute: null,
           time: null,
           value: 0
         }
        ],
        this.startValue = 0;
        this.endValue = 0;
        this.workTime = 0;
        this.totalTime = 0;
        this.midnightWorkTime = 0;
        this.overTime = 0;
        this.midnightOverTime = 0;
        this.topStartTime = 435;
        this.topEndTime = 735;
      }
    },
    changeStart(selectTime) {
      this.start = selectTime;
      this.startValue = selectTime.value;
      this.calculation();
    },

    changeEnd(selectTime) {
      this.end = selectTime;
      this.endValue = selectTime.value;
      this.calculation();
    },


    //セレクトボックスで時間を変更した時に、それぞれ算出用のメソッドを呼ぶ。
    calculation() {
      const calculateResult = [];
      //startまたはendだけ入力されている状態だとそれぞれNamになってしまう為、isNamでtureの場合は0を返すように。
      this.workTime = isNaN(calculateWorkTime(this.start, this.end)) ? 0 : calculateWorkTime(this.start, this.end);
      this.midnightWorkTime = isNaN(midnightWorkTime(this.start, this.end)) ? 0 : midnightWorkTime(this.start, this.end);
      this.totalTime = isNaN(calculateTotalTime(this.start, this.end)) ? 0 : calculateTotalTime(this.start, this.end);
      this.overTime = isNaN(overTime(this.totalTime, this.work)) ? 0 : overTime(this.totalTime, this.work);
      this.midnightOverTime = isNaN(midnightOverTime(this.work, this.totalTime, this.start, this.end)) ? 0 : midnightOverTime(this.work, this.totalTime, this.start, this.end);
      calculateResult.push({ workTime: this.workTime, midnightWorkTime: this.midnightWorkTime, overTime: this.overTime, midnightOverTime: this.midnightOverTime });
      this.$emit('calculate', calculateResult);
    }
  },

  computed: {
  }
};
</script>
