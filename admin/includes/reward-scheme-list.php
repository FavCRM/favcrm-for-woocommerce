<?php

if (! current_user_can('manage_options')) {
  wp_die(esc_html__('You do not have sufficient capabilities to access this page.', 'favored'));
}

?>

<div class="wrap">
  <div id="favored-admin-reward-scheme" data-nonce="<?php echo esc_html( wp_create_nonce('wp_rest') ) ?>"></div>
</div>
