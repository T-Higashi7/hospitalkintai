//明細の従業時間を求める
function workTime(starttime, endtime, work) {
    let worktime = 0;
    if (work == "公" || work == "有給" || work == "特休" || work == "振休" || work == "欠勤") {
        worktime = 0;
    } else {
        const start = starttime.split(":");
        const startTimeMinute = Number(start[0] * 60) + Number(start[1]);
        const end = endtime.split(":");
        const endTimeMinute = Number(end[0] * 60) + Number(end[1]);
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
    let overtime = 0;
    const start = starttime.split(":");
    const startTimeMinute = Number(start[0] * 60) + Number(start[1]);
    const end = endtime.split(":");
    const endTimeMinute = Number(end[0] * 60) + Number(end[1]);
    const totaltime = endTimeMinute - startTimeMinute;
    if ((work == "〇" || work == "〇/当") && totaltime > 540) {
        overtime = totaltime - 540;
    } else if ((work == "A/公" || work == "公/A" || work == "有/A" || work == "A/有") && totaltime > 300) {
        overtime = totaltime - 300;
    } else {
        overtime = 0;
    }
    return overtime;
}

//明細の22時以降の残業時間を求める
function midnightOvertime(starttime, endtime, work) {
    let midnightOvertime = 0;
    //22時を分単位に変換すると60分*22で1320分になる。
    const tenOclockMinite = 1320;
    const start = starttime.split(":");
    const startTimeMinute = Number(start[0] * 60) + Number(start[1]);
    const end = endtime.split(":");
    const endTimeMinute = Number(end[0] * 60) + Number(end[1]);
    console.log(endTimeMinute);
    if (work=="〇" && endTimeMinute > 1320) {
        midnightOvertime = endTimeMinute - tenOclockMinite;
    } else if (work=="〇" && startTimeMinute >= 1320) {
        midnightOvertime = endTimeMinute - startTimeMinute;
    } else {
        midnightOvertime = 0;
    }
    //22時から9時間以上の勤務を想定した場合、22時以降の残業時間から-60する。
    if(midnightOvertime >540){
        midnightOvertime = midnightOvertime-60;
    }
    return midnightOvertime;
}

export { workTime, overtime, midnightOvertime };