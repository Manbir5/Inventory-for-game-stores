function deleteStores(store_id){
    $.ajax({
        url: '/stores/' + store_id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};