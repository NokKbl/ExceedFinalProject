$(function () {
    let top, back, leg;
    let topp, backk, legg;
    let ctx = document.getElementById("wake");
    let date_wake = new Date();
    let time_wake = date_wake.getHours() + (date_wake.getMinutes() / 60);
    let day_wake = date_wake.toDateString();
    let x_axis_wake = ['Sat Jul 14 2018', 'Sun Jul 15 2018', 'Mon Jul 16 2018', 'Tue Jul 17 2018', 'Wed Jul 18 2018', 'Thu Jul 19 2018', 'Fri Jul 20 2018'];
    let y_axis_wake = [5.5, 7, 6, 10, 9, 6.5, 8]

    let wake = new Chart(ctx, {
        type: 'line',
        data: {
            labels: x_axis_wake,
            datasets: [{
                label: 'Waking up Time',
                data: y_axis_wake,
                backgroundColor: [
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 4
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        max: Math.max(...y_axis_wake) + 2
                    }
                }]
            }
        }
    });

    let ctxx = document.getElementById("sleep");
    let date_sl = new Date();
    let time_sl = date_sl.getHours() + (date_sl.getMinutes() / 60);
    let day_sl = date_sl.toDateString();
    let x_axis_sl = ['Sat Jul 14 2018', 'Sun Jul 15 2018', 'Mon Jul 16 2018', 'Tue Jul 17 2018', 'Wed Jul 18 2018', 'Thu Jul 19 2018', 'Fri Jul 20 2018'];
    let y_axis_sl = [20, 22, 23.5, 21.75, 24, 24.5, 1]
    let sleep = new Chart(ctxx, {
        type: 'line',
        data: {
            labels: x_axis_sl,
            datasets: [{
                label: 'Sleeping Time',
                data: y_axis_sl,
                backgroundColor: [
                    'rgba(153, 102, 255, 0.2)'
                ],
                borderColor: [
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 4
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });

    setInterval(function () {
        $.ajax({
            type: "GET",
            url: "http://ecourse.cpe.ku.ac.th/exceed/api/tonpalm-bed_mode/view/",
            dataType: "text",
            success: function (response) {
                if (response == 1) {
                    $('#bed_mode').bootstrapToggle('on')
                }
                else {
                    $('#bed_mode').bootstrapToggle('off')
                }
                topp, backk, legg = 10;
                console.log(`mode   ${response}`)
            },
            fail: function (response) {
                console.log(response)
            }
        });
        $.ajax({
            type: "GET",
            url: "http://ecourse.cpe.ku.ac.th/exceed/api/tonpalm-sleep_position/view/",
            dataType: "text",
            success: function (response) {
                if (response == 0) {
                    $('#sleep_position').html(`
                <label class="fontPos">Back</label>            
            `)
                }
                else if (response == 1) {
                    $('#sleep_position').html(`
                <label class="fontPos">Left Side</label>            
            `)
                }
                else if (response == 2) {
                    $('#sleep_position').html(`
                <label class="fontPos">Right Side</label>            
            `)
                }
                else {
                    $('#sleep_position').html(`
                <label class="fontPos">Prone</label>            
            `)
                }
                console.log(`sleep_position   ${response}`)
            },
            fail: function (response) {
                console.log(response)
            }
        });
        $.ajax({
            type: "GET",
            url: "http://ecourse.cpe.ku.ac.th/exceed/api/tonpalm-controller_select/view/",
            dataType: "text",
            success: function (response) {
                if (response == 1) {
                    $('#bmode').hide()
                }
                else {
                    $('#bmode').show()
                }
                console.log(`select   ${response}`)
            },
            fail: function (response) {
                console.log(response)
            }
        });
        $.ajax({
            type: "GET",
            url: "http://ecourse.cpe.ku.ac.th/exceed/api/tonpalm-servo_top/view/",
            dataType: "text",
            success: function (response) {
                $('#servo_top').html(`
                <label class="fontVal">${response}</label>
            `)
                top = response
                console.log(`top   ${top}`)
            },
            fail: function (response) {
                console.log(response)
            }
        });
        $.ajax({
            type: "GET",
            url: "http://ecourse.cpe.ku.ac.th/exceed/api/tonpalm-servo_back/view/",
            dataType: "text",
            success: function (response) {
                $('#servo_back').html(`
                <label class="fontVal">${response}</label>
            `)
                back = response
                console.log(`back   ${back}`)
            },
            fail: function (response) {
                console.log(response)
            }
        });
        $.ajax({
            type: "GET",
            url: "http://ecourse.cpe.ku.ac.th/exceed/api/tonpalm-servo_leg/view/",
            dataType: "text",
            success: function (response) {
                $('#servo_leg').html(`
                <label class="fontVal">${response}</label>
            `)
                leg = response
                console.log(`leg   ${leg}`)
            },
            fail: function (response) {
                console.log(response)
            }
        });
        console.log(top + back + leg)
        if (top == 0 && back == 0 && leg == 0) {
            $('#bed').html(`<img src="https://image.ibb.co/hyjN1y/lieonback.png" alt="bed-pic" width="100%" height="auto">`)    //ตัวตรง
        }
        else if (top > 0 && top <= 10 && back == 0 && leg == 0) {
            $('#bed').html(`<img src="https://image.ibb.co/gHHPWy/UpNeck10.png" alt="bed-pic" width="100%" height="auto">`)     //คอขึ้น
        }
        else if (top > 10 && top <= 20 && back == 0 && leg == 0) {
            $('#bed').html(`<img src="https://image.ibb.co/fGL04J/UpNeck20.png" alt="bed-pic" width="100%" height="auto">`)
        }
        // else if (top > 20 && top <= 30 && back == 0 && leg == 0) {
        //     $('#bed').html(`<img src="" alt="bed-pic" width="100%" height="auto">`)
        // }
        // else if (top > 30 && top <= 40 && back == 0 && leg == 0) {
        //     $('#bed').html(`<img src="" alt="bed-pic" width="100%" height="auto">`)
        // }
        else if (top == 0 && back > 0 && back <= 10 && leg == 0) {
            $('#bed').html(`<img src="https://image.ibb.co/hb3sJd/NSTRW10leg_STR.png" alt="bed-pic" width="100%" height="auto">`)     //หลังขึ้นคอตรง
        }
        else if (top == 0 && back > 10 && back <= 20 && leg == 0) {
            $('#bed').html(`<img src="https://image.ibb.co/iixKyd/W20_NSTRleg_STR.png" alt="bed-pic" width="100%" height="auto">`)
        }
        else if (top == 0 && back > 20 && back <= 30 && leg == 0) {
            $('#bed').html(`<img src="https://image.ibb.co/dThV4J/W30_NSTRleg_STR.png" alt="bed-pic" width="100%" height="auto">`)
        }
        else if (top == 0 && back > 30 && back <= 40 && leg == 0) {
            $('#bed').html(`<img src="https://image.ibb.co/mmWjWy/W40_NSTRleg_STR.png" alt="bed-pic" width="100%" height="auto">`)
        }
        else if (top > 0 && top <= 10 && back > 0 && back <= 10 && leg == 0) {
            $('#bed').html(`<img src="https://image.ibb.co/cLd9yd/N10_W10leg_Str.png" alt="bed-pic" width="100%" height="auto">`)     //หลังขึ้นคอขึ้น
        }
        else if (top > 0 && top <= 10 && back > 10 && back <= 20 && leg == 0) {
            $('#bed').html(`<img src="https://image.ibb.co/crxxjJ/W20_N10leg_STR.png" alt="bed-pic" width="100%" height="auto">`)
        }
        else if (top > 0 && top <= 10 && back > 20 && back <= 30 && leg == 0) {
            $('#bed').html(`<img src="https://image.ibb.co/fpxV4J/W30_N10leg_STR.png" alt="bed-pic" width="100%" height="auto">`)
        }
        else if (top > 0 && top <= 10 && back > 30 && back <= 40 && leg == 0) {
            $('#bed').html(`<img src="https://image.ibb.co/nFdEWy/W40_N10leg_STR.png" alt="bed-pic" width="100%" height="auto">`)
        }
        else if (top > 10 && top <= 20 && back > 0 && back <= 10 && leg == 0) {
            $('#bed').html(`<img src="https://image.ibb.co/iYBeyd/N20_W10leg_STR.png" alt="bed-pic" width="100%" height="auto">`)     //หลังขึ้นคอขึ้นขึ้น
        }
        else if (top > 10 && top <= 20 && back > 10 && back <= 20 && leg == 0) {
            $('#bed').html(`<img src="https://image.ibb.co/kn6OPJ/W20_N20leg_STR.png" alt="bed-pic" width="100%" height="auto">`)
        }
        else if (top > 10 && top <= 20 && back > 20 && back <= 30 && leg == 0) {
            $('#bed').html(`<img src="https://image.ibb.co/nvjory/W30_N20leg_STR.png" alt="bed-pic" width="100%" height="auto">`)
        }
        else if (top > 10 && top <= 20 && back > 30 && back <= 40 && leg == 0) {
            $('#bed').html(`<img src="https://image.ibb.co/hZgJry/W40_N20leg_STR.png" alt="bed-pic" width="100%" height="auto">`)
        }
        else if (top > 0 && top <= 10 && back > 0 && back <= 10 && leg > 0 && leg <= 10) {
            $('#bed').html(`<img src="https://image.ibb.co/drGJry/N10_W10leg10.png" alt="bed-pic" width="100%" height="auto">`)     //
        }
        else if (top > 0 && top <= 10 && back > 0 && back <= 10 && leg > 10 && leg <= 20) {
            $('#bed').html(`<img src="https://image.ibb.co/bwJ9yd/N10_W10leg20.png" alt="bed-pic" width="100%" height="auto">`)
        }
        else if (top > 0 && top <= 10 && back > 0 && back <= 10 && leg > 20 && leg <= 30) {
            $('#bed').html(`<img src="https://image.ibb.co/nkDL4J/N10_W10leg30.png" alt="bed-pic" width="100%" height="auto">`)
        }
        else if (top > 0 && top <= 10 && back > 0 && back <= 10 && leg > 30 && leg <= 40) {
            $('#bed').html(`<img src="https://image.ibb.co/nAvpyd/N10_W10leg40.png" alt="bed-pic" width="100%" height="auto">`)
        }
        else if (top > 0 && top <= 10 && back > 10 && back <= 20 && leg > 0 && leg <= 10) {
            $('#bed').html(`<img src="https://image.ibb.co/iJJgBy/W20_N10leg10.png" alt="bed-pic" width="100%" height="auto">`)     //
        }
        else if (top > 0 && top <= 10 && back > 10 && back <= 20 && leg > 10 && leg <= 20) {
            $('#bed').html(`<img src="https://image.ibb.co/k8wOPJ/W20_N10leg20.png" alt="bed-pic" width="100%" height="auto">`)
        }
        else if (top > 0 && top <= 10 && back > 10 && back <= 20 && leg > 20 && leg <= 30) {
            $('#bed').html(`<img src="https://preview.ibb.co/mZaHjJ/W20_N10leg30.png" alt="bed-pic" width="100%" height="auto">`)
        }
        else if (top > 0 && top <= 10 && back > 10 && back <= 20 && leg > 30 && leg <= 40) {
            $('#bed').html(`<img src="https://image.ibb.co/hxauWy/W20_N10leg40.png" alt="bed-pic" width="100%" height="auto">`)
        }
        else if (top > 10 && top <= 20 && back > 0 && back <= 10 && leg > 0 && leg <= 10) {
            $('#bed').html(`<img src="https://image.ibb.co/mAtRdd/N20_W10leg10.png" alt="bed-pic" width="100%" height="auto">`)     //
        }
        else if (top > 10 && top <= 20 && back > 0 && back <= 10 && leg > 10 && leg <= 20) {
            $('#bed').html(`<img src="https://image.ibb.co/eVCxjJ/N20_W10leg20.png" alt="bed-pic" width="100%" height="auto">`)
        }
        else if (top > 10 && top <= 20 && back > 0 && back <= 10 && leg > 20 && leg <= 30) {
            $('#bed').html(`<img src="https://image.ibb.co/jAHV4J/N20_W10leg30.png" alt="bed-pic" width="100%" height="auto">`)
        }
        else if (top > 10 && top <= 20 && back > 0 && back <= 10 && leg > 30 && leg <= 40) {
            $('#bed').html(`<img src="https://image.ibb.co/eKcV4J/N20_W10leg40.png" alt="bed-pic" width="100%" height="auto">`)
        }
        else if (top > 10 && top <= 20 && back > 10 && back <= 20 && leg > 0 && leg <= 10) {
            $('#bed').html(`<img src="https://image.ibb.co/foiRdd/W20_N20leg10.png" alt="bed-pic" width="100%" height="auto">`)     //
        }
        else if (top > 10 && top <= 20 && back > 10 && back <= 20 && leg > 10 && leg <= 20) {
            $('#bed').html(`<img src="https://image.ibb.co/iPYgBy/W20_N20leg20.png" alt="bed-pic" width="100%" height="auto">`)
        }
        else if (top > 10 && top <= 20 && back > 10 && back <= 20 && leg > 20 && leg <= 30) {
            $('#bed').html(`<img src="https://image.ibb.co/bUezyd/W20_N20leg30.png" alt="bed-pic" width="100%" height="auto">`)
        }
        else if (top > 10 && top <= 20 && back > 10 && back <= 20 && leg > 30 && leg <= 40) {
            $('#bed').html(`<img src="https://image.ibb.co/fFoRdd/W20_N20leg40.png" alt="bed-pic" width="100%" height="auto">`)
        }
        else if (top > 0 && top <= 10 && back > 20 && back <= 30 && leg > 0 && leg <= 10) {
            $('#bed').html(`<img src="https://image.ibb.co/fEezyd/W30_N10leg10.png" alt="bed-pic" width="100%" height="auto">`)     //
        }
        else if (top > 0 && top <= 10 && back > 20 && back <= 30 && leg > 10 && leg <= 20) {
            $('#bed').html(`<img src="https://image.ibb.co/b98gBy/W30_N10leg20.png" alt="bed-pic" width="100%" height="auto">`)
        }
        else if (top > 0 && top <= 10 && back > 20 && back <= 30 && leg > 20 && leg <= 30) {
            $('#bed').html(`<img src="https://image.ibb.co/ke9XJd/W30_N10leg30.png" alt="bed-pic" width="100%" height="auto">`)
        }
        else if (top > 0 && top <= 10 && back > 20 && back <= 30 && leg > 30 && leg <= 40) {
            $('#bed').html(`<img src="https://image.ibb.co/mhRq4J/W30_N10leg40.png" alt="bed-pic" width="100%" height="auto">`)
        }
        else if (top > 10 && top <= 20 && back > 20 && back <= 30 && leg > 0 && leg <= 10) {
            $('#bed').html(`<img src="https://image.ibb.co/mYC8ry/W30_N20leg10.png" alt="bed-pic" width="100%" height="auto">`)     //
        }
        else if (top > 10 && top <= 20 && back > 20 && back <= 30 && leg > 10 && leg <= 20) {
            $('#bed').html(`<img src="https://image.ibb.co/mJXV4J/W30_N20leg20.png" alt="bed-pic" width="100%" height="auto">`)
        }
        else if (top > 10 && top <= 20 && back > 20 && back <= 30 && leg > 20 && leg <= 30) {
            $('#bed').html(`<img src="https://image.ibb.co/bYucjJ/W30_N20leg30.png" alt="bed-pic" width="100%" height="auto">`)
        }
        else if (top > 10 && top <= 20 && back > 20 && back <= 30 && leg > 30 && leg <= 40) {
            $('#bed').html(`<img src="https://image.ibb.co/iW6CJd/W30_N20leg40.png" alt="bed-pic" width="100%" height="auto">`)
        }
        else if (top > 0 && top <= 10 && back > 30 && back <= 40 && leg > 0 && leg <= 10) {
            $('#bed').html(`<img src="https://image.ibb.co/iXQuWy/W40_N10leg10.png" alt="bed-pic" width="100%" height="auto">`)     //
        }
        else if (top > 0 && top <= 10 && back > 30 && back <= 40 && leg > 10 && leg <= 20) {
            $('#bed').html(`<img src="https://image.ibb.co/kUweyd/W40_N10leg20.png" alt="bed-pic" width="100%" height="auto">`)
        }
        else if (top > 0 && top <= 10 && back > 30 && back <= 40 && leg > 20 && leg <= 30) {
            $('#bed').html(`<img src="https://image.ibb.co/ccHV4J/W40_N10leg30.png" alt="bed-pic" width="100%" height="auto">`)
        }
        else if (top > 0 && top <= 10 && back > 30 && back <= 40 && leg > 30 && leg <= 40) {
            $('#bed').html(`<img src="https://image.ibb.co/jr1eyd/W40_N10leg40.png" alt="bed-pic" width="100%" height="auto">`)
        }
        else if (top > 10 && top <= 20 && back > 30 && back <= 40 && leg > 0 && leg <= 10) {
            $('#bed').html(`<img src="https://image.ibb.co/dSYnjJ/W40_N20leg10.png" alt="bed-pic" width="100%" height="auto">`)     //
        }
        else if (top > 10 && top <= 20 && back > 30 && back <= 40 && leg > 10 && leg <= 20) {
            $('#bed').html(`<img src="https://image.ibb.co/kJ2PWy/W40_N20leg20.png" alt="bed-pic" width="100%" height="auto">`)
        }
        else if (top > 10 && top <= 20 && back > 30 && back <= 40 && leg > 20 && leg <= 30) {
            $('#bed').html(`<img src="https://image.ibb.co/d0m7jJ/W40_N20leg30.png" alt="bed-pic" width="100%" height="auto">`)
        }
        else if (top > 10 && top <= 20 && back > 30 && back <= 40 && leg > 30 && leg <= 40) {
            $('#bed').html(`<img src="https://image.ibb.co/jZ3WBy/W40_N20leg40.png" alt="bed-pic" width="100%" height="auto">`)
        }
        else if (top >= -10 && top < 0 && back > 0 && back <= 10 && leg > 0 && leg <= 10) {
            $('#bed').html(`<img src="https://image.ibb.co/gGquWy/N_10_W10leg10.png" alt="bed-pic" width="100%" height="auto">`)     //
        }
        else if (top >= -10 && top < 0 && back > 0 && back <= 10 && leg > 10 && leg <= 20) {
            $('#bed').html(`<img src="https://image.ibb.co/iTYsJd/N_10_W10leg20.png" alt="bed-pic" width="100%" height="auto">`)
        }
        else if (top >= -10 && top < 0 && back > 0 && back <= 10 && leg > 20 && leg <= 30) {
            $('#bed').html(`<img src="https://image.ibb.co/gSd3PJ/N_10_W10leg30.png" alt="bed-pic" width="100%" height="auto">`)
        }
        else if (top >= -10 && top < 0 && back > 0 && back <= 10 && leg > 30 && leg <= 40) {
            $('#bed').html(`<img src="https://image.ibb.co/bKX8ry/N_10_W10leg40.png" alt="bed-pic" width="100%" height="auto">`)
        }
        else if (top >= -10 && top < 0 && back > 10 && back <= 20 && leg > 0 && leg <= 10) {
            $('#bed').html(`<img src="https://image.ibb.co/cXgOPJ/W20_N_10leg10.png" alt="bed-pic" width="100%" height="auto">`)     //
        }
        else if (top >= -10 && top < 0 && back > 10 && back <= 20 && leg > 10 && leg <= 20) {
            $('#bed').html(`<img src="https://image.ibb.co/ixcmdd/W20_N_10leg20.png" alt="bed-pic" width="100%" height="auto">`)
        }
        else if (top >= -10 && top < 0 && back > 10 && back <= 20 && leg > 20 && leg <= 30) {
            $('#bed').html(`<img src="https://image.ibb.co/n4JsJd/W20_N_10leg30.png" alt="bed-pic" width="100%" height="auto">`)
        }
        else if (top >= -10 && top < 0 && back > 10 && back <= 20 && leg > 30 && leg <= 40) {
            $('#bed').html(`<img src="https://image.ibb.co/kXUcjJ/W20_N_10leg40.png" alt="bed-pic" width="100%" height="auto">`)
        }
        else if (top >= -20 && top < -10 && back > 0 && back <= 10 && leg > 0 && leg <= 10) {
            $('#bed').html(`<img src="https://image.ibb.co/n5k6dd/N_20_W10leg10.png" alt="bed-pic" width="100%" height="auto">`)     //
        }
        else if (top >= -20 && top < -10 && back > 0 && back <= 10 && leg > 10 && leg <= 20) {
            $('#bed').html(`<img src="https://image.ibb.co/fGZMBy/N_20_W10leg20.png" alt="bed-pic" width="100%" height="auto">`)
        }
        else if (top >= -20 && top < -10 && back > 0 && back <= 10 && leg > 20 && leg <= 30) {
            $('#bed').html(`<img src="https://image.ibb.co/c4RZWy/N_20_W10leg30.png" alt="bed-pic" width="100%" height="auto">`)
        }
        else if (top >= -20 && top < -10 && back > 0 && back <= 10 && leg > 30 && leg <= 40) {
            $('#bed').html(`<img src="https://image.ibb.co/dFeXJd/N_20_W10leg40.png" alt="bed-pic" width="100%" height="auto">`)
        }
        else if (top >= -20 && top < -10 && back > 10 && back <= 20 && leg > 0 && leg <= 10) {
            $('#bed').html(`<img src="https://image.ibb.co/k5TEWy/W20_N_20leg10.png" alt="bed-pic" width="100%" height="auto">`)     //
        }
        else if (top >= -20 && top < -10 && back > 10 && back <= 20 && leg > 10 && leg <= 20) {
            $('#bed').html(`<img src="https://image.ibb.co/mYWeyd/W20_N_20leg20.png" alt="bed-pic" width="100%" height="auto">`)
        }
        else if (top >= -20 && top < -10 && back > 10 && back <= 20 && leg > 20 && leg <= 30) {
            $('#bed').html(`<img src="https://image.ibb.co/mpkTry/W20_N_20leg30.png" alt="bed-pic" width="100%" height="auto">`)
        }
        else if (top >= -20 && top < -10 && back > 10 && back <= 20 && leg > 30 && leg <= 40) {
            $('#bed').html(`<img src="https://image.ibb.co/fJjMBy/W20_N_20leg40.png" alt="bed-pic" width="100%" height="auto">`)
        }
        else if (top >= -10 && top < 0 && back > 20 && back <= 30 && leg > 0 && leg <= 10) {
            $('#bed').html(`<img src="https://image.ibb.co/fqeA4J/W30_N_10leg10.png" alt="bed-pic" width="100%" height="auto">`)     //
        }
        else if (top >= -10 && top < 0 && back > 20 && back <= 30 && leg > 10 && leg <= 20) {
            $('#bed').html(`<img src="https://image.ibb.co/deF6dd/W30_N_10leg20.png" alt="bed-pic" width="100%" height="auto">`)
        }
        else if (top >= -10 && top < 0 && back > 20 && back <= 30 && leg > 20 && leg <= 30) {
            $('#bed').html(`<img src="https://image.ibb.co/mZ33PJ/W30_N_10leg30.png" alt="bed-pic" width="100%" height="auto">`)
        }
        else if (top >= -10 && top < 0 && back > 20 && back <= 30 && leg > 30 && leg <= 40) {
            $('#bed').html(`<img src="https://image.ibb.co/hq61By/W30_N_10leg40.png" alt="bed-pic" width="100%" height="auto">`)
        }
        else if (top >= -20 && top < -10 && back > 20 && back <= 30 && leg > 0 && leg <= 10) {
            $('#bed').html(`<img src="https://image.ibb.co/gZjXJd/W30_N_20leg10.png" alt="bed-pic" width="100%" height="auto">`)     //
        }
        else if (top >= -20 && top < -10 && back > 20 && back <= 30 && leg > 10 && leg <= 20) {
            $('#bed').html(`<img src="https://image.ibb.co/hi06dd/W30_N_20leg20.png" alt="bed-pic" width="100%" height="auto">`)
        }
        else if (top >= -20 && top < -10 && back > 20 && back <= 30 && leg > 20 && leg <= 30) {
            $('#bed').html(`<img src="https://image.ibb.co/d8iRdd/W30_N_20leg30.png" alt="bed-pic" width="100%" height="auto">`)
        }
        else if (top >= -20 && top < -10 && back > 20 && back <= 30 && leg > 30 && leg <= 40) {
            $('#bed').html(`<img src="https://image.ibb.co/dQhxjJ/W30_N_20leg40.png" alt="bed-pic" width="100%" height="auto">`)
        }
        else if (top >= -10 && top < 0 && back > 30 && back <= 40 && leg > 0 && leg <= 10) {
            $('#bed').html(`<img src="https://image.ibb.co/fhOWBy/W40_N_10leg10.png" alt="bed-pic" width="100%" height="auto">`)     //
        }
        else if (top >= -10 && top < 0 && back > 30 && back <= 40 && leg > 10 && leg <= 20) {
            $('#bed').html(`<img src="https://image.ibb.co/jM1ZWy/W40_N_10leg20.png" alt="bed-pic" width="100%" height="auto">`)
        }
        else if (top >= -10 && top < 0 && back > 30 && back <= 40 && leg > 20 && leg <= 30) {
            $('#bed').html(`<img src="https://image.ibb.co/kX1q4J/W40_N_10leg30.png" alt="bed-pic" width="100%" height="auto">`)
        }
        else if (top >= -10 && top < 0 && back > 30 && back <= 40 && leg > 30 && leg <= 40) {
            $('#bed').html(`<img src="https://image.ibb.co/ijoEWy/W40_N_10leg40.png" alt="bed-pic" width="100%" height="auto">`)
        }
        else if (top >= -20 && top < -10 && back > 30 && back <= 40 && leg > 0 && leg <= 10) {
            $('#bed').html(`<img src="https://image.ibb.co/jXf04J/W40_N_20leg10.png" alt="bed-pic" width="100%" height="auto">`)     //
        }
        else if (top >= -20 && top < -10 && back > 30 && back <= 40 && leg > 10 && leg <= 20) {
            $('#bed').html(`<img src="https://image.ibb.co/is8njJ/W40_N_20leg20.png" alt="bed-pic" width="100%" height="auto">`)
        }
        else if (top >= -20 && top < -10 && back > 30 && back <= 40 && leg > 20 && leg <= 30) {
            $('#bed').html(`<img src="https://image.ibb.co/eJcPWy/W40_N_20leg30.png" alt="bed-pic" width="100%" height="auto">`)
        }
        else if (top >= -20 && top < -10 && back > 30 && back <= 40 && leg > 30 && leg <= 40) {
            $('#bed').html(`<img src="https://image.ibb.co/mky9yd/W40_N_20leg40.png" alt="bed-pic" width="100%" height="auto">`)
        }
        else if (top == 0 && back > 0 && back <= 10 && leg > 0 && leg <= 10) {
            $('#bed').html(`<img src="https://image.ibb.co/eReory/NSTRW10leg10.png" alt="bed-pic" width="100%" height="auto">`)     //
        }
        else if (top == 0 && back > 0 && back <= 10 && leg > 10 && leg <= 20) {
            $('#bed').html(`<img src="https://image.ibb.co/cWgeyd/NSTRW10leg20.png" alt="bed-pic" width="100%" height="auto">`)
        }
        else if (top == 0 && back > 0 && back <= 10 && leg > 20 && leg <= 30) {
            $('#bed').html(`<img src="https://image.ibb.co/ewKXJd/NSTRW10leg30.png" alt="bed-pic" width="100%" height="auto">`)
        }
        else if (top == 0 && back > 0 && back <= 10 && leg > 30 && leg <= 40) {
            $('#bed').html(`<img src="https://image.ibb.co/fbWZWy/NSTRW10leg40.png" alt="bed-pic" width="100%" height="auto">`)
        }
        else if (top == 0 && back > 10 && back <= 20 && leg > 0 && leg <= 10) {
            $('#bed').html(`<img src="https://image.ibb.co/d0mZWy/W20_NSTRleg10.png" alt="bed-pic" width="100%" height="auto">`)     //
        }
        else if (top == 0 && back > 10 && back <= 20 && leg > 10 && leg <= 20) {
            $('#bed').html(`<img src="https://image.ibb.co/iXLHjJ/W20_NSTRleg20.png" alt="bed-pic" width="100%" height="auto">`)
        }
        else if (top == 0 && back > 10 && back <= 20 && leg > 20 && leg <= 30) {
            $('#bed').html(`<img src="https://image.ibb.co/fhdgBy/W20_NSTRleg30.png" alt="bed-pic" width="100%" height="auto">`)
        }
        else if (top == 0 && back > 10 && back <= 20 && leg > 30 && leg <= 40) {
            $('#bed').html(`<img src="https://image.ibb.co/cGogBy/W20_NSTRleg40.png" alt="bed-pic" width="100%" height="auto">`)
        }
        else if (top == 0 && back > 20 && back <= 30 && leg > 0 && leg <= 10) {
            $('#bed').html(`<img src="https://image.ibb.co/ezMeyd/W30_NSTRleg10.png" alt="bed-pic" width="100%" height="auto">`)     //
        }
        else if (top == 0 && back > 20 && back <= 30 && leg > 10 && leg <= 20) {
            $('#bed').html(`<img src="https://image.ibb.co/c59ory/W30_NSTRleg20.png" alt="bed-pic" width="100%" height="auto">`)
        }
        else if (top == 0 && back > 20 && back <= 30 && leg > 20 && leg <= 30) {
            $('#bed').html(`<img src="https://image.ibb.co/dcYEWy/W30_NSTRleg30.png" alt="bed-pic" width="100%" height="auto">`)
        }
        else if (top == 0 && back > 20 && back <= 30 && leg > 30 && leg <= 40) {
            $('#bed').html(`<img src="https://image.ibb.co/hQaTry/W30_NSTRleg40.png" alt="bed-pic" width="100%" height="auto">`)
        }
        else if (top == 0 && back > 30 && back <= 40 && leg > 0 && leg <= 10) {
            $('#bed').html(`<img src="https://image.ibb.co/dGp4Wy/W40_NSTRleg10.png" alt="bed-pic" width="100%" height="auto">`)     //
        }
        else if (top == 0 && back > 30 && back <= 40 && leg > 10 && leg <= 20) {
            $('#bed').html(`<img src="https://image.ibb.co/fYApyd/W40_NSTRleg20.png" alt="bed-pic" width="100%" height="auto">`)
        }
        else if (top == 0 && back > 30 && back <= 40 && leg > 20 && leg <= 30) {
            $('#bed').html(`<img src="https://image.ibb.co/mzY9yd/W40_NSTRleg30.png" alt="bed-pic" width="100%" height="auto">`)
        }
        else if (top == 0 && back > 30 && back <= 40 && leg > 30 && leg <= 40) {
            $('#bed').html(`<img src="https://image.ibb.co/mmfpyd/W40_NSTRleg40.png" alt="bed-pic" width="100%" height="auto">`)
        }
        else {
            $('#bed').html(`<img src="https://image.ibb.co/hyjN1y/lieonback.png" alt="bed-pic" width="100%" height="auto">`)    //ตัวตรง
        }

    }, 1000)

    $('#bed_mode').change(function () {
        console.log($(this).prop('checked'));

        if ($(this).prop('checked') == true) {
            mode = 1;
        }
        else {
            mode = 0;
        }
        topp, backk, legg = 0;
        console.log('BEDMODE CHANGE ', mode);

        $.ajax({
            type: "POST",
            url: "http://ecourse.cpe.ku.ac.th/exceed/api/tonpalm-bed_mode/set/",
            data: {
                value: mode
            },
            dataType: "text",
            success: function (response) {
                console.log("SENDING ", mode);

                if (mode == 1) {
                    $('#bmode').hide()
                } else {
                    $('#bmode').show()
                }
            }
        });
    })

    $('#bedtime').change(function () {
        if ($(this).prop('checked') == true) {
            x_axis_sl.push(day_sl)
            x_axis_sl.shift()
            y_axis_sl.push(time_sl)
            y_axis_sl.shift()
            sleep.update()
        }
        else {
            x_axis_wake.push(day_wake)
            x_axis_wake.shift()
            y_axis_wake.push(time_wake)
            y_axis_wake.shift()
            wake.update()
        }
    })
    $('#servo_top_plus').on("click", function () {
        num = parseInt(topp) + 10
        $.ajax({
            type: "POST",
            url: "http://ecourse.cpe.ku.ac.th/exceed/api/tonpalm-servo_top_cm/set/",
            data: {
                value: num
            },
            dataType: "text",
            success: function (response) {
                topp += 10
                console.log(`stp   ${response} ${top}`)
            }
        });
    })
    $('#servo_top_minus').on("click", function () {
        num = parseInt(topp) - 10
        $.ajax({
            type: "POST",
            url: "http://ecourse.cpe.ku.ac.th/exceed/api/tonpalm-servo_top_cm/set/",
            data: {
                value: num
            },
            dataType: "text",
            success: function (response) {
                topp -= 10
                console.log(`stm   ${response} ${top}`)
            }
        });
    })
    $('#servo_back_plus').on("click", function () {
        num = parseInt(backk) + 10
        $.ajax({
            type: "POST",
            url: "http://ecourse.cpe.ku.ac.th/exceed/api/tonpalm-servo_back_cm/set/",
            data: {
                value: num
            },
            dataType: "text",
            success: function (response) {
                backk += 10
                console.log(`sbp   ${response} ${back}`)
            }
        });
    })
    $('#servo_back_minus').on("click", function () {
        num = parseInt(backk) - 10
        $.ajax({
            type: "POST",
            url: "http://ecourse.cpe.ku.ac.th/exceed/api/tonpalm-servo_back_cm/set/",
            data: {
                value: num
            },
            dataType: "text",
            success: function (response) {
                backk -= 10
                console.log(`sbm   ${response} ${back}`)
            }
        });
    })
    $('#servo_leg_plus').on("click", function () {
        num = parseInt(legg) + 10
        $.ajax({
            type: "POST",
            url: "http://ecourse.cpe.ku.ac.th/exceed/api/tonpalm-servo_leg_cm/set/",
            data: {
                value: num
            },
            dataType: "text",
            success: function (response) {
                legg += 10
                console.log(`slp   ${response} ${leg}`)
            }
        });
    })
    $('#servo_leg_minus').on("click", function () {
        num = parseInt(legg) - 10
        $.ajax({
            type: "POST",
            url: "http://ecourse.cpe.ku.ac.th/exceed/api/tonpalm-servo_leg_cm/set/",
            data: {
                value: num
            },
            dataType: "text",
            success: function (response) {
                legg -= 10
                console.log(`slm   ${response} ${leg}`)
            }
        });
    })
})