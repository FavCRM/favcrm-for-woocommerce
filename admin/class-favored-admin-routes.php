<?php

if ( ! defined( 'ABSPATH' ) ) exit;

class Favored_Admin_Routes {

    public function custom_route_permission_callback( $request ) {

        $nonce = $request->get_header( 'X-WP-Nonce' );

        if ( ! wp_verify_nonce( $nonce, 'wp_rest' ) ) {
            return new WP_Error( 'invalid_nonce', 'Invalid nonce.', array( 'status' => 403 ) );
        }

        return true;

    }

    public function register_routes() {

		register_rest_route( 'fav/v1', '/company-signup', array(
			'methods' => 'POST',
			'callback' => array( $this, 'company_signup' ),
			'permission_callback' => array( $this, 'custom_route_permission_callback' ),
		) );

		register_rest_route( 'fav/v1', '/company-login', array(
			'methods' => 'POST',
			'callback' => array( $this, 'company_login' ),
			'permission_callback' => array( $this, 'custom_route_permission_callback' ),
		) );

		register_rest_route( 'fav/v1', '/company-logout', array(
			'methods' => 'POST',
			'callback' => array( $this, 'company_logout' ),
			'permission_callback' => array( $this, 'custom_route_permission_callback' ),
		) );

		register_rest_route( 'fav/v1', '/dashboard', array(
			'methods' => 'GET',
			'callback' => array( $this, 'fetch_dashboard' ),
			'permission_callback' => array( $this, 'custom_route_permission_callback' ),
		) );

		register_rest_route( 'fav/v1', '/announcements', array(
			'methods' => 'GET',
			'callback' => array( $this, 'fetch_announcements' ),
			'permission_callback' => array( $this, 'custom_route_permission_callback' ),
		) );

		register_rest_route( 'fav/v1', '/update-notice', array(
			'methods' => 'GET',
			'callback' => array( $this, 'fetch_app_settings' ),
			'permission_callback' => array( $this, 'custom_route_permission_callback' ),
		) );

		register_rest_route( 'fav/v1', '/settings', array(
			'methods' => 'GET',
			'callback' => array( $this, 'fetch_settings' ),
			'permission_callback' => array( $this, 'custom_route_permission_callback' ),
		) );

		register_rest_route( 'fav/v1', '/settings', array(
			'methods' => 'POST',
			'callback' => array( $this, 'update_settings' ),
			'permission_callback' => array( $this, 'custom_route_permission_callback' ),
		) );

		register_rest_route( 'fav/v1', '/settings/access-control', array(
			'methods' => 'GET',
			'callback' => array( $this, 'fetch_access_control' ),
			'permission_callback' => array( $this, 'custom_route_permission_callback' ),
		) );

		register_rest_route( 'fav/v1', '/settings/access-control', array(
			'methods' => 'POST',
			'callback' => array( $this, 'update_access_control' ),
			'permission_callback' => array( $this, 'custom_route_permission_callback' ),
		) );

		register_rest_route( 'fav/v1', '/permissions-check', array(
			'methods' => 'GET',
			'callback' => array( $this, 'fav_current_user_can' ),
			'permission_callback' => array( $this, 'custom_route_permission_callback' ),
		) );

		register_rest_route( 'fav/v1', '/members', array(
			'methods' => 'GET',
			'callback' => array( $this, 'fetch_members' ),
			'permission_callback' => array( $this, 'custom_route_permission_callback' ),
		) );

		register_rest_route( 'fav/v1', '/members/(?P<uuid>[\W\w]+)', array(
			'methods' => 'GET',
			'callback' => array( $this, 'fetch_members_by_uuid' ),
			'permission_callback' => array( $this, 'custom_route_permission_callback' ),
		) );

		register_rest_route( 'fav/v1', '/members', array(
			'methods' => 'POST',
			'callback' => array( $this, 'add_members' ),
			'permission_callback' => array( $this, 'custom_route_permission_callback' ),
		) );

		register_rest_route( 'fav/v1', '/members/(?P<uuid>[\W\w]+)', array(
			'methods' => 'PATCH',
			'callback' => array( $this, 'update_members' ),
			'permission_callback' => array( $this, 'custom_route_permission_callback' ),
		) );

		register_rest_route( 'fav/v1', '/members/(?P<uuid>[\W\w]+)', array(
			'methods' => 'DELETE',
			'callback' => array( $this, 'delete_members' ),
			'permission_callback' => array( $this, 'custom_route_permission_callback' ),
		) );

		register_rest_route( 'fav/v1', '/membership-tiers', array(
			'methods' => 'GET',
			'callback' => array( $this, 'fetch_membership_tiers' ),
			'permission_callback' => array( $this, 'custom_route_permission_callback' ),
		) );

		register_rest_route( 'fav/v1', '/membership-tiers', array(
			'methods' => 'POST',
			'callback' => array( $this, 'add_membership_tiers' ),
			'permission_callback' => array( $this, 'custom_route_permission_callback' ),
		) );

		register_rest_route( 'fav/v1', '/membership-tiers/(?P<id>[\W\w]+)', array(
			'methods' => 'GET',
			'callback' => array( $this, 'fetch_membership_tiers_by_id' ),
			'permission_callback' => array( $this, 'custom_route_permission_callback' ),
		) );

		register_rest_route( 'fav/v1', '/membership-tiers/(?P<id>[\W\w]+)', array(
			'methods' => 'PATCH',
			'callback' => array( $this, 'update_membership_tiers' ),
			'permission_callback' => array( $this, 'custom_route_permission_callback' ),
		) );

		register_rest_route( 'fav/v1', '/membership-tiers/(?P<id>[\W\w]+)', array(
			'methods' => 'DELETE',
			'callback' => array( $this, 'delete_membership_tiers' ),
			'permission_callback' => array( $this, 'custom_route_permission_callback' ),
		) );

		register_rest_route( 'fav/v1', '/reward-transactions', array(
			'methods' => 'GET',
			'callback' => array( $this, 'fetch_reward_transactions' ),
			'permission_callback' => array( $this, 'custom_route_permission_callback' ),
		) );

		register_rest_route( 'fav/v1', '/reward-schemes', array(
			'methods' => 'GET',
			'callback' => array( $this, 'fetch_reward_schemes' ),
			'permission_callback' => array( $this, 'custom_route_permission_callback' ),
		) );

		register_rest_route( 'fav/v1', '/reward-schemes/(?P<id>[\W\w]+)', array(
			'methods' => 'GET',
			'callback' => array( $this, 'fetch_reward_schemes_by_id' ),
			'permission_callback' => array( $this, 'custom_route_permission_callback' ),
		) );

		register_rest_route( 'fav/v1', '/reward-schemes', array(
			'methods' => 'POST',
			'callback' => array( $this, 'add_reward_schemes' ),
			'permission_callback' => array( $this, 'custom_route_permission_callback' ),
		) );

		register_rest_route( 'fav/v1', '/reward-schemes/(?P<id>[\W\w]+)', array(
			'methods' => 'PATCH',
			'callback' => array( $this, 'update_reward_schemes' ),
			'permission_callback' => array( $this, 'custom_route_permission_callback' ),
		) );

		register_rest_route( 'fav/v1', '/reward-schemes/(?P<id>[\W\w]+)', array(
			'methods' => 'DELETE',
			'callback' => array( $this, 'delete_reward_schemes' ),
			'permission_callback' => array( $this, 'custom_route_permission_callback' ),
		) );

		register_rest_route( 'fav/v1', '/gift-offers', array(
			'methods' => 'GET',
			'callback' => array( $this, 'fetch_gift_offers' ),
			'permission_callback' => array( $this, 'custom_route_permission_callback' ),
		) );

		register_rest_route( 'fav/v1', '/gift-offers/(?P<id>[\W\w]+)', array(
			'methods' => 'GET',
			'callback' => array( $this, 'fetch_gift_offers_by_id' ),
			'permission_callback' => array( $this, 'custom_route_permission_callback' ),
		) );

		register_rest_route( 'fav/v1', '/gift-offers', array(
			'methods' => 'POST',
			'callback' => array( $this, 'add_gift_offers' ),
			'permission_callback' => array( $this, 'custom_route_permission_callback' ),
		) );

		register_rest_route( 'fav/v1', '/gift-offers/(?P<id>[\W\w]+)', array(
			'methods' => 'POST',
			'callback' => array( $this, 'update_gift_offers' ),
			'permission_callback' => array( $this, 'custom_route_permission_callback' ),
		) );

		register_rest_route( 'fav/v1', '/gift-offers/(?P<id>[\W\w]+)', array(
			'methods' => 'DELETE',
			'callback' => array( $this, 'delete_gift_offers' ),
			'permission_callback' => array( $this, 'custom_route_permission_callback' ),
		) );

		register_rest_route( 'fav/v1', '/subscription', array(
			'methods' => 'GET',
			'callback' => array( $this, 'fetch_subscription' ),
			'permission_callback' => array( $this, 'custom_route_permission_callback' ),
		) );

		register_rest_route( 'fav/v1', '/subscription-plans', array(
			'methods' => 'GET',
			'callback' => array( $this, 'fetch_subscription_plans' ),
			'permission_callback' => array( $this, 'custom_route_permission_callback' ),
		) );

		register_rest_route( 'fav/v1', '/change-subscription-plan', array(
			'methods' => 'POST',
			'callback' => array( $this, 'change_subscription_plan' ),
			'permission_callback' => array( $this, 'custom_route_permission_callback' ),
		) );

    }

    public function company_signup( $request ) {

		$url = '/v3/member/companies/';

		$body = $request->get_json_params();
		$body = array_merge( $body, array( 'source' => 'WORDPRESS' ) );

		$headers = [
			'Content-Type' => 'application/json',
		];

		$response = FavoredHttpHelper::post( $url, $body, $headers );

		$success = false;
		$error = '';

		try {
			$result = json_decode( wp_remote_retrieve_body( $response ), true );

			if ( isset( $result['errorCode'] ) ) {
				return array(
					'success' => false,
					'error' => $result['error'],
					'errorCode' => $result['errorCode'],
				);
			}

			$merchant_id = $result['merchantId'];
			$secret = $result['accessToken'];
			$mode = 'live';

			if ( ! $merchant_id || ! $secret ) {
				throw new Exception( 'Invalid response' );
			}

			$favored_options = get_option( 'favored_options' );

			if ( ! $favored_options ) {
				$favored_options = [];
			}

			$favored_options['merchant_id'] = $merchant_id;
			$favored_options['secret'] = $secret;
			$favored_options['mode'] = $mode;

			update_option( 'favored_options', $favored_options );

			$success = true;

			$this->register_api_keys();


		} catch(Exception $e) {

		}

		return array(
			'success' => $success,
			'error' => $error,
		);
	}

	public function fetch_dashboard( $request ) {

		$url = '/v3/member/company/dashboard/';

		return FavoredHttpHelper::get( $url );
	}

	public function fetch_announcements( $request ) {

		$url = '/v3/member/announcements/';

		return FavoredHttpHelper::get( $url );

	}

	public function fetch_app_settings( $request ) {

		$url = '/member/app-settings/';

		$response = FavoredHttpHelper::get( $url );

		if ( $response['wpVersion'] == FAVORED_VERSION ) {
			return null;
		}

		return $response['wpVersion'];

	}

	public function fetch_settings( $request ) {

		$url ='/v3/member/company/settings/';

		return FavoredHttpHelper::get( $url );

	}

	public function update_settings( $request ) {

		$url = '/v3/member/company/settings/';

		$body = $request->get_json_params();

		$response = FavoredHttpHelper::post( $url, $body );

		$success = false;
		$error = '';

		try {
			$result = json_decode( wp_remote_retrieve_body( $response ), true );

			if ( isset( $result['errorCode'] ) ) {
				return array(
					'success' => false,
					'error' => $result['error'],
					'errorCode' => $result['errorCode'],
				);
			}

			$success = true;

		} catch(Exception $e) {
			echo esc_html( $e->getMessage() );
		}

		return array(
			'success' => $success,
			'error' => $error,
		);
	}

	public function fav_get_permissions() {
    return array(
      "read"=>"Read",
      "write"=>"Write",
      "delete"=>"Delete",
    );
  }

  public function fav_current_user_can($request) {
		$perm = $request->get_param( 'permission' );
    if (current_user_can($perm)){
      return new WP_REST_Response(array('data'=>"Authorised"), 200);
    }

    return new WP_REST_Response(array(
      'error' => "You don't have sufficient permission",
      'errorCode' => 403,
    ), 403);
  }

	public function fetch_access_control() {
    $favored_access_control = array();
    $permissions = $this->fav_get_permissions();

    $all_roles = wp_roles();
    
    $role_names = array();
    foreach ( $all_roles->roles as $role_code=>$r_value ) {
      if (!is_array($r_value)) continue;
      array_push($role_names,$r_value[$role_code]);
      $favored_access_control[$role_code] = array(
        "roleName" => $r_value["name"],
        "permissions" => array(),
      );
      
      foreach ($permissions as $permCode => $permName) {
        if (
          !!$r_value["capabilities"] && 
            array_key_exists($permCode, $r_value["capabilities"]) &&
            !!$r_value["capabilities"][$permCode]
        ) {
          array_push($favored_access_control[$role_code]["permissions"],$permName);
        }
      }
    }

    $retrieveBody = json_encode( $favored_access_control );
		return json_decode( $retrieveBody, true );
	}

	public function update_access_control($request) {
		$body = $request->get_json_params();

		$success = false;
		$error = '';

    $permissions = $this->fav_get_permissions();
    foreach($body as $role => $reqPermissions){
      $roleObj = get_role($role);

      foreach($permissions as $perm){
        if (in_array($perm, $reqPermissions)){
          $roleObj->add_cap(strtolower($perm));
        }else{
          $roleObj->remove_cap(strtolower($perm));
        }
      }
    }

		try {
			update_option('favored_access_control', $body);
			$success = true;
		} catch(Exception $e) {
			echo esc_html( $e->getMessage() );
		}

		return array(
			'success' => $success,
			'error' => $error,
		);
	}

	public function fetch_members( $request ) {

		$page = $request->get_param( 'page' ) ?? 1;
		$page_size = $request->get_param( 'page_size' ) ?? 20;
		$search = $request->get_param( 'search' );

		$url = '/v3/member/company/members/?page=' . $page . '&page_size=' . $page_size;

		if ( ! empty( $search ) ) {
			$url = $url . '&search=' . $search;
		}

		return FavoredHttpHelper::get( $url, true );

	}

	public function fetch_members_by_uuid( $request ) {

		$uuid = $request['uuid'];
		$url = '/v3/member/company/members/'.$uuid.'/';

		return FavoredHttpHelper::get( $url );

	}

	public function add_members( $request ) {

		$url = '/v3/member/company/members/';

		$body = $request->get_json_params();
		$body = array_merge( $body, array( 'source' => 'WORDPRESS' ) );

		$response = FavoredHttpHelper::post( $url, $body );

		$success = false;
		$error = '';

		try {
			$result = json_decode( wp_remote_retrieve_body( $response ), true );

			if ( isset( $result['errorCode'] ) ) {
				return array(
					'success' => false,
					'error' => $result['error'],
					'errorCode' => $result['errorCode'],
				);
			}

			$success = true;

		} catch(Exception $e) {
			echo esc_html( $e->getMessage() );
		}

		return array(
			'success' => $success,
			'error' => $error,
		);

	}

	public function update_members( $request ) {

		$uuid = $request['uuid'];
		$url = '/v3/member/company/members/'.$uuid.'/';

		$body = $request->get_json_params();
		$body = array_merge( $body, array( 'source' => 'WORDPRESS' ) );

		$response = FavoredHttpHelper::patch( $url, $body );

		$success = false;
		$error = '';

		try {
			$result = json_decode( wp_remote_retrieve_body( $response ), true );

			if ( isset($result['errorCode']) || isset($result['error']) ) {
				return array(
					'success' => false,
					'error' => $result['error'],
					'errorCode' => $result['errorCode'],
				);
			}

			$success = true;

		} catch(Exception $e) {
			echo esc_html( $e->getMessage() );
		}

		return array(
			'success' => $success,
			'error' => $error,
		);

	}

	public function delete_members( $request ) {

		$uuid = $request['uuid'];
		$url = '/v3/member/company/members/'.$uuid.'/';

		$response = FavoredHttpHelper::delete( $url );

		$success = false;
		$error = '';

		try {
			$result = json_decode( wp_remote_retrieve_body( $response ), true );

			if ( isset( $result['errorCode'] ) ) {
				return array(
					'success' => false,
					'error' => $result['error'],
					'errorCode' => $result['errorCode'],
				);
			}

			$success = true;

		} catch(Exception $e) {
			echo esc_html( $e->getMessage() );
		}

		return array(
			'success' => $success,
			'error' => $error,
		);

	}

	public function fetch_membership_tiers( $request ) {

		$page = $request->get_param( 'page' ) ?? 1;
		$page_size = $request->get_param( 'page_size' ) ?? 20;

		$url = '/v3/member/company/membership-tiers/?page=' . $page . '&page_size=' . $page_size;

		return FavoredHttpHelper::get( $url, true );

	}

	public function add_membership_tiers( $request ) {

		$url = '/v3/member/company/membership-tiers/';

		$body = $request->get_json_params();

		$response = FavoredHttpHelper::post( $url, $body );

		$success = false;
		$error = '';

		try {
			$result = json_decode( wp_remote_retrieve_body( $response ), true );

			if (isset($result['errorCode']) || isset($result['error'])) {
				return array(
					'success' => false,
					'error' => $result['error'],
					'errorCode' => $result['errorCode'],
				);
			}

			$success = true;

		} catch(Exception $e) {
			echo esc_html( $e->getMessage() );
		}

		return array(
			'success' => $success,
			'error' => $error,
		);

	}

	public function fetch_membership_tiers_by_id( $request ) {

		$id = $request['id'];
		$url = '/v3/member/company/membership-tiers/'.$id.'/';

		return FavoredHttpHelper::get( $url );

	}

	public function update_membership_tiers( $request ) {

		$id = $request['id'];

		$url = '/v3/member/company/membership-tiers/' . $id . '/';

		$body = $request->get_json_params();

		$response = FavoredHttpHelper::patch( $url, $body );

		$success = false;
		$error = '';

		try {
			$result = json_decode( wp_remote_retrieve_body( $response ), true );

			if ( isset($result['errorCode']) || isset($result['error']) ) {
				return array(
					'success' => false,
					'error' => $result['error'],
					'errorCode' => $result['errorCode'],
				);
			}

			$success = true;

		} catch(Exception $e) {
			echo esc_html( $e->getMessage() );
		}

		return array(
			'success' => $success,
			'error' => $error,
		);

	}

	public function delete_membership_tiers( $request ) {

		$id = $request['id'];
		$url = '/v3/member/company/membership-tiers/' . $id . '/';

		$response = FavoredHttpHelper::delete( $url );

		$success = false;
		$error = '';

		try {
			$result = json_decode( wp_remote_retrieve_body( $response ), true );

			if ( isset( $result['errorCode'] ) ) {
				return array(
					'success' => false,
					'error' => $result['error'],
					'errorCode' => $result['errorCode'],
				);
			}

			$success = true;

		} catch(Exception $e) {
			echo esc_html( $e->getMessage() );
		}

		return array(
			'success' => $success,
			'error' => $error,
		);

	}

	public function fetch_reward_transactions( $request ) {

		$page = $request->get_param( 'page' ) ?? 1;
		$page_size = $request->get_param( 'page_size' ) ?? 20;

		$url = '/v3/member/company/reward-transactions/?page=' . $page . '&page_size=' . $page_size;

		return FavoredHttpHelper::get( $url, true );

	}

	public function fetch_reward_schemes( $request ) {

		$page = $request->get_param( 'page' ) ?? 1;
		$page_size = $request->get_param( 'page_size' ) ?? 20;

		$url = '/v3/member/company/reward-schemes/?page=' . $page . '&page_size=' . $page_size;

		return FavoredHttpHelper::get( $url, true );

	}

	public function fetch_reward_schemes_by_id( $request ) {

		$id = $request['id'];
		$url = '/v3/member/company/reward-schemes/'.$id.'/';

		return FavoredHttpHelper::get( $url );

	}

	public function add_reward_schemes( $request ) {

		$url = '/v3/member/company/reward-schemes/';

		$body = $request->get_json_params();

		$response = FavoredHttpHelper::post( $url, $body );

		$success = false;
		$error = '';

		try {
			$result = json_decode( wp_remote_retrieve_body( $response ), true );

			if (isset($result['errorCode']) || isset($result['error'])) {
				return array(
				'success' => false,
				'error' => $result['error'],
				'errorCode' => $result['errorCode'],
				);
			}

			$success = true;

		} catch(Exception $e) {
			echo esc_html( $e->getMessage() );
		}

		return array(
			'success' => $success,
			'error' => $error,
		);

	}

	public function update_reward_schemes( $request ) {

		$id = $request['id'];

		$url = '/v3/member/company/reward-schemes/'.$id.'/';

		$body = $request->get_json_params();

		$response = FavoredHttpHelper::patch( $url, $body );

		$success = false;
		$error = '';

		try {
			$result = json_decode( wp_remote_retrieve_body( $response ), true );

			if ( isset($result['errorCode']) || isset($result['error']) ) {
				return array(
					'success' => false,
					'error' => $result['error'],
					'errorCode' => $result['errorCode'],
				);
			}

			$success = true;

		} catch(Exception $e) {
			echo esc_html( $e->getMessage() );
		}

		return array(
			'success' => $success,
			'error' => $error,
		);

	}

	public function delete_reward_schemes( $request ) {

		$id = $request['id'];
		$url = '/v3/member/company/reward-schemes/'.$id.'/';

		$response = FavoredHttpHelper::delete( $url );

		$success = false;
		$error = '';

		try {
			$result = json_decode( wp_remote_retrieve_body( $response ), true );

			if ( isset( $result['errorCode'] ) ) {
				return array(
					'success' => false,
					'error' => $result['error'],
					'errorCode' => $result['errorCode'],
				);
			}

			$success = true;

		} catch(Exception $e) {
			echo esc_html( $e->getMessage() );
		}

		return array(
			'success' => $success,
			'error' => $error,
		);

	}

	public function fetch_gift_offers( $request ) {

		$page = $request->get_param( 'page' ) ?? 1;
		$page_size = $request->get_param( 'page_size' ) ?? 20;

		$url = '/v3/member/company/gift-offers/?page=' . $page . '&page_size=' . $page_size;

		return FavoredHttpHelper::get( $url, true );

	}

	public function fetch_gift_offers_by_id( $request ) {

		$id = $request['id'];

		$url = '/v3/member/company/gift-offers/'.$id.'/';

		return FavoredHttpHelper::get( $url );

	}

	public function add_gift_offers( $request ) {

		$url = '/v3/member/company/gift-offers/';

		$body = $request->get_body_params();
		$files = $request->get_file_params();

		$merchant_id = cmb2_get_option( 'favored_options', 'merchant_id' );
		$secret = cmb2_get_option( 'favored_options', 'secret' );

		$boundary = wp_generate_password( 24 );

		$header = array(
			'X-Merchant-ID' => $merchant_id,
			'X-Secret' => $secret,
			'Content-type' => 'multipart/form-data; boundary=' . $boundary,
		);

		$payload = '';
		// First, add the standard POST fields:
		foreach ( $body as $name => $value ) {
			$payload .= '--' . $boundary;
			$payload .= "\r\n";
			$payload .= 'Content-Disposition: form-data; name="' . $name .
				'"' . "\r\n\r\n";
			$payload .= $value;
			$payload .= "\r\n";
		}

		// Upload the file
		if ( array_key_exists("image", $files) ) {
			$filesystem = new WP_Filesystem_Direct( true );

			$content = $filesystem->get_contents( $files['image']['tmp_name'] );

			$payload .= '--' . $boundary;
			$payload .= "\r\n";
			$payload .= 'Content-Disposition: form-data; name="' . 'image' .
				'"; filename="' . basename( $files['image']['name'] ) . '"' . "\r\n";
			$payload .= "\r\n";
			$payload .= $content;
			$payload .= "\r\n";
		}
		$payload .= '--' . $boundary . '--';

		$response = FavoredHttpHelper::post( $url, $payload, $header, true );

		$success = false;
		$error = '';

		try {
			$result = json_decode( wp_remote_retrieve_body( $response ), true );

			if (isset($result['errorCode']) || isset($result['error'])) {
				return array(
				'success' => false,
				'error' => $result['error'],
				'errorCode' => $result['errorCode'],
				);
			}

			$success = true;
		} catch(Exception $e) {
			echo esc_html( $e->getMessage() );
		}

		return array(
			'success' => $success,
			'error' => $error,
		);
	}

	public function update_gift_offers( $request ) {

		$id = $request['id'];
		$url = '/v3/member/company/gift-offers/'.$id.'/';

		$body = $request->get_body_params();
		$files = $request->get_file_params();

		$merchant_id = cmb2_get_option( 'favored_options', 'merchant_id' );
		$secret = cmb2_get_option( 'favored_options', 'secret' );

		$boundary = wp_generate_password( 24 );

		$header = array(
			'X-Merchant-ID' => $merchant_id,
			'X-Secret' => $secret,
			'Content-type' => 'multipart/form-data; boundary=' . $boundary,
		);

		$payload = '';
		// First, add the standard POST fields:
		foreach ( $body as $name => $value ) {
			$payload .= '--' . $boundary;
			$payload .= "\r\n";
			$payload .= 'Content-Disposition: form-data; name="' . $name .
				'"' . "\r\n\r\n";
			$payload .= $value;
			$payload .= "\r\n";
		}

		// Upload the file
		if ( array_key_exists("image", $files) ) {
			$filesystem = new WP_Filesystem_Direct( true );

			$content = $filesystem->get_contents( $files['image']['tmp_name'] );

			$payload .= '--' . $boundary;
			$payload .= "\r\n";
			$payload .= 'Content-Disposition: form-data; name="' . 'image' .
				'"; filename="' . basename( $files['image']['name'] ) . '"' . "\r\n";
			//        $payload .= 'Content-Type: image/jpeg' . "\r\n";
			$payload .= "\r\n";
			$payload .= $content;
			$payload .= "\r\n";
		}
		$payload .= '--' . $boundary . '--';

		$response = FavoredHttpHelper::patch( $url, $payload, $header, true );

		$success = false;
		$error = '';

		try {
			$result = json_decode( wp_remote_retrieve_body( $response ), true );

			if (isset($result['errorCode']) || isset($result['error'])) {
				return array(
				'success' => false,
				'error' => $result['error'],
				'errorCode' => $result['errorCode'],
				);
			}

			$success = true;
		} catch(Exception $e) {
			echo esc_html( $e->getMessage() );
		}

		return array(
			'success' => $success,
			'error' => $error,
		);
	}

	public function delete_gift_offers( $request ) {

		$id = $request['id'];
		$url = '/v3/member/company/gift-offers/' . $id . '/';

		$response = FavoredHttpHelper::delete( $url );

		$success = false;
		$error = '';

		try {
			$result = json_decode( wp_remote_retrieve_body( $response ), true );

			if ( isset( $result['errorCode'] ) ) {
				return array(
					'success' => false,
					'error' => $result['error'],
					'errorCode' => $result['errorCode'],
				);
			}

			$success = true;

		} catch(Exception $e) {
			echo esc_html( $e->getMessage() );
		}

		return array(
			'success' => $success,
			'error' => $error,
		);

	}

	public function fetch_subscription( $request ) {

		$url = '/v3/subscription/get/';

		return FavoredHttpHelper::get( $url );

	}

	public function fetch_subscription_plans( $request ) {

		$url = '/v3/subscription/plans/';

		return FavoredHttpHelper::get( $url, true );

	}

	public function change_subscription_plan( $request ) {

		$url = '/v3/subscription/checkout/';

		$payload = $request->get_json_params();

		$body = array(
			'price_id' => $payload['price_id'],
			'subscription_id' => $payload['subscription_id'],
			'success_url' => get_site_url() . '/wp-admin/admin.php?page=fav-crm-billing&result=success',
			'cancel_url' => get_site_url() . '/wp-admin/admin.php?page=fav-crm-billing&result=cancel',
		);

		$response = FavoredHttpHelper::post( $url, $body );

		return array(
			'data' => json_decode( wp_remote_retrieve_body( $response ), true )
		);

	}

	public function company_login( $request ) {

		$url = '/v3/member/company-login/';

		$body = $request->get_json_params();

		$response = FavoredHttpHelper::post( $url, $body );

		$success = false;
		$error = '';

		try {

			$result = json_decode( wp_remote_retrieve_body( $response ), true );

			if ( isset( $result['errorCode'] ) ) {
				return array(
					'success' => false,
					'error' => $result['error'],
					'errorCode' => $result['errorCode'],
				);
			}

			$merchant_id = $result['merchantId'];
			$secret = $result['accessToken'];
			$mode = 'live';

			if ( ! $merchant_id || ! $secret ) {
				throw new Exception( 'Invalid response' );
			}

			$favored_options = get_option( 'favored_options' );

			if ( ! $favored_options ) {
				$favored_options = [];
			}

			$favored_options['merchant_id'] = $merchant_id;
			$favored_options['secret'] = $secret;
			$favored_options['mode'] = $mode;

			update_option( 'favored_options', $favored_options );

			$success = true;

			$this->register_api_keys();

		} catch(Exception $e) {
			echo esc_html( $e->getMessage() );
		}

		return array(
			'success' => $success,
			'error' => $error,
		);

	}

	public function company_logout() {

		$key = 'favored_options';

		$favored_options = get_option( $key );

		$favored_options['merchant_id'] = '';
		$favored_options['secret'] = '';
		$favored_options['mode'] = '';

		update_option( $key, $favored_options );

		return array(
			'success' => true,
		);

	}

	public function generate_api_key() {

		global $wpdb;

		$consumer_key    = 'ck_' . wc_rand_hash();
		$consumer_secret = 'cs_' . wc_rand_hash();
		$permissions     = 'read_write';

		$wpdb->insert( $wpdb->prefix . 'woocommerce_api_keys', array(
			'user_id'         => get_current_user_id(),
			'description'     => 'favcrm-for-woocommerce',
			'permissions'     => $permissions,
			'consumer_key'    => wc_api_hash( $consumer_key ),
			'consumer_secret' => $consumer_secret,
			'truncated_key'   => substr( $consumer_key, -7 ),
			'last_access'     => current_time( 'mysql' ),
		) ); // db call ok; no-cache ok

		return [ $consumer_key, $consumer_secret ];

	}

	public function register_api_keys() {

		[ $consumer_key, $consumer_secret ] = $this->generate_api_key();

		$body = array(
			'consumer_key' => $consumer_key,
			'consumer_secret' => $consumer_secret,
			'url' => get_site_url(),
			'app_code' => 'woocommerce',
		);

		$url = '/app/register/';
		$response = FavoredHttpHelper::post( $url, $body );

		$response_code = wp_remote_retrieve_response_code( $response );

		if ( is_wp_error( $response ) ) {
			$error_message = $response->get_error_message();
			FavoredLogger::write_log( "API register error: $error_message" );
		} else {
			FavoredLogger::write_log( '----- API register completed -----' );
			update_option( 'favored_registered', true );
		}
	}

}
