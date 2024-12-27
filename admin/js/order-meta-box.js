function manualSync(orderId) {
  if (confirm('Are you sure you want to sync this order?')) {
      var data = {
          action: 'fav_sync_order',
          order_id: orderId,
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
