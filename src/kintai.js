//明細の従業時間を求める
function workTime(starttime, endtime, work) {
    let worktime = 0;
    if (work == "公" || work == "有給" || work == "特休" || work == "振休" || work == "欠勤") {
        worktime = 0;
    } else {
        // const start = starttime.split(":");
        //const startTimeMinute = Number(start[0] * 60) + Number(start[1]);
        const startTimeMinute = starttime;
        //const end = endtime.split(":");
        //const endTimeMinute = Number(end[0] * 60) + Number(end[1]);
        const endTimeMinute = endtime;
        if (endTimeMinute - startTimeMinute >= 450) {
            worktime = (endTimeMinute - startTimeMinute) - 60;
        } else {
            worktime = endTimeMinute - startTimeMinute;
        }
    }
    return worktime;
}


//明細の残業時間を求める。日勤の場合かつ、1日の従業時間が休憩時間を含めて9時間(540分)より長いの場合はその分を残業とする。
//半日の場合は1日の従業時間が休憩時間を含めて5時間(300分)より長い場合はその分を残業とする。
function overtime(starttime, endtime, work) {
    let overTime = 0;
    const startTimeMinute = starttime;
    const endTimeMinute = endtime;
    const totalTime = endTimeMinute - startTimeMinute;
    if ((work == "〇" || work == "〇/当") && totalTime > 540) {
        overTime = totalTime - 540;
    } else if ((work == "A/公" || work == "公/A" || work == "有/A" || work == "A/有") && totalTime > 300) {
        overTime = totalTime - 300;
    } else {
        overTime = 0;
    }
    return overTime;
}

//残業時間(従業時間が540分以上になる時間)が22時から5時にかかる時間を求める。
function midnightOvertime(starttime, endtime) {
    let midnightOvertime = 0;
    //勤務開始時間をstartTimeMinuteとする。
    const startTimeMinute = starttime;
    //勤務終了時間をstartTimeMinuteとする。
    const endTimeMinute = endtime;
    //従業時間をtotalTimeとする。
    const totalTime = endTimeMinute - startTimeMinute;
    //従業時間が540分を過ぎた残業時間をoverTimeとする。
    const overTime = totalTime - 540;
    //22時以降、5時未満の時間はendTimeMinute > 1320 && endTimeMinute < 1740で表すことができる？
    if (endTimeMinute > 1320 && endTimeMinute < 1740) {
        
    } else {
        midnightOvertime = 0;
    }
    return midnightOvertime;
}

export { workTime, overtime, midnightOvertime };