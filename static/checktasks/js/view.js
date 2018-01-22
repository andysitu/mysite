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
    create_menu: function() {
        var $menu_option_div = $( '#menu-option-div' );

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
        $addType_div = $("<div class='form-group row'></div>");

        $addType_div.appendTo($form);
        return $form;
    }
};