<?php
/**
 * Account Exists No (Food Service) Staff Widget class
 *
 * @since 12.7
 *
 * @package KerrFairtex
 */

namespace KerrFairtex\StaffWidget;

class FsaExistsN extends FsaExists
{
	function html( $value = 'N' )
	{
		return parent::html( $value );
	}
}
