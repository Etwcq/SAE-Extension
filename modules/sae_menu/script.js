import { Settings } from "../Settings.js";

let floatingWindow = document.getElementById('floatingWindow');
let minimizeButton = document.getElementById('minimizeButton');
let loginUserName = document.getElementById('loginUserName');
let containers = document.getElementsByClassName('container');

loginUserName.innerText = `Welcome back, ${document.getElementById('sae-username').getAttribute('username')}`;

let isMinimized = false;



const appendSettingContainer = (setting) => {
    let settingChanged = false;
    let settingContainer = document.getElementById('settings');
    let settingElement = document.createElement('div');
    settingElement.className = 'element';

    let label = document.createElement('h4');
    label.textContent = Settings.settingNameMap[setting.name];
    label.style.marginRight = '1em';

    let input = document.createElement('input');
    input.type = setting.inputType;
    input.id = setting.name;

    if (setting.value !== null) {
        input.value = setting.value;
    }

    if (setting.checked !== null) {
        input.checked = setting.checked;
    }

    input.onchange = () => {
        // Update the setting
        for (let i = 0; i < Settings.settings.length; i++) {
            const s = Settings.settings[i];
            if (s.name === setting.name) {
                if (s.inputType === 'checkbox') {
                    s.checked = input.checked;
                } else {
                    s.value = input.value;
                }

                Settings.settings[i] = s;
                break;
            }
        }

        Settings.updateSettings();

        /*
        ここから個別の処理
        */

        if (setting.name === 'submitAutomatically') {
            if (input.checked) {
                let c = confirm("この機能を利用するには、ページをリロードしてください。\nリロードしますか？");
        
                if (c) {
                    location.reload();
                }
                return true;
            }
        }

        if (setting.name === 'showExplanation') {
            if (!input.checked) {
                window.playerModel.explainDisplay = false;
                window.playerModel.explainDisplayScore = 0;
            }
        }
    }

    settingElement.appendChild(label);
    settingElement.appendChild(input);
    settingContainer.appendChild(settingElement);

    return settingChanged;
}

// Initialize setting elements
(() => {
    const settingv = document.getElementById("sae-setting");
    let savedSettings = [];

    try {
        savedSettings = JSON.parse(settingv.innerText);
    } catch (ignored) {
    }

    for (let i = 0; i < Settings.settings.length; i++) {
        const setting = Settings.settings[i];
        const savedSetting = savedSettings.find((s) => s.name === setting.name);

        if (savedSetting !== undefined) {
            setting.value = savedSetting.value;
            setting.checked = savedSetting.checked;
        }

        appendSettingContainer(savedSetting === undefined ? setting : savedSetting);
    }
})();

floatingWindow.onmousedown = function (event) {
    let shiftX = event.clientX - floatingWindow.getBoundingClientRect().left;
    let shiftY = event.clientY - floatingWindow.getBoundingClientRect().top;

    floatingWindow.style.position = 'absolute';
    floatingWindow.style.zIndex = 1000;

    moveAt(event.pageX, event.pageY);

    function moveAt(pageX, pageY) {
        let newLeft = pageX - shiftX;
        let newTop = pageY - shiftY;

        /* 外に出ないようにする
        if (newLeft < 0) newLeft = 0; // left side
        if (newTop < 0) newTop = 0; // top side
        if (newLeft > document.body.offsetWidth - floatingWindow.offsetWidth) {
            newLeft = document.body.offsetWidth - floatingWindow.offsetWidth; // right side
        }
        if (newTop > document.body.offsetHeight - floatingWindow.offsetHeight) {
            newTop = document.body.offsetHeight - floatingWindow.offsetHeight; // bottom side
        }
        */

        floatingWindow.style.left = newLeft + 'px';
        floatingWindow.style.top = newTop + 'px';
    }

    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
    }

    document.addEventListener('mousemove', onMouseMove);

    document.onmouseup = function () {
        document.removeEventListener('mousemove', onMouseMove);
        floatingWindow.onmouseup = null;
    };
};

// Disable default drag handler
floatingWindow.ondragstart = function () {
    return false;
};

minimizeButton.onclick = function () {
    if (!isMinimized) {
        // Minimize the window
        for (let child of floatingWindow.children) {
            if (child === minimizeButton || child.id === 'saeMenuTitle') {
                continue;
            }

            child.style.display = 'none';
        }

        floatingWindow.style.height = '20px'
        isMinimized = true;
    } else {
        // Restore the window
        for (let child of floatingWindow.children) {
            child.style.display = '';
        }

        floatingWindow.style.height = '';
        isMinimized = false;
    }
};

for (let container of containers) {
    let button = document.createElement('button');

    button.textContent = '-';
    button.onclick = () => {
        if (!button.classList.contains('closed')) {
            for (let child of container.children) {
                if (child === button) {
                    continue;
                }

                child.style.display = 'none';
            }

            container.style.height = button.style.height;
            button.classList.add('closed');
        } else {
            for (let child of container.children) {
                child.style.display = '';
            }

            container.style.height = '';
            button.classList.remove('closed');
        };
    }

    container.prepend(button);
}

document.getElementById("addTimerMinute").onclick = () => {
    window.playerModel.limitTime += 60;
};

document.getElementById("reduceTimerDSec").onclick = () => {
    window.playerModel.limitTime -= 10;
};

document.getElementById("stopTimer").onclick = () => {
    window.playerModel.limitTime = 0;
};