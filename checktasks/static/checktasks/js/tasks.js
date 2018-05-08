var tasks_functions = {
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
        tasks_functions.csrf_it();
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
    get_tasks: function(callback_function) {
        tasks_functions.csrf_it();
        $.ajax({
            type: "GET",
            url: get_tasksAjax_url,
            data: {},
            success: function(data) {
                callback_function(data);
            }
        });
    }
};

class Task {
    // JS component. Handles display HTML & retrieving data from Tasks model
    constructor(name) {
        this.name = name;
    }
}