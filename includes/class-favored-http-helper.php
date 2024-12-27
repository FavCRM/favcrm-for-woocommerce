<?php

class FavoredHttpHelper {

    static private function get_base_url() {

        $mode = cmb2_get_option( 'favored_options', 'mode' );
        return $mode == 'test' ? 'https://dev.favcrm.io' : 'https://api.favoredapp.co';

    }

    static public function build_headers() {

		$merchant_id = cmb2_get_option( 'favored_options', 'merchant_id' );
		$secret = cmb2_get_option( 'favored_options', 'secret' );

		return array(
			'X-Merchant-ID' => $merchant_id,
			'X-Secret' => $secret,
			'Content-Type' => 'application/json; charset=utf-8',
		);

	}

    static public function get( $url, $many = false, $headers = array() ) {

        $mode = cmb2_get_option( 'favored_options', 'mode' );

        $base_url = self::get_base_url();
        $url = $base_url . $url;

        if ( empty( $headers ) ) {
            $headers = self::build_headers();
        }

        $response = wp_remote_get( $url, array(
            'headers' => $headers,
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

    static public function post( $url, $data, $headers = array(), $multipart = false ) {

        $base_url = self::get_base_url();
        $url = $base_url . $url;

        if ( empty( $headers ) ) {
            $headers = self::build_headers();
        }

        $response = wp_remote_post( $url, array(
			'method' => 'POST',
			'timeout' => 45,
			'redirection' => 5,
			'httpversion' => '1.0',
			'blocking' => true,
			'headers' => $headers,
			'body' => wp_json_encode( $data ),
            'data_format' => 'body',
			'cookies' => array(),
            'multipart' => $multipart,
        ));

        return $response;

    }

    static public function patch( $url, $data, $headers = array(), $multipart = false ) {

        $base_url = self::get_base_url();
        $url = $base_url . $url;

        if ( empty( $headers ) ) {
            $headers = self::build_headers();
        }

        $response = wp_remote_post( $url, array(
            'method' => 'PATCH',
            'headers' => $headers,
            'body' => wp_json_encode( $data ),
            'multipart' => $multipart,
        ) );

        return $response;

    }

    static public function delete( $url ) {

            $base_url = self::get_base_url();
            $url = $base_url . $url;

            $headers = self::build_headers();

            $response = wp_remote_request( $url, array(
                'method' => 'DELETE',
                'headers' => $headers,
            ) );

            return $response;

    }
}
