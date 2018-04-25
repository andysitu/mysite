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
    add: function($add_form, run_on_success) {
        tasks.csrf_it();
        $.ajax({
            type: "POST",
            url: add_url,
            data: $add_form.serialize(),
            success: function(data) {
                console.log(data);
                if (typeof run_on_success == "function") {
                    run_on_success();
                }
            }
        });
    },
};

class Task {
    // JS component. Handles display HTML & retrieving data from Tasks model
}