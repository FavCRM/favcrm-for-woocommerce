<?php
use Automattic\WooCommerce\StoreApi\Schemas\V1\CartSchema;

/**
 * The public-facing functionality of the plugin.
 *
 * @link       https://favoredapp.co
 * @since      1.0.0
 *
 * @package    Favored
 * @subpackage Favored/public
 */

/**
 * The public-facing functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the public-facing stylesheet and JavaScript.
 *
 * @package    Favored
 * @subpackage Favored/public
 * @author     Favored <info@favoredapp.co>
 */
class Favored_Public {

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

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of the plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {

		$this->plugin_name = $plugin_name;
		$this->version = $version;

	}

	/**
	 * Register the stylesheets for the public-facing side of the site.
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

		wp_enqueue_style( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'css/app.css?'  . time(), array(), $this->version, 'all' );
	}

	/**
	 * Register the JavaScript for the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts() {

		wp_enqueue_script( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'js/favored-public.js', array( 'jquery' ), $this->version, false );

	}

	public function register_rest_routes() {

		register_rest_route( 'wc/v3', '/payment-intents', array(
			'methods' => 'POST',
			'callback' => array( $this, 'create_order_payment_intent' ),
			'permission_callback' => '__return_true',
		  ) );

		register_rest_route( 'wc/v3', '/orders/(?P<id>\d+)', array(
			'methods' => 'PUT',
			'callback' => array( $this, 'update_order' ),
			'permission_callback' => '__return_true',
		) );

		register_rest_route( 'fav/v1', '/member', array(
			'methods' => 'GET',
			'callback' => array( $this, 'get_member' ),
			'permission_callback' => '__return_true',
		) );

		register_rest_route( 'fav/v1', '/reward-schemes', array(
			'methods' => 'GET',
			'callback' => array( $this, 'get_reward_schemes' ),
			'permission_callback' => '__return_true',
		) );

		register_rest_route( 'fav/v1', '/gift-offers', array(
			'methods' => 'GET',
			'callback' => array( $this, 'get_gift_offers' ),
			'permission_callback' => '__return_true',
		) );

		register_rest_route( 'fav/v1', '/activities', array(
			'methods' => 'GET',
			'callback' => array( $this, 'get_activities' ),
			'permission_callback' => '__return_true',
		) );

		register_rest_route( 'fav/v1', '/site', array(
			'methods' => 'GET',
			'callback' => array( $this, 'get_site' ),
			'permission_callback' => '__return_true',
		) );

		register_rest_route( 'fav/v1', '/reward-redemptions', array(
			'methods' => 'POST',
			'callback' => array( $this, 'create_reward_redemption' ),
			'permission_callback' => '__return_true',
		) );

		register_rest_route( 'fav/v1', '/my-rewards', array(
			'methods' => 'GET',
			'callback' => array( $this, 'get_my_rewards' ),
			'permission_callback' => '__return_true',
		) );

		register_rest_route( 'fav/v1', '/login', array(
			'methods' => 'POST',
			'callback' => array( $this, 'ajax_login' ),
			'permission_callback' => '__return_true',
		) );

		register_rest_route( 'fav/v1', '/register', array(
			'methods' => 'POST',
			'callback' => array( $this, 'ajax_register' ),
			'permission_callback' => '__return_true',
		) );

		register_rest_route( 'fav/v1', '/logout', array(
			'methods' => 'POST',
			'callback' => array( $this, 'ajax_logout' ),
			'permission_callback' => '__return_true',
		) );
	}

	public function use_credits() {

		woocommerce_store_api_register_update_callback(
			[
			'namespace' => 'fav-cash-rewards',
			'callback'  => function( $data ) {
				WC()->session->set( 'cash_rewards', $data['credits'] );
			},
			]
		);

	}

	public function extend_schemas() {

		woocommerce_store_api_register_endpoint_data(
			array(
				'endpoint'        => CartSchema::IDENTIFIER,
				'namespace'       => 'fav',
				'data_callback'   => function() {
					$member = $this->get_member();

					$cash_rewards = 0;

					if ( property_exists( $member, 'cashRewards' ) ) {
						$cash_rewards = $member->cashRewards;
					}

					return array(
						'cashRewards' => $cash_rewards,
						'nonce' => wp_create_nonce( 'wc_store_api' ),
					);
				},
				'schema_callback' => function() {
					return array(
						'properties' => array(
							'cashRewards' => array(
								'type' => 'integer',
							),
						),
					);
				},
				'schema_type' => ARRAY_A,
			)
		);

	}

	public function create_order_payment_intent( $request ) {
		if ( !is_user_logged_in() ) {
			wp_send_json_error( 'Authentication required', 401 );
		}

		$order_id = $request['order_id'];
		$amount = $request['amount'];

		$stripe_settings = get_option( 'woocommerce_stripe_settings' );

		if ( $stripe_settings['testmode'] == 'yes' ) {
			$publishable_key = $stripe_settings['test_publishable_key'];
			$secret_key = $stripe_settings['test_secret_key'];
		} else {
			$publishable_key = $stripe_settings['publishable_key'];
			$secret_key = $stripe_settings['secret_key'];
		}

		$response = wp_remote_post( 'https://api.stripe.com/v1/payment_intents', array(
			'headers' => array(
				'Authorization' => 'Bearer ' . $secret_key,
				'Content-Type' => 'application/x-www-form-urlencoded',
			),
			'body' => array(
				'amount' => $amount * 100,
				'currency' => 'hkd',
				'metadata[order_id]' => $order_id,
			),
		) );

		$payment_intent = json_decode( wp_remote_retrieve_body( $response ) );

		return array(
			'publishable_key' => $publishable_key,
			'payment_intent' => $payment_intent,
		);
	}

	public function update_order( $request ) {
		if ( !is_user_logged_in() ) {
			wp_send_json_error( 'Authentication required', 401 );
		}

		$payload = $request->get_params();

		$order_id = $payload['id'];
		$payment_intent_id = $payload['payment_intent_id'];

		$stripe_settings = get_option( 'woocommerce_stripe_settings' );

		if ( $stripe_settings['testmode'] == 'yes' ) {
			$publishable_key = $stripe_settings['test_publishable_key'];
			$secret_key = $stripe_settings['test_secret_key'];
		} else {
			$publishable_key = $stripe_settings['publishable_key'];
			$secret_key = $stripe_settings['secret_key'];
		}

		$response = wp_remote_get( 'https://api.stripe.com/v1/payment_intents/' . $payment_intent_id, array(
			'headers' => array(
				'Authorization' => 'Bearer ' . $secret_key,
				'Content-Type' => 'application/x-www-form-urlencoded',
			),
		) );

		$payment_intent = json_decode( wp_remote_retrieve_body( $response ), true );
		$order = wc_get_order( $order_id );

		if ( $payment_intent['status'] == 'succeeded' && ( $payment_intent['amount_received'] / 100 ) == $order->get_total() ) {

			$order->set_status( 'processing' );
			$order->update_meta_data( '_stripe_intent_id', $payment_intent_id );
			$order->update_meta_data( '_stripe_source_id', $payment_intent['charges']['data'][0]['payment_method'] );
			$order->update_meta_data( '_stripe_charge_captured', true );
			$order->save();

		}

		$order_data = $order->get_data();

		$order_line_items = array();

		foreach ( $order->get_items() as $item_id => $item ) {
			$order_line_items[] = $item->get_data();
		}

		$order_data['line_items'] = $order_line_items;
		$order_data['shipping_method'] = $order->get_shipping_method();

		return array(
			'order' => $order_data,
			'status' => $payment_intent['status'],
		);
	}

	public function register_blocks(): void {

		$blocks = glob( plugin_dir_path(__FILE__) . '../build/blocks/*/block.json' );

		if ( ! $blocks ) {
			return;
		}

		foreach ( $blocks as $block ) {
			register_block_type( $block );
		}

		wp_register_script(
			'favored-use-credit-js',
			plugin_dir_url( __FILE__ ) . '../resources/js/favored-use-credit.js',
			array( 'react' )
		);

	}

	public function enqueue_block_editor_assets() {

		wp_enqueue_script( 'favored-use-credit-js' );

	}

	public function init_floating_icon() {

		echo wp_kses_post( do_blocks( '<!-- wp:fav/floating-icon /-->' ) );

	}

	public function get_member() {

		$merchant_id = cmb2_get_option( 'favored_options', 'merchant_id' );
		$secret = cmb2_get_option( 'favored_options', 'secret' );
		$mode = cmb2_get_option( 'favored_options', 'mode' );

		$fav_id = get_user_meta( get_current_user_id(), 'fav_id', true );
		$base_url = $mode == 'test' ? 'https://dev.favcrm.io' : 'https://api.favoredapp.co';
		$url = $base_url . '/member/external-platform/members/' . $fav_id . '/';

		$response = wp_remote_post( $url, array(
			'method' => 'GET',
			'timeout' => 45,
			'redirection' => 5,
			'httpversion' => '1.0',
			'blocking' => true,
			'headers' => array(
				'X-Merchant-ID' => $merchant_id,
				'X-Secret' => $secret,
				'Content-Type' => 'application/json',
			),
		) );

		$response_code = wp_remote_retrieve_response_code( $response );

		if ( $response_code != 200 ) {
			return new WP_Error( 'error', 'Failed to fetch member', array( 'status' => $response_code ) );
		}

		$body = wp_remote_retrieve_body( $response );

		return json_decode( $body );

	}

	public function get_reward_schemes() {
		$merchant_id = cmb2_get_option( 'favored_options', 'merchant_id' );
		$secret = cmb2_get_option( 'favored_options', 'secret' );
		$mode = cmb2_get_option( 'favored_options', 'mode' );

		$base_url = $mode == 'test' ? 'https://dev.favcrm.io' : 'https://api.favoredapp.co';
		$url = $base_url . '/member/external-platform/reward-schemes/';

		$response = wp_remote_post( $url, array(
			'method' => 'GET',
			'timeout' => 45,
			'redirection' => 5,
			'httpversion' => '1.0',
			'blocking' => true,
			'headers' => array(
				'X-Merchant-ID' => $merchant_id,
				'X-Secret' => $secret,
				'Content-Type' => 'application/json',
			),
		) );

		$response_code = wp_remote_retrieve_response_code( $response );

		if ( $response_code != 200 ) {
			return new WP_Error( 'error', 'Failed to fetch reward schemes', array( 'status' => $response_code ) );
		}

		$body = wp_remote_retrieve_body( $response );

		return json_decode( $body );
	}

	public function get_gift_offers() {

		$merchant_id = cmb2_get_option( 'favored_options', 'merchant_id' );
		$secret = cmb2_get_option( 'favored_options', 'secret' );
		$mode = cmb2_get_option( 'favored_options', 'mode' );

		$base_url = $mode == 'test' ? 'https://dev.favcrm.io' : 'https://api.favoredapp.co';
		$url = $base_url . '/member/external-platform/gift-offers/';

		$response = wp_remote_post( $url, array(
			'method' => 'GET',
			'timeout' => 45,
			'redirection' => 5,
			'httpversion' => '1.0',
			'blocking' => true,
			'headers' => array(
				'X-Merchant-ID' => $merchant_id,
				'X-Secret' => $secret,
				'Content-Type' => 'application/json',
			),
		) );

		$response_code = wp_remote_retrieve_response_code( $response );

		if ( $response_code != 200 ) {
			return new WP_Error( 'error', 'Failed to fetch gift offers', array( 'status' => $response_code ) );
		}

		$body = wp_remote_retrieve_body( $response );

		return json_decode( $body );

	}

	public function get_activities() {

		$merchant_id = cmb2_get_option( 'favored_options', 'merchant_id' );
		$secret = cmb2_get_option( 'favored_options', 'secret' );
		$mode = cmb2_get_option( 'favored_options', 'mode' );

		$base_url = $mode == 'test' ? 'https://dev.favcrm.io' : 'https://api.favoredapp.co';
		$url = $base_url . '/member/external-platform/activities/';

		$response = wp_remote_post( $url, array(
			'method' => 'GET',
			'timeout' => 45,
			'redirection' => 5,
			'httpversion' => '1.0',
			'blocking' => true,
			'headers' => array(
				'X-Merchant-ID' => $merchant_id,
				'X-Secret' => $secret,
				'Content-Type' => 'application/json',
			),
		) );

		$response_code = wp_remote_retrieve_response_code( $response );

		if ( $response_code != 200 ) {
			return new WP_Error( 'error', 'Failed to fetch activities', array( 'status' => $response_code ) );
		}

		$body = wp_remote_retrieve_body( $response );

		return json_decode( $body );

	}

	public function build_headers() {

		$merchant_id = cmb2_get_option( 'favored_options', 'merchant_id' );
		$secret = cmb2_get_option( 'favored_options', 'secret' );

		return array(
			'X-Merchant-ID' => $merchant_id,
			'X-Secret' => $secret,
			'Content-Type' => 'application/json',
		);

	}

	public function http_get( $url ) {

		$mode = cmb2_get_option( 'favored_options', 'mode' );

		$base_url = $mode == 'test' ? 'https://dev.favcrm.io' : 'https://api.favoredapp.co';
		$url = $base_url . $url;

		$response = wp_remote_get( $url, array(
			'headers' => $this->build_headers(),
			'timeout' => 30,
		) );

		return json_decode( wp_remote_retrieve_body( $response ), true );

	}

	public function fetch_settings() {

		return $this->http_get( '/v3.0/member/company/settings/' );

	}


	public function get_site( $request ) {
		$site = get_bloginfo( 'name' );
		$settings = $this->fetch_settings();

		return array(
			'title' => $site,
			'settings' => $settings,
		);
	}

	public function create_reward_redemption( $request ) {
		if ( !is_user_logged_in() ) {
			wp_send_json_error( 'Authentication required', 401 );
		}

		$payload = $request->get_json_params();

		$merchant_id = cmb2_get_option( 'favored_options', 'merchant_id' );
		$secret = cmb2_get_option( 'favored_options', 'secret' );
		$mode = cmb2_get_option( 'favored_options', 'mode' );

		$base_url = $mode == 'test' ? 'https://dev.favcrm.io' : 'https://api.favoredapp.co';
		$url = $base_url . '/member/external-platform/reward-redemptions/';

		$response = wp_remote_post( $url, array(
			'method' => 'POST',
			'timeout' => 45,
			'redirection' => 5,
			'httpversion' => '1.0',
			'blocking' => true,
			'headers' => array(
				'X-Merchant-ID' => $merchant_id,
				'X-Secret' => $secret,
				'Content-Type' => 'application/json',
			),
			'body' => wp_json_encode( array(
				'member_id' => get_user_meta( get_current_user_id(), 'fav_id', true ),
				'gift_offer_id' => $payload['gift_offer_id'],
			) ),
		) );

		$response_code = wp_remote_retrieve_response_code( $response );
		$body = wp_remote_retrieve_body( $response );

		return json_decode( $body );
	}

	public function get_my_rewards( $request ) {
		$merchant_id = cmb2_get_option( 'favored_options', 'merchant_id' );
		$secret = cmb2_get_option( 'favored_options', 'secret' );
		$mode = cmb2_get_option( 'favored_options', 'mode' );

		$base_url = $mode == 'test' ? 'https://dev.favcrm.io' : 'https://api.favoredapp.co';
		$url = $base_url . '/member/external-platform/members/' . get_user_meta( get_current_user_id(), 'fav_id', true ) . '/rewards/';

		$response = wp_remote_post( $url, array(
			'method' => 'GET',
			'timeout' => 45,
			'redirection' => 5,
			'httpversion' => '1.0',
			'blocking' => true,
			'headers' => array(
				'X-Merchant-ID' => $merchant_id,
				'X-Secret' => $secret,
				'Content-Type' => 'application/json',
			),
		) );

		$response_code = wp_remote_retrieve_response_code( $response );

		if ( $response_code != 200 ) {
			return new WP_Error( 'error', 'Failed to fetch reward redemptions', array( 'status' => $response_code ) );
		}

		$body = wp_remote_retrieve_body( $response );

		return json_decode( $body );
	}

	public function ajax_login( $request ) {
		$payload = $request->get_json_params();

		$info = array();
		$info['user_login'] = $payload['email'];
		$info['user_password'] = $payload['password'];
		$info['remember'] = true;

		$user_signon = wp_signon( $info, false );

		if ( is_wp_error( $user_signon ) ){
			$response = array(
				'loggedin' => false,
				'message' => __('Wrong username or password.', 'favcrm-for-woocommerce')
			);
		} else {
			$response = array(
				'loggedin' => true,
				'message' => __('Login successful, redirecting...', 'favcrm-for-woocommerce')
			);
		}

		return $response;
	}

	public function ajax_register( $request ) {
		$payload = $request->get_json_params();

		$user_id = username_exists( $payload['phone'] );

		if ( $user_id || email_exists( $payload['email'] ) ) {
			return array(
				'registered' => false,
				'message' => 'DUPLICATED_PHONE'
			);
		}

		$fav_user = $this->create_fav_account( array(
			'name' => $payload['name'],
			'phone' => $payload['phone'],
			'email' => $payload['email'],
			'password' => $payload['password'],
			'agreeToReceivePromotion' => $payload['agreeToReceivePromotion'],
		) );

		if ( empty( $fav_user ) ) {
			return array(
				'registered' => false,
				'message' => 'FAILED_TO_CREATE_FAV_USER',
			);
		}

		$user_id = wp_create_user( $payload['phone'], $payload['password'], $payload['email'] );
		$user = get_user_by( 'id', $user_id );

		$user->set_role( 'customer' );

		update_user_meta( $user_id, 'fav_id', $fav_user->uuid );

		$info = array();
		$info['user_login'] = $payload['phone'];
		$info['user_password'] = $payload['password'];
		$info['remember'] = true;

		$user_signon = wp_signon( $info, false );

		return array(
			'registered' => true,
			'message' => 'REGISTER_COMPLETED',
		);
	}

	public function create_fav_account( $payload ) {

		$merchant_id = cmb2_get_option( 'favored_options', 'merchant_id' );
		$secret = cmb2_get_option( 'favored_options', 'secret' );
		$mode = cmb2_get_option( 'favored_options', 'mode' );

		$base_url = $mode == 'test' ? 'https://dev.favcrm.io' : 'https://api.favoredapp.co';
		$url = $base_url . '/v3.0/member/company/members/';

		$response = wp_remote_post( $url, array(
			'method' => 'POST',
			'timeout' => 45,
			'redirection' => 5,
			'httpversion' => '1.0',
			'blocking' => true,
			'headers' => array(
				'X-Merchant-ID' => $merchant_id,
				'X-Secret' => $secret,
				'Content-Type' => 'application/json',
			),
			'body' => wp_json_encode( array(
				'name' => $payload['name'],
				'phone' => $payload['phone'],
				'email' => $payload['email'],
				'referral' => $payload['referral'],
				'agree_to_receive_promotion' => $payload['agreeToReceivePromotion'],
			) ),
		) );

		$response_code = wp_remote_retrieve_response_code( $response );

		if ( $response_code != 200 ) {
			return;
		}

		$body = wp_remote_retrieve_body( $response );

		return json_decode( $body );

	}

	public function ajax_logout() {

		wp_logout();

		return array(
			'loggedout' => true,
			'message' => __('Logout successful, redirecting...', 'favcrm-for-woocommerce')
		);

	}

	function add_loyalty_discounts( $cart ) {

		if ( is_admin() && ! defined( 'DOING_AJAX' ) )
			return;

		$discount = (float) WC()->session->get( 'cash_rewards' );
		$subtotal = (float) WC()->cart->subtotal;

		if ( $discount > 0 ) {
			if ( $subtotal == 0 && $discount > 0 ) {

				WC()->session->set( 'cash_rewards', 0 );
				wc_clear_notices();

			} else if ( $subtotal >= $discount ) {

				$member = $this->get_member();
				$cash_rewards = $member->cashRewards;

				if ( $cash_rewards >= $discount ) {
					$cart->add_fee( __( 'Cash Rewards', 'favcrm-for-woocommerce' ), -$discount );
				} else {
					wc_clear_notices();
					wc_add_notice( __('You do not have enough cash rewards to apply this discount.', 'favcrm-for-woocommerce'), 'error');
				}

			} else {
				wc_clear_notices();
				// translators: %s: discount amount
				wc_add_notice( sprintf( __('You must spend more than %s to use your loyalty discount.', 'favcrm-for-woocommerce'), wc_price( $discount ) ), 'error');
			}
		}
	}

	public function add_tier_discounts( $cart ) {

		if ( ( is_admin() && ! defined( 'DOING_AJAX' ) || ! is_user_logged_in() ) ) {
			return;
		}

		$member = $this->get_member();

		if ( ! property_exists( $member, 'membershipTier' ) ) {
			return;
		}

		$discount = 0;

		$membershipTier = $member->membershipTier;

		$subtotal = (float) WC()->cart->subtotal;

		$discount = $membershipTier->discount / 100 * $subtotal;

		if ( $discount > 0 ) {
			$cart->add_fee( $membershipTier->name . ' ' . __( 'Member Discount', 'favcrm-for-woocommerce' ) . ' (' . $membershipTier->discount . '%)', -$discount );
		}
	}
}
