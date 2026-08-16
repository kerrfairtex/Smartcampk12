<?php
/**
 * Account Status Active (Food Service) Staff Widget class
 *
 * @since 12.7
 *
 * @package KerrFairtex
 */

namespace KerrFairtex\StaffWidget;

class FsaStatusActive extends FsaStatus
{
	function html( $value = 'active' )
	{
		return parent::html( $value );
	}
}
