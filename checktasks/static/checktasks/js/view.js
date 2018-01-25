$(document).ready(function(){
    $("#add-btn").click(function() {
        add_menu.create_menu();
    });

    $('.overlay').click(function() {
        add_menu.close_menu();
    });
});


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
        var $form = $("#" + add_menu.index.form_id)
        tasks.add($form);
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
    }
};