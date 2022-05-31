
<template>
<div class="container mx-auto container-fluid" style="background-color: #FFFCFB" >
  <div class = "head" style="padding: 10px; border: 1px dashed #333333;">
    <p class = "title">【勤怠表入力】
      提出者：<input type="text" v-model = "submitter">
    </p>
    <p>({{ subjectMonth }})
      <button type="button" class="btn btn-primary" @click="goPrevMonth">前月</button>　
      <button type="button" class="btn btn-warning" @click="subMission">提出</button>　
      <button type="button" class="btn btn btn-info" @click="temporarilySaved">一時保存</button>
      <button type="button" class="btn btn btn-info" @click="read">保存データ読み込み</button>
      <!-- <button @click="totalWorktime">検証用</button> -->
    </p>
    <div> 
      <p>合計勤務日数：{{ totalWork }}日</p>
      <p>合計従業時間：{{ totalTime }}時間 (内　22時～5時の従業時間：{{totalMidnightWorkTime}}時間)</p>
      <p>合計残業時間：{{ totalOverTime }}時間 (内　22時～5時の残業時間：{{totalMidnightOverTime}}時間　　法定休日(日曜日)の残業時間：{{totalHolidayOverTime}}時間)</p>
      <p>    当直回数：{{ totalOndutyWork }}回</p>
      <p>    夜勤回数：{{ totalNightWork }}回</p>
      <p>    有給時間：{{ totalPaidTime }}分</p>
    </div>
  </div>
  <div>
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
          <td>{{element.day}}</td>
          <td v-bind:class="{blue: element.isSaturday, red: element.isSunday }">{{element.week}}</td>
          <td v-if="element.show">{{element.work}}</td>
          <td v-if="!element.show">
            <select v-model="element.editWork" v-on:change="selectedWork(element)">
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
          </td>
          <!-- 勤務開始時間は勤務が深夜でも深夜以外でも共通のシフトを使用する -->
          <td v-if="element.show">{{searchDayShiftValue(element.starttime)}}</td>
          <td v-if="!element.show">
            <select v-model="element.editStartTime">
              <option v-for="time in dayShift" :value="time.value">
                {{time.text}}
              </option>
            </select>
          </td>
          <!-- 勤務が深夜以外の場合の勤務終了時間はdayShiftを使用 -->
          <td v-if="element.show && !element.nightWork">{{searchDayShiftValue(element.endtime)}}</td>
          <td v-if="!element.show && !element.nightWork">
            <select v-model="element.editEndTime">
              <option v-for="time in dayShift" :value="time.value">
                {{time.text}}
              </option>
            </select>
          </td>
          <!-- 勤務が深夜の場合の勤務終了時間はnightShiftを使用 -->
          <td v-if="element.show &&  element.nightWork">{{searchNightShiftValue(element.endtime)}}</td>
          <td v-if="!element.show && element.nightWork">
            <select v-model="element.editEndTime">
              <option v-for="time in nightShift" :value="time.value">
                {{time.text}}
              </option>
            </select>
          </td>
          <td>{{element.workTime}}</td>
          <td>{{element.midnightWorkTime}}</td>
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
          <td v-if="element.show">
            <button class="btn btn-outline-dark" v-on:click="edit(element)" >編集</button>
          </td>
          <td v-if="element.show">
            <button class="btn btn-outline-dark" v-on:click="deleate(element);totalWorkday()" >削除</button>
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
</div>
</template>

<script>
//同じ階層にあるkintai.jsを読み込む。
import { workTime, overTime, midnightOvertime, midnightWorkTime } from "./kintai";

const subjectMonth = (targetMonth) => {
  //現在の日時のフォーマットを"YYYY年MM"月の形式に変換する。
  return targetMonth.format("YYYY年MM月");
};

// const momentYear = (targetMonth) => {
//   return targetMonth.add(this.current, "months")
// };

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

//dayShiftを作成する。
const makeDayShift = () => {
  let dayShift = {};
  let dayShiftArray = [];
  let valueTimeHour = 7;
  let valueTimeMinute = 45;
  let textTimeHour = 7;
  let textTimeMinute = 45;
  for (let i = 1; i <= 49; i++) {
    dayShift.id = i;
    if(valueTimeMinute == 15 && dayShift.id != 33) {
      valueTimeMinute = valueTimeMinute + 30;
      textTimeMinute = textTimeMinute + 30;
      dayShift.value = String(valueTimeHour)+":"+String(valueTimeMinute);
      dayShift.text = String(textTimeHour)+":"+String(textTimeMinute);
    } 
      else if (valueTimeMinute == 45 && dayShift.id != 33) {
      valueTimeMinute = 15;
      valueTimeHour = valueTimeHour + 1;
      textTimeMinute = 15; 
      textTimeHour = textTimeHour + 1;
      dayShift.value = String(valueTimeHour)+":"+String(valueTimeMinute);
      dayShift.text = String(textTimeHour)+":"+String(textTimeMinute);
    } 
      else {
      valueTimeHour = valueTimeHour + 1;
      valueTimeMinute = 15;
      textTimeHour = textTimeHour - 23;
      textTimeMinute = 15;
      dayShift.value = String(valueTimeHour)+":"+String(valueTimeMinute);
      dayShift.text = String(textTimeHour)+":"+String(textTimeMinute);
    } 
      dayShiftArray.push({ ...dayShift});            
  }
  return dayShiftArray;
};

//nightShiftを作成する。
const makeNightShift = () => {
  let nightShift = {};
  let nightShiftArray = [];
  let valueTimeHour = 31;
  let valueTimeMinute = 45;
  let textTimeHour = 7;
  let textTimeMinute = 45;
  const idCheack = [11,33]
  for (let i = 1; i <= 49; i++) {
    nightShift.id = i;
    let cheack = idCheack.includes(nightShift.id);
    if(valueTimeMinute == 15 && cheack == false) {
      valueTimeMinute = valueTimeMinute + 30;
      textTimeMinute = textTimeMinute + 30;
      nightShift.value = String(valueTimeHour)+":"+String(valueTimeMinute);
      nightShift.text = String(textTimeHour)+":"+String(textTimeMinute);
    } 
      else if (valueTimeMinute == 45 && cheack == false) {
      valueTimeMinute = 15;
      valueTimeHour = valueTimeHour + 1;
      textTimeMinute = 15; 
      textTimeHour = textTimeHour + 1;
      nightShift.value = String(valueTimeHour)+":"+String(valueTimeMinute);
      nightShift.text = String(textTimeHour)+":"+String(textTimeMinute);
    } 
      else if(nightShift.id == 11) {
      textTimeHour = textTimeHour + 1;
      valueTimeMinute = 15;
      valueTimeHour = valueTimeHour - 23;
      textTimeMinute = 15;
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
}

export default {
  data() {
    return {
      //カレンダー表示月
      caldendarMonth: null,
      current: 0,
      meisaiList: null,
      //日勤シフト
      dayShift: null,
      //夜シフト
      nightShift: null,
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
      //読み込みデータ
      readData : null
    };
  },
  mounted(){
    this.meisaiList = calendarDay(moment());
    this.dayShift = makeDayShift();
    this.nightShift = makeNightShift();
    console.log(this.dayShift);
    console.log(this.nightShift);
  },

  methods: {
    //対象月を前月にする処理。
    //前月のdateで最後に保存したレコードをテーブルから取得する。
    goPrevMonth() {
      this.current--;
      this.meisaiList = calendarDay(moment().add(this.current, "months"));
    },

    //勤務で"深夜"を選んだ場合はnightWorkをtrueにして、勤務終了時間に使用するshiftをわける。
    selectedWork(selectedElement) {
      if(selectedElement.editWork == "深夜"){
        selectedElement.nightWork = true;
      } 
       else {
        selectedElement.nightWork = false;
      }
        console.log(selectedElement.nightWork)
    },

    //「編集」ボタンを押した時に明細を編集する。
    edit: function (selectedElement) {
      selectedElement.editWork = selectedElement.work;
      selectedElement.editStartTime = selectedElement.starttime;
      selectedElement.editEndTime = selectedElement.endtime;
      selectedElement.editWorkTime = selectedElement.workTime;
      selectedElement.editMidnightWorkTime = selectedElement.midnightWorkTime;
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
      const start = starttime.split(":");
      const startTimeMinute = Number(start[0] * 60) + Number(start[1]);
      const end = endtime.split(":");
      const endTimeMinute = Number(end[0] * 60) + Number(end[1]);
      //明細の従業時間を自動算出する。
      selectedElement.workTime = workTime(starttime, endtime, work)/60;
      //明細の22時～5時にかかる従業時間を自動算出する
      selectedElement.midnightWorkTime =  midnightWorkTime(starttime, endtime)/60;
      console.log(selectedElement.midnightWorkTime)
      //勤務開始22:15	勤務終了5:15等、明細の22時～5時にかかる従業時間が従業時間を超えていた場合は従業時間を2時～5時にかかる従業時間とする。
      if(selectedElement.midnightWorkTime > selectedElement.workTime){
        selectedElement.midnightWorkTime = selectedElement.workTime;
      }
      //明細の休憩時間を自動算出する。
      if (endTimeMinute - startTimeMinute >= 480) {
        selectedElement.restTime = "60分";
      } 
       else if(endTimeMinute - startTimeMinute < 480 && endTimeMinute - startTimeMinute >= 360) {
        selectedElement.restTime = "45分";
      } 
       else {
        selectedElement.restTime = 0;
      }
      //明細の残業時間を自動算出する。
      selectedElement.overtime = overTime(starttime, endtime, work)/60;
      //明細の22時～5時にかかる残業時間を自動算出する。
      const midnightOver = midnightOvertime(starttime, endtime, work);
      selectedElement.midnightOvertime = midnightOver/60;
      //20時15分から6時15分まで勤務した場合、22時から5時にかかる残業時間が-15になるので0になるようにする。
      if(selectedElement.midnightOvertime<0){
        selectedElement.midnightOvertime = 0
      }
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
      selectedElement.nightWork = "";
      selectedElement.editStartTime = "";
      selectedElement.editEndTime = "";
      selectedElement.editworkTime = "";
      selectedElement.editmidnightWorkTime = "";
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
        const momentYear = this.currentMoment.year();
        const momentMonth = this.currentMoment.month();
        this.status = 1;
        const url = "http://127.0.0.1:8000/api/submission/${momentYear}/${momentMonth}";
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
      const a = confirm("提出しますか？");
      console.log(a)
      if(a && this.submitter!== null){
        //提出ボタンを押した時はstatusを2(提出)に更新する。
        const momentYear = this.currentMoment.year();
        const momentMonth = this.currentMoment.month();
        this.status = 2;
        console.log(this.status);
        console.log(this.submitter);
        const url = "http://127.0.0.1:8000/api/submission/${momentYear}/${momentMonth}";
        //エンドポイントにクエリパラメータでpostでリクエストを送信する。
        axios.post(url,{data:this.meisaiList,status:this.status,submitter:this.submitter})
        //送信結果をレスポンスという引数で受け取る。
        .then((response) => {
        console.log(response) 
        });
      } 
       else if(a && this.submitter == null) {
        alert('提出者が未入力の為、提出に失敗しました。');
      } 
       else {
        console.log("提出しませんでした。");
      }
    },
 
    //「保存データ読み込み」ボタンを押した時に、statusが1(一時保存)かつ表示月で最も直近に一時保存されたデータを取得する。
    //`/temporary-kintai/${yesr}/${month}`
    read: function(){
      const momentYear = this.currentMoment.year();
      const momentMonth = this.currentMoment.month();
      // console.log(momentYear);
      // console.log(momentMonth);
      const url = "http://127.0.0.1:8000/api/temporary-kintai/${momentYear}/${momentMonth}";
      // const url = "http://127.0.0.1:8000/api/temporary-kintai";
      axios.get(url).then(response => {
        this.meisaiList = response.data[0].kintai;
        this.submitter = response.data[0].submitter;
        console.log(this.meisaiList);
        this.total();
        }
      )
    },

    //合計勤務日数を計算する。
    totalWorkday: function () {
      this.totalWork = 0;
      const fullWork = ["〇","〇/当","深夜"];
      const herfWork = ["A/公","公/A","A/有","有/A"];
      for (let i = 0; i < this.meisaiList.length; i++) {
        let fullWorkCheack = fullWork.includes(this.meisaiList[i].work);
        let herfWorkCheack = herfWork.includes(this.meisaiList[i].work);
        if (fullWorkCheack == true) {
          this.totalWork = this.totalWork + 1;
        } 
         else if (herfWorkCheack == true) {
          this.totalWork = this.totalWork + 0.5;
        } 
      }
    },

    //合計従業時間を計算する。
    totalWorktime: function () {
      this.totalTime = 0;
      for (let i = 0; i < this.meisaiList.length; i++) {
        if (this.meisaiList[i].workTime == "") {
          this.totalTime = this.totalTime + 0;
        } 
         else {
          this.totalTime = this.totalTime + this.meisaiList[i].workTime;
        }
      }
    },

    //合計の22時～5時にかかる従業時間を計算する。
    totalWorkMidnightWorkTime: function () {
      this.totalMidnightWorkTime = 0;
      for (let i = 0; i < this.meisaiList.length; i++) {
        if (this.meisaiList[i].midnightWorkTime == "") {
          this.totalMidnightWorkTime = this.totalMidnightWorkTime + 0;
        } 
         else {
          this.totalMidnightWorkTime = this.totalMidnightWorkTime + Number(this.meisaiList[i].midnightWorkTime);
         }
        }
      },

    //合計残業時間を計算する。
    totalWorkOverTime: function () {
      this.totalOverTime = 0;
      for (let i = 0; i < this.meisaiList.length; i++) {
        if (this.meisaiList[i].overtime == "") {
          this.totalOverTime = this.totalOverTime + 0;
        } 
         else {
          this.totalOverTime = this.totalOverTime + this.meisaiList[i].overtime;
        }
      }
    },

    //合計の22時～5時にかかる残業を計算する。
    totalWorkMidnightOverTime: function () {
      this.totalMidnightOverTime = 0;
      for (let i = 0; i < this.meisaiList.length; i++) {
        if (this.meisaiList[i].midnightOvertime == "") {
          this.totalMidnightOverTime = this.totalMidnightOverTime + 0;
        } 
         else {
          this.totalMidnightOverTime = this.totalMidnightOverTime + Number(this.meisaiList[i].midnightOvertime);
        }
      }
    },

    //合計当直回数を計算する。
    totalOnduty: function () {
      this.totalOndutyWork = 0;
      const onDuty = ["〇/当","公/当"];
      for (let i = 0; i < this.meisaiList.length; i++) {
        let onDutyCheack = onDuty.includes(this.meisaiList[i].work);
        if (onDutyCheack == true) {
          this.totalOndutyWork = this.totalOndutyWork + 1;
        }
      }
    },

    //法定休日の合計残業時間を計算する。
    totalWorkOverTimeHoliday: function () {
      this.totalHolidayOverTime = 0;
      for (let i = 0; i < this.meisaiList.length; i++) {
        if (this.meisaiList[i].week == "(日)") {
          this.totalHolidayOverTime = this.totalHolidayOverTime + this.meisaiList[i].overtime;
        }
      }
      console.log(this.totalHolidayOverTime);
    },

    //有給の合計時間を計算する。
    totalPaid: function () {
      this.totalPaidTime = 0;
      for (let i = 0; i < this.meisaiList.length; i++) {
        if (this.meisaiList[i].paidTime == "") {
          this.totalPaidTime = Number(this.totalPaidTime) + 0;
        } 
         else {
          this.totalPaidTime = Number(this.totalPaidTime) + Number(this.meisaiList[i].paidTime);
        }
      }
    },

    //それぞれの合計を算出
    total: function () {
      this.totalWorkday();
      this.totalWorktime();
      this.totalWorkMidnightWorkTime();
      this.totalWorkOverTime();
      this.totalWorkMidnightOverTime();
      this.totalOnduty();
      this.totalWorkOverTimeHoliday();
      this.totalPaid();
    },

    //dayShiftの中から確定した時間と同じvalueのオブジェクトを探す。
    searchDayShiftValue:function(time){
      const a = this.dayShift.filter((ele) => {
        return time == ele.value;
      });
      if(a[0]==null){
      return "";
      }
      return a[0].text;
    },

    //nightShiftの中から確定した時間と同じvalueのオブジェクトを探す。
    searchNightShiftValue:function(time){
      const a = this.nightShift.filter((ele) => {
        return time == ele.value;
      });
      if(a[0]==null){
      return "";
      }
      return a[0].text;
    }
  },

  computed: {
    // //対象月を作成する。
    currentMoment: function () {
      //現在の日時からcurrentプロパティをの数値分の月数を引く。
      return moment().add(this.current, "months");
    },

    subjectMonth() {
      //現在の日時のフォーマットを"YYYY年MM"月の形式に変換する。
      this.caldendarMonth = this.currentMoment.format("YYYY年MM月");
      console.log(this.caldendarMonth);
      return this.currentMoment.format("YYYY年MM月");
    },
  }
};
</script>

<style>
#app {
  margin-top: 60px;
}

.title {
  font-size: 24px;
}

td,th {
  text-align: center;
}

.red {
  color: #ff0000;
}

.blue {
  color: #0000ff;
}

.container-fluid {
 min-width: 538px;
 max-width: 1400px;
}

/* ヘッダーとテーブルヘッダーを画面の上端に固定するのに設定 */
.head {
  min-width: 538px;
  background-color: white;
  position: sticky;
  top: 0; /* Don't forget this, required for the stickiness */
}

.table > thead {
  position: sticky;
  width:100%;
  top: 374px; /* Don't forget this, required for the stickiness */
}
</style>
