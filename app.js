$(function () {
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
                if (response> && response<=10){
                    response=0
                }
                else if(response>10 && response<=20){
                    $('#bgg').html(`<div style="background: url();"></div>`)
                }
                else{
                    $('#bgg').html(`<div style="background: url();"></div>`)
                }
                $('#top-servo').html(`
                <label class="fontVal">${response}</label>
            `)
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
            },
            fail: function (response) {
                consloe.log(response)
            } 
        });
    }, 1000)
})