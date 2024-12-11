<?php

if ( ! current_user_can( 'manage_options' ) ) {
   wp_die( esc_html__( 'You do not have sufficient capabilities to access this page.', 'favored' ) );
}

?>

<div class="wrap">
    <div id="favored-admin-login" data-nonce="<?php echo wp_create_nonce( 'wp_rest' ) ?>"></div>
</div>
