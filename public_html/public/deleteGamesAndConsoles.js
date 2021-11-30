function deleteGamesAndConsoles(console_id,game_title){
    $.ajax({
        url: '/games/gamesAndConsoles/' + console_id + "/" + encodeURI(game_title),
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};