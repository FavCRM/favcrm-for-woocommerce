<?php

if ( ! defined( 'ABSPATH' ) ) exit;

if ( ! current_user_can( 'manage_options' ) ) {
   wp_die( esc_html__( 'You do not have sufficient capabilities to access this page.', 'favcrm-for-woocommerce' ) );
}

$pluginlog = FAVORED_BASE_PATH . 'debug.log';

$filesystem = new WP_Filesystem_Direct( true );

if ( ! $filesystem->exists( $pluginlog ) ) {
    wp_die( esc_html__( 'The log file does not exist.', 'favcrm-for-woocommerce' ) );
}

$content = $filesystem->get_contents( $pluginlog );

?>

<div class="wrap">
    <form novalidate="novalidate" method="post" action="options.php">
        <?php wp_nonce_field( 'favored_options_verify' ); ?>
        <textarea class="w-full h-[500px] mb-2"><?php echo esc_html( $content ); ?></textarea>
        <?php submit_button( esc_html__( 'Send Diagnostic Logs ', 'favcrm-for-woocommerce' ) ); ?>
    </form>
</div>
