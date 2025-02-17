<?php

if ( ! defined( 'ABSPATH' ) ) exit;

use Automattic\WooCommerce\Internal\DataStores\Orders\CustomOrdersTableController;

/**
 * The admin-specific functionality of the plugin.
 *
 * @link       https://favoredapp.co
 * @since      1.0.0
 *
 * @package    Favored
 * @subpackage Favored/admin
 */

/**
 * The admin-specific functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    Favored
 * @subpackage Favored/admin
 * @author     Favored <info@favoredapp.co>
 */
class Favored_Admin {

	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $plugin_name    The ID of this plugin.
	 */
	private $plugin_name;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	private $pages;

	public static function is_logged_in() {

		$is_logged_in = false;

		$merchant_id = cmb2_get_option( 'favored_options', 'merchant_id' );
		$secret = cmb2_get_option( 'favored_options', 'secret' );

		if ( ! empty( $merchant_id ) && ! empty( $secret ) ) {
			$is_logged_in = true;
		}

		return $is_logged_in;

	}

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of this plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {

		$this->plugin_name = $plugin_name;
		$this->version = $version;

		$this->pages = array(
			array( 'toplevel_page_fav-crm', 'fav-crm-dashboard-script', '../build/admin/dashboard/index.js' ),
			array( 'favcrm_page_fav-crm-members', 'fav-crm-members-script', '../build/admin/members/index.js' ),
			array( 'favcrm_page_fav-crm-membership-tiers', 'fav-crm-membership-tiers-script', '../build/admin/membership-tiers/index.js' ),
			array( 'favcrm_page_fav-crm-reward-schemes', 'fav-crm-reward-schemes-script', '../build/admin/reward-schemes/index.js' ),
			array( 'favcrm_page_fav-crm-gift-offers', 'fav-crm-gift-offers-script', '../build/admin/gift-offers/index.js' ),
			array( 'favcrm_page_fav-crm-reward-transactions', 'fav-crm-reward-transactions-script', '../build/admin/reward-transactions/index.js' ),
			array( 'favcrm_page_fav-crm-billing', 'fav-crm-billing-script', '../build/admin/billing/index.js' ),
			array( 'favcrm_page_fav-crm-register', 'fav-crm-register-script', '../build/admin/register/index.js' ),
			array( 'favcrm_page_fav-crm-login', 'fav-crm-login-script', '../build/admin/login/index.js' ),
			array( 'favcrm_page_fav-crm-settings', 'fav-crm-settings-script', '../build/admin/settings/index.js' ),
		);

		require_once ABSPATH . 'wp-admin/includes/class-wp-filesystem-base.php';
		require_once ABSPATH . 'wp-admin/includes/class-wp-filesystem-direct.php';
		require_once plugin_dir_path( __FILE__ ) . 'class-favored-admin-routes.php';

	}

	/**
	 * Register the stylesheets for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Favored_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Favored_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		 wp_enqueue_style( $this->plugin_name, plugin_dir_url( __FILE__ ) . '../public/css/editor-style.css?'  . time(), array(), $this->version, 'all' );
		 wp_enqueue_style( 'woocommerce_admin_styles' );

	}

	public function init_action() {

		$this->register_scripts();
		$this->add_shortcode();

	}

	public function register_scripts() {

		foreach( $this->pages as $page ) {
			wp_register_script( $page[1], plugin_dir_url( __FILE__ ) . $page[2], array( 'wp-element', 'wp-api-fetch', 'react', 'wp-i18n' ), $this->version, true );
		}

		wp_register_script( 'fav-crm-order-meta-box', plugin_dir_url( __FILE__ ) . './js/order-meta-box.js', array(), $this->version, true );

	}

	/**
	 * Register the JavaScript for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Favored_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Favored_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		$screen = get_current_screen();

		if ($screen->id === 'woocommerce_page_wc-orders') {
			wp_enqueue_script( 'fav-crm-order-meta-box' );
		}

		foreach( $this->pages as $page ) {
			if ( $screen->id == $page[0] ) {
				wp_enqueue_script( $page[1] );

				remove_all_actions( 'admin_notices' );
				remove_all_actions( 'all_admin_notices' );

				break;
			}
		}

		wp_enqueue_script( 'jquery-tiptip' );

	}

	public function add_shortcode() {

		add_shortcode( 'fav-register', function() {
			echo esc_html( do_blocks( '<!-- wp:fav/register /-->' ) );
		} );

		add_shortcode( 'fav-login', function() {
			echo esc_html( do_blocks( '<!-- wp:fav/login /-->' ) );
		} );

	}

	public function register_rest_routes() {

		$admin_routes = new Favored_Admin_Routes();
		$admin_routes->register_routes();

	}

	public function add_plugin_admin_menu() {

		$is_logged_in = self::is_logged_in();

		add_menu_page( 'FavCRM', 'FavCRM', 'manage_options', 'fav-crm', array( &$this, 'render_dashboard_page' ), 'dashicons-star-filled', 81 );

		if ( $is_logged_in ) {
			add_submenu_page( 'fav-crm', __('Members', 'favcrm-for-woocommerce'), __('Members', 'favcrm-for-woocommerce'), 'manage_options', 'fav-crm-members', array( &$this, 'render_members_list_page' ) );
			add_submenu_page( 'fav-crm', __('Reward Transactions', 'favcrm-for-woocommerce'), __('Reward Transactions', 'favcrm-for-woocommerce'), 'manage_options', 'fav-crm-reward-transactions', array( &$this, 'render_reward_transactions_list_page' ) );
			add_submenu_page( 'fav-crm', __('Membership Tiers', 'favcrm-for-woocommerce'), __('Membership Tiers', 'favcrm-for-woocommerce'), 'manage_options', 'fav-crm-membership-tiers', array( &$this, 'render_membership_tiers_list_page' ) );
			add_submenu_page( 'fav-crm', __('Reward Schemes', 'favcrm-for-woocommerce'), __('Reward Schemes', 'favcrm-for-woocommerce'), 'manage_options', 'fav-crm-reward-schemes', array( &$this, 'render_reward_schemes_list_page' ) );
			add_submenu_page( 'fav-crm', __('Gift Offers', 'favcrm-for-woocommerce'), __('Gift Offers', 'favcrm-for-woocommerce'), 'manage_options', 'fav-crm-gift-offers', array( &$this, 'render_gift_offers_list_page' ) );
			add_submenu_page( 'fav-crm', __('Billing', 'favcrm-for-woocommerce'), __('Billing', 'favcrm-for-woocommerce'), 'manage_options', 'fav-crm-billing', array( &$this, 'render_billing_page' ) );
			add_submenu_page( 'fav-crm', __('Settings', 'favcrm-for-woocommerce'), __('Settings', 'favcrm-for-woocommerce'), 'manage_options', 'fav-crm-settings', array( &$this, 'render_settings_page' ) );
			add_submenu_page( 'fav-crm', __('System Log', 'favcrm-for-woocommerce'), __('System Log', 'favcrm-for-woocommerce'), 'manage_options', 'fav-crm-system-log', array( &$this, 'render_system_log_page' ) );
		} else {
			add_submenu_page( 'fav-crm', __('Register', 'favcrm-for-woocommerce'), __('Register', 'favcrm-for-woocommerce'), 'manage_options', 'fav-crm-register', array( &$this, 'render_register_page' ) );
			add_submenu_page( 'fav-crm', __('Login', 'favcrm-for-woocommerce'), __('Login', 'favcrm-for-woocommerce'), 'manage_options', 'fav-crm-login', array( &$this, 'render_login_page' ) );
		}

		add_submenu_page( 'fav-crm', __('Bug Report', 'favcrm-for-woocommerce'), __('Bug Report', 'favcrm-for-woocommerce'), 'manage_options', 'fav-crm-bug-report', array( &$this, 'render_bug_report_page' ) );
		add_submenu_page( null, __('Credential', 'favcrm-for-woocommerce'), __('Credential', 'favcrm-for-woocommerce'), 'manage_options', 'fav-crm-credential', array( &$this, 'render_credential_page' ) );

	}

	public function register_and_build_fields() {

		$credential_options = new_cmb2_box( array(
			'id'           => 'fav_credential_option_metabox',
			'hookup'        => false,
			'object_types' => array( 'options-page' ),
		) );

		$credential_options->add_field( array(
			'id'   => 'store_settings_section_title',
			'name' => 'FavCRM Settings',
			'type' => 'title',
		) );

		$credential_options->add_field( array(
			'id'      => 'merchant_id',
			'name'    => esc_html__( 'Merchant ID', 'favcrm-for-woocommerce' ),
			'type'    => 'text',
		) );

		$credential_options->add_field( array(
			'id'      => 'secret',
			'name'    => esc_html__( 'Secret', 'favcrm-for-woocommerce' ),
			'type'    => 'text',
		) );

		$credential_options->add_field( array(
			'id'	  => 'mode',
			'name'	  => esc_html__( 'Mode', 'favcrm-for-woocommerce' ),
			'type'	  => 'radio',
			'options' => array(
				'test' => 'Test',
				'live' => 'Live',
			),
		) );

		$bug_report_options = new_cmb2_box( array(
			'id'           => 'fav_bug_report_option_metabox',
			'hookup'        => false,
			'object_types' => array( 'options-page' ),
		) );

		$bug_report_options->add_field( array(
			'id'      => 'issue',
			'name'    => esc_html__( 'Issue', 'favcrm-for-woocommerce' ),
			'type'    => 'text',
		) );

		$bug_report_options->add_field( array(
			'id'      => 'description',
			'name'    => esc_html__( 'Description', 'favcrm-for-woocommerce' ),
			'type'    => 'textarea',
		) );

		$bug_report_options->add_field( array(
			'id'      => 'attachments',
			'name'    => esc_html__( 'Attachments', 'favcrm-for-woocommerce' ),
			'type'    => 'file_list',
			'preview_size' => array( 50, 50 )
		) );
	}

	public function maybe_process() {

		if ( ! isset( $_POST['_wpnonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['_wpnonce'] ) ), 'favored_options_verify' ) ) {
            return;
        }

		$url = wp_get_referer();

		if ( strpos( $url, 'fav-crm-credential' ) > 0 ) {
			$this->maybe_save_credential();
		} else if ( strpos( $url, 'fav-crm-system-log' ) > 0 ) {
			$this->maybe_send_diagnostic_log();
		} else if ( strpos( $url, 'fav-crm-bug-report' ) > 0 ) {
			$this->maybe_send_bug_report();
		}

	}

	public function maybe_save_credential() {

		$key = 'favored_options';
		$metabox_id = 'fav_credential_option_metabox';

		$cmb = cmb2_get_metabox( $metabox_id, $key );

		if ( $cmb ) {

			$hookup = new CMB2_hookup( $cmb );

			if ( $hookup->can_save( 'options-page' ) ) {
				$cmb->save_fields( $key, 'options-page', array(
					'merchant_id' => sanitize_text_field( $_POST['merchant_id'] ),
					'secret'   => sanitize_text_field( $_POST['secret'] ),
					'mode'   => sanitize_text_field( $_POST['mode'] ),
				) );
			}
		}

		wp_redirect( admin_url( 'admin.php?page=fav-crm-credential' ) );
		exit();

	}

	public function maybe_send_diagnostic_log() {

		$pluginlog = FAVORED_BASE_PATH . 'debug.log';

		$merchant_id = cmb2_get_option( 'favored_options', 'merchant_id' );

		$to = 'info@favcrm.io';
		$subject = 'Diagnostic log from Favored CRM plugin';

		$message = 'Merchant ID: ' . $merchant_id . '<br>';
		$message .= 'Site URL: ' . get_site_url() . '<br>';
		$message .= 'PHP version: ' . phpversion() . '<br>';
		$message .= 'WordPress version: ' . get_bloginfo( 'version' ) . '<br>';
		$message .= 'Plugin version: ' . FAVORED_VERSION . '<br>';
		$message .= 'WooCommerce version: ' . WC()->version . '<br>';

		$headers = array('Content-Type: text/html; charset=UTF-8');
		$attachments = array( $pluginlog );

		wp_mail( $to, $subject, $message, $headers, $attachments );

		wp_redirect( admin_url( 'admin.php?page=fav-crm-system-log&result=1' ) );
		exit();

	}

	public function maybe_send_bug_report() {

		$pluginlog = FAVORED_BASE_PATH . 'debug.log';

		$merchant_id = cmb2_get_option( 'favored_options', 'merchant_id' );

		$to = 'info@favcrm.io';
		$subject = '[Bug Report] ' . sanitize_text_field( $_POST['issue'] );

		$message = sanitize_text_field( $_POST['description'] ) . '<br>';
		$message .= '-----------------------------------------' . '<br>';
		$message .= 'Merchant ID: ' . $merchant_id . '<br>';
		$message .= 'Site URL: ' . get_site_url() . '<br>';
		$message .= 'PHP version: ' . phpversion() . '<br>';
		$message .= 'WordPress version: ' . get_bloginfo( 'version' ) . '<br>';
		$message .= 'Plugin version: ' . FAVORED_VERSION . '<br>';
		$message .= 'WooCommerce version: ' . WC()->version . '<br>';

		$attachments = array();

		foreach( sanitize_text_field( $_POST['attachments'] ) as $attachment ) {
			$attachments[] = str_replace( 'http://localhost:8082', WP_CONTENT_DIR, $attachment );
		}

		$attachments[] = $pluginlog;

		$headers = array('Content-Type: text/html; charset=UTF-8');
		wp_mail( $to, $subject, $message, $headers, $attachments );

		wp_redirect( admin_url( 'admin.php?page=fav-crm-bug-report&result=1' ) );
		exit();

	}

	public function maybe_display_admin_notices() {

		$screen = get_current_screen();

		if ( isset( $_GET['result'] ) && $screen->id === 'favcrm_page_fav-crm-system-log' ) {
			?>
			<div class="notice notice-success is-dismissible">
				<p><?php esc_html_e( 'Diagnostic logs have been sent successfully.', 'favcrm-for-woocommerce' ); ?></p>
			</div>
			<?php
		} else if ( isset( $_GET['result'] ) && $screen->id === 'favcrm_page_fav-crm-bug-report' ) {
			?>
			<div class="notice notice-success is-dismissible">
				<p><?php esc_html_e( 'Bug report has been sent successfully.', 'favcrm-for-woocommerce' ); ?></p>
			</div>
			<?php
		}
	}

	public function handle_order_status_changed( $order_id, $old_status, $new_status ) {

		if ( ! self::is_logged_in() ) {
			return;
		}

		$order = wc_get_order( $order_id );

		if ( $new_status == 'completed' ) {
			$this->update_order_to_fav( $order );
		} else if ( $new_status == 'cancelled' || $new_status == 'refunded' ) {
			$this->sync_void_order_to_fav( $order );
		}
	}

	public function sync_order_to_fav( $order ) {

		$order_data = [];

		$billing = $order->get_address( 'billing' );
		// $order_data['shipping'] = $order->get_address( 'shipping' );
		$order_data['subtotal'] = $order->get_subtotal();
		$order_data['discount'] = $order->get_discount_total();
		$order_data['total'] = $order->get_total();
		$order_data['order_id'] = $order->get_id();
		$order_data['items'] = [];
		$order_data['coupons'] = [];

		$order_items = $order->get_items();

		foreach( $order_items as $product ) {
			$order_data['items'][] = [
				'name' => $product['name'],
				'quantity' => $product['quantity'],
				'price' => $product['subtotal'],
			];
		}

		$order_coupons = $order->get_items( 'coupon' );

		foreach( $order_coupons as $coupon ) {
			$order_data['coupons'][] = [
				'name' => $coupon['name'],
				'amount' => $coupon['discount_amount'],
			];
		}

		$body = array(
			'name' => $billing['first_name'],
			'phone' => $billing['phone'],
			'amount' => $order_data['total'],
			'order_id' => $order_data['order_id'],
			'data' => wp_json_encode( $order_data ),
			'member_id' => get_user_meta( get_current_user_id(), 'fav_id', true ),
			'status' => $order->get_status() == 'completed' ? 'PROCESSED' : 'PENDING',
		);

		FavoredLogger::write_log( 'Sending data to Favored CRM for order #' . $order_data['order_id'] );

		$response = FavoredHttpHelper::post( '/v3/member/company/spending-records/', $body );

		if ( is_wp_error( $response ) ) {
			$error_message = $response->get_error_message();
			FavoredLogger::write_log( "Something went wrong: $error_message" );

			return;
		}

		$response = wp_remote_retrieve_body( $response );
		$response = json_decode( $response, true );

		$order->update_meta_data( 'fav_order_id', $response['uuid'] );
		$order->update_meta_data( 'fav_order_status', $response['status'] );
		$order->save();

		FavoredLogger::write_log( '----- Completed -----' );
	}

	public function update_order_to_fav( $order ) {

		FavoredLogger::write_log( 'Sending data to Favored CRM for order #' . $order->get_id() );

		$fav_order_id = $order->get_meta( 'fav_order_id' );
		$fav_order_status = $order->get_meta( 'fav_order_status' );

		if ( $fav_order_status == 'PROCESSED' ) {
			return;
		}

		$body = array(
			'order_id' => $order->get_id(),
			'member_id' => get_user_meta( get_current_user_id(), 'fav_id', true ),
			'status' => $order->get_status() == 'completed' ? 'PROCESSED' : 'PENDING',
		);

		$response = FavoredHttpHelper::patch( '/v3/member/company/spending-records/' . $fav_order_id . '/', $body );

		if ( is_wp_error( $response ) ) {
			$error_message = $response->get_error_message();
			FavoredLogger::write_log( "Something went wrong: $error_message" );
		}

		$response = wp_remote_retrieve_body( $response );
		$response = json_decode( $response, true );

		if ( $response['status'] == 'PROCESSED' ) {
			$order->update_meta_data( 'fav_order_status', $response['status'] );
			$order->update_meta_data( 'fav_order_points', $response['points'] );
			$order->update_meta_data( 'fav_order_stamps', $response['stamps'] );
			$order->save();
		}

		FavoredLogger::write_log( '----- Completed -----' );

	}

	public function manual_sync_order() {

		$order_id = sanitize_text_field( $_POST['order_id'] );

		$order = wc_get_order( $order_id );
		$fav_order_id = $order->get_meta( 'fav_order_id' );

		if ( ! $fav_order_id ) {
			$this->sync_order_to_fav( $order );
		}

		$this->update_order_to_fav( $order );

		wp_send_json_success(array(
			'success' => true,
		));

	}

	public function sync_void_order_to_fav( $order ) {

		FavoredLogger::write_log( 'Order #' . $order_id . ' has been voided' );

		$body = array(
			'order_id' => $order_id,
			'member_id' => get_user_meta( get_current_user_id(), 'fav_id', true ),
		);

		FavoredLogger::write_log( 'Sending data to Favored CRM for order #' . $order_id );

		$url = '/v3/member/company/void-order/';

		$response = FavoredHttpHelper::post( $url, $body );

		$response_code = wp_remote_retrieve_response_code( $response );

		if ( is_wp_error( $response ) ) {
			$error_message = $response->get_error_message();
			FavoredLogger::write_log( "Something went wrong: $error_message" );
		} else {
			FavoredLogger::write_log( '----- Completed -----' );
		}
	}

	public function handle_order_created( $order_id ) {

		if ( ! self::is_logged_in() ) {
			return;
		}

		$order = wc_get_order( $order_id );

		$this->sync_order_to_fav( $order );

	}

	public function render_dashboard_page() {

		$favored_options = get_option( 'favored_options' );

		if ( ! $this->is_logged_in() ) {
			include_once( plugin_dir_path( __FILE__ ) . 'includes/register.php' );

			wp_enqueue_script( 'fav-crm-register-script' );
		} else {
			include_once( plugin_dir_path( __FILE__ ) . 'includes/dashboard.php' );
		}

	}

	public function render_members_list_page() {
		include_once( plugin_dir_path( __FILE__ ) . 'includes/member-list.php' );
	}

	public function render_membership_tiers_list_page() {
		include_once( plugin_dir_path( __FILE__ ) . 'includes/membership-tier-list.php' );
	}

	public function render_reward_schemes_list_page() {
		include_once( plugin_dir_path( __FILE__ ) . 'includes/reward-scheme-list.php' );
	}

	public function render_reward_transactions_list_page() {
		include_once( plugin_dir_path( __FILE__ ) . 'includes/reward-transaction-list.php' );
	}

	public function render_gift_offers_list_page() {
		include_once( plugin_dir_path( __FILE__ ) . 'includes/gift-offer-list.php' );
	}

	public function render_billing_page() {
		include_once( plugin_dir_path( __FILE__ ) . 'includes/billing.php' );
	}

	public function render_register_page() {
		include_once( plugin_dir_path( __FILE__ ) . 'includes/register.php' );
	}

	public function render_login_page() {
		include_once( plugin_dir_path( __FILE__ ) . 'includes/login.php' );
	}

	public function render_credential_page() {
		include_once( plugin_dir_path( __FILE__ ) . 'includes/credential.php' );
	}

	public function render_settings_page() {
		include_once( plugin_dir_path( __FILE__ ) . 'includes/settings.php' );
	}

	public function render_system_log_page() {
		include_once( plugin_dir_path( __FILE__ ) . 'includes/system-log.php' );
	}

	public function render_bug_report_page() {
		include_once( plugin_dir_path( __FILE__ ) . 'includes/bug-report.php' );
	}

	public function add_order_meta_boxes() {

		$screen = class_exists( '\Automattic\WooCommerce\Internal\DataStores\Orders\CustomOrdersTableController' ) && wc_get_container()->get( CustomOrdersTableController::class )->custom_orders_table_usage_is_enabled()
			? wc_get_page_screen_id( 'shop-order' )
			: 'shop_order';

		add_meta_box(
			'fav_order_meta_box',
			__( 'FavCRM Order Details', 'favcrm-for-woocommerce' ),
			array( $this, 'order_meta_box_callback' ),
			$screen,
			'side',
			'high'
		);

	}

	public function order_meta_box_callback( $order ) {

		$order_id = $order->get_id();
		$fav_order_id = $order->get_meta( 'fav_order_id' ) ?: '-';
		$fav_order_status = $order->get_meta( 'fav_order_status' ) ?: '-';
		$fav_order_points = $order->get_meta( 'fav_order_points' ) ?: '-';
		$fav_order_stamps = $order->get_meta( 'fav_order_stamps' ) ?: '-';

		include( plugin_dir_path( __FILE__ ) . 'includes/order-meta-box.php' );

	}

	public function add_order_column( $columns ) {

		$columns['fav-order-status'] = __( 'Fav Order', 'favcrm-for-woocommerce' );

		return $columns;

	}

	public function display_wc_order_list_custom_column_content( $column, $order ) {

		switch ( $column ) {

			case 'fav-order-status':
				$fav_order_status = $order->get_meta( 'fav_order_status' );
				echo esc_html( $fav_order_status );
				break;
		}

	}

}
