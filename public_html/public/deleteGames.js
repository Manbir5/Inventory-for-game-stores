function deleteGames(game_title){
    $.ajax({
        url: '/games/' + encodeURI(game_title),
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};