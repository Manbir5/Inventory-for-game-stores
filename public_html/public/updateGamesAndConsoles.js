function updateGamesAndConsoles(console_id, game_title){
    $.ajax({
        url: '/gamesAndConsoles/' + console_id + "/" + encodeURI(game_title),
        type: 'PUT',
        data: $('#update-Games-And-Consoles').serialize(),
        success: function(result){
            window.location = '/gamesAndConsoles'
        }
    })
};