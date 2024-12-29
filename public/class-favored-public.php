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

		require_once plugin_dir_path( __FILE__ ) . 'class-favored-public-routes.php';
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

		$public_routes = new Favored_Public_Routes();
		$public_routes->register_routes();

	}

	public function get_my_member_profile() {

		$public_routes = new Favored_Public_Routes();
		return $public_routes->get_my_member_profile();

	}

	public function use_credits() {

		woocommerce_store_api_register_update_callback(
			[
			'namespace' => 'fav-cash-rewards',
			'callback'  => function( $data ) {
				$credits = $data['credits'] > 0 ? $data['credits'] : 0;

				$this->sync_credit_to_fav( $data['credits'] );
				WC()->session->set( 'cash_rewards', $credits );
			},
			]
		);

	}

	public function sync_credit_to_fav( $cash_rewards ) {

		$member_id = get_user_meta( get_current_user_id(), 'fav_id', true );

		FavoredLogger::write_log( '----- Syncing cash rewards to FavCRM -----' );

		if ( $cash_rewards > 0 ) {
			FavoredLogger::write_log( 'Member (#' . $member_id . ') used cash rewards: ' . $cash_rewards );
		} else {
			FavoredLogger::write_log( 'Member (#' . $member_id . ') voided cash rewards: ' . $cash_rewards );
		}

		$body = array(
			'cash_rewards' => $cash_rewards * -1,
			'member_id' => $member_id,
			'transaction_type' => $cash_rewards > 0 ? 'CASH REWARD' : 'CASH REWARD (VOID)',
		);

		$url = '/v3/member/company/cash-rewards/';

		$response = FavoredHttpHelper::post( $url, $body );

		$response_code = wp_remote_retrieve_response_code( $response );

		if ( is_wp_error( $response ) ) {
			$error_message = $response->get_error_message();
			FavoredLogger::write_log( "Something went wrong: $error_message" );
		} else {
			FavoredLogger::write_log( '----- Completed -----' );
		}
	}

	public function extend_schemas() {

		woocommerce_store_api_register_endpoint_data(
			array(
				'endpoint'        => CartSchema::IDENTIFIER,
				'namespace'       => 'fav',
				'data_callback'   => function() {
					$cash_rewards = 0;
					$is_logged_in = is_user_logged_in();

					$member = $this->get_my_member_profile();

					if ( $member !== null && is_array( $member ) ) {
						$cash_rewards = $member['cashRewards'] ?? 0;
					}

					return array(
						'cashRewards' => $cash_rewards,
						'isLoggedIn' => $is_logged_in,
						'nonce' => wp_create_nonce( 'wc_store_api' ),
					);
				},
				'schema_callback' => function() {
					return array(
						'properties' => array(
							'cashRewards' => array(
								'type' => 'integer',
							),
							'isLoggedIn' => array(
								'type' => 'boolean',
							),
						),
					);
				},
				'schema_type' => ARRAY_A,
			)
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

				$member = $this->get_my_member_profile();
				$cash_rewards = $member['cashRewards'];

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

		$member = $this->get_my_member_profile();

		if ( $member === null || ! is_array( $member ) || ! array_key_exists( 'membershipTier', $member ) ) {
			return;
		}

		$discount = 0;

		$membershipTier = $member['membershipTier'];

		$subtotal = (float) WC()->cart->subtotal;

		$discount = $membershipTier['discount'] / 100 * $subtotal;

		if ( $discount > 0 ) {
			$cart->add_fee( $membershipTier['name'] . ' ' . __( 'Member Discount', 'favcrm-for-woocommerce' ) . ' (' . $membershipTier['discount'] . '%)', -$discount );
		}

	}

}
