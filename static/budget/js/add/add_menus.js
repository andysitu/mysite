var add_menu = {
    form_id: "add-form",
    add_menu_container: "add-menu-container",
    set_menu: function() {
        this.empty_menu();
        var option = this.get_selected_add_option();

        this.add_amount_input();
        this.add_date_input();
        this.add_category_select();
    },
    get_container: function() {
        return $("#" + this.add_menu_container);
    },
    empty_menu: function() {
        $("#" + this.add_menu_container).empty();
    },
    get_selected_add_option: function() {
        var options_name = add_menu_elements.add_options_name;

        return $("input:radio[name=" + options_name + "]:checked").val();
    },
    get_form: function() {
        return $("#" + this.form_id);
    },
    add_amount_input: function() {
        var $container = this.get_container(),
            $amount_input_div = add_elements.$amount_input_div();
        $container.append($amount_input_div);
    },
    add_category_select: function() {
        var $container = this.get_container(),
            $category_select = add_elements.$category_select();
        $container.append($category_select);
    },
    add_date_input: function() {
        var $container = this.get_container(),
            $date_input_div = add_elements.$date_input_div();
        $container.append($date_input_div);
    },
    submit: function(e) {
        ajax_func.csrf_it();

        var $form = this.get_form();
        console.log($form.serialize());
        $.ajax({
            type: $form.attr("method"),
            url: $form.attr("action"),
            data: $form.serialize(),
            success: function(data) {
                console.log(data);
            }
        });
    }
};

var add_menu_elements = {
    add_options_name: "add-type-options",
    amount_select_id: "amount-select",
    amount_select_name: "amount",
    category_select_id: "category-select",
    category_select_name: "category",
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
    $category_select: function() {
        /**
         * Return $element for selecting category.
         */
        var $div = $("<div class='form-group row'></div>");
        $("<label>", {
            "for": add_menu_elements.category_select_id,
            "class": "col-sm-1 col-form-label",
            "text": "Category",
        }).appendTo($div);

        var $select = $("<select>", {
            id: add_menu_elements.category_select_id,
            name: add_menu_elements.category_select_name,
            "class": "col-sm-2 form-control",
        }).appendTo($div);

        return $div;

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

        var $date_input = $("<input>", {
            id: add_menu_elements.date_input_id,
            type: "date",
            name: add_menu_elements.date_input_name,
            "class": "col-sm-2 form-control",
        }).appendTo($date_div);

        $date_input[0].valueAsDate = new Date();

        return $date_div;
    },
};