$(document).ready(function(){
    $("#add-btn").click(function() {
        add_menu.create_menu();
        $('.overlay').show();
    });

    $('.overlay').click(function() {
        add_menu.close_menu();
        $('.overlay').hide()
    });
});


var add_menu = {
    index: {
        name_input: "name_input",
    },
    create_menu: function() {
        var $menu_option_div = $( '#menu-option-div' );

        $menu_option_div.empty();

        var $form = this.create_form();
        $menu_option_div.append($form);
        $( '#menu-option-div' ).show();
    },
    close_menu: function() {
        $( '#menu-option-div' ).hide();
    },
    create_form: function() {
        var $form = $("<form>", {
            action: add_url,
            method: "POST",
            id: "add-menu-form",
        });

        var $div;

        $div = $("<div class='form-group row'></div>");
        $("<label>", {
            "class": "col-sm-2 col-form-label",
            "for": this.index.name_input,
        }).text("Name").appendTo($div);

        $("<input/>", {
            id: this.index.name_input,
            "class": "col-sm-4 form-control",
            name: "name",
        }).appendTo($div);
        $form.append($div);

        $("<button/>", {
            "type": "submit",
            "class": "btn btn-primary",
            "text": "Submit",
        }).appendTo($form);

        $("<button/>", {
            "class": "btn btn-secondary",
            text: "Cancel",
        }).appendTo($form);


        return $form;
    }
};