//開始時間を分単位に変換する。
function startMinuteChange(starttime) {
    const start = starttime.split(":");
    const startTimeMinute = Number(start[0] * 60) + Number(start[1]);
    return startTimeMinute;
}

function testStartMinuteChange(time){
    const a = startMinuteChange(time);
    return a
}

//終了時間を分単位に変換する。
function endMinuteChange(endtime) {
    const end = endtime.split(":");
    const endTimeMinute = Number(end[0] * 60) + Number(end[1]);
    return endTimeMinute;
}

//明細の従業時間を求める
function workTime(starttime, endtime, work) {

    let worktime = 0;

    const startTimeMinute = startMinuteChange(starttime);
    const endTimeMinute = endMinuteChange(endtime);

    const holiday = ["公","有給","特休","振休","欠勤"];

    if (holiday.includes(work)) {
      worktime = 0;
    } 
     else {
        //勤務時間が8時間(480分)以上の場合は
        if (endTimeMinute - startTimeMinute >= 480) {
            //勤務時間は60分休憩を引いた時間となる。
            worktime = (endTimeMinute - startTimeMinute) - 60;
            //勤務時間が6時間(360分)以上、8時間(480分)未満の場合は
        } 
         else if(endTimeMinute - startTimeMinute < 480 && endTimeMinute - startTimeMinute >= 360  ) {
            //勤務時間は45分休憩を引いた時間となる。
            worktime = (endTimeMinute - startTimeMinute) - 45;
        } 
         else {
            worktime = endTimeMinute - startTimeMinute;
        }
    }
    return worktime;
}

//明細の残業時間を求める。日勤の場合かつ、1日の従業時間が休憩時間を含めて9時間(540分)より長い場合はその分を残業とする。
//半日の場合は1日の従業時間が休憩時間を含めて5時間(300分)より長い場合はその分を残業とする。
function overTime(starttime, endtime, work) {

    let over = 0;

    const startTimeMinute = startMinuteChange(starttime);
    const endTimeMinute = endMinuteChange(endtime);
    const totalTime = endTimeMinute - startTimeMinute;

    const fullWork = ["〇","〇/当","深夜"];
    const herfWork = ["A/公","公/A","A/有","有/A"];

    if (fullWork.includes(work) && totalTime > 540) {
        over = totalTime - 540;
    } 
     else if (herfWork.includes(work) && totalTime > 300) {
        over = totalTime - 300;
    } 
     else {
        over = 0;
    }
    return over;
}

//従業時間が22時から5時にかかる時間を求める。
function midnightWorkTime(starttime, endtime) {
    let midnightWorkTime = 0;

    const start = starttime.split(":");
    const startTimeMinute = Number(start[0] * 60) + Number(start[1]);

    const end = endtime.split(":");
    const endTimeMinute = Number(end[0] * 60) + Number(end[1]);

    const totalTime = endTimeMinute - startTimeMinute;
    
    if (Number(end[0])>=22 && Number(end[0])>=29) {
        //勤務終了時間がAM5時(60*29 = 1740)を超えた時間をoverFiveとする。
        const overFive = endTimeMinute - 1740;
        //勤務開始時間からAM22時(60*22 = 1320)を超えなかった時間をnotOverTenとする。
        let notOverTen = 1320 - startTimeMinute;
        //勤務開始時間がAM22時(60*22 = 1320)を超えていた場合
        if(notOverTen < 0){
            // 従業時間から勤務終了時間がAM5時(60*29 = 1740)を超えた時間を引く。
            midnightWorkTime = totalTime - overFive;
        } 
         else {
            // 従業時間から勤務終了時間がAM5時(60*29 = 1740)を超えた時間と勤務開始時間ががAM22時(60*22 = 1320)を超えなかった時間を引く。
            midnightWorkTime = totalTime - (overFive + notOverTen);
        }
    } 
     else if((Number(end[0])>=22 && Number(end[0])<29)){
        //勤務開始時間からAM22時(60*22 = 1320)を超えなかった時間をnotOverTenとする。
        const notOverTen = 1320 - startTimeMinute;
        midnightWorkTime = totalTime - notOverTen;
    } 
     else {
        //それ以外の場合は深夜従業時間は0となる。
        midnightWorkTime = 0;
    }
    return midnightWorkTime;
}

//残業時間(従業時間が540分以上になる時間)が22時から5時にかかる時間を求める。
function midnightOvertime(starttime, endtime) {

    let midnightOvertime = 0;

    const start = starttime.split(":");
    const startTimeMinute = Number(start[0] * 60) + Number(start[1]);

    const end = endtime.split(":");
    const endTimeMinute = Number(end[0] * 60) + Number(end[1]);

    //従業時間をtotalTimeとする。
    const totalTime = endTimeMinute - startTimeMinute;

    //残業の基準となる時間をoverStandardTime(勤務開始時間+540分)とする。overStandardTimeを超えた時間は残業扱い。
    const overStandardTime = startTimeMinute+540;

    //従業時間が540分を超えるかつ勤務終了時間が22時以降かつ5時を超える場合
    if (totalTime >540 && Number(end[0])>=22 && Number(end[0])>=29) {
        //勤務終了時間がAM5時(60*29 = 1740)を超えた時間をoverFiveとする。
        const overFive = endTimeMinute - 1740;
        //深夜の残業時間は勤務終了時間-22時(60*22=1320)-5時を超えた時間となる。
        midnightOvertime = (endTimeMinute - 1320)-overFive;
    } 
      //従業時間が540分を超えるかつ勤務終了時間が22時以降かつ5時を超えない場合
      else if(totalTime >540 && Number(end[0])>=22 && Number(end[0])<29) {
        //深夜の残業時間は勤務終了時間-22時(60*22=1320)-となる。
        midnightOvertime = endTimeMinute - 1320;
    } else {
        //それ以外の場合は深夜残業時間は0分となる。
        midnightOvertime = 0;
    }

    //深夜残業時間が0ではなく、残業の基準となる時間(勤務開始時間+540分)が22時を超える場合は
    if(midnightOvertime > 0 && overStandardTime > 1320){
        //深夜残業時間は深夜残業時間-(残業時間の基準となる時間-22時)となる。
        return midnightOvertime-(overStandardTime - 1320);
    }
    else {
        //それ以外の場合は深夜残業時間をそのまま返す。
        return midnightOvertime;
    }
}

export { workTime, overTime, midnightOvertime, midnightWorkTime};