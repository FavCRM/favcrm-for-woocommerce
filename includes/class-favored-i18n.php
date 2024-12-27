<?php

/**
 * Define the internationalization functionality
 *
 * Loads and defines the internationalization files for this plugin
 * so that it is ready for translation.
 *
 * @link       https://favoredapp.co
 * @since      1.0.0
 *
 * @package    Favored
 * @subpackage Favored/includes
 */

/**
 * Define the internationalization functionality.
 *
 * Loads and defines the internationalization files for this plugin
 * so that it is ready for translation.
 *
 * @since      1.0.0
 * @package    Favored
 * @subpackage Favored/includes
 * @author     Favored <info@favoredapp.co>
 */
class Favored_i18n {

	public function set_admin_script_translations() {

		wp_set_script_translations(
			'fav-crm-billing-script',
			'favcrm-for-woocommerce',
			plugin_dir_path( __FILE__ ) . '../languages/',
		);

	}

	public function set_public_script_translations() {

		$scripts = array(
			'fav-login-view-script',
			'fav-register-view-script',
			'fav-floating-icon-view-script',
		);

		foreach ( $scripts as $script ) {
			wp_set_script_translations(
				$script,
				'favcrm-for-woocommerce',
				plugin_dir_path( __FILE__ ) . '../languages/',
			);
		}

	}

}
