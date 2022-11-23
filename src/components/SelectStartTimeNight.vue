<!-- modelValueが選んだ選択肢の内容を表している。 -->
<!-- event.target.value　=　optionのvalueのこと。-->
<template>
<select :value="modelValue" @change="$emit('update:modelValue', searchDayShiftValue($event.target.value))">
  <option v-for="time in nightStartShift" :value="time.value">
    {{time.text}}
  </option>
</select>


</template>

<script>
const makeNightShift = () => {
  let nightShift = {};
  let nightShiftArray = [];
  let valueTimeHour = 16;
  let valueTimeMinute = 15;
  let textTimeHour = 16;
  let textTimeMinute = 15;
  for (let i = 1; i <= 30; i++) {
    nightShift.id = i;
    if(valueTimeMinute == 15 && nightShift.id != 16) {
      valueTimeMinute = valueTimeMinute + 30;
      textTimeMinute = textTimeMinute + 30;
      nightShift.value = String(valueTimeHour)+":"+String(valueTimeMinute);
      nightShift.text = String(textTimeHour)+":"+String(textTimeMinute);
    } 
      else if (valueTimeMinute == 45 && nightShift.id != 16) {
      valueTimeMinute = 15;
      valueTimeHour = valueTimeHour + 1;
      textTimeMinute = 15; 
      textTimeHour = textTimeHour + 1;
      nightShift.value = String(valueTimeHour)+":"+String(valueTimeMinute);
      nightShift.text = String(textTimeHour)+":"+String(textTimeMinute);
    } 
      else {
      valueTimeHour = valueTimeHour + 1;
      valueTimeMinute = 15;
      textTimeHour = textTimeHour - 23;
      textTimeMinute = 15;
      nightShift.value = String(valueTimeHour)+":"+String(valueTimeMinute);
      nightShift.text = String(textTimeHour)+":"+String(textTimeMinute);
    } 
      nightShiftArray.push({ ...nightShift});            
  }
  return nightShiftArray;
};

export default {
    props: {
         modelValue:String,
    },
    data(){
        return {
          nightStartShift: null,
        }
    },

    //Domが作成された後
    mounted() {
        this.nightStartShift = makeNightShift();
        console.log(this.nightShift)
    },

    methods:{
      //dayShiftの中から確定した時間と同じvalueのオブジェクトを探す。
      searchDayShiftValue:function(time){
        console.log(time + "etargetvalue");
        console.log(time.id + "etargetvalue");
        const a = this.nightStartShift.filter((ele) => {
            return time == ele.value;
        });
        console.log(a)
        if(a[0]==null){
        return "";
        }
        //親のほうにオブジェクトがいく。
        return a[0];
      }
    }
}

</script>