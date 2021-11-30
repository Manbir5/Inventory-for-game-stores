function searchOrdersByOrderID() {
    var order_id_search_string  = document.getElementById('order_id_search_string').value
    //construct the URL and redirect to it
    window.location = '/orders/search/' + encodeURI(order_id_search_string)
}

function searchOrdersByCustomerID() {
    var customer_id_search_string  = document.getElementById('customer_id_search_string').value
    //construct the URL and redirect to it
    window.location = '/orders/search2/' + encodeURI(customer_id_search_string)
}