function searchConsolesByConsoleName() {
    var console_main_name_search_string  = document.getElementById('console_main_name_search_string').value
    //construct the URL and redirect to it
    window.location = '/consoles/search/' + encodeURI(console_main_name_search_string)
}