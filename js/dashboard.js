document.addEventListener("DOMContentLoaded", () => {
  const browser = navigator.userAgent;
  const isChrome = browser.includes("Chrome");

  // Command Settings
  let engineStart = false;
  const leftButton = document.querySelector(".direction-button--left");
  const rightButton = document.querySelector(".direction-button--right");
  const forwardButton = document.querySelector(".direction-button--forward");
  const backButton = document.querySelector(".direction-button--back");
  const engineButton = document.querySelector(".engine-button");
  const voiceControl = document.querySelector("#voiceCommand");
  voiceControl.style.display = "none";
  const pressed = "direction-button--pressed";

  if (isChrome) {
    initializeVoiceControl();
  }

  engineButton.addEventListener("click", () => {
    if (engineStart) {
      engineStart = false;
      engineActive(false);
      engineButton.textContent = "Start";
      engineButton.classList.remove("engine-button--stop");
      document
        .querySelectorAll(".direction-button")
        .forEach((btn) => btn.classList.remove("direction-button--on"));
      voiceControl.style.display = "none";
    } else {
      engineStart = true;
      engineActive(true);
      engineButton.textContent = "Stop";
      engineButton.classList.add("engine-button--stop");
      document
        .querySelectorAll(".direction-button")
        .forEach((btn) => btn.classList.add("direction-button--on"));
      if (isChrome) {
        voiceControl.style.display = "block";
      }
    }
  });

  // Joystick
  const addDirectionEvents = (button, direction) => {
    button.addEventListener("mouseup", () => {
      callDirection("stop");
      button.classList.remove(pressed);
    });
    button.addEventListener("touchend", () => {
      callDirection("stop");
      button.classList.remove(pressed);
    });
    button.addEventListener("mousedown", () => {
      callDirection(direction);
      button.classList.add(pressed);
    });
    button.addEventListener("touchstart", () => {
      callDirection(direction);
      button.classList.add(pressed);
    });
  };

  addDirectionEvents(leftButton, "left");
  addDirectionEvents(rightButton, "right");
  addDirectionEvents(forwardButton, "forward");
  addDirectionEvents(backButton, "back");

  // Keyboard commands
  document.addEventListener("keydown", keyDown);
  document.addEventListener("keyup", keyUp);

  function keyDown(e) {
    switch (e.keyCode) {
      case 37:
        callDirection("left");
        break;
      case 38:
        callDirection("forward");
        break;
      case 39:
        callDirection("right");
        break;
      case 40:
        callDirection("back");
        break;
    }
  }

  function keyUp() {
    callDirection("stop");
  }

  function initializeVoiceControl() {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const SpeechGrammarList =
      window.SpeechGrammarList || window.webkitSpeechGrammarList;
    const SpeechRecognitionEvent =
      window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;

    const grammar =
      "#JSGF V1.0; grammar colors; public <color> = start | stop | back | forward | left | right ";
    const recognition = new SpeechRecognition();
    const speechRecognitionList = new SpeechGrammarList();

    speechRecognitionList.addFromString(grammar, 1);
    recognition.grammars = speechRecognitionList;
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    voiceControl.addEventListener("click", () => {
      recognition.start();
    });

    recognition.onresult = (event) => {
      const voiceCommand = event.results[0][0].transcript;
      const commands = ["back", "forward", "left", "right", "start", "stop"];

      commands.forEach((command) => {
        if (command === voiceCommand) {
          callDirection(command);
        }
      });
    };

    recognition.onspeechend = () => {
      recognition.stop();
    };
  }

  function engineActive(command) {
    const car = { key: command };

    fetch("/start", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(car),
    })
      .then((response) => response.json())
      .then((data) => console.log("Server res: ", data))
      .catch((error) => console.error("Error:", error));
  }

  function callDirection(command) {
    if (engineStart) {
      const car = { key: command };

      fetch("/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(car),
      })
        .then((response) => response.json())
        .then((data) => console.log("Server res: ", data))
        .catch((error) => console.error("Error:", error));
    }
  }
});
