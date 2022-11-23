<template>
    <select :value="modelValue" @change="$emit('update:modelValue', $event.target.value)">
    <!-- <select v-model="selectedWork" v-on:change="changeSelect"> -->
              <option value=〇>〇</option>
              <option value=〇/当>〇/当</option>
              <option value=深夜>深夜</option>
              <option value=A/公>A/公</option>
              <option value=公/A>公/A</option>
              <option value=A/有>A/有</option>
              <option value=有/A>有/A</option>
              <option value=公/当>公/当</option>
              <option value=公>公</option>
              <option value=有給>有給</option>
              <option value=時間有給>時間有給</option>
              <option value=特休>特休</option>
              <option value=振休>振休</option>
              <option value=欠勤>欠勤</option>
      </select>
</template>
<script>
  export default {
    props: {
        modelValue:String
    },
    // data(){
    //     return {
    //         selectedWork:null
    //     }
    // },
    // created(){
    //     console.log("created"+this.selected)
    //     console.log("created"+this.editWork)
    //     this.selectedWork = this.editWork;
    // },
    // methods:{
    //   changeSelect:function(e) {
    //     console.log("methods"+ e.target.value);
    //     console.log("methods" + this.selected);
    //     const element = e.target.value;

    //     //選んだ勤務が"深夜"の場合は"深夜"以外を選んだ場合と勤務終了時間のセレクトボックスの内容を変更する為、深夜を選んだどうかを親コンポーネントに送る。
    //     let night = "";
    //     night = element == "深夜";
    //     console.log("深夜かどうか"+night);

    //     const selected = this.selected;
    //     this.$emit("in", {day:selected,editWork:element,nightWork:night});
    //   },
    // }
  }
</script>