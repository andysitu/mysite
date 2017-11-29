var add_menu = {
    add_menu_container: "add-menu-container",
    set_menu: function() {
        this.empty_menu();
        var option = this.get_selected_add_option();

        switch(option) {
            case "income":
                this.add_amount_input();
                this.add_date_input();
                break;
            case "expenditure":
                this.add_amount_input();
                this.add_date_input();
                break;
        };
    },
    empty_menu: function() {
        $("#" + this.add_menu_container).empty();
    },
    get_selected_add_option: function() {
        var options_name = add_menu_elements.add_options_name;

        return $("input:radio[name=" + options_name + "]:checked").val();
    },
    add_amount_input: function() {
        var $div = $("#" + this.add_menu_container),
            $amount_input_div = add_elements.$amount_input_div();
        $div.append($amount_input_div);
    },
    add_date_input: function() {
        var $div = $("#" + this.add_menu_container),
            $date_input_div = add_elements.$date_input_div();
        $div.append($date_input_div);
    }
};

var add_menu_elements = {
    add_options_name: "add-type-options",
    amount_select_id: "amount-select",
    amount_select_name: "amount",
    date_input_name: "date",
    date_input_id: "date-input",
};

var add_elements = {
    $amount_input_div: function() {
        /**
         * Return $element for amount input (type:number)
         *  using the id & name from add_menu_elements.
         */
        var $amount_div = $("<div class='form-group row'></div>");

        $("<label>", {
           "for": add_menu_elements.amount_select_id,
            "class": "col-sm-1 col-form-label",
            "text": "Amount",
        }).appendTo($amount_div);

        $amount_div.append(
            $("<div class='input-group-addon'>$</div>"),
            $("<input>", {
                id: add_menu_elements.amount_select_id,
                type: "number",
                name: add_menu_elements.amount_select_name,
                "class": "col-sm-2 form-control",
            }),
        );

        return $amount_div;
    },
    $date_input_div: function() {
        /**
         * Return $element for date input
         *  using the id & name from add_menu_elements.
         */
        var $date_div = $("<div class='form-group row'></div>");

        $("<label>", {
            "for": add_menu_elements.date_input_id,
            "class": "col-sm-1 col-form-label",
            "text": "Date",
        }).appendTo($date_div);

        $date_div.append(
            $("<input>", {
                id: add_menu_elements.date_input_id,
                type: "date",
                name: add_menu_elements.date_input_name,
                "class": "col-sm-2 form-control",
            }),
        );

        return $date_div;
    },
};