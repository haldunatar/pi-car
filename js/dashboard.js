$(function() {
    var engineStart = false;

    var leftButton = $('.direction-button--left');
    var rightButton = $('.direction-button--right');
    var forwardButton = $('.direction-button--forward');
    var backButton = $('.direction-button--back');
    var engineButton = $('.engine-button');
    var pressed = 'direction-button--pressed';

    var callDirection = function(command) {
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

    var engineActive = function(command) {
        var car = {
            key: command
        };

        $.ajax({
            type: "POST",
            url: '/start',
            data: JSON.stringify(car),
            contentType: "application/json",
            success: function(res) {
                console.log('Server res: ', res);
            }
        });
    };

    $(engineButton).click(function() {

        if(engineStart) {
            engineActive(false);
            $(this).text('Start');
            $(this).removeClass('engine-button--stop');
            $('.direction-button').removeClass('direction-button--on');
        } else {
            engineActive(true);
            $(this).text('Stop');
            $(this).addClass('engine-button--stop');
            $('.direction-button').addClass('direction-button--on');
        }
    });

    $(leftButton)
        .on('mouseup touchend', function() {
            callDirection('stop');
            $('p').text('stop');

            $(this).removeClass(pressed);
        })
        .on('mousedown touchstart', function() {
            callDirection('left');
            $('p').text('left');

            $(this).addClass(pressed);
        });

    $(rightButton)
        .on('mouseup touchend', function() {
            callDirection('stop');
            $(this).removeClass(pressed);
        })
        .on('mousedown touchstart', function() {
            callDirection('right');
            $(this).addClass(pressed);
        });

    $(forwardButton)
        .on('mouseup touchend', function() {
            callDirection('stop');
            $(this).removeClass(pressed);
        })
        .on('mousedown touchstart', function() {
            callDirection('forward');
            $(this).addClass(pressed);
        });

    $(backButton)
        .on('mouseup touchend', function() {
            callDirection('stop');
            $(this).removeClass(pressed);
        })
        .on('mousedown touchstart', function() {
            callDirection('back');
            $(this).addClass(pressed);
        });


    $(document).keydown(function (e) {
       if(e.keyCode === 37) {
           callDirection('left')
       } else if(e.keyCode === 38) {
           callDirection('forward')
       } else if(e.keyCode === 39) {
           callDirection('right')
       } else if(e.keyCode === 40) {
           callDirection('back')
       }
    }).keyup(function () {
        callDirection('stop');
    })
});