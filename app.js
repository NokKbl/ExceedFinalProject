$(function () {
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
            title: {
                display: true,
                text: 'Waking up average graph per week'
            },
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
    // if(Math.min(...y_axis_sl) < 10){
    //     for (i = 0; i < y_axis_sl.length; i++) {
    //         if(y_axis_sl[i] < 10){

    //         }
    //     }
    // }
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
            title: {
                display: true,
                text: 'Sleeping average graph per week'
            },
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
                //     if (response==1){
                //         $('#bed_mode').change(function () {
                //         ($(this).prop('checked') == true)
                //     }

                //     },
            },
            fail: function (response) {
                consloe.log(response)
            }
        });
        $.ajax({
            type: "GET",
            url: "http://ecourse.cpe.ku.ac.th/exceed/api/tonpalm-sleep_position/view/",
            dataType: "text",
            success: function (response) {
                $('#sleep_position').html(`
                <label class="fontVal">${response}</label>
            `)
            },
            fail: function (response) {
                consloe.log(response)
            }
        });
        $.ajax({
            type: "GET",
            url: "http://ecourse.cpe.ku.ac.th/exceed/api/tonpalm-servo_top/view/",
            dataType: "text",
            success: function (response) {
                $('#servo_top').html(`<label class="fontVal">${response}</label>`)
                top = response
            },
            fail: function (response) {
                consloe.log(response)
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
            },
            fail: function (response) {
                consloe.log(response)
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
            },
            fail: function (response) {
                consloe.log(response)
            }
        });
        // if (){
        //      $('#bed').html(`<img src=" " alt="bed-pic" height="300px">`)
        // }
        // else if(){
        //      $('#bed').html(`<img src=" " alt="bed-pic" height="300px">`)
        // }
        // else (){
        //      $('#bed').html(`<img src=" " alt="bed-pic" height="300px">`)

        // }
    }, 1000)

    $('#bed_mode').change(function () {
        if ($(this).prop('checked') == true) {
            mode = 1;
        }
        else {
            mode = 0;
        }
        $.ajax({
            type: "POST",
            url: "http://ecourse.cpe.ku.ac.th/exceed/api/tonpalm-bed_mode/set/",
            data: {
                value: mode
            },
            dataType: "text",
            success: function (response) {
                if(mode == 0){
                    $('#bmode').append(``)
                }
            }
        });
    })
    $('#servo_top_plus').on("click", function () {
        $.ajax({
            type: "POST",
            url: "http://ecourse.cpe.ku.ac.th/exceed/api/tonpalm-servo_top_cm/set/",
            data: {
                value: top + 10
            },
            dataType: "text",
            success: function (response) {
                console.log(`stp   ${response}`)
            }
        });
    })
    $('#servo_top_minus').on("click", function () {
        $.ajax({
            type: "POST",
            url: "http://ecourse.cpe.ku.ac.th/exceed/api/tonpalm-servo_top_cm/set/",
            data: {
                value: top - 10
            },
            dataType: "text",
            success: function (response) {
                console.log(`stm   ${response}`)
            }
        });
    })
    $('#servo_back_plus').on("click", function () {
        $.ajax({
            type: "POST",
            url: "http://ecourse.cpe.ku.ac.th/exceed/api/tonpalm-servo_back_cm/set/",
            data: {
                value: back + 10
            },
            dataType: "text",
            success: function (response) {
                console.log(`sbp   ${response}`)
            }
        });
    })
    $('#servo_back_minus').on("click", function () {
        $.ajax({
            type: "POST",
            url: "http://ecourse.cpe.ku.ac.th/exceed/api/tonpalm-servo_back_cm/set/",
            data: {
                value: back - 10
            },
            dataType: "text",
            success: function (response) {
                console.log(`sbm   ${response}`)
            }
        });
    })
    $('#servo_leg_plus').on("click", function () {
        $.ajax({
            type: "POST",
            url: "http://ecourse.cpe.ku.ac.th/exceed/api/tonpalm-servo_leg_cm/set/",
            data: {
                value: leg + 10
            },
            dataType: "text",
            success: function (response) {
                console.log(`slp   ${response}`)
            }
        });
    })
    $('#servo_leg_minus').on("click", function () {
        $.ajax({
            type: "POST",
            url: "http://ecourse.cpe.ku.ac.th/exceed/api/tonpalm-servo_leg_cm/set/",
            data: {
                value: leg - 10
            },
            dataType: "text",
            success: function (response) {
                console.log(`slm   ${response}`)
            }
        });
    })
})