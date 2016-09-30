$(function() {
    var engineStart = false;

    var leftButton = $('.direction-button--left');
    var rightButton = $('.direction-button--right');
    var forwardButton = $('.direction-button--forward');
    var backButton = $('.direction-button--back');
    var engineButton = $('.engine-button');

    // Effects
    var pressed = 'direction-button--pressed';

    var sendCommand = function(command) {
        var car = {
            key: command
        };

        if(engineStart) {
            $.ajax({
                type: "POST",
                url: '/',
                data: JSON.stringify(car),
                contentType: "application/json",
                success: function(res) {
                    console.log('Server res: ', res);
                }
            });
        }
    };

    $(engineButton).click(function() {

        if(engineStart) {
            engineStart = false;
            $(this).text('Start');
            $(this).removeClass('engine-button--stop');
            $('.direction-button').removeClass('direction-button--on');
        } else {
            engineStart = true;
            $(this).text('Stop');
            $(this).addClass('engine-button--stop');
            $('.direction-button').addClass('direction-button--on');
        }
        sendCommand(engineStart)
    });

    $(leftButton)
        .on('mouseup touchend', function() {
            sendCommand('stop');
            $('p').text('stop');

            $(this).removeClass('direction-button--pressed');
        })
        .on('mouseup touchstart', function() {
            sendCommand('left');
            $('p').text('left');

            $(this).addClass('direction-button--pressed');
        });

    $(rightButton)
        .on('mouseup touchend', function() {
            sendCommand('stop');
            $(this).removeClass('direction-button--pressed');
        })
        .on('mouseup touchstart', function() {
            sendCommand('right');
            $(this).addClass('direction-button--pressed');
        });

    $(forwardButton)
        .on('mouseup touchend', function() {
            sendCommand('stop');
            $(this).removeClass('direction-button--pressed');
        })
        .on('mouseup touchstart', function() {
            sendCommand('forward');
            $(this).addClass('direction-button--pressed');
        });

    $(backButton)
        .on('mouseup touchend', function() {
            sendCommand('stop');
            $(this).removeClass('direction-button--pressed');
        })
        .on('mouseup touchstart', function() {
            sendCommand('back');
            $(this).addClass('direction-button--pressed');
        });


    $(document).keydown(function (e) {
       if(e.keyCode === 37) {
           sendCommand('left')
       } else if(e.keyCode === 38) {
           sendCommand('forward')
       } else if(e.keyCode === 39) {
           sendCommand('right')
       } else if(e.keyCode === 40) {
           sendCommand('back')
       }
    }).keyup(function () {
        sendCommand('stop');
    })
});