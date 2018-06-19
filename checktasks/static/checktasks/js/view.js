$(document).ready(function(){
    $("#add-btn").click(function() {
        add_menu.create_menu();
    });

    $('.overlay').click(function() {
        add_menu.close_menu();
    });

    viewer.make_tasks_table();
});

var viewer = {
    _taskName_map: [],
    _date_map: [],
    set_date: function(year, month, date) {
        this.month = month;
        this.year = year;
        this.date = date;

        this.start_date = new Date(year, month, 1);
        this.end_date = new Date(year, month+1, 0);
    },
    year: null,
    month: null,
    date: null,

    start_date: null,
    end_date: null,

    get_element_name: function(element, type, identifier) {
        // type - element name, id, or $element
        // identifier - additional string added, ie # added at end.
        if (typeof(identifier) == "string")
            identifier = identifier.replace(" ", "_");
        switch(element) {
            case "table":
                if (type == "$")
                    return $("#tasks-table");
                else
                    return "tasks-table";
            case "tasks-div":
                if (type == "$")
                    return $("#tasks-div");
                else
                    return "tasks-div";
            case "dateRow-div":
                if (type == "$")
                    return $("dateRow-div");
                else
                    return "dateRow-div";
            case "date-th":
                if (identifier == undefined || identifier == null)
                    identifier = "";
                if (type == "$")
                    return $("#date-th-" + identifier);
                else
                    return ("date-th-" + identifier);
            case "tasks-td":
                if (identifier == undefined || identifier == null)
                    identifier = "";
                if (type == "$") {
                    return $("#tasks-td-" + identifier);
                } else {
                    return ("tasks-td-" + identifier);
                }
            default:
                return "";
        }
    },
    tasks: [],
    table_columns: 0,
    remove_tasks: function() {
        /**
         * Remove tasks from #tasks_div & classes
         */
        this._taskName_map = [];
        this.get_element_name("tasks-div", "$").empty();
    },

    make_tasks_table: function() {
        var $tasks_div = this.get_element_name("tasks-div", "$");

        var $table = $("<table>", {
            id: this.get_element_name("table", "id"),
            "class": "table table-sm",
        });

        $table.click(this.mouseClick.bind(this));

        $tasks_div.append($table);

        this.add_dateRow();
        tasks_functions.get_tasks(this.add_tasks.bind(this), this.start_date, this.end_date);
    },

    add_task: function(task_dic, task_row_num, numDays) {
        var taskName = task_dic.taskName,
            taskType = task_dic.taskType,
            start_date = this.start_date,
            end_date = this.end;

        this._taskName_map.push(taskName);

        // Append tasks name column
        var $tr = $("<tr>"),
            $th = $("<th>", {
                scope: "row",
            });
        $tr.append($th);


        var $button_div = this.make_task_dropdown(task_row_num)
        $th.append($button_div);


        // Append rest of tasks row
        for (var col_num = 1; col_num < numDays + 1; col_num++) {
            var new_date = new Date(start_date);
            new_date.setDate(new_date.getDate() + col_num - 1);

            var y = new_date.getFullYear(),
                m = new_date.getMonth()+1,
                d = new_date.getDate(),
                value = 0,
                date_string = helper.get_date_string(y, m, d);

            if (date_string in task_dic.dates)
                value = task_dic["dates"][date_string];

            var $td = viewer.make_table_$td(task_row_num,taskType,col_num,value);
            $tr.append($td);
        }
        return $tr;
    },

    add_tasks: function(tasks_list) {
        var tasks_length = tasks_list.length,
            $tbody = $("<tbody>");

        var $tasks_table = viewer.get_element_name("table", "$");
        var $tr, $td, task, taskName,
            table_columns = viewer.table_columns;

        var task_dic = null, taskName=null, taskType=null,
            numDays = helper.get_num_days(this.start_date, this.end_date),
            col_num = 1;

        for (var task_row_num = 0; task_row_num < tasks_length; task_row_num++) {
            task_dic = tasks_list[task_row_num];
            $tr = this.add_task(task_dic, task_row_num, numDays);
            $tr.appendTo($tbody);
        }

        $tasks_table.append($tbody);
    },
    make_table_$td: function(task_row_num,taskType,col_num,value) {
        var $td = $("<td>", {
            id: viewer.get_element_name("tasks-td", "id", task_row_num + "-" + col_num),
        });
        if (value) {
            $td.addClass("active");
        }
        if (taskType == "bool") {
            if (value) {
                $td.addClass("boolOn");
            }
        }
        return $td;
    },
    make_task_dropdown: function(task_row_num) {
        var $button_div = $("<div class='dropdown'></div>"),
            taskName = this._taskName_map[task_row_num];

        $("<button>", {
            "class": "btn btn-link dropdown-toggle",
            type: "button",
            text: taskName,
            id: "taskButton-" + task_row_num,
            "data-toggle": "dropdown",
            "aria-haspopup": true,
            "aria-expanded": false,
        }).appendTo($button_div);

        var $dropdown_div = $("<div>", {
            "class": "dropdown-menu",
            "aria-labelledby": "taskButton-" + task_row_num,
        }).appendTo($button_div);

        function delete_task(e) {
            e.preventDefault();
            var del_msg = "Are you sure you want to delete task " + taskName + "?";
            confirm = window.confirm(del_msg);
            if (confirm) {
                tasks_functions.del_task(taskName);
            }
        }

        $("<a>", {
            "class": "dropdown-item",
            text: "Delete",
            click: delete_task
        }).appendTo($dropdown_div);

        return $button_div;
    },

    add_dateRow: function() {
        helper.setTodayDate();

        var dateJSON = helper.get_date(),
            $thead, $tr, $th,
            i;

        var month = dateJSON.month,
            year = dateJSON.year,
            date = dateJSON.date;

        this.set_date(year,month,date);

        var last_dateOfmonth = this.end_date.getDate();

        this.table_columns = last_dateOfmonth + 1;

        var locale = "en-us",
            monthString = this.end_date.toLocaleString(locale, {month: "long" });

        var $table = this.get_element_name("table", "$");
        var $thead = $("<thead>");

        $tr = $("<tr>");
        $tr.append($("<th>", {
            text: monthString,
            scope: "col",
        }));

        for (i = 1; i <last_dateOfmonth+1; i++) {
            this._date_map.push(year + "_" + month + "_" + i);
            $tr.append(
                $("<th>", {
                    text: i,
                    scope: "col",
                    id: viewer.get_element_name("date-th", "id", i),}
                ));
        }

        $thead.append($tr);
        $table.append($thead);
    },

    mouseClick: function(e) {
        var target = e.target,
            eleType = target.nodeName;

        if (eleType == "TD") {
            var td_prefix_name = viewer.get_element_name("tasks-td", "id", ""),
                re = new RegExp(td_prefix_name + '(\\d+)-(\\d+)');


            var reResults = re.exec(target.id),
                task_row_num = reResults[1],
                taskName = viewer._taskName_map[task_row_num],
                dateCol = reResults[2];

            var td_replacer = this.get_td_replacer(e.target.id);

            tasks_functions.click(taskName, this.year, this.month, parseInt(dateCol), td_replacer );
        }
    },
    get_td_replacer: function(td_id, ) {
        return function(response_dict) {
                var reResults = /(\d+)-(\d+)$/.exec(td_id);

                var task_row_num = reResults[1],
                    col_num = reResults[2];

            var new_td = viewer.make_table_$td(task_row_num, response_dict.type, col_num, response_dict.value);
            $("#" + td_id).replaceWith(new_td);
        };
    }
};

var add_menu = {
    index: {
        form_id: "add-form",
        name: "name",
        name_input_element: "name_input",
        description: "description",
        description_textarea: "description_text",

    },
    submitter: function(e) {
        e.preventDefault();
        var $add_form = $("#" + add_menu.index.form_id)

        function run_on_success() {
            location.reload();
        }

        tasks_functions.add($add_form, run_on_success);
    },
    create_menu: function() {
        var $menu_option_div = $( '#menu-option-div' );

        $menu_option_div.empty();

        var $form = this.create_form();
        $menu_option_div.append($form);
        $( '#menu-option-div' ).show();
        $('.overlay').show();
    },
    close_menu: function() {
        $( '#menu-option-div' ).hide();
        $('.overlay').hide()
    },
    create_form: function() {
        var $form = $("<form>", {
            action: add_url,
            method: "POST",
            id: this.index.form_id,
            submit: this.submitter,
        });

        var $div;

        // Name Input
        $div = $("<div class='form-group row'></div>");
        $("<label>", {
            "class": "col-sm-2 col-form-label",
            "for": this.index.name_input_element,
        }).text("Name").appendTo($div);

        $("<input/>", {
            id: this.index.name_input_element,
            "class": "col-sm-4 form-control",
            name: "name",
        }).appendTo($div);
        $form.append($div);

        // Submit Button
        $("<button/>", {
            "type": "submit",
            "class": "btn btn-primary",
            "text": "Submit",
        }).appendTo($form);

        $("<button/>", {
            "class": "btn btn-secondary",
            text: "Cancel",
            click: function(e) {
                e.preventDefault();
                add_menu.close_menu();
            },
        }).appendTo($form);

        return $form;
    },
};