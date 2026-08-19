<?php
/**
 * Dashboard functions class
 *
 * @since 13.0
 *
 * @package KerrFairtex
 */

namespace KerrFairtex\Functions;

class Dashboard
{
	/** @var array Dashboard HTML */
	protected $dashboard = [];

	/** @var object DashboardModule object instance */
	protected $module;

	/**
	 * Dashboard build
	 *
	 * Calls, for each active and user module
	 * the `Dashboard[Module_Name]` function.
	 *
	 * Place your add-on module `Dashboard[Module_Name]` function in the functions.php file.
	 *
	 * @uses $_REQUEST['_ROSARIO_DASHBOARD']
	 *
	 * @todo For example, set $_REQUEST['_ROSARIO_DASHBOARD']['export'] to 1 to export data.
	 * In URL: &_ROSARIO_DASHBOARD[export]=1
	 *
	 * @global $RosarioModules
	 * @see DashboardModule.php for default core modules `Dashboard[Module_Name]` functions.
	 *
	 * @param object $module DashboardModule object instance. Optional.
	 */
	function __construct( $module = null )
	{
		global $RosarioModules;

		if ( $module )
		{
			$this->module = $module;
		}
		// (Re)create it, if it's gone missing.
		elseif ( ! is_object( $this->module ) )
		{
			$this->module = new DashboardModule();
		}

		if ( ! empty( $_REQUEST['_ROSARIO_DASHBOARD'] ) )
		{
			$this->dashboard = array_merge_recursive( $this->dashboard, $_REQUEST['_ROSARIO_DASHBOARD'] );
		}

		foreach ( $RosarioModules as $module => $activated )
		{
			if ( ! $activated )
			{
				// Module not activated.
				continue;
			}

			$html = $this->module->load( $module );

			$this->add( $module, $html, true );
		}
	}

	/**
	 * Dashboard Output HTML
	 * Modules HTML inside PopTable
	 *
	 * @param integer $rows Number of modules per row, defaults to 4. Optional.
	 */
	function output( $rows = 4 )
	{
		if ( empty( $this->dashboard ) )
		{
			return;
		}

		echo '<br>';

		PopTable( 'header', _( 'Dashboard' ), 'width="100%"' );

		echo '<div class="kpi-grid">';

		$module_colors = [
			'School_Setup' => 'violet',
			'Students' => 'cyan',
			'Users' => 'green',
			'Scheduling' => 'amber',
			'Grades' => 'red',
			'Attendance' => 'teal',
			'Discipline' => 'violet',
			'Accounting' => 'green',
			'Student_Billing' => 'amber',
			'Food_Service' => 'teal',
		];

		$i = 0;
		foreach ( $this->dashboard as $module => $html ) {
			$color = $module_colors[$module] ?? 'cyan';
			$color_hex = ($color == 'violet' ? '#7C5CFF' : ($color == 'cyan' ? '#00D9FF' : ($color == 'green' ? '#22D3A8' : ($color == 'amber' ? '#FFB020' : ($color == 'red' ? '#FF6B6B' : '#4EA8DE')))));
			echo '<div class="kpi-card accent-' . $color . '" data-count="0" data-label="' . $module . '" data-color="' . $color_hex . '">';
			echo '<div class="kpi-card-header"><div class="kpi-card-icon"></div><div class="sparkline-container"></div></div>';
			echo '<div class="kpi-value">0</div>';
			echo '<div class="kpi-label">' . _( str_replace( '_', ' ', $module ) ) . '</div>';
			echo '<div class="kpi-card-inner">' . $html . '</div>';
			echo '</div>';
			$i++;
		}

		echo '</div>';

		PopTable( 'footer' );
	}

	/**
	 * Add module HTML to Dashboard
	 *
	 * Add module HTML to $this->dashboard[ $module ]
	 *
	 * @param string  $module Module.
	 * @param string  $html   Dashboard HTML.
	 * @param boolean $append Append HTML.
	 */
	function add( $module, $html, $append = true )
	{
		if ( empty( $html ) )
		{
			return;
		}

		if ( $append
			&& ! empty( $this->dashboard[$module] ) )
		{
			$this->dashboard[$module] .= $html;
		}
		else
		{
			$this->dashboard[$module] = $html;
		}
	}
}
