<template>
    <!-- 明細リストを3行定義してrowをオブジェクトとして3行取り出せるか。 -->
    <div v-for="(element, index) of meisaiList" key="index">
        <row :element="element" @calculate="calculated" />
    </div>
</template>

<!-- //オブジェクトという値が入った配列 -->

<!-- const obj = [ { name:taro } ]
const array = [1,3,5] -->

<script>
// 　./自分と同じ階層という意味　../は自分より階層一つ上　相対パスで考える。
import row from './row.vue'

export default {
    components: {
        row
    },
    data() {
        return {
            meisaiList: [
                {
                    work: "",
                    start: "",
                    end: "",
                    workTime: "",
                    overTime: "",
                    midnightWorkTime: "",
                    midnightOverTime: ""
                },
                {
                    work: "",
                    start: "",
                    end: "",
                    workTime: "",
                    overTime: "",
                    midnightWorkTime: "",
                    midnightOverTime: ""
                },
                {
                    work: "",
                    start: "",
                    end: "",
                    workTime: "",
                    overTime: "",
                    midnightWorkTime: "",
                    midnightOverTime: ""
                },
            ],
            calculateResult:null,
        }
    },
    methods: {
        calculated: function ($event) {
            this.calculateResult = $event;
            console.log($event)
        }
    }
}
</script>