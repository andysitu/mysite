var menu_screen = {
    create_add_menu: function () {

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

        console.log($form);
        $menu_option_div.append($form);
    },


};