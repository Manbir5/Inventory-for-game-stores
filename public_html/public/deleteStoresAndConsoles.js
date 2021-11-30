function deleteStoresAndConsoles(store_id,console_id){
    $.ajax({
        url: '/stores/storesAndConsoles/' + store_id + "/" + console_id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};