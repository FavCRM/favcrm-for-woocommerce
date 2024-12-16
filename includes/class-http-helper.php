<?php

class HttpHelper {

    static public function build_headers() {

		$merchant_id = cmb2_get_option( 'favored_options', 'merchant_id' );
		$secret = cmb2_get_option( 'favored_options', 'secret' );

		return array(
			'X-Merchant-ID' => $merchant_id,
			'X-Secret' => $secret,
			'Content-Type' => 'application/json',
		);

	}

    static public function get( $url, $many = false ) {

        $mode = cmb2_get_option( 'favored_options', 'mode' );

        $base_url = $mode == 'test' ? 'https://dev.favcrm.io' : 'https://api.favoredapp.co';
        $url = $base_url . $url;

        $response = wp_remote_get( $url, array(
            'headers' => self::build_headers(),
            'timeout' => 30,
        ) );

        $items = json_decode( wp_remote_retrieve_body( $response ), true );

        if ( $many ) {
            return array(
                'page' => array(
                    'page_size' => (int) $response['headers']['x-page-size'],
                    'current_page' => (int) $response['headers']['x-current-page'],
                    'total_pages' => (int) $response['headers']['x-page-count'],
                ),
                'items' => $items,
            );
        }

        return $items;

    }

}
