<?php

$is_logged_in = Favored_Admin::is_logged_in();

if ( ! $is_logged_in ) {
    wp_redirect( admin_url( 'admin.php?page=fav-crm-login' ) );
    exit;
}

if ( ! current_user_can( 'manage_options' ) ) {
   wp_die( esc_html__( 'You do not have sufficient capabilities to access this page.', 'favored' ) );
}

?>

<div class="wrap">
    <div id="favored-admin-dashboard" data-nonce="<?php echo wp_create_nonce( 'wp_rest' ) ?>"></div>
</div>
