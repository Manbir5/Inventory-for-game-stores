function deleteRewards(account_number){
    $.ajax({
        url: '/rewards/' + account_number,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};