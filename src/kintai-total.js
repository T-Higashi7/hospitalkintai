//合計勤務日数を計算する。
function totalWorkday (meisaiList) {
    let totalWork = 0;
    const fullWork = ["〇","〇/当","深夜"];
    const herfWork = ["A/公","公/A","A/有","有/A"];
    for (let i = 0; i < meisaiList.length; i++) {
        let fullWorkCheack = fullWork.includes(meisaiList[i].work);
        let herfWorkCheack = herfWork.includes(meisaiList[i].work);
        if (fullWorkCheack == true) {
        totalWork = totalWork + 1;
        } 
        else if (herfWorkCheack == true) {
        totalWork = totalWork + 0.5;
        } 
    }
    return totalWork;
}

function totalWorktime (meisaiList) {
    let totalTime = 0;
    for (let i = 0; i < meisaiList.length; i++) {
        if (meisaiList[i].workTime == "") {
        totalTime = totalTime + 0;
        } 
        else {
        totalTime = totalTime + meisaiList[i].workTime;
        }
    }
    return totalTime;
}

//合計の22時～5時にかかる従業時間を計算する。
function totalWorkMidnightWorkTime (meisaiList) {
    let totalMidnightWorkTime = 0;
    for (let i = 0; i < meisaiList.length; i++) {
        if (meisaiList[i].midnightWorkTime == "") {
        totalMidnightWorkTime = totalMidnightWorkTime + 0;
        } 
        else {
        totalMidnightWorkTime = totalMidnightWorkTime + Number(meisaiList[i].midnightWorkTime);
        }
    }
    return  totalMidnightWorkTime; 
}

//合計残業時間を計算する。
function totalWorkOverTime (meisaiList) {
    let totalOverTime = 0;
    for (let i = 0; i < meisaiList.length; i++) {
        if (meisaiList[i].overtime == "") {
        totalOverTime = totalOverTime + 0;
        } 
        else {
        totalOverTime = totalOverTime + meisaiList[i].overtime;
        }
    }
    return totalOverTime;
}

//合計の22時～5時にかかる残業を計算する。
function totalWorkMidnightOverTime (meisaiList) {
    let totalMidnightOverTime = 0;
    for (let i = 0; i < meisaiList.length; i++) {
        if (meisaiList[i].midnightOvertime == "") {
        totalMidnightOverTime = totalMidnightOverTime + 0;
        } 
        else {
        totalMidnightOverTime = totalMidnightOverTime + Number(meisaiList[i].midnightOvertime);
        }
    }
    return totalMidnightOverTime;
}

//合計当直回数を計算する。
function totalOnduty (meisaiList) {
    let totalOndutyWork = 0;
    const onDuty = ["〇/当","公/当"];
    for (let i = 0; i < meisaiList.length; i++) {
        let onDutyCheack = onDuty.includes(meisaiList[i].work);
        if (onDutyCheack == true) {
        totalOndutyWork = totalOndutyWork + 1;
        }
    }
    return totalOndutyWork;
}

//法定休日の合計残業時間を計算する。
function totalWorkOverTimeHoliday (meisaiList) {
    let totalHolidayOverTime = 0;
    for (let i = 0; i < meisaiList.length; i++) {
        if (meisaiList[i].week == "(日)") {
        totalHolidayOverTime = totalHolidayOverTime + meisaiList[i].overtime;
        }
    }
    return totalHolidayOverTime;
}

//有給の合計時間を計算する。
function totalPaid (meisaiList) {
    let totalPaidTime = 0;
    for (let i = 0; i < meisaiList.length; i++) {
        if (meisaiList[i].paidTime == "") {
        totalPaidTime = Number(totalPaidTime) + 0;
        } 
        else {
        totalPaidTime = Number(totalPaidTime) + Number(meisaiList[i].paidTime);
        }
    }
    return totalPaidTime;
}

export { totalWorkday, totalWorktime, totalWorkMidnightWorkTime, totalWorkOverTime, totalWorkMidnightOverTime, totalOnduty , totalWorkOverTimeHoliday, totalPaid };