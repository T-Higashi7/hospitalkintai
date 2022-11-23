<!-- totaltime等はMeisaList.vueで計算 -->
<template>
<table class="table">
      <thead>
        <tr>
          <th scope="col" style="background-color: #EEEEEE">日付</th>
          <th scope="col" style="background-color: #EEEEEE">曜日</th>
          <th scope="col" style="background-color: #CCFFCC">勤務</th>
          <th scope="col" style="background-color: #CCFFCC">勤務<br>開始</th>
          <th scope="col" style="background-color: #CCFFCC">勤務<br>終了</th>
          <th scope="col" style="background-color: #CCFFCC">従業時間</th>
          <th scope="col" style="background-color: #CCFFCC">22時～5時<br>従業</th>
          <th scope="col" style="background-color: #CCFFCC">休憩</th>
          <th scope="col" style="background-color: #CCFFFF">残業時間</th>
          <th scope="col" style="background-color: #CCFFFF">22時～5時<br>残業</th>
          <th scope="col" style="background-color: #CCFFFF">残業理由・<br>備考</th>
          <th scope="col" style="background-color: #FFFF99">有給</th>
          <th colspan=2 scope="col" style="background-color: #FFFCFB"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(element,index) of meisaiList" key="index" >
            <!-- 明細コンポーネントを呼ぶ -->
            <Meisai :element="element" />
        </tr>
      </tbody>
    </table>
    {{meisaiList}}
</template>

<script>
import Meisai from './Meisai.vue'

export default {
  components:{
    Meisai,
  },
  props: ['meisaiList'],
 
}

</script>