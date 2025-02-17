<?php

/**
 * The file that defines the core plugin class
 *
 * A class definition that includes attributes and functions used across both the
 * public-facing side of the site and the admin area.
 *
 * @link       https://favoredapp.co
 * @since      1.0.0
 *
 * @package    Favored
 * @subpackage Favored/includes
 */

/**
 * The core plugin class.
 *
 * This is used to define internationalization, admin-specific hooks, and
 * public-facing site hooks.
 *
 * Also maintains the unique identifier of this plugin as well as the current
 * version of the plugin.
 *
 * @since      1.0.0
 * @package    Favored
 * @subpackage Favored/includes
 * @author     Favored <info@favoredapp.co>
 */
class Favored {

	/**
	 * The loader that's responsible for maintaining and registering all hooks that power
	 * the plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      Favored_Loader    $loader    Maintains and registers all hooks for the plugin.
	 */
	protected $loader;

	/**
	 * The unique identifier of this plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      string    $plugin_name    The string used to uniquely identify this plugin.
	 */
	protected $plugin_name;

	/**
	 * The current version of the plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      string    $version    The current version of the plugin.
	 */
	protected $version;

	/**
	 * Define the core functionality of the plugin.
	 *
	 * Set the plugin name and the plugin version that can be used throughout the plugin.
	 * Load the dependencies, define the locale, and set the hooks for the admin area and
	 * the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function __construct() {
		if ( defined( 'FAVORED_VERSION' ) ) {
			$this->version = FAVORED_VERSION;
		} else {
			$this->version = '1.0.0';
		}
		$this->plugin_name = 'favcrm';

		$this->load_dependencies();
		$this->set_locale();
		$this->define_admin_hooks();
		$this->define_public_hooks();

	}

	/**
	 * Load the required dependencies for this plugin.
	 *
	 * Include the following files that make up the plugin:
	 *
	 * - Favored_Loader. Orchestrates the hooks of the plugin.
	 * - Favored_i18n. Defines internationalization functionality.
	 * - Favored_Admin. Defines all hooks for the admin area.
	 * - Favored_Public. Defines all hooks for the public side of the site.
	 *
	 * Create an instance of the loader which will be used to register the hooks
	 * with WordPress.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function load_dependencies() {

		/**
		 * The class responsible for orchestrating the actions and filters of the
		 * core plugin.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-favored-loader.php';

		/**
		 * The class responsible for defining internationalization functionality
		 * of the plugin.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-favored-i18n.php';

		/**
		 * The class responsible for defining all actions that occur in the admin area.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'admin/class-favored-admin.php';

		/**
		 * The class responsible for defining all actions that occur in the public-facing
		 * side of the site.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'public/class-favored-public.php';

		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-favored-http-helper.php';
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-favored-logger.php';
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/cmb2/init.php';

		if ( ! class_exists( 'WP_List_Table' ) ) {
			require_once( ABSPATH . 'wp-admin/includes/class-wp-list-table.php' );
		}

		$this->loader = new Favored_Loader();

	}

	/**
	 * Define the locale for this plugin for internationalization.
	 *
	 * Uses the Favored_i18n class in order to set the domain and to register the hook
	 * with WordPress.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function set_locale() {

		$plugin_i18n = new Favored_i18n();

		$this->loader->add_action( 'admin_enqueue_scripts', $plugin_i18n, 'set_admin_script_translations', 100 );
		$this->loader->add_action( 'init', $plugin_i18n, 'set_public_script_translations', 100 );

	}

	/**
	 * Register all of the hooks related to the admin area functionality
	 * of the plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function define_admin_hooks() {

		$plugin_admin = new Favored_Admin( $this->get_plugin_name(), $this->get_version() );

		$this->loader->add_action( 'init', $plugin_admin, 'init_action' );
		$this->loader->add_action( 'admin_enqueue_scripts', $plugin_admin, 'enqueue_styles' );
		$this->loader->add_action( 'admin_enqueue_scripts', $plugin_admin, 'enqueue_scripts' );

		$this->loader->add_action( 'rest_api_init', $plugin_admin, 'register_rest_routes' );
		$this->loader->add_action( 'admin_menu', $plugin_admin, 'add_plugin_admin_menu' );
		$this->loader->add_action( 'cmb2_admin_init', $plugin_admin, 'register_and_build_fields' );
		$this->loader->add_action( 'woocommerce_order_status_changed', $plugin_admin, 'handle_order_status_changed', 10, 3 );
		$this->loader->add_action( 'woocommerce_new_order', $plugin_admin, 'handle_order_created', 10, 1 );
		$this->loader->add_action( 'current_screen', $plugin_admin, 'maybe_process', 10, 1 );
		$this->loader->add_action( 'admin_notices', $plugin_admin, 'maybe_display_admin_notices' );
		$this->loader->add_action( 'add_meta_boxes', $plugin_admin, 'add_order_meta_boxes' );
		$this->loader->add_filter( 'manage_woocommerce_page_wc-orders_columns', $plugin_admin, 'add_order_column' );
		$this->loader->add_action( 'manage_woocommerce_page_wc-orders_custom_column', $plugin_admin, 'display_wc_order_list_custom_column_content', 10, 2 );
		$this->loader->add_action( 'wp_ajax_fav_sync_order', $plugin_admin, 'manual_sync_order' );

	}

	/**
	 * Register all of the hooks related to the public-facing functionality
	 * of the plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function define_public_hooks() {

		$plugin_public = new Favored_Public( $this->get_plugin_name(), $this->get_version() );

		$this->loader->add_action( 'wp_enqueue_scripts', $plugin_public, 'enqueue_styles' );
		$this->loader->add_action( 'wp_enqueue_scripts', $plugin_public, 'enqueue_scripts' );

		$this->loader->add_action( 'rest_api_init', $plugin_public, 'register_rest_routes' );
		$this->loader->add_action( 'init', $plugin_public, 'register_blocks' );
		$this->loader->add_action( 'init', $plugin_public, 'extend_schemas' );
		$this->loader->add_action( 'wp_footer', $plugin_public, 'init_floating_icon' );
		$this->loader->add_action( 'woocommerce_cart_calculate_fees', $plugin_public, 'add_loyalty_discounts' );
		$this->loader->add_action( 'woocommerce_cart_calculate_fees', $plugin_public, 'add_tier_discounts' );
		$this->loader->add_action( 'woocommerce_blocks_loaded', $plugin_public, 'use_credits' );

		add_action( 'init', array( __CLASS__, 'load_integration' ) );
	}

	/**
	 * Load the integration.
	 */
	public static function load_integration() {

		if ( ! did_action( 'woocommerce_blocks_loaded' ) ) {
			return;
		}

		include_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-favored-integration-interface.php';

		add_action(
			'woocommerce_blocks_checkout_block_registration',
			function( $registry ) {
				$registry->register( Favored_Plugin_Integration::instance() );
			}
		);

	}

	/**
	 * Run the loader to execute all of the hooks with WordPress.
	 *
	 * @since    1.0.0
	 */
	public function run() {
		$this->loader->run();
	}

	/**
	 * The name of the plugin used to uniquely identify it within the context of
	 * WordPress and to define internationalization functionality.
	 *
	 * @since     1.0.0
	 * @return    string    The name of the plugin.
	 */
	public function get_plugin_name() {
		return $this->plugin_name;
	}

	/**
	 * The reference to the class that orchestrates the hooks with the plugin.
	 *
	 * @since     1.0.0
	 * @return    Favored_Loader    Orchestrates the hooks of the plugin.
	 */
	public function get_loader() {
		return $this->loader;
	}

	/**
	 * Retrieve the version number of the plugin.
	 *
	 * @since     1.0.0
	 * @return    string    The version number of the plugin.
	 */
	public function get_version() {
		return $this->version;
	}

}
