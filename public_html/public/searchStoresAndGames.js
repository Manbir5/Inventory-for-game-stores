function searchStoresAndGamesByGameTitle() {
    var game_title_for_store_search_string  = document.getElementById('game_title_for_store_search_string').value
    //construct the URL and redirect to it
    window.location = '/stores/storesAndGames/search/' + encodeURI(game_title_for_store_search_string)
}