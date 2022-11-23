<template>

<select :value="modelValue" @change="$emit('update:modelValue', $event.target.value)">
    <option v-for="time in dayShift" :value="time.value">
    {{time.text}}
     </option>
 </select>

</template>


<script>
const makeDayShift = () => {
  let dayShift = {};
  let dayShiftArray = [];
  let textTimeHour = 12;
  let textTimeMinute = 15;
  for (let i = 1; i <= 24; i++) {
    dayShift.id = i;
    if(textTimeMinute == 15 && dayShift.id != 24) {
      textTimeMinute = textTimeMinute + 30;
      dayShift.text = String(textTimeHour)+":"+String(textTimeMinute);
  } 
      else if (textTimeMinute == 45 && dayShift.id != 24) {
      textTimeMinute = 15; 
      textTimeHour = textTimeHour + 1;
      dayShift.text = String(textTimeHour)+":"+String(textTimeMinute);
  } 
      else {
        textTimeMinute = 15; 
        textTimeHour = 8;
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
          dayShift: null,
        }
    },

    //Domが作成された後
    mounted() {
        this.dayShift = makeDayShift();
    },

  //   methods:{
  //     //dayShiftの中から確定した時間と同じvalueのオブジェクトを探し、そのオブジェクトのtextを返す。
  //     searchDayShiftValue:function(time){
  //       const a = this.dayShift.filter((ele) => {
  //           return time == ele.value;
  //       });
  //       if(a[0]==null){
  //       return "";
  //       }
  //       return a[0].text;
  //     },
  // }
 }
</script>