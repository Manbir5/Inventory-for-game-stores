function searchStoresAndConsolesByConsoleId() {
    var console_id_for_store_search_string  = document.getElementById('console_id_for_store_search_string').value
    //construct the URL and redirect to it
    window.location = '/stores/storesAndConsoles/search/' + encodeURI(console_id_for_store_search_string)
}