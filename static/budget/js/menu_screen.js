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

        var $form = $("<form>", {
                        action: add_url,
                        method: "POST",
                    }),
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

        $("<div id='menu-screen'></div>")
            .appendTo($form);

        // Get add type & then add corresponding menu
        add_type_menu.add_menuOption();
        $addType_select.change(add_type_menu.add_menuOption.bind(add_type_menu));

        $form.submit(function(e){
            e.preventDefault();
            ajax_func.csrf_it();

            $.ajax({
                type: "POST",
                url: add_url,
                data: $form.serialize(),
                success: function(data) {
                    console.log(data);
                }
            })

        });
    },
    clear_all_menu: function() {
        $menu_option_div = $( '#menu-option-div' ).empty();
    },
    close_menu: function() {
        $('#navbarSide').removeClass('reveal');
        $( '#menu-option-div' ).hide();
        $('.overlay').hide()
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
        var $menu_screen = $('#menu-screen');

        switch(type) {
            case "Income":
                this.add_income($menu_screen);
                break;
            case "Expenditure":
                this.add_expenditure($menu_screen);
                break;
        }
        $menu_screen.append($("<button type='submit' class='btn btn-primary'>Submit</button>"));

        $menu_screen.append(this.make_$close_btn());
    },
    add_income: function($menu_screen) {

        var $date_select_div = this.make_$date_select_div();
        $menu_screen.append($date_select_div);

        $menu_screen.append(this.make_$amount_input_div());

        $menu_screen.append(this.make_$time_period_div());
    },
    add_expenditure: function($menu_screen) {

        var $date_select_div = this.make_$date_select_div();
        $menu_screen.append($date_select_div);

        $menu_screen.append(this.make_$amount_input_div());

        $menu_screen.append(this.make_$time_period_div());
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
    make_$time_period_div: function() {
        var $time_period_div = $("<div class='form-row align-items-center'></div>");

        $("<label for='time-period-input' class='col-sm-1 col-form-label'>Time Period</label>")
            .appendTo($time_period_div);
        $("<input id='time-period-input' type='number' class='col-sm-1 form-control'>")
            .appendTo($time_period_div);

        var $timePer_option = $("<select id='time-period-option' class='custom-select'></select>")
            .appendTo($time_period_div);
        $("<option>Days</option>").appendTo($timePer_option);
        $("<option>Weeks</option>").appendTo($timePer_option);
        $("<option>Months</option>").appendTo($timePer_option);
        $("<option>Years</option>").appendTo($timePer_option);

        return $time_period_div;
    },
    make_$close_btn: function() {
        var $but = $("<button class='btn'>Close</button>");
        $but.click(function(){
            menu_screen.close_menu();
        });
        return $but;
    },
}