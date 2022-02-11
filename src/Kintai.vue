
<template>
<div class="container mx-auto">
  <div style="padding: 10px; margin-bottom: 10px; border: 1px dashed #333333;">
　<p class = "title">【勤怠表入力】</p>
  <p>({{ subjectMonth }})
     <button type="button" class="btn btn-primary" @click="goPrevMonth">前月</button>
     <button type="button" class="btn btn-primary" @click="goNextMonth">次月</button>
     <button type="button" class="btn btn-warning" @click="subMission">提出</button>
     <!-- <button @click="totalWorktime">検証用</button>
     <button @click="testtest">検証用2</button> -->
  </p>
  <div> 
  <p>合計勤務日数：{{ totalWork }}日</p>
  <p>合計従業時間：{{ totalTime }}分</p>
  <p>合計残業時間：{{ totalOverTime }}分 (内　22時以降の残業時間：{{totalMidnightOverTime}}分　　法定休日(日曜日)の残業時間：{{totalHolidayOverTime}}分)</p>
  <p>　　当直回数：{{ totalOndutyWork }}回</p>
  <p>　　有給時間：{{ totalPaidTime }}分</p>
  </div>
  </div>~
         <table class="table">
           <thead thead class="table-light">
           <tr>
                <th>日付</th><th>曜日</th><th>勤務</th><th>勤務開始時間</th><th>勤務終了時間</th><th>従業時間</th><th>昼休憩</th><th>残業時間</th><th>22時～5時の残業</th><th>残業理由・その他備考</th><th>有給時間</th>
           </tr>
           </thead>
           <tbody>
             <tr v-for="(element,index) of meisai" key="index" >
                <td>{{element.day}}</td>
                <td v-bind:class="{blue: element.isSaturday, red: element.isSunday }">{{element.week}}</td>
                <td v-if="element.show">{{element.work}}</td>
                <td v-if="!element.show">
                 <select v-model="element.editWork">
                      <option value=〇>〇</option>
                      <option value=〇/当>〇/当</option>
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
                </td>
                <td v-if="element.show">{{searchTimeListValue(element.starttime)}}</td>
                <td v-if="!element.show">
                  <select v-model="element.editStartTime">
                      <option v-for="time in timeList" :value="time.value">
                      {{time.text}}
                      </option>
                  </select>
                </td>
                <td v-if="element.show">{{searchTimeListValue(element.endtime)}}</td>
                <td v-if="!element.show">
                   <select v-model="element.editEndTime" >
                      <option v-for="time in timeList" :value="time.value">
                      {{time.text}}
                      </option>
                   </select>
                </td>
                <td>{{element.workTime}}</td>
                <td>{{element.restTime}}</td>
                <td>{{element.overtime}}</td>
                <td>{{element.midnightOvertime}}</td>

                <td v-if="element.show">{{element.reason}}</td>
                <td v-if="!element.show">
                 <input v-model="element.editReason">
                </td>
                <td v-if="element.show">{{element.paidTime}}</td>
                <td v-if="!element.show">
                <select v-model="element.editPaidTime">
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
                  </td>
                <td v-if="element.show"><button class="btn btn-outline-dark" v-on:click="edit(element)" >編集</button>
                </td>
                <td v-if="element.show"><button class="btn btn-outline-dark" v-on:click="deleate(element);totalWorkday()" >削除</button>
                </td>
                <td v-if="!element.show">
                <button class="btn btn-outline-dark" v-on:click="confirm(element);total()" >確定</button>
                </td>
                <td v-if="!element.show">
                <button class="btn btn-outline-dark" v-on:click="cancel(element)" >キャンセル</button>
                </td>

                  <div v-if="element.show">
                  </div>

　　         </tr>
            </tbody>
         </table>
  </div>

</template>

<script>
//同じ階層にあるkintai.jsを読み込む。
import { workTime, overtime, midnightOvertime } from "./kintai";

export default {
  data() {
    return {
      current: 0,
      meisaiList: null,
      timeList:[
        {id : 1, value:495, text: "8:15" },
        {id : 2, value:525, text: "8:45" },
        {id : 3, value:555, text: "9:15" },
        {id : 4, value:585, text: "9:45" },
        {id : 5, value:615, text: "10:15" },
        {id : 6, value:645, text: "10:45" },
        {id : 7, value:675, text: "11:15" },
        {id : 8, value:705, text: "11:45" },
        {id : 9, value:735, text: "12:15" },
        {id : 10, value:765, text: "12:45" },
        {id : 11, value:795, text: "13:15" },
        {id : 12, value:825, text: "13:45" },
        {id : 13, value:855, text: "14:15" },
        {id : 14, value:885, text: "14:45" },
        {id : 15, value:915, text: "15:15" },
        {id : 16, value:945, text: "15:45" },
        {id : 17, value:975, text: "16:15" },
        {id : 18, value:1005, text: "16:45" },
        {id : 19, value:1035, text: "17:15" },
        {id : 20, value:1065, text: "17:45" },
        {id : 21, value:1095, text: "18:15" },
        {id : 22, value:1125, text: "18:45" },
        {id : 23, value:1155, text: "19:15" },
        {id : 24, value:1185, text: "19:45" },
        {id : 25, value:1215, text: "20:15" },
        {id : 26, value:1245, text: "20:45" },
        {id : 27, value:1275, text: "21:15" },
        {id : 28, value:1305, text: "21:45" },
        {id : 29, value:1335, text: "22:15" },
        {id : 30, value:1365, text: "22:45" },
        {id : 31, value:1395, text: "23:15" },
        {id : 32, value:1425, text: "23:45" },
        {id : 33, value:1455, text: "00:15" },
        {id : 34, value:1485, text: "00:45" },
        {id : 35, value:1515, text: "1:15" },
        {id : 36, value:1545, text: "1:45" },
        {id : 37, value:1575, text: "2:15" },
        {id : 38, value:1605, text: "2:45" },
        {id : 39, value:1635, text: "3:15" },
        {id : 40, value:1665, text: "3:45" },
        {id : 41, value:1695, text: "4:15" },
        {id : 42, value:1725, text: "4:45" },
        {id : 43, value:1755, text: "5:15" },
        {id : 44, value:1785, text: "5:45" },
        {id : 45, value:1815, text: "6:15" },
        {id : 46, value:1845, text: "6:45" },
        {id : 47, value:1875, text: "7:15" },
        {id : 48, value:1905, text: "7:45" },
        {id : 49, value:1920, text: "8:00" },
      ],
      //勤務日数の合計
      totalWork: 0,
      //従業時間の合計
      totalTime: 0,
      //残業時間の合計
      totalOverTime: 0,
      //有給時間の合計
      totalPaidTime: 0,
      //22時以降の残業時間の合計
      totalMidnightOverTime: 0,
      //法定休日の残業時間の合計
      totalHolidayOverTime: 0,
      //当直の合計
      totalOndutyWork: 0,
    };
  },

  methods: {
    //日付をYYYY-MM-DDにの形に整形する。
    formatDate: function (dt) {
      const y = dt.getFullYear();
      const m = ("00" + (dt.getMonth() + 1)).slice(-2);
      const d = ("00" + dt.getDate()).slice(-2);
      const result = y + "-" + m + "-" + d;
      return result;
    },
    //対象月を前月にする処理。
    goPrevMonth() {
      this.current--;
    },
    //対象月を次月にする処理。
    goNextMonth() {
      this.current++;
    },

    //「編集」ボタンを押した時に明細を編集する。
    edit: function (selectedElement) {
      selectedElement.editWork = selectedElement.work;
      selectedElement.editStartTime = selectedElement.starttime;
      selectedElement.editEndTime = selectedElement.endtime;
      selectedElement.editWorkTime = selectedElement.workTime;
      selectedElement.editRestTime = selectedElement.restTime;
      selectedElement.editOverTime = selectedElement.overtime;
      selectedElement.editMidnightOverTime = selectedElement.midnightOvertime;
      selectedElement.editReason = selectedElement.reason;
      selectedElement.editPaidTime = selectedElement.paidTime;
      selectedElement.show = false;
    },

    //「確定」ボタンを押した時の動作
    confirm: function (selectedElement) {
      selectedElement.work = selectedElement.editWork;
      selectedElement.starttime = selectedElement.editStartTime;
      selectedElement.endtime = selectedElement.editEndTime;
      const work = selectedElement.work;
      const starttime = selectedElement.starttime;
      const endtime = selectedElement.endtime;
      //明細の従業時間を自動算出する。
      const worktime = workTime(starttime, endtime, work);
      selectedElement.workTime = worktime;
      //明細の休憩時間を自動算出する。
      if (selectedElement.workTime >= 450) {
        selectedElement.restTime = 60;
      } else {
        selectedElement.restTime = 0;
      }
      //明細の残業時間を自動算出する。
      const over = overtime(starttime, endtime, work);
      selectedElement.overtime = over;
      //明細の22時以降の残業時間を自動算出する。
      const midnightOver = midnightOvertime(starttime, endtime, work);
      selectedElement.midnightOvertime = midnightOver;
      //明細で編集した残業理由を残業理由に代入する。
      selectedElement.reason = selectedElement.editReason;
      selectedElement.paidTime = selectedElement.editPaidTime;
      selectedElement.show = true;
      console.log(this.meisaiList);
    },

    //「キャンセル」ボタンを押した時の動作。
    //キャンセルボタンを押した編集明細に空データを代入する。
    cancel: function (selectedElement) {
      selectedElement.editWork = "";
      selectedElement.editStartTime = "";
      selectedElement.editEndTime = "";
      selectedElement.editworkTime = "";
      selectedElement.editRestTime = "";
      selectedElement.editOverTime = "";
      selectedElement.editMidnightOverTime = "";
      selectedElement.editReason = "";
      selectedElement.editPaidTime = "";
      selectedElement.show = true;
    },

    //「削除」ボタンを押した時に日付と曜日以外の列の値を空データにする。
    deleate: function (element) {
      element.work = "";
      element.starttime = "";
      element.endtime = "";
      element.workTime = "";
      element.restTime = "";
      element.overtime = "";
      element.midnightOvertime = "";
      element.reason = "";
      element.paidTime = "";
      this.total();
    },

   //「提出」ボタンを押した時に、本当に提出するか選択するようにする。
    subMission: function(){
      const a = confirm("提出しますか？");
      console.log(a)
      if(""){
        console.log("こんにちは")
      } else {
        console.log("こんばんは")
      }
    },


    //合計勤務日数を計算する。
    totalWorkday: function () {
      this.totalWork = 0;
      for (let i = 0; i < this.calendarData; i++) {
        if (
          this.meisaiList[i].work == "〇" ||
          this.meisaiList[i].work == "〇/当"
        ) {
          this.totalWork = this.totalWork + 1;
        } else if (
          this.meisaiList[i].work == "A/公" ||
          this.meisaiList[i].work == "公/A" ||
          this.meisaiList[i].work == "A/有" ||
          this.meisaiList[i].work == "有/A"
        ) {
          this.totalWork = this.totalWork + 0.5;
        }
      }
      console.log(this.totalWork);
    },

    //合計従業時間を計算する。
    totalWorktime: function () {
      this.totalTime = 0;
      for (let i = 0; i < this.calendarData; i++) {
        if (this.meisaiList[i].workTime == "") {
          this.totalTime = this.totalTime + 0;
        } else {
          this.totalTime = this.totalTime + this.meisaiList[i].workTime;
        }
      }
    },

    //合計残業時間を計算する。
    totalWorkOverTime: function () {
      this.totalOverTime = 0;
      for (let i = 0; i < this.calendarData; i++) {
        if (this.meisaiList[i].overtime == "") {
          this.totalOverTime = this.totalOverTime + 0;
        } else {
          this.totalOverTime = this.totalOverTime + this.meisaiList[i].overtime;
        }
      }
    },

    //合計の22時以降の残業を計算する。
    totalWorkMidnightOverTime: function () {
      this.totalMidnightOverTime = 0;
      for (let i = 0; i < this.calendarData; i++) {
        if (this.meisaiList[i].midnightOvertime == "") {
          this.totalMidnightOverTime = this.totalMidnightOverTime + 0;
        } else {
          this.totalMidnightOverTime =
            this.totalMidnightOverTime +
            Number(this.meisaiList[i].midnightOvertime);
        }
      }
    },

    //合計当直回数を計算する。
    totalOnduty: function () {
      this.totalOndutyWork = 0;
      for (let i = 0; i < this.calendarData; i++) {
        if (
          this.meisaiList[i].work == "公/当" ||
          this.meisaiList[i].work == "〇/当"
        ) {
          this.totalOndutyWork = this.totalOndutyWork + 1;
        }
      }
    },

    //法定休日の合計残業時間を計算する。
    totalWorkOverTimeHoliday: function () {
      this.totalHolidayOverTime = 0;
      for (let i = 0; i < this.calendarData; i++) {
        if (this.meisaiList[i].week == "(日)") {
          this.totalHolidayOverTime =
            this.totalHolidayOverTime + this.meisaiList[i].overtime;
        }
      }
      console.log(this.totalHolidayOverTime);
    },

    //有給の合計時間を計算する。
    totalPaid: function () {
      this.totalPaidTime = 0;
      for (let i = 0; i < this.calendarData; i++) {
        if (this.meisaiList[i].paidTime == "") {
          this.totalPaidTime = Number(this.totalPaidTime) + 0;
        } else {
          this.totalPaidTime =
            Number(this.totalPaidTime) + Number(this.meisaiList[i].paidTime);
        }
      }
    },

    //timeListの中から確定した時間と同じvalueのオブジェクトを探す。
    searchTimeListValue:function(time){
      const a = this.timeList.filter((ele) => {
        return time == ele.value;
      });
      if(a[0]==null){
      return "";
      }
      return a[0].text;
    },

    //それぞれの合計を算出
    total: function () {
      this.totalWorktime();
      this.totalWorkday();
      this.totalWorkOverTime();
      this.totalWorkMidnightOverTime();
      this.totalOnduty();
      this.totalWorkOverTimeHoliday();
      this.totalPaid();
    },
  },

  computed: {
    //対象月を作成する。
    currentMoment: function () {
      //現在の日時からcurrentプロパティをの数値分の月数を足す。
      return moment().add(this.current, "months");
    },
    subjectMonth() {
      //現在の日時のフォーマットを"YYYY年MM"月の形式に変換する。
      return this.currentMoment.format("YYYY年MM月");
    },

    //今月の日数を取得　ex)2021年11月30なら30を返す。
    calendarData: function () {
      const numOfMonth = this.currentMoment.endOf("month").date();
      console.log(numOfMonth);
      //const daysOfMonth = [...Array(numOfMonth).keys()].map(i => ++i)
      //console.log(daysOfMonth)
      return numOfMonth;
    },
    //今月の最初の日の曜日を取得。
    calendarFirstdayWeek() {
      // この月の1日の曜日（0~6の数値で取得）(ex:月曜日であれば1を取得)
      const firstWeekDay = this.currentMoment.startOf("month").weekday();
      console.log(firstWeekDay);
      return firstWeekDay;
    },

    //今月のカレンダーのオブジェクトを作成。ex)2021年11月なら30日分のオブジェクト。
    calendarDay: function () {
      let Calendar = {};
      let CalendarArray = [];

      //今月の最初の日の曜日をFirstdayWeekに代入　ex)2021年12月の場合は、1日は水曜日となる為、3を代入。
      //土曜日の場合はisSaturdayをtrueにする。
      //日曜日の場合はisSundayをtrueにする。
      let FirstdayWeek = this.calendarFirstdayWeek; //曜日の値を日～月に変換する為の配列を用意する。
      const japanWeek = [
        "(日)",
        "(月)",
        "(火)",
        "(水)",
        "(木)",
        "(金)",
        "(土)",
      ];

      for (let i = 1; i <= this.calendarData; i++) {
        Calendar.day = i;
        Calendar.week = japanWeek[FirstdayWeek];
        if (Calendar.week == "(土)") {
          Calendar.isSunday = false;
          Calendar.isSaturday = true;
        } else if (Calendar.week == "(日)") {
          Calendar.isSaturday = false;
          Calendar.isSunday = true;
        } else {
          Calendar.isSaturday = false;
          Calendar.isSunday = false;
        }
        Calendar.work = "";
        Calendar.starttime = "";
        Calendar.endtime = "";
        Calendar.workTime = "";
        Calendar.restTime = "";
        Calendar.overtime = "";
        Calendar.midnightOvertime = "";
        Calendar.reason = "";
        Calendar.paidTime = "";
        Calendar.editWork = "";
        Calendar.editStartTime = "";
        Calendar.editEndTime = "";
        Calendar.editRestTime = "";
        Calendar.editOverTime = "";
        Calendar.editMidnightOvertime = "";
        Calendar.editReason = "";
        Calendar.editPaidTime = "";
        Calendar.show = true;
        CalendarArray.push({ ...Calendar });
        if (FirstdayWeek == 6) {
          FirstdayWeek = FirstdayWeek - 6;
        } else {
          FirstdayWeek = FirstdayWeek + 1;
        }
      }
      return CalendarArray;
    },

    meisai: function () {
      this.meisaiList = this.calendarDay;
      console.log(this.meisaiList);
      return this.meisaiList;
    },
  },
};
</script>

<style>
#app {
  margin-top: 60px;
}
.title {
  font-size: 24px;
}

.red {
  color: #ff0000;
}
.blue {
  color: #0000ff;
}

td,
th {
  text-align: center;
}

th {
  text-align: center;
}
</style>
