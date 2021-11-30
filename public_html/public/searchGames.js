function searchGamesByGameTitle() {
    var game_title_search_string  = document.getElementById('game_title_search_string').value
    //construct the URL and redirect to it
    window.location = '/games/search/' + encodeURI(game_title_search_string)
}

