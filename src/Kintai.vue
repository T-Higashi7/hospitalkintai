
<template>
　
　<p>勤怠表入力<br>({{ subject_month }})
     <button @click="goPrevMonth">前月</button>
     <button @click="goNextMonth">次月</button>
     <button @click="totalWorkday">検証用</button>
  </p>
  <div class = total> 
  <p>合計勤務日数：{{ totalWork }}日</p>
  <p>合計従業時間：{{ totaltime }}分</p>
  <p>合計残業時間：{{ totalovertime }}時間　(内　22時以降の残業時間：{{totalnightovertime}}時間　　法定休日の残業時間：{{holidayovertime}}時間)</p>
  </div>
      <div class="container mt-3">

         <table align="center">
　           <tr>
                <th>日付</th><th>曜日</th><th>勤務</th><th>勤務開始時間</th><th>勤務終了時間</th><th>残業</th><th>残業理由・その他備考</th>
             </tr>
             <tr v-for="(element,index) of meisai" key="index" >
                <td>{{element.day}}</td>
                <td v-bind:class="{blue: element.isSaturday, red: element.isSunday }">{{element.week}}</td>
                <td v-if="element.show">{{element.work}}</td>
                <td v-if="!element.show">
                 <select v-model="element.editwork">
                      <option value=〇>〇</option>
                      <option value=〇/当>〇/当</option>
                      <option value=A/公>A/公</option>
                      <option value=公/A>公/A</option>
                      <option value=公/当>公/当</option>
                      <option value=公>公</option>
                      <option value=有給>有給</option>
                      <option value=振休>振休</option>
                    </select>
                </td>
                <td v-if="element.show">{{element.starttime}}</td>
                <td v-if="!element.show">
                  <select v-model="element.editstarttime">
                      <option value=08:15>08:15</option>
                      <option value=08:45>08:45</option>
                      <option value=09:15>09:15</option>
                      <option value=09:45>09:45</option>
                      <option value=10:15>10:15</option>
                      <option value=10:45>10:45</option>
                      <option value=11:15>11:15</option>
                      <option value=11:45>11:45</option>
                      <option value=12:15>12:15</option>
                      <option value=12:45>12:45</option>
                      <option value=13:15>13:15</option>
                      <option value=13:45>13:45</option>
                      <option value=14:15>14:15</option>
                      <option value=14:45>14:45</option>
                      <option value=15:15>15:15</option>
                      <option value=15:45>15:45</option>
                      <option value=16:15>16:15</option>
                      <option value=16:45>16:45</option>
                      <option value=17:00>17:00</option>
                      <option value=17:15>17:15</option>
                      <option value=17:45>17:45</option>
                      <option value=20:00>20:00</option>
                      <option value=21:00>21:00</option>
                      <option value=22:00>22:00</option>
                      <option value=23:00>23:00</option>
                    </select>
                </td>
                <td v-if="element.show">{{element.endtime}}</td>
                <td v-if="!element.show">
                <select v-model="element.editendtime">
                      <option value=06:15>06:15</option>
                      <option value=06:30>06:30</option>
                      <option value=06:30>06:45</option>
                      <option value=07:00>07:00</option>
                      <option value=08:15>08:15</option>
                      <option value=08:30>08:30</option>
                      <option value=08:45>08:45</option>
                      <option value=09:15>09:15</option>
                      <option value=09:45>09:45</option>
                      <option value=10:15>10:15</option>
                      <option value=10:45>10:45</option>
                      <option value=11:15>11:15</option>
                      <option value=11:45>11:45</option>
                      <option value=12:15>12:15</option>
                      <option value=12:45>12:45</option>
                      <option value=13:15>13:15</option>
                      <option value=13:45>13:45</option>
                      <option value=14:15>14:15</option>
                      <option value=14:45>14:45</option>
                      <option value=15:15>15:15</option>
                      <option value=15:45>15:45</option>
                      <option value=16:15>16:15</option>
                      <option value=16:45>16:45</option>
                      <option value=17:00>17:00</option>
                      <option value=17:15>17:15</option>
                      <option value=17:45>17:45</option>
                      <option value=20:00>20:00</option>
                      <option value=21:00>21:00</option>
                      <option value=22:00>22:00</option>
                      <option value=23:00>23:00</option>
                    </select>
                
                </td>
                <td v-if="element.show">{{element.overtime}}</td>
                <td v-if="!element.show">
                  <select v-model="element.editovertime">
                      <option value=0>0</option>
                      <option value=0.5>0.5</option>
                      <option value=1.0>1.0</option>
                      <option value=1.5>1.5</option>
                      <option value=2.0>2.0</option>
                      <option value=2.5>2.5</option>
                      <option value=3.0>3.0</option>
                      <option value=3.5>3.5</option>
                      <option value=4.0>4.0</option>
                    </select>
                </td>

                <td v-if="element.show">{{element.Reason}}</td>
                <td v-if="!element.show">
                 <input v-model="element.editReason">
                </td>


                <td v-if="element.show"><button v-on:click="edit(element)" >編集</button>
                </td>
                <td v-if="element.show"><button v-on:click="deleate(element);totalWorkday()" >削除</button>
                </td>
                <td v-if="!element.show">
                <button v-on:click="confirm(element);totalWorkday()" >確定</button>
                </td>
                <td v-if="!element.show">
                <button v-on:click="cancel(element)" >キャンセル</button>
                </td>

                  <div v-if="element.show">
                  </div>
                  <div >
                  </div>
　　         </tr>
         </table>
      </div>

</template>

<script>
export default {
  data() {
    return {
      current: 0,
      meisaiList: null,
      //勤務日数の合計
      totalWork: 0,
      //従業時間の合計
      totaltime: 0,
      //残業時間の合計
      totalovertime: 0,
      //22時以降の残業時間の合計
      totalnightovertime: 0,
      //法定休日の残業時間の合計
      holidayovertime: 0,
      //当直の合計
      totalondutywork: 0,
    };
  },

  created: function () {
    //入力日付の初期値として今日の日付を設定する。
    this.input_date = this.formatDate(new Date());
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
    edit: function (selectedelement) {
      selectedelement.editwork = selectedelement.work;
      console.log(selectedelement.editwork)
      selectedelement.editstarttime = selectedelement.starttime;
      selectedelement.editendtime = selectedelement.endtime;
      selectedelement.editovertime = selectedelement.overtime;
      selectedelement.editReason = selectedelement.Reason;
      selectedelement.show = false;
    },
    //「確定」ボタンを押した時に編集明細を確定する。
    //「確定」ボタンを押した時にstarttimeがendtimeより遅い時間の場合は「時刻が不正です。」と警告を表示する。
    confirm: function (selectedelement) {
      selectedelement.work = selectedelement.editwork;
      console.log(selectedelement.work)

      if (selectedelement.editstarttime >= selectedelement.editendtime) {
        alert("時刻が不正です。");
      } else {
        selectedelement.starttime = selectedelement.editstarttime;
        // //selectedelement.starttimeを分単位に変換する
        // let start = selectedelement.starttime.split(":")
        // let starttimeminute = Number((start[0]*60)) + Number(start[1])
        // console.log(starttimeminute)
        selectedelement.endtime = selectedelement.editendtime;
        //selectedelement.endtimeを分単位に変換する
        // let end = selectedelement.endtime.split(":")
        // let endtimeminute = Number((end[0]*60))+Number(end[1])
        // console.log(endtimeminute)
        // this.totaltime = endtimeminute-starttimeminute
        // console.log(this.totaltime)

      }
      selectedelement.overtime = selectedelement.editovertime;
      selectedelement.Reason = selectedelement.editReason;
      selectedelement.show = true;
      console.log(this.meisaiList);
    },
    //「キャンセル」ボタンを押した時に明細の編集をキャンセルする。
    cancel: function (selectedelement) {
      selectedelement.editwork = "";
      console.log(selectedelement.editwork)
      selectedelement.editstarttime = "";
      selectedelement.editendtime = "";
      selectedelement.editovertime = "";
      selectedelement.editReason = "";
      selectedelement.show = true;
    },

    //「削除」ボタンを押した時に日付と曜日以外の列の値を空データにする。
    deleate: function (element) {
      element.work = "";
      element.starttime = "";
      element.endtime = "";
      element.overtime = "";
      element.Reason = "";
    },
  },

  computed: {
    //対象月を作成する。
    currentMoment() {
      //現在の日時からcurrentプロパティをの数値分の月数を足す。
      return moment().add(this.current, "months");
    },
    subject_month() {
      //現在の日時のフォーマットを"YYYY年MM"月の形式に変換する。
      return this.currentMoment.format("YYYY年MM月");
    },

    //今月の日数を取得　ex)2021年11月30なら30を返す。
    calendarData() {
      const numOfMonth = this.currentMoment.endOf("month").date();
      console.log(numOfMonth);
      //const daysOfMonth = [...Array(numOfMonth).keys()].map(i => ++i)
      //console.log(daysOfMonth)
      return numOfMonth;
    }, //今月の最初の日の曜日を取得。

    calendarFirstdayWeek() {
      // この月の1日の曜日（0~6の数値で取得）(ex:月曜日であれば1を取得)
      const firstWeekDay = this.currentMoment.startOf("month").weekday();
      console.log(firstWeekDay);
      return firstWeekDay;
    },

    //今月のカレンダーのオブジェクトを作成。ex)2021年11月なら30日分のオブジェクト。
    calendarDay() {
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
        Calendar.overtime = "";
        Calendar.Reason = "";
        Calendar.editwork = "";
        Calendar.editstarttime = "";
        Calendar.editendtime = "";
        Calendar.editovertime = "";
        Calendar.editReason = "";
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

    meisai() {
      this.meisaiList = this.calendarDay;
      console.log(this.meisaiList);
      return this.meisaiList;
    },

    //合計勤務日数を計算する。
    totalWorkday () {
      this.totalWork = 0;
      for (let i = 0; i < this.calendarData; i++) {
        if (
          this.meisaiList[i].work == "〇" ||
          this.meisaiList[i].work == "〇/当"
        ) {
          this.totalWork = this.totalWork + 1;
        } else if (
          this.meisaiList[i].work == "A/公" ||
          this.meisaiList[i].work == "公/A"
        ) {
          this.totalWork = this.totalWork + 0.5;
        }
      }
      console.log(this.totalWork);
    },

    //総従業時間を計算する。


    //  totalWorkday:function(){
    //    let meisai = this.meisaiList
    //    let workmeisai = meisai.filter(value =>{
    //      if(value.work =="〇"){
    //        return true;
    //      }
    //    })
    //    console.log(workmeisai)
    //  }
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.red {
  color: #ff0000;
}
.blue {
  color: #0000ff;
}

td,
th {
  border: 1px solid black;
}

th {
  background-color: #eeffff;
}
</style>
