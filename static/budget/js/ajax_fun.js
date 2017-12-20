var ajax_func = {
    csrf_it: function(){
        function csrfSafeMethod(method) {
            // these HTTP methods do not require CSRF protection
            return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
        }

        $.ajaxSetup({
            beforeSend: function(xhr, settings) {
                if (!csrfSafeMethod(settings.type) && !self.crossDomain) {
                    xhr.setRequestHeader("X-CSRFToken", csrftoken);
                }
            }
        });
    },
    submit_add_form: function(e) {
        e.preventDefault();
        ajax_func.csrf_it();
        var $form = $("#add-menu-form");

        $.ajax({
            type: "POST",
            url: add_url,
            data: $form.serialize(),
            success: function(data) {
                console.log(data);
                menu_screen.close_menu();
            }
        })
    },
    get_accounts: function(e) {
        
    }
}