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
}