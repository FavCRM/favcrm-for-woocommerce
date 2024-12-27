<?php

if ( ! defined( 'ABSPATH' ) ) exit;

?>

<div class="order-attribution-metabox">
    <?php if ( $fav_order_status != 'PROCESSED' ) : ?>
        <div class="mb-2">
            <button type="button" class="button" onclick="javascript:manualSync(<?php echo esc_html( $order_id ) ?>)">Manual Sync</button>
        </div>
    <?php endif; ?>
    <div>
        <h4>Order ID</h4>
        <div><?php echo esc_html( $fav_order_id ); ?></div>
    </div>
    <div>
        <h4>Status</h4>
        <div><?php echo esc_html( $fav_order_status ); ?></div>
    </div>
    <div class="flex justify-between">
        <div>
            <h4>Points Earned</h4>
            <div><?php echo esc_html( $fav_order_points ); ?></div>
        </div>
        <div>
            <h4>Stamps Earned</h4>
            <div><?php echo esc_html( $fav_order_stamps ); ?></div>
        </div>
    </div>
</div>
