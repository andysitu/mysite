var tasks = {
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
    add: function($add_form) {
        tasks.csrf_it();
        $.ajax({
            type: "POST",
            url: add_url,
            data: $add_form.serialize(),
            success: function(data) {
                console.log(data);
            }
        });
    },
};