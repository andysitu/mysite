$( document ).ready(function() {
    var options_name = add_menu_elements.add_options_name;

    $("input:radio[name=" + options_name + "]").change(
        function() {
            add_menu.set_menu();
        }
    );

    add_menu.set_menu();

    $("#add-form").submit(function(e){
        e.preventDefault();
        add_submit(e);
    });

    $("#cancel-button").click(function(e){
        e.preventDefault();
        go_back();
    });
});

function add_submit(e) {
    go_back();
}

function go_back(e) {
    location.replace(document.referrer);
}