<template>
<select :value="modelValue" @change="$emit('update:modelValue', $event.target.value)">
    <!-- <select v-model="selectedPaidTime" v-on:change="changeSelect"> -->
        <option value=30>30</option>
        <option value=60>60</option>
        <option value=90>90</option>
        <option value=120>120</option>
        <option value=150>150</option>
        <option value=180>180</option>
        <option value=210>210</option>
        <option value=240>240</option>
        <option value=270>270</option>
        <option value=300>300</option>
        <option value=330>330</option>
        <option value=360>360</option>
        <option value=390>390</option>
        <option value=420>420</option>
        <option value=450>450</option>
        <option value=480>480</option>
    </select>
</template>

<script>

export default {
    props: {
        modelValue:Number
    }
    // data(){
    //     return {
    //         selectedPaidTime:null
    //     }
    // },
    // created(){
    //     console.log("created"+this.selected)
    //     console.log("created"+this.editPaidTime)
    //     this.selectedPaidTime = this.editPaidTime;
    // },
    // methods:{
    //     changeSelect:function(e) {
    //         console.log("methods"+ e.target.value);
    //         console.log("methods" + this.selected);
    //         const element = e.target.value;
    //         const selected = this.selected;
    //         this.$emit('update:modelValue', {day:selected,editPaid:element});
    //     }
    }    
</script>