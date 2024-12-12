<?php

if ( ! current_user_can( 'manage_options' ) ) {
   wp_die( esc_html__( 'You do not have sufficient capabilities to access this page.', 'favored' ) );
}

$filesystem = new WP_Filesystem_Direct( true );

if ( ! $filesystem->exists( plugin_dir_path( __FILE__ ) . '../debug.log' ) ) {
    wp_die( esc_html__( 'The log file does not exist.', 'favored' ) );
}

$pluginlog = plugin_dir_path(__FILE__) . '../debug.log';

$content = $filesystem->get_contents( $pluginlog );

$lines = explode( PHP_EOL, $content );
$lines = array_reverse( $lines );


?>

<div class="wrap">
    <form novalidate="novalidate" method="post" action="options.php">
        <?php wp_nonce_field( 'favored_options_verify' ); ?>
        <textarea class="w-full h-[500px] mb-2">
            <?php
            foreach ( $lines as $line ) {
                echo esc_html( $line . PHP_EOL );
            }
            ?>
        </textarea>
        <?php submit_button( esc_html__( 'Send Diagnostic Logs ', 'favored' ) ); ?>
    </form>
</div>
