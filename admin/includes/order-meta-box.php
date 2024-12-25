<script>
    function manualSync() {
        if (confirm('Are you sure you want to sync this order?')) {
            var data = {
                action: 'fav_sync_order',
                order_id: '<?php echo $order_id; ?>'
            };

            jQuery.post(ajaxurl, data, function(response) {
                if (response.success) {
                    alert('Order synced successfully');
                    location.reload();
                } else {
                    alert('Order sync failed');
                }
            });
        }
    }
</script>

<div class="order-attribution-metabox">
    <?php if ( $fav_order_status != 'PROCESSED' ) : ?>
        <div class="mb-2">
            <button type="button" class="button" onclick="javascript:manualSync()">Manual Sync</button>
        </div>
    <?php endif; ?>
    <div>
        <h4>Order ID</h4>
        <div><?php echo $fav_order_id; ?></div>
    </div>
    <div>
        <h4>Status</h4>
        <div><?php echo $fav_order_status; ?></div>
    </div>
    <div class="flex justify-between">
        <div>
            <h4>Points Earned</h4>
            <div><?php echo $fav_order_points; ?></div>
        </div>
        <div>
            <h4>Stamps Earned</h4>
            <div><?php echo $fav_order_stamps; ?></div>
        </div>
    </div>
</div>
