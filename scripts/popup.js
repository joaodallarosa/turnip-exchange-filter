(function () {
  chrome.tabs.getSelected(null, function (tab) {
    if (tab.url.includes('turnip.exchange/islands')) {
      document.getElementById('filter-container').style.display = 'block';
    } else {
      document.getElementById('button-exchange').style.display = 'block';
    }
  });

  function onClickToFilter() {
    const actionFilter = document.getElementById('btn-filter');
    actionFilter.disabled = true;
    actionFilter.innerText = 'Filtering Islands...';

    const config = {
      turnipValue: document.getElementById('turnip-price').value,
      people: document.getElementById('people').value
    }

    chrome.tabs.executeScript(null, {
      file: 'scripts/blur.js'
    }, () => {
      chrome.tabs.executeScript(null, {
        code: `var config = ${JSON.stringify({ config })}`
      }, () => {
        chrome.tabs.executeScript(null,
          {
            file: 'scripts/filter-islands.js'
          }, async (data) => {
            console.log('Filtered!', data);
            actionFilter.disabled = false;
            actionFilter.innerText = 'Filter Islands'
            const result = data[0];

            chrome.tabs.executeScript(null,
              {
                file: 'scripts/unblur.js'
              }, () => {
                window.close();
              });

            if (!result.ok) return;
          });
      });
    });




  }

  function handleNumberInput() {
    setInputButtonState();
    setBackgroundColor();
  }


  function handleNumberInputBlur(event) {
    const value = event.target.value;

    if (event.target.hasAttribute("min") && value < parseFloat(event.target.min))
      event.target.value = event.target.min;

    if (event.target.hasAttribute("max") && value > parseFloat(event.target.max))
      event.target.value = event.target.max;
  }

  function setInputButtonState() {
    const inputs = document.getElementsByClassName("number-input-text-box");

    for (let input of inputs) {
      if (input.id.length > 0) { // during value transition the old input won't have an id
        const value = input.value;
        const parent = input.parentElement.parentElement;

        if (parent.children[0] && input.hasAttribute("min"))
          parent.children[0].disabled = value <= parseFloat(input.min);

        if (parent.children[2] && input.hasAttribute("max"))
          parent.children[2].disabled = value >= parseFloat(input.max);
      }
    }
  }

  function setNumber(event) {
    let button = event.target;
    let input = document.getElementById(button.dataset.inputId);

    if (input) {
      let value = parseFloat(input.value);
      let step = parseFloat(input.dataset.step);

      if (button.dataset.operation === "decrement") {
        value -= isNaN(step) ? 1 : step;
      } else if (button.dataset.operation === "increment") {
        value += isNaN(step) ? 1 : step;
      }

      if (input.hasAttribute("min") && value < parseFloat(input.min)) {
        value = input.min;
      }

      if (input.hasAttribute("max") && value > parseFloat(input.max)) {
        value = input.max;
      }

      if (input.value !== value) {
        setInputValue(input, value);
        setInputButtonState();
      }
    }
  }

  function setInputValue(input, value) {
    let newInput = input.cloneNode(true);
    const parentBox = input.parentElement.getBoundingClientRect();

    input.id = "";

    newInput.value = value;

    if (value > input.value) {
      // right to left
      input.parentElement.appendChild(newInput);
      input.style.marginLeft = -parentBox.width + "px";
    } else if (value < input.value) {
      // left to right
      newInput.style.marginLeft = -parentBox.width + "px";
      input.parentElement.prepend(newInput);
      window.setTimeout(function () {
        newInput.style.marginLeft = 0
      }, 20);
    }

    window.setTimeout(function () {
      input.parentElement.removeChild(input);
    }, 250);
  }

  async function onInitializePopup() {
    console.log('DOM fully loaded');



    const actionOpenExchange = document.getElementById('button-exchange');
    actionOpenExchange.addEventListener('click', () => {
      window.open('https://turnip.exchange/islands');
    });

    const actionFilter = document.getElementById('btn-filter');
    actionFilter.addEventListener('click', onClickToFilter);

    var inputButtons = document.querySelectorAll('.number-input-container > button');

    for (const button of inputButtons) {
      button.addEventListener('click', setNumber);
    }
    // enable active states for buttons in mobile safari
    document.addEventListener("touchstart", function () { }, false);
    setInputButtonState();
  }

  document.addEventListener('DOMContentLoaded', onInitializePopup);
})();