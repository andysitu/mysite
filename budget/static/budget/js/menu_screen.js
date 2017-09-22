var menu_screen = {
    create_menu: function(type) {
        this.clear_all_menu();

        switch(type) {
            case "add":
                this.create_add_type_menu();
                break;
        }
    },
    create_add_type_menu: function () {

        var $menu_option_div = $( '#menu-option-div' );

        var $form = $("<form></form>"),
            $addType_div = $("<div class='form-group'></div>");

        $addType_div.appendTo($form);

        $("<label for='add-type-select'>Type</label>").appendTo($addType_div);
        var $addType_select = $("<select>", {
            "class": "form-control",
            id: "add-type-select",})
                .addClass("col-sm-2")
                .appendTo($addType_div);

        $addType_select.append( $("<option>Income</option>"));
        $addType_select.append( $("<option>Expenditure</option>"));

        $menu_option_div.append($form);

        $("<form class='form-group' id='menu-screen'></form>")
            .appendTo($menu_option_div);

        // Get add type & then add corresponding menu
        add_type_menu.add_menuOption();
    },
    clear_all_menu: function() {
        $menu_option_div = $( '#menu-option-div' ).empty();
    },
};

var add_type_menu = {
    add_menuOption: function() {
        var $menu_screen = $('#menu-screen'),
            $add_select = $('#add-type-select'),
            type = $add_select.val();
        $menu_screen.empty();

        this.make_menuOption(type);

        // this.make(type);
    },
    make_menuOption: function(type) {
        switch(type) {
            case "Income":
                this.add_income();
                break;
            case "Expenditure":
                this.add_expenditure();
                break;
        }
    },
    add_income: function() {
        var $menu_screen = $('#menu-screen');

        var $date_div = $("<div class='form-group'></div>")
            .appendTo($menu_screen);
        $("<label for='add-date-input'>Date</label>")
            .appendTo($date_div);
        $("<input id='add-date-input' type='date' class='form-control'>")
            .appendTo($date_div);
    },
    add_expenditure: function() {
        var menu_screen = $('#menu-screen');
    },
}