/**
 * PasswordInput() function JS
 *
 * @since 12.5
 *
 * @package KerrFairtex
 */

csp.functions.passwordInput = function() {
	var $p = $('.password-input-wrapper input');

	$p.each(function() {
		$(this).passwordStrength(
			$(this).data('minStrength'),
			$(this).data('error'),
			$(this).data('userInputs')
		);
	});
}

$(csp.functions.passwordInput);
