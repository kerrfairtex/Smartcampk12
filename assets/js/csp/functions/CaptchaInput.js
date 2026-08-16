/**
 * CaptchaInput() function JS
 *
 * @since 12.5
 *
 * @package KerrFairtex
 */

csp.functions.captchaInput = function() {
	$('.captcha').each(function() {
		captcha(this.id);
	});
}

$(csp.functions.captchaInput);
