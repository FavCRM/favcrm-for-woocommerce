<?php

class Favored_Public_Routes {

	public function logged_in_user_permission_callback( $request ) {

        return is_user_logged_in();

    }

    public function register_routes() {

		register_rest_route( 'fav/v1', '/my-member-profile', array(
			'methods' => 'GET',
			'callback' => array( $this, 'get_my_member_profile' ),
			'permission_callback' => array( $this, 'logged_in_user_permission_callback' ),
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
			'permission_callback' => array( $this, 'logged_in_user_permission_callback' ),
		) );

		register_rest_route( 'fav/v1', '/site', array(
			'methods' => 'GET',
			'callback' => array( $this, 'get_site' ),
			'permission_callback' => '__return_true',
		) );

		register_rest_route( 'fav/v1', '/reward-redemptions', array(
			'methods' => 'POST',
			'callback' => array( $this, 'create_reward_redemption' ),
			'permission_callback' => array( $this, 'logged_in_user_permission_callback' ),
		) );

		register_rest_route( 'fav/v1', '/my-rewards', array(
			'methods' => 'GET',
			'callback' => array( $this, 'get_my_rewards' ),
			'permission_callback' => array( $this, 'logged_in_user_permission_callback' ),
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
			'permission_callback' => array( $this, 'logged_in_user_permission_callback' ),
		) );

    }

    public function get_my_member_profile() {

		if ( ! is_user_logged_in() ) {
			return new WP_Error( 'error', 'Authentication required', array( 'status' => 401 ) );
		}

		$fav_id = get_user_meta( get_current_user_id(), 'fav_id', true );

		if ( ! $fav_id ) {
			return new WP_Error( 'error', 'Favored ID not found', array( 'status' => 404 ) );
		}

		return FavoredHttpHelper::get( '/v3/member/company/members/' . $fav_id . '/' );

	}

	public function get_my_reward_schemes() {

		$merchant_id = cmb2_get_option( 'favored_options', 'merchant_id' );

		return FavoredHttpHelper::get( '/v3/member/outlets/' . $merchant_id . '/reward-schemes/', true );

	}

	public function get_my_gift_offers() {

		$merchant_id = cmb2_get_option( 'favored_options', 'merchant_id' );

		return FavoredHttpHelper::get( '/v3/member/outlets/' . $merchant_id . '/gift-offers/', true );

	}

	public function get_my_activities() {

		$fav_id = get_user_meta( get_current_user_id(), 'fav_id', true );

		if ( ! $fav_id ) {
			return new WP_Error( 'error', 'Favored ID not found', array( 'status' => 404 ) );
		}

		return FavoredHttpHelper::get( '/v3/member/company/members/' . $fav_id . '/reward-transactions/', true );

	}

	public function fetch_settings() {

		return FavoredHttpHelper::get( '/v3/member/company/settings/' );

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

		$response = FavoredHttpHelper::post( $url, $body );

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

		return FavoredHttpHelper::get( $url, true );

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

		$response = FavoredHttpHelper::post( $url, $body );

		$response_code = wp_remote_retrieve_response_code( $response );

		if ( $response_code != 200 ) {
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
