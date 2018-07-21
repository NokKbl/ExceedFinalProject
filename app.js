$(function () {
    let ctx = document.getElementById("wake");
    let wake = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
            datasets: [{
                label: '# of Votes',
                data: [12, 19, 3, 5, 2, 3],
                borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
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
    let ctxx = document.getElementById("sleep");
    let sleep = new Chart(ctxx, {
        type: 'line',
        data: {
            labels: ["", "", "", "", "", "Orange"],
            datasets: [{
                label: '# of Votes',
                data: [2, 5, 13, 6, 9, 3],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
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
                console.log(`mode   ${response}`)
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
        //     $('#bed-img').html(`<img src=" " alt="bed" height="300px">`)
        // }
        // else if(){

        // }
    }, 1000)
})