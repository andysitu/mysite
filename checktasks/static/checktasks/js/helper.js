var helper = {
    // year, month, day, num_days [int]
    // Return array containig Dates();
    get_dates: function(start_year, start_month, start_day, num_days) {

        var date_arr = [];
        var i = 0;

        for (i = 0; i < num_days; i++) {
            date_arr.push(new Date(start_year, start_month, start_day + i))
        }
        return date_arr;
    },

    get_date: function() {
        var stor = window.localStorage;
        var dStor = stor.getItem("checkTasks_jdate");
        if (dStor == undefined || dStor == null) {
            var d = new Date();
            this.set_date(d.getYear(), d.getMonth(), d.getDate());
            return this.get_date();
        } else {
            return JSON.parse(dStor);
        }
    },
    set_date: function(year, month, date) {
        var stor = window.localStorage;

        stor.setItem("checkTasks_jdate", JSON.stringify({"date": date, "year": year, "month": month,}));
    },
};