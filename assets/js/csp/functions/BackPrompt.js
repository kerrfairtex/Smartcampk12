/**
 * BackPrompt() function JS
 *
 * @since 12.5
 *
 * @package KerrFairtex
 */

// Note: do not add to `csp` object here: not defined
var backPrompt = function() {
	alert(document.getElementById('back_prompt').value);

	window.close();
}

backPrompt();
