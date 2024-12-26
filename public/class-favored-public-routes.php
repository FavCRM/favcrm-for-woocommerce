<?php

class Favored_Public_Routes {

    public function register_routes() {

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

		register_rest_route( 'fav/v1', '/my-member-profile', array(
			'methods' => 'GET',
			'callback' => array( $this, 'get_my_member_profile' ),
			'permission_callback' => '__return_true',
		) );

		register_rest_route( 'fav/v1', '/my-reward-schemes', array(
			'methods' => 'GET',
			'callback' => array( $this, 'get_my_reward_schemes' ),
			'permission_callback' => '__return_true',
		) );

		register_rest_route( 'fav/v1', '/my-gift-offers', array(
			'methods' => 'GET',
			'callback' => array( $this, 'get_my_gift_offers' ),
			'permission_callback' => '__return_true',
		) );

		register_rest_route( 'fav/v1', '/my-activities', array(
			'methods' => 'GET',
			'callback' => array( $this, 'get_my_activities' ),
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

    // TODO check usage and remove if not used
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

    public function get_my_member_profile() {

		if ( ! is_user_logged_in() ) {
			return new WP_Error( 'error', 'Authentication required', array( 'status' => 401 ) );
		}

		$fav_id = get_user_meta( get_current_user_id(), 'fav_id', true );

		if ( ! $fav_id ) {
			return new WP_Error( 'error', 'Favored ID not found', array( 'status' => 404 ) );
		}

		return HttpHelper::get( '/v3/member/company/members/' . $fav_id . '/' );

	}

	public function get_my_reward_schemes() {

		$merchant_id = cmb2_get_option( 'favored_options', 'merchant_id' );

		return HttpHelper::get( '/v3/member/outlets/' . $merchant_id . '/reward-schemes/', true );

	}

	public function get_my_gift_offers() {

		$merchant_id = cmb2_get_option( 'favored_options', 'merchant_id' );

		return HttpHelper::get( '/v3/member/outlets/' . $merchant_id . '/gift-offers/', true );

	}

	public function get_my_activities() {

		$fav_id = get_user_meta( get_current_user_id(), 'fav_id', true );

		if ( ! $fav_id ) {
			return new WP_Error( 'error', 'Favored ID not found', array( 'status' => 404 ) );
		}

		return HttpHelper::get( '/v3/member/company/members/' . $fav_id . '/reward-transactions/', true );

	}

	public function fetch_settings() {

		return HttpHelper::get( '/v3/member/company/settings/' );

	}


	public function get_site( $request ) {

		$site = get_bloginfo( 'name' );
		$settings = $this->fetch_settings();

		return array(
			'title' => html_entity_decode( $site ),
			'settings' => $settings,
		);

	}

	public function create_reward_redemption( $request ) {

		if ( !is_user_logged_in() ) {

			wp_send_json_error( 'Authentication required', 401 );

		}

		$payload = $request->get_json_params();

		$url = '/member/external-platform/reward-redemptions/';

		$body = array(
			'member_id' => get_user_meta( get_current_user_id(), 'fav_id', true ),
			'gift_offer_id' => $payload['gift_offer_id'],
		);

		$response = HttpHelper::post( $url, $body );

		$response_code = wp_remote_retrieve_response_code( $response );
		$body = wp_remote_retrieve_body( $response );

		return json_decode( $body );
	}

	public function get_my_rewards( $request ) {

		$fav_id = get_user_meta( get_current_user_id(), 'fav_id', true );

		if ( ! $fav_id ) {
			return new WP_Error( 'error', 'Favored ID not found', array( 'status' => 404 ) );
		}

		$url = '/member/external-platform/members/' . $fav_id . '/rewards/';

		return HttpHelper::get( $url, true );

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

		update_user_meta( $user_id, 'fav_id', $fav_user['uuid'] );

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

		$url = '/v3/member/company/members/';

		$body = array(
			'name' => $payload['name'],
			'phone' => $payload['phone'],
			'email' => $payload['email'],
			'referral' => $payload['referral'],
			'agree_to_receive_promotion' => $payload['agreeToReceivePromotion'],
		);

		$response = HttpHelper::post( $url, $body );

		$response_code = wp_remote_retrieve_response_code( $response );

		if ( $response_code != 200 ) {
			var_dump(wp_remote_retrieve_body( $response ));
			return;
		}

		$response = wp_remote_retrieve_body( $response );

		return json_decode( $response, true );

	}

	public function ajax_logout() {

		wp_logout();

		return array(
			'loggedout' => true,
			'message' => __('Logout successful, redirecting...', 'favcrm-for-woocommerce')
		);

	}
}
