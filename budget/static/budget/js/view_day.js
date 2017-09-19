$( document ).ready(function() {
    //JS for Pressing menu button
    $('#navbarSideButton').on('click', function() {
        $('#navbarSide').addClass('reveal');
        $('.overlay').show();
    });

    //JS for pressing out of menu screen
    $('.overlay').on('click', function() {
        $('#navbarSide').removeClass('reveal');
        $( '#menu-option-div' ).hide();
        $('.overlay').hide()
    });

    //JS for pressing Add button
    $('#add-button').click(function(){
        $('.overlay').show();
        $( '#menu-option-div' ).show();
        menu_screen.create_add_menu()
    });
});