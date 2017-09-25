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
            $addType_div = $("<div class='form-group row'></div>");

        $addType_div.appendTo($form);

        $("<label for='add-type-select' class='col-sm-1 col-form-label'>Type</label>").appendTo($addType_div);
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
        $addType_select.change(add_type_menu.add_menuOption.bind(add_type_menu));
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

        var $date_select_div = this.make_$date_select_div();
        $menu_screen.append($date_select_div);

        $menu_screen.append(this.make_$amount_input_div);
    },
    add_expenditure: function() {
        var $menu_screen = $('#menu-screen');

        var $date_select_div = this.make_$date_select_div();
        $menu_screen.append($date_select_div);

        $menu_screen.append(this.make_$amount_input_div);

    },
    make_$date_select_div: function() {
        var $date_div = $("<div class='form-group row'></div>")
        $("<label for='add-date-input' class='col-sm-1 col-form-label'>Date</label>")
            .appendTo($date_div);
        var $date_select = $("<input id='add-date-input' type='date' class='col-sm-3 form-control'>")
            .appendTo($date_div);

        // Set Default date to today
        $date_select[0].valueAsDate = new Date();

        return $date_div;
    },
    make_$amount_input_div: function() {
        var $amount_div = $("<div class='form-group row'></div>");

        $("<label for='add-amount-input' class='col-sm-1 col-form-label'>Amount</label>")
            .appendTo($amount_div);

        $("<span class='input-group-addon'>$</span>")
            .appendTo($amount_div);
        $("<input id='add-amount-input' type='number' class='col-sm-3 form-control'>")
            .appendTo($amount_div);

        return $amount_div;
    },
}