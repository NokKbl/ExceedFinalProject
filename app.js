$(function () {
    let ctx = document.getElementById("wake");
    let date_wake = new Date();
    let time_wake = date_wake.getHours() + (date_wake.getMinutes()/60);
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
                text: 'Waking up average graph per week'
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        max: Math.max(...y_axis_wake)+2
                    }
                }]
            }
        }
    });

    let ctxx = document.getElementById("sleep");
    let date_sl = new Date();
    let time_sl = date_sl.getHours() + (date_sl.getMinutes()/60);
    let day_sl = date_sl.toDateString();
    let x_axis_sl = ['Sat Jul 14 2018', 'Sun Jul 15 2018', 'Mon Jul 16 2018', 'Tue Jul 17 2018', 'Wed Jul 18 2018', 'Thu Jul 19 2018', 'Fri Jul 20 2018'];
    let y_axis_sl = [5.5, 7, 6, 10, 9, 6.5, 8]
    let sleep = new Chart(ctxx, {
        type: 'line',
        data: {
            labels: ["", "", "", "", "", "Orange"],
            datasets: [{
                label: 'Sleeping Time',
                data: [2, 5, 13, 6, 9, 3],
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

    $('#time-tog').change(function () {
        if ($(this).prop('checked') == true) {
            mode = 1;
        }
        else {
            mode = 0;
        }
        $.ajax({
            type: "POST",
            url: "http://ecourse.cpe.ku.ac.th/exceed/api/tonpalm-time-tog/set/",
            data: {
                value: mode
            },
            dataType: "text",
            success: function (response) {
                if(mode == 1){
                    
                }else{
                    x_axis_wake.push(day_wake)
                    x_axis_wake.shift()
                    wake.update()
                }
            }
        });
    })
    setInterval(function () {
        $.ajax({
            type: "GET",
            url: "http://ecourse.cpe.ku.ac.th/exceed/api/tonpalm-top-servo/view/",
            dataType: "text",
            success: function (response) {
                $('#top-servo').html(`
                <label class="fontVal">${response}</label>
            `)
                top = response
            },
            fail: function (response) {
                consloe.log(response)
            }
        });
        $.ajax({
            type: "GET",
            url: "http://ecourse.cpe.ku.ac.th/exceed/api/tonpalm-bottom-servo/view/",
            dataType: "text",
            success: function (response) {
                $('#bottom-servo').html(`
                <label class="fontVal">${response}</label>
            `)
                bottom = response
            },
            fail: function (response) {
                consloe.log(response)
            }
        });
        // if (){
        //      $('#bed-img').html(`<img src=" " alt="bed" height="300px">`)
        // }
        // else if(){
        //      $('#bed-img').html(`<img src=" " alt="bed" height="300px">`)
        // }
        // else (){
        //      $('#bed-img').html(`<img src=" " alt="bed" height="300px">`)
        
        // }
    }, 1000)
})