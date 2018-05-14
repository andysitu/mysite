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
    get_element: function(element, type, identifier) {
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
                if (identifier != undefined || identifier != null) {
                    if (type == "$")
                        return $("#date-td-" + identifier);
                    else
                        return ("date-td-" + identifier);
                } else {

                }
            default:
                return "";
        }
    },
    tasks: null,
    table_columns: 0,
    remove_tasks: function() {
        /**
         * Remove tasks from #tasks_div & classes
         */
        this.get_element("tasks-div", "$").empty();
    },
    make_tasks_table: function() {
        var $tasks_div = this.get_element("tasks-div", "$");

        var $table = $("<table>", {
            id: this.get_element("table", "id"),
            "class": "table table-sm",
        });

        $table.hover(this.hover_table);

        $tasks_div.append($table);

        this.add_dateRow();
        tasks_functions.get_tasks(this.add_tasks);
    },
    add_tasks: function(tasks_list) {
        var tasks_length = tasks_list.length,
            $tbody = $("<tbody>");

        var $tasks_table = viewer.get_element("table", "$");
        var $tr, $td,
            table_columns = viewer.table_columns;

        for (var i = 0; i < tasks_length; i++) {
            $tr = $("<tr>");
            $tr.append($("<th>", {
                text: tasks_list[i],
                scope: "row",
            }));

            for (var j = 0; j < table_columns -1; j++) {
                $td = $("<td>").appendTo($tr);
            }
            $tr.appendTo($tbody);
        }
        $tasks_table.append($tbody);
    },
    add_dateRow: function() {
        var dateJSON = helper.get_date(),
            $thead, $tr, $th,
            i;
        var month = dateJSON.month,
            year = dateJSON.year,
            date = dateJSON.date;
        var lastDateObj = new Date(year, month+1, 0),
            last_dateOfmonth = lastDateObj.getDate();

        this.table_columns = last_dateOfmonth + 1;

        var locale = "en-us",
            monthString = lastDateObj.toLocaleString(locale, {month: "long" });

        var $table = this.get_element("table", "$");
        var $thead = $("<thead>");

        $tr = $("<tr>");
        $tr.append($("<th>", {
            text: monthString,
            "class": "col",
        }));

        for (i = 1; i <last_dateOfmonth+1; i++) {
            $tr.append(
                $("<th>", {
                    text: i,
                    "class": "col",
                    id: viewer.get_element("date-th", "id", i),}
                ));
        }

        $thead.append($tr);
        $table.append($thead);
    },
    hover_table: function(e) {
        console.log(e);
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