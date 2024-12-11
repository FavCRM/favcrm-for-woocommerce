<?php

if ( ! current_user_can( 'manage_options' ) ) {
   wp_die( esc_html__( 'You do not have sufficient capabilities to access this page.', 'favored' ) );
}

CMB2_hookup::enqueue_cmb_css();

$key = 'favored_options';

?>
<div class="wrap">
   <form novalidate="novalidate" method="post" action="options.php">
      <?php wp_nonce_field( 'favored_options_verify' ); ?>
      <div id="cmb2-options-page-<?php echo $key; ?>" class="wrap cmb2-options-page <?php echo $key; ?>">
         <?php cmb2_get_metabox( 'fav_credential_option_metabox', $key, 'options-page' )->show_form(); ?>
      </div>
      <?php submit_button(); ?>
   </form>
</div>
