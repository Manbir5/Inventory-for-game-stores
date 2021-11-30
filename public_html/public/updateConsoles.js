function updateConsoles(console_id){
    $.ajax({
        url: '/consoles/' + console_id,
        type: 'PUT',
        data: $('#updateConsole').serialize(),
        success: function(result){
            window.location = '/consoles'
        }
    })
};
