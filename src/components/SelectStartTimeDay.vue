<!-- modelValueが選んだ選択肢の内容を表している。 -->
<!-- event.target.value　=　optionのvalueのこと。-->
<template>
<select :value="modelValue" @change="$emit('update:modelValue', $event.target.value)">
  <option v-for="time in dayStartShift" :value="time.text">
    {{time.text}}
  </option>
</select>
</template>

<script>

const makeDayShift = () => {
  let dayShift = {};
  let dayShiftArray = [];
  let textTimeHour = 6;
  let textTimeMinute = 45;
  for (let i = 1; i <= 21; i++) {
    dayShift.id = i;
    if(textTimeMinute == 15) {
      textTimeMinute = textTimeMinute + 30;
      dayShift.text = String(textTimeHour)+":"+String(textTimeMinute);
    } 
      else {
      textTimeMinute = 15; 
      textTimeHour = textTimeHour + 1;
      dayShift.text = String(textTimeHour)+":"+String(textTimeMinute);
    } 
      dayShiftArray.push({ ...dayShift});            
  }
  console.log(dayShiftArray)
  return dayShiftArray;
};

export default {
    props: {
         modelValue:String,
    },
    data(){
        return {
          dayStartShift: null,
        }
    },

    //Domが作成された後
    mounted() {
        this.dayStartShift = makeDayShift();
    },

    methods:{
      //dayShiftの中から確定した時間と同じvalueのオブジェクトを探す。
      // searchDayShiftValue:function(time){
      //   console.log(time + "etargetvalue");
      //   console.log(time.id + "etargetvalue");
      //   const a = this.dayStartShift.filter((ele) => {
      //       return time == ele.value;
      //   });
        // console.log(a)
        // if(a[0]==null){
        // return "";
        // }
        //親のほうにオブジェクトがいく。
//         return a[0];
//       }
     }
 }

</script>