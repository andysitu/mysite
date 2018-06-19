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
    get_tasks: function(callback_function, start_date, end_date) {
        tasks_functions.csrf_it();
        $.ajax({
            type: "POST",
            url: get_tasksAjax_url,
            data: {
                "start_year": start_date.getFullYear(),
                "start_month": start_date.getMonth() + 1,
                "start_day": start_date.getDate(),
                "end_year": end_date.getFullYear(),
                "end_month": end_date.getMonth() + 1,
                "end_day": end_date.getDate(),
            },
            success: function(data) {
                console.log("Got TASKS:", data);
                callback_function(data, start_date, end_date);
            }
        });
    },
    get_task: function() {

    },
    click: function(taskName, year, month, date, td_replacer) {
        tasks_functions.csrf_it();
        
        $.ajax({
            type: "POST",
            url: click_ajax_url,
            data: {
                "task": taskName,
                "year": year,
                "month": month + 1,
                "day": date,
            },
            success: function (response) {
                td_replacer(response);
            }

        });
    },
    del_task: function(taskName) {
        tasks_functions.csrf_it();

        $.ajax({
            type: "POST",
            url: del_url,
            data: {
                "task": taskName,
            },
            success: function(response) {
                console.log("Deleted Task: " + taskName);
            }
        });
    },
};

class Task {
    // JS component. Handles display HTML & retrieving data from Tasks model
    constructor(name) {
        this.name = name;
    }

    click() {
    }
}