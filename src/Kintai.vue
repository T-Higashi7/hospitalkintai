<template>
<div class="container mx-auto container-fluid" style="background-color: #FFFCFB" >
  <div class = "head" style="padding: 10px; border: 1px dashed #333333;">
    <p class = "title">【勤怠表入力】
      提出者：<input type="text" v-model = "submitter">　
      <span class="status" v-if="getStatus==1">進捗：一時保存</span>
      <span class="status" v-if="getStatus==2">進捗：提出済み</span>
      <span class="status" v-if="getStatus==3">進捗：差し戻し</span>
    </p>
    <p>({{ dispMomentFormat }})
      <button type="button" class="btn btn-primary" @click="goPrevMonth">前月</button>　
      <button type="button" class="btn btn-primary" @click="goNextMonth" v-if="calendarMonthCheck==false">次月</button>　
      <button type="button" class="btn btn-warning" @click="subMission">提出</button>　
      <button type="button" class="btn btn btn-info" @click="temporarilySaved">一時保存</button>
    </p>
    <p>合計勤務日数：{{ totalWork }}日</p>
    <p>合計従業時間：{{ totalTime }}時間 (内　22時～5時の従業時間：{{totalMidnightWorkTime}}時間)</p>
    <p>合計残業時間：{{ totalOverTime }}時間 (内　22時～5時の残業時間：{{totalMidnightOverTime}}時間　　法定休日(日曜日)の残業時間：{{totalHolidayOverTime}}時間)</p>
    <p>    当直回数：{{ totalOndutyWork }}回</p>
    <p>    夜勤回数：{{ totalNightWork }}回</p>
    <p>    有給時間：{{ totalPaidTime }}分</p>
  </div>
  <div>
    <MeisaiList :meisaiList="meisaiList" />
    <!-- <MeisaiList v-for="meisai in meisaiList" key="index" :meisaiList="meisaiList"></MeisaiList> -->
  </div>
</div>
</template>

<script>
//同じ階層にあるkintai.jsを読み込む。
import { workTime, overTime, midnightOvertime, midnightWorkTime } from "./kintai";
//同じ階層にあるkintai-total.jsを読み込む。
import { totalWorkday, totalWorktime, totalWorkMidnightWorkTime, totalWorkOverTime, totalWorkMidnightOverTime, totalOnduty , totalWorkOverTimeHoliday, totalPaid } from "./kintai-total";
// src\components\SelectPaidTime.vue
// import SelectedPaidTime from './components/SelectPaidTime.vue'
// src\components\SelectWork.vue
// import SelectedWork from './components/SelectWork.vue'
// src\components\SelectStartTimeDay.vue
// import SelectedStartTimeDay from './components/SelectStartTimeDay.vue'
// src\components\SelectStartTimeNight.vue
// import SelectedStartTimeNight from './components/SelectStartTimeNight.vue'
// src\components\SelectEndTimeDay.vue
// import SelectedEndTimeDay from './components/SelectEndTimeDay.vue'
// src\components\SelectEndTimeNight.vue
// import SelectedEndTimeNight from './components/SelectEndTimeNight.vue'
// src\components\SelectReason.vue
// import SelectedReason from './components/SelectReason.vue'
// src\components\MeisaiList.vue
import MeisaiList from './components/MeisaiList.vue'


//153行目からexport defaultは別ファイルにしてimportで読み込みができる。
const subjectMonth = (targetMonth) => {
//現在の日時のフォーマットを"YYYY年MM"月の形式に変換する。
  return targetMonth.format("YYYY年MM月");
};

//今月の日数を取得　ex)2021年11月30なら30を返す。
const calendarData = (targetMonth) => {
  const numOfMonth = targetMonth.endOf("month").date();
  console.log(numOfMonth);
  return numOfMonth;
};

//今月の最初の日の曜日を取得。
const calendarFirstdayWeek = (targetMonth) => {
// この月の1日の曜日（0~6の数値で取得）(ex:月曜日であれば1を取得)
  const firstWeekDay = targetMonth.startOf("month").weekday();
  return firstWeekDay;
};

//今月のカレンダーのオブジェクトを作成。ex)2021年11月なら30日分のオブジェクト。
const calendarDay = (targetMonth) => {
  let Calendar = {};
  let CalendarArray = [];
  //今月の最初の日の曜日をFirstdayWeekに代入　ex)2021年12月の場合は、1日は水曜日となる為、3を代入。
  let FirstdayWeek = calendarFirstdayWeek(targetMonth); 
  //曜日の値を日～月に変換する為の配列を用意する。
  const japanWeek = ["(日)","(月)","(火)","(水)","(木)","(金)","(土)"];
  for (let i = 1; i <= calendarData(targetMonth); i++) {
    Calendar.date = subjectMonth(targetMonth);
    Calendar.day = i;
    Calendar.week = japanWeek[FirstdayWeek];
    //土曜日の場合はisSaturdayをtrueにする。
    //日曜日の場合はisSundayをtrueにする。
    if (Calendar.week == "(土)") {
      Calendar.isSunday = false;
      Calendar.isSaturday = true;
    } 
     else if (Calendar.week == "(日)") {
      Calendar.isSaturday = false;
      Calendar.isSunday = true;
    } 
      else {
      Calendar.isSaturday = false;
      Calendar.isSunday = false;
    }
      Calendar.work = "";
      Calendar.nightWork = "";
      Calendar.starttime = "";
      Calendar.endtime = "";
      Calendar.workTime = "";
      Calendar.midnightWorkTime = "";
      Calendar.restTime = "";
      Calendar.overtime = "";
      Calendar.midnightOvertime = "";
      Calendar.reason = "";
      Calendar.paidTime = "";
      Calendar.editWork = "";
      Calendar.editStartTime = "";
      Calendar.editEndTime = "";
      Calendar.editWorkTime = "";
      Calendar.editMidnightWorkTime = "";
      Calendar.editRestTime = "";
      Calendar.editOverTime = "";
      Calendar.editMidnightOvertime = "";
      Calendar.editReason = "";
      Calendar.editPaidTime = "";
      Calendar.show = true;
      CalendarArray.push({ ...Calendar });
    if (FirstdayWeek == 6) {
      FirstdayWeek = FirstdayWeek - 6;
    } 
     else {
      FirstdayWeek = FirstdayWeek + 1;
    }
  }
  console.log(CalendarArray);
  return CalendarArray;
};

export default {
  components:{
    // SelectedPaidTime,
    // SelectedWork,
    // SelectedStartTimeDay,
    // SelectedStartTimeNight,
    // SelectedEndTimeDay,
    // SelectedEndTimeNight,
    // SelectedReason,
    MeisaiList
},
  data() {
    return {
      //カレンダー表示月
      caldendarMonth: null,
      current: 0,
      meisaiList: null,
      //日勤シフト
      // dayShift: null,
      //夜シフト
      // nightShift: null,
      //勤務日数の合計
      totalWork: 0,
      //従業時間の合計
      totalTime: 0,
      //22時～5時にかかる従業時間の合計
      totalMidnightWorkTime: 0,
      //残業時間の合計
      totalOverTime: 0,
      //有給時間の合計
      totalPaidTime: 0,
      //22時～5時にかかる残業時間の合計
      totalMidnightOverTime: 0,
      //法定休日の残業時間の合計
      totalHolidayOverTime: 0,
      //当直の合計
      totalOndutyWork: 0,
      //夜勤の合計
      totalNightWork: 0,
      //提出ステータス
      status: null,
      //提出者
      submitter: null,
      //取得ステータス
      getStatus: null
    };
  },
  mounted(){
    this.meisaiList = calendarDay(moment());
    // this.dayShift = makeDayShift();
    // this.nightShift = makeNightShift();
    this.read();
  },

  methods: {
    //対象月を前月にする処理。
    //前月のdateで最後に保存したレコードをテーブルから取得する。
    goPrevMonth() {
      this.current--;
      this.meisaiList = calendarDay(moment().add(this.current, "months"));
      this.read();
    },

    //対象月を次月にする処理。
    //次月のdateで最後に保存したレコードをテーブルから取得する。
    goNextMonth() {
      this.current++;
      this.meisaiList = calendarDay(moment().add(this.current, "months"));
      this.read();
    },

    //「確定」ボタンを押した時の動作
    //　定義したメソッドを呼び出して明細の従業時間や残業時間、休憩時間が計算できるように
    confirm: function (selected) {


      // const holiday = ["公","公/当","有給","特休","振休","欠勤"];

      // if(holiday.includes(selected.work)){
      //   selected.starttime = "";
      //   selected.endtime = "";   
      // } else {
      //   selected.starttime = selected.editStartTime;
      //   selected.endtime = selected.editEndTime;
      // }
      // const startTime = selected.starttime.split(":");
      // const startTimeMinute = Number(startTime[0] * 60) + Number(startTime[1]);
      // const endTime = selected.endtime.split(":");
      // const endTimeMinute = Number(endTime[0] * 60) + Number(endTime[1]);

      //明細の従業時間を自動算出する。
      selected.workTime = workTime(selected.starttime, selected.endtime, selected.work)/60;

      //明細の22時～5時にかかる従業時間を自動算出する
      selected.midnightWorkTime =  midnightWorkTime(selected.starttime, selected.endtime)/60;
    
      //勤務開始22:15	勤務終了5:15等、明細の22時～5時にかかる従業時間が従業時間を超えていた場合は従業時間を2時～5時にかかる従業時間とする。
      if(selected.midnightWorkTime > selected.workTime){
        selected.midnightWorkTime = selected.workTime;
      }
      //明細の休憩時間を自動算出する。
      // if (endTimeMinute - startTimeMinute >= 480) {
      //   selected.restTime = "60分";
      // } 
      //  else if(endTimeMinute - startTimeMinute < 480 && endTimeMinute - startTimeMinute >= 360) {
      //   selected.restTime = "45分";
      // } 
      //  else {
      //   selected.restTime = 0;
      // }

      //明細の残業時間を自動算出する。
      // selected.overtime = overTime(selected.starttime, selected.endtime, selected.work)/60;

      //明細の22時～5時にかかる残業時間を自動算出する。
      // const midnightOver = midnightOvertime(selected.starttime, selected.endtime, selected.work);
      // selected.midnightOvertime = midnightOver/60;

      //20時15分から6時15分まで勤務した場合、22時から5時にかかる残業時間が-15になるので0になるようにする。
      // if(selected.midnightOvertime < 0){
      //   selected.midnightOvertime = 0
      // }
        selected.show = true;
        console.log(this.meisaiList);
    },

    //「キャンセル」ボタンを押した時の動作。
    //キャンセルボタンを押した編集明細に空データを代入する。
    cancel: function (selected) {
      selected.editWork = "";
      selected.nightWork = "";
      selected.editStartTime = "";
      selected.editEndTime = "";
      selected.editworkTime = "";
      selected.editmidnightWorkTime = "";
      selected.editRestTime = "";
      selected.editOverTime = "";
      selected.editMidnightOverTime = "";
      selected.editReason = "";
      selected.editPaidTime = "";
      selected.show = true;
    },

    //「削除」ボタンを押した時に日付と曜日以外の列の値を空データにする。
    deleate: function (element) {
      element.work = "";
      element.nightWork = "";
      element.starttime = "";
      element.endtime = "";
      element.workTime = "";
      element.midnightWorkTime = "";
      element.restTime = "";
      element.overtime = "";
      element.midnightOvertime = "";
      element.reason = "";
      element.paidTime = "";
      this.total();
    },

  //「一時保存」ボタンを押した時に、statusを1(一時保存)に更新してリクエストを送信する
    temporarilySaved: function(){
      //提出者が未入力の場合は一時保存に失敗する。
      if(this.submitter == null){
        alert('提出者が未入力の為、一時保存に失敗しました。');
      } 
       else {
        //一時保存ボタンを押した時はstatusを1(一時保存)に更新する。
        const momentYear = this.dispMoment.year();
        const momentMonth = this.dispMoment.month()+1;
        this.status = 1;
        const url = `http://127.0.0.1:8000/api/submission/${momentYear}/${momentMonth}`;
        //エンドポイントにクエリパラメータでpostでリクエストを送信する。
        axios.post(url,{data:this.meisaiList,status:this.status,submitter:this.submitter})
        //送信結果をレスポンスという引数で受け取る。
        .then((response) => {
          console.log(response) 
        });
        alert('入力データを一時保存しました。');
      }
    },

   //「提出」ボタンを押した時に、本当に提出するか選択するようにする。
    subMission: function(){
      const countMeisaiNull = this.meisaiNullCheck();

      if(!confirm("提出しますか？")){
        return false;
      }

       //提出者が未入力である場合。
      if(this.submitter == null ){
        alert("提出者が未入力の為、提出に失敗しました。");
        return false;
      }

       //未入力の明細がある場合
      // if(countMeisaiNull > 0){
      //   //alert("勤務、勤務開始、勤務終了が未入力の行が"+countMeisaiNull+"行あります。再度見直してください。");
      //   alert(`勤務、勤務開始、勤務終了が未入力の行が ${countMeisaiNull}行あります。再度見直してください。`);
      //   return false;
      // }
      //提出者が入力済み、かつ未入力の明細が無い場合。
      const momentYear = this.dispMoment.year();
      const momentMonth = this.dispMoment.month()+1;
      //statusを2(提出)に更新する。
      this.status = 2;
      const url = `http://127.0.0.1:8000/api/submission/${momentYear}/${momentMonth}`;
      //エンドポイントにクエリパラメータでpostでリクエストを送信する。

      const data = {
        data:this.meisaiList,
        status:this.status,
        submitter:this.submitter
      }
      axios.post(url,data)
        .then((response) => {//送信結果をレスポンスという引数で受け取る。
          console.log(response) 
        });
    },
 
    //表示月で最も直近に一時保存されたデータを取得する。
    //その際に取得したデータのstatus(getStatus)が1だった場合は一時保存、2だった場合は提出済み、3だった場合は差戻しという進捗を表示し、
    //2の場合は提出ボタンを非表示とする。
    read: function(){
      const momentYear = this.dispMoment.year();
      const momentMonth = this.dispMoment.month()+1;
      const url = `http://127.0.0.1:8000/api/kintai/${momentYear}/${momentMonth}`;

      // const url = `http://127.0.0.1:8000/api/kintai/2022/6`;
      axios.get(url).then(response => {
        // console.log(JSON.stringify(response))
        if(response.data.kintai === undefined){
          this.meisaiList = calendarDay(moment());
        } 
         else {
          this.meisaiList = response.data.kintai;
          console.log(response.data.kintai)
        }
        this.submitter = response.data.submitter;
        this.getStatus = response.data.status;
  
        console.log(this.meisaiList)
        this.total();
        }
      )
    },

    //明細(meisaiList)のwork、startTime、endTimeプロパティがどれか一つでもnullになっている行について、何行あるかチェックする。
    meisaiNullCheck: function() {
      let count = 0;
      for(let i = 0; i < this.meisaiList.length; i++) {
       if(this.meisaiList[i].work == null || this.meisaiList[i].starttime == null || this.meisaiList[i].endtime ==null){
        count = count + 1;
        }
      }
      return count;
    },

    //それぞれの合計を算出
    total: function () {
      this.totalWork = totalWorkday(this.meisaiList);
      this.totalTime = totalWorktime(this.meisaiList);
      this.totalMidnightWorkTime = totalWorkMidnightWorkTime(this.meisaiList);
      this.totalOverTime = totalWorkOverTime(this.meisaiList);
      this.totalMidnightOverTime = totalWorkMidnightOverTime(this.meisaiList);
      this.totalOndutyWork = totalOnduty(this.meisaiList);
      this.totalHolidayOverTime = totalWorkOverTimeHoliday(this.meisaiList);
      this.totalPaidTime = totalPaid(this.meisaiList);
    },
    
  },

  computed: {
    //表示月を作成する。
    dispMoment: function () {
      //現在の日時からcurrentプロパティをの数値分の月数を引く。
      return moment().add(this.current, "months");
    },
    //表示しているかカレンダーが現在月と一致しているかチェック
    calendarMonthCheck: function () {
      const month = moment().month();
      return  this.dispMoment.month() == month;
    },

    dispMomentFormat: function () {
      //現在の日時のフォーマットを"YYYY年MM"月の形式に変換する。
      return this.dispMoment.format("YYYY年MM月");
    }
  }
};
</script>
