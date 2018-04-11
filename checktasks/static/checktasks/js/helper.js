var helper = {
    // year, month, day, num_days [int]
    // Return array containig Dates();
    get_dates: function(year, month, day, num_days) {

        var date_arr = [];
        var i = 0;

        for (i = 0; i < num_days; i++) {
            date_arr.push(new Date(year, month, day + i))
        }
        return date_arr;
    },
};