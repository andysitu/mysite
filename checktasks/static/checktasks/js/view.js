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
        tasks_functions.get_tasks(this.add_tasks, this.start_date, this.end_date);
    },

    add_tasks: function(tasks_list, start_date, end_date) {
        var tasks_length = tasks_list.length,
            $tbody = $("<tbody>");

        var $tasks_table = viewer.get_element_name("table", "$");
        var $tr, $td, task, taskName,
            table_columns = viewer.table_columns;

        var task_dic = null, taskName=null, taskType=null,
            numDays = helper.get_num_days(start_date, end_date),
            col_num = 1;

        for (var i = 0; i < tasks_length; i++) {
            task_dic = tasks_list[i];
            taskName = task_dic.taskName;
            taskType = taskName.taskTake;
            viewer.tasks.push(new Task(taskName));

            // Append tasks name column
            $tr = $("<tr>");
            $tr.append($("<th>", {
                text: taskName,
                scope: "row",
            }));

            // Append rest of tasks row
            for (col_num = 1; col_num < numDays + 1; col_num++) {
                var new_date = new Date(start_date);
                new_date.setDate(new_date.getDate() + col_num - 1);

                var y = new_date.getFullYear(),
                    m = new_date.getMonth()+1,
                    d = new_date.getDate(),
                    value = 0,
                    date_string = helper.get_date_string(y, m, d);

                if (date_string in task_dic.dates)
                    value = task_dic["dates"][date_string];

                var $td = viewer.make_table_$td(taskName,taskType,col_num,value);
                $tr.append($td);
            }
            $tr.appendTo($tbody);
        }

        $tasks_table.append($tbody);
    },
    make_table_$td: function(taskName,taskType,col_num,value) {
        $td = $("<td>", {
            id: viewer.get_element_name("tasks-td", "id", taskName + "-" + col_num),
        }).append(value);

        return $td;
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
                re = new RegExp(td_prefix_name + '(.+)-(\\d+)');

            var reResults = re.exec(target.id),
                taskName = reResults[1],
                dateCol = reResults[2];

            tasks_functions.click(taskName, this.year, this.month, parseInt(dateCol) );
        }
    },
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

        // // Text Area for Description
        // $div = $("<div class='form-group row'></div>");
        // $("<label>", {
        //     "for": this.index.description_textarea,
        //     "class": "col-form-label col-sm-2",
        //     "text": "Description",
        // }).appendTo($div);
        //
        // $("<textarea>", {
        //     "class": "form-control col-sm-8",
        //     name: this.index.description,
        //     id: this.index.description_textarea,
        //     rows: 4,
        // }).appendTo($div);
        //
        // $form.append($div);

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