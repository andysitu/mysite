$( document ).ready(function() {
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
    console.log("going back");
    location.replace(document.referrer);
    console.log(document.referrer);
}