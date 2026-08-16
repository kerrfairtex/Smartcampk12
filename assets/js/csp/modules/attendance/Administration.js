/**
 * Administration program (Attendance module) JS
 *
 * @since 12.5
 *
 * @package KerrFairtex
 */

csp.modules.attendance.administration = {
	addCodePulldown: function() {
		addHTML(this.dataset.html, 'code_pulldowns');
	},
	onEvents: function() {
		$('.onclick-add-code-pulldown').on('click', csp.modules.attendance.administration.addCodePulldown);
	}
}

$(csp.modules.attendance.administration.onEvents);
