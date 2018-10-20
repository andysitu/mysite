var menu = {
     index: {
        form_id: "add-form",
        name: "name",
        name_input_element: "name_input",
        description: "description",
        description_textarea: "description_text",
    },
    create_menu: function(type, data_obj) {
        this.status = true;
        var $menu_option_div = $( '#menu-option-div' );

        $menu_option_div.empty();

        var $form = $("<div>");
        if (type == "add") {
            $form = add_menu.create_form();
        } else if (type == "edit") {
            $form = edit_menu.create_form(data_obj.taskName);
        }

        $menu_option_div.append($form);
        $( '#menu-option-div' ).show();
        $('.overlay').show();
    },
    close_menu: function() {
        this.status = false;
        $( '#menu-option-div' ).hide();
        $('.overlay').hide()
    },
    create_name_$input: function() {
         // Name Input
        var $div = $("<div class='form-group row'></div>");
        $("<label>", {
            "class": "col-sm-2 col-form-label",
            "for": this.index.name_input_element,
        }).text("Name").appendTo($div);

        $("<input/>", {
            id: this.index.name_input_element,
            "class": "col-sm-6 form-control",
            name: "name",
        }).appendTo($div);
        return $div;
    },
    create_type_$select: function() {
         var $div = $("<div class='form-group row'></div>"),
             type_select_id = "type-select";

        $("<label>", {
            "class": "col-sm-2 col-form-label",
            "for": type_select_id,
        }).text("Type").appendTo($div);

        var $type_select = $("<select>", {
            id: type_select_id,
            "class": "form-control col-sm-6",
            name: "type",
        }).appendTo($div);


        $("<option>", {
            value: "bool",
            text: "Done Once",
        }).appendTo($type_select)

        $("<option>", {
            value: "time",
            text: "Timed",
        }).appendTo($type_select)

        return $div;
    },
    $create_submit_button: function() {
         return $("<button/>", {
            "type": "submit",
            "class": "btn btn-primary",
            "text": "Submit",
        })
    },
    $create_cancel_button: function() {
        return $("<button/>", {
            "class": "btn btn-secondary",
            text: "Cancel",
            click: function(e) {
                e.preventDefault();
                menu.close_menu();
            },
        });

    }
};

var add_menu = {
    status: false,
    submitter: function(e) {
        e.preventDefault();
        var $add_form = $("#" + menu.index.form_id)

        function run_on_success() {
            location.reload();
        }

        tasks_functions.add($add_form, run_on_success);
    },
    create_form: function() {
        var $form = $("<form>", {
            action: add_url,
            method: "POST",
            id: menu.index.form_id,
            submit: this.submitter,
        });

        var $name_div = menu.create_name_$input();
        $form.append($name_div);

        var $type_div = menu.create_type_$select();
        $form.append($type_div);

        var $submit_button = menu.$create_submit_button();
        $submit_button.appendTo($form);

        var $cancel_button = menu.$create_cancel_button;
        $form.append($cancel_button);

        return $form;
    },
};

var edit_menu = {
    status: false,
    create_form: function(taskName) {
        var $form = $("<form>", {
            action: edit_url,
            method: "POST",
            data: {taskName,},
            id: menu.index.form_id,
            submit: this.submitter,
        });

        var $name_div = menu.create_name_$input();
        $form.append($name_div);

        // var $type_div = menu.create_type_$select();
        // $form.append($type_div);

        var $submit_button = menu.$create_submit_button();
        $submit_button.appendTo($form);

        var $cancel_button = menu.$create_cancel_button;
        $form.append($cancel_button);

        var el = document.createElement("input")
        el.innerHTML = '<input type="hidden" value="' + taskName + '" name="taskName">'
        $form.append(el.firstChild)

        return $form;
    },
    submitter: function(e) {
        e.preventDefault();
        console.log("edit");

        var $edit_form = $("#" + menu.index.form_id)

        function run_on_success(data) {
            // menu.close_menu();
            location.reload();
        }

        tasks_functions.edit($edit_form, run_on_success);
    }
};