<?php
/**
 * Account Status Active (Food Service) Widget class
 *
 * @since 12.7
 *
 * @package KerrFairtex
 */

namespace KerrFairtex\Widget;

class FsaStatusActive extends FsaStatus
{
	function html( $value = 'active' )
	{
		return parent::html( $value );
	}
}
