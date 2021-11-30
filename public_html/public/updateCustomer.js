function updateCustomer(customer_id){
    $.ajax({
        url: '/customers/' + customer_id,
        type: 'PUT',
        data: $('#updateCusto').serialize(),
        success: function(result){
            window.location = '/customers'
        }
    })
};
