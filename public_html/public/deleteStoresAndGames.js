function deleteStoresAndGames(store_id,game_title){
    $.ajax({
        url: '/stores/storesAndGames/' + store_id + "/" + encodeURI(game_title),
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};