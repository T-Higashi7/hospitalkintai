<template>
<!-- 編集モードのエレメントをeditElementにする。
編集を押した時にelementの内容をeditElementにコピーする。
確定を押した時にeditElementの内容をMeisaiListにemitする。
その時にMiesaiListの変更を検知してcomputedが必要かもしれない -->
          <!-- {{element}} -->
          <td>{{element.day}}</td>
          <td v-bind:class="{blue: element.isSaturday, red: element.isSunday }">{{element.week}}</td>
          <!-- 表示モード -->
          <template v-if="element.show">
            <td>{{element.work}}</td>
            <td>{{element.starttime}}</td>
            <td>{{element.endtime}}</td>
            <td>{{element.workTime}}</td>
            <td>{{element.midnightWorkTime}}</td>
            <td>{{element.restTime}}</td>
            <td>{{element.overtime}}</td>
            <td>{{element.midnightOvertime}}</td>
            <td>{{element.reason}}</td>
            <td>{{element.paidTime}}</td>
            <td>
                <button class="btn btn-outline-dark" v-on:click="edit(element)" >編集</button>
            </td>
            <td>
                <button class="btn btn-outline-dark" v-on:click="deleate(element);totalWorkday()" >削除</button>
            </td>
          </template>
          <!-- 編集モード -->
          <template v-else>
            <td>
                <!-- <SelectedWork :editWork="element.work" :selected="Number(element.day)" @in="changeSelect"/> -->
                <SelectedWork v-model="element.work" @change="element.nightWork = element.work == '深夜'"/>
            </td>
           
            <!-- 勤務が深夜の場合、nightShiftをセレクトボックスに表示 -->
            <template v-if="element.work === '深夜'">
                <td>
                    <SelectedStartTimeNight v-model="element.starttime"/>
                </td>
                <td>
                    <SelectedEndTimeNight v-model="element.endtime"/>
                </td>
            </template>
            <!-- 勤務が深夜以外の場合、dayShiftをセレクトボックスに表示 -->
            <template v-else>
                 <td>
                    <SelectedStartTimeDay v-model="element.starttime"/>
                 </td>
                 <td>
                    <SelectedEndTimeDay v-model="element.endtime"/>
                 </td>
            </template>
            <td>
                {{element.workTime}}
            </td>
            <td>
                {{element.midnightWorkTime}}
            </td>
            <td>
                {{element.restTime}}
            </td>
            <td>
                {{element.overtime}}
            </td>
            <td>
                {{element.midnightOvertime}}
            </td>
            <td>
                <SelectedReason v-model="element.reason"/>
            </td>
            <td>
                <SelectedPaidTime v-model="element.paidTime"/>
            </td>
            <td>
                <button class="btn btn-outline-dark" v-on:click="confirm(element);total()" >確定</button>
            </td>
            <td>
                <button class="btn btn-outline-dark" v-on:click="cancel(element)" >キャンセル</button>
            </td>
        </template>
</template>
<script>
import SelectedPaidTime from './SelectPaidTime.vue'
import SelectedWork from './SelectWork.vue'
import SelectedStartTimeDay from './SelectStartTimeDay.vue'
import SelectedStartTimeNight from './SelectStartTimeNight.vue'
import SelectedEndTimeDay from './SelectEndTimeDay.vue'
import SelectedEndTimeNight from './SelectEndTimeNight.vue'
import SelectedReason from './SelectReason.vue'

export default {
    props: ['element'],
    components:{
        SelectedPaidTime,
        SelectedWork,
        SelectedStartTimeDay,
        SelectedStartTimeNight,
        SelectedEndTimeDay,
        SelectedEndTimeNight,
        SelectedReason,
    },
    // emits: ['update:element'],
    methods: {
      //「編集」ボタンを押した時に明細を編集する。
      edit: function (selected) {
        selected.show = false;
    },
    //「確定」ボタンを押した時に明細を確定する。
      confirm: function(selected) {
        selected.show = true;
      }
    }
};
</script>
