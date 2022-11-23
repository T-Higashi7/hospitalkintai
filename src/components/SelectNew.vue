<!-- modelValueが選んだ選択肢の内容を表している。PropsのmodelValue: Numberと連動-->
<!-- event.target.value　=　optionのvalueのこと。-->
<template>

  <!-- <select :value="modelValue" @change="$emit('update:modelValue', $event.target.value)"> -->
  <select :value="modelValue" @change="selectChange">
    <option v-for="time in makeShift" :value="time.value">
      {{ time.time }}
    </option>
  </select>
</template>

<script>

const makeDayShift = (startTime) => {
  const ShiftArray = []
  for (let i = 1; i <= 33; i++) {
    const valueTime = startTime;
    const hour = Math.floor(startTime / 60);
    const nextDayHour = hour > 23 ? hour - 24 : hour;
    const minute = startTime - (hour * 60);
    if (hour < 24) {
      ShiftArray.push({ hour: hour, minute: minute, time: nextDayHour + ":" + minute, value: valueTime });
    } else {
      ShiftArray.push({ hour: nextDayHour, minute: minute, time: nextDayHour + ":" + minute, value: valueTime });
    }
    startTime = startTime + 30;
  }
  return ShiftArray;
};

export default {
  props: {
    //親のtest.vueからセレクトボックスで選択した内容をmodelValueとして受け取る。
    modelValue: Number,
    topTime: Number,
  },
  emits: ['change'],
  data() {
    return {
      dayStartShift: null,
    }
  },
  methods: {
    //フィルターでe.target.valueの値があるオブジェクトに絞り込む。
    //配列をemitするのではなく一つのオブジェクトをemitする。
    //親でオブジェクトで受け取り、親でコンソールで受けっとたオブジェクトを表示し、hourなど小分けにしたもので処理する。
    //hourを親で使用すると見た目も分かりやすい。
    selectChange(e) {
      const selectTime = this.dayStartShift.filter(shift => shift.value === Number(e.target.value))
      this.$emit('change', selectTime[0]);
    }
  },

  //呼ばれた時に一度しかdataが変わらないものはcomputedは使わない。
  //createdでDomが作成される前に処理がされる。
  // created() {
  //     this.dayStartShift = makeDayShift(this.topTime);
  //   }
  // }
  //Domが作成された後
  // mounted() {
  //   this.dayStartShift = makeDayShift(this.sendToChild);
  // },
  //勤務が深夜の場合、top時間を変動させたdayStartShiftが作成される為、computedを採用
  computed: {
    makeShift: function () {
      this.dayStartShift = makeDayShift(this.topTime);
      return this.dayStartShift;
    }
  },
}


</script>