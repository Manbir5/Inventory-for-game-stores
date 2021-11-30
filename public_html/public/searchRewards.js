function searchRewardsByAccountNumber() {
    var account_number_search_string  = document.getElementById('account_number_search_string').value
    //construct the URL and redirect to it
    window.location = '/rewards/search/' + encodeURI(account_number_search_string)
}