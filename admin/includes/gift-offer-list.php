<?php

if ( ! defined( 'ABSPATH' ) ) exit;

if ( ! current_user_can( 'read_favored' ) ) {
  wp_die(esc_html__('You do not have sufficient capabilities to access this page.', 'favcrm-for-woocommerce'));
}

?>

<div class="wrap">
  <div id="favored-admin-gift-offer" data-nonce="<?php echo esc_html( wp_create_nonce('wp_rest') ) ?>"></div>
</div>
