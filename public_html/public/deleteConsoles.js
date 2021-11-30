function deleteConsoles(console_id){
    $.ajax({
        url: '/consoles/' + console_id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};