<?php

if ( ! defined( 'ABSPATH' ) ) exit;

$is_logged_in = Favored_Admin::is_logged_in();

if ( ! $is_logged_in ) {
    wp_redirect( admin_url( 'admin.php?page=fav-crm-login' ) );
    exit;
}

if ( ! current_user_can( 'read_favored' ) ) {
   wp_die( esc_html__( 'You do not have sufficient capabilities to access this page.', 'favcrm-for-woocommerce' ) );
}

?>

<div class="wrap">
    <div id="favored-admin-dashboard" data-nonce="<?php echo esc_html( wp_create_nonce( 'wp_rest' ) ) ?>"></div>
</div>
