$( document ).ready(function() {
    var options_name = add_menu_elements.add_options_name;

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
    ajax_func.csrf_it();
    add_menu.submit(e);

    // go_back();
}

function go_back(e) {
    location.replace(document.referrer);
}