$(function() {

    var browser = navigator.userAgent;
    var isChrome = browser.indexOf('Chrome') > -1;

    if(isChrome) {
        initializeVoiceControl();
    }

    // Command Settings
    var engineStart = false;
    var leftButton = $('.direction-button--left');
    var rightButton = $('.direction-button--right');
    var forwardButton = $('.direction-button--forward');
    var backButton = $('.direction-button--back');
    var engineButton = $('.engine-button');
    var voiceControl = $('#voiceCommand').hide();
    var pressed = 'direction-button--pressed';

    $(engineButton).click(function() {

        if(engineStart) {
            engineStart = false;
            engineActive(false);
            $(this).text('Start');
            $(this).removeClass('engine-button--stop');
            $('.direction-button').removeClass('direction-button--on');
            $(voiceControl).hide();
        } else {
            engineStart = true;
            engineActive(true);
            $(this).text('Stop');
            $(this).addClass('engine-button--stop');
            $('.direction-button').addClass('direction-button--on');

            if(isChrome) {
                $(voiceControl).show();
            }
        }
    });

    // Joystick
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

    // Keyboard commands
    $(document).keydown(keyDown).keyup(keyUp);

    function keyDown(e) {

        if(e.keyCode === 37) {
            callDirection('left')
        } else if(e.keyCode === 38) {
            callDirection('forward')
        } else if(e.keyCode === 39) {
            callDirection('right')
        } else if(e.keyCode === 40) {
            callDirection('back')
        }
    }

    function keyUp() {
        callDirection('stop');
    }

    function initializeVoiceControl() {
        var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
        var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
        var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

        var grammar = '#JSGF V1.0; grammar colors; public <color> = start | stop | back | forward | left | right ';
        var recognition = new SpeechRecognition();
        var speechRecognitionList = new SpeechGrammarList();

        speechRecognitionList.addFromString(grammar, 1);
        recognition.grammars = speechRecognitionList;

        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        $(voiceControl).click(function () {
            recognition.start();
        });

        recognition.onresult = function(event) {
            var voiceCommand = event.results[0][0].transcript;

            var commands = [
                'back',
                'forward',
                'left',
                'right',
                'start',
                'stop'
            ];

            commands.forEach(function(command) {
                if(command === voiceCommand) {
                    callDirection(command);
                }
            });
        };

        recognition.onspeechend = function() {
            recognition.stop();
        };
    }

    var engineActive = function(command) {
        var car = { key: command };

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

    var callDirection = function(command) {
        var car = { key: command };

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
});