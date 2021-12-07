function searchGamesAndConsolesByGameTitle() {
    var game_title_for_console_search_string  = document.getElementById('game_title_for_console_search_string').value
    //construct the URL and redirect to it
    window.location = '/games/gamesAndConsoles/search/' + encodeURI(game_title_for_console_search_string)
}