/**
 * Created by 1 on 21.05.2016.
 */

'use strict';

document.addEventListener('DOMContentLoaded', function() {

    var buttons = document.body.querySelectorAll('.js-button-load-code');
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener('click', copyCode)
    }

});

function copyCode(event) {
    var target = event.target;
    var codeId = target.getAttribute('data-code-id');
    if(codeId == null) {
        return;
    }

    var containerSource = document.body.querySelector('.js-container-code[data-code-id="' + codeId + '"]');
    var containerTarget = document.body.querySelector('.js-remodal-content');
    containerTarget.innerHTML = containerSource.innerHTML;
}