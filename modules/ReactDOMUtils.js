export class ReactDOMUtils {

    /**
     * Changes the value of an input element and triggers a change event.
     * @param {HTMLInputElement} input - The input element to change the value of.
     * @param {any} newValue - The new value to set on the input element.
     */
    static changeInputValue(input, newValue) {
        input.value = newValue;
        reactTriggerChange(input);
    }

    /**
     * Simulates a mouse click on the given button element by dispatching a series of mouse events.
     * @param {HTMLElement} button - The button element to click.
     */
    static clickButton(button) {
        const mouseClickEvents = ['mousedown', 'click', 'mouseup'];
        mouseClickEvents.forEach(mouseEventType =>
            button.dispatchEvent(
                new MouseEvent(mouseEventType, {
                    view: window,
                    bubbles: true,
                    cancelable: true,
                    buttons: 1
                })
            )
        );
    }
}