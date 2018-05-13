var helper = {
    // year, month, day, num_days [int]
    // Return Date object
    get_dates: function(start_year, start_month, start_day, num_days) {

        var date_arr = [];
        var i = 0;

        for (i = 0; i < num_days; i++) {
            date_arr.push(new Date(start_year, start_month, start_day + i))
        }
        return date_arr;
    },

    date_verName: "dateVer",
    date_version: "0.0.3",
    get_date: function() {
        var stor = window.localStorage;

        var dateStored = stor.getItem("checkTasks_date"),
            check_ver = stor.getItem(this.date_verName);

        if (dateStored == undefined || dateStored == null || check_ver != this.date_version) {
            var d = new Date();
            this.set_date(d.getFullYear(), d.getMonth(), d.getDate());
            return this.get_date();
        } else {
            return dateStored;
        }
    },
    set_date: function(year, month, date) {
        var stor = window.localStorage;

        var d = new Date(year, month, date);

        stor.setItem("checkTasks_date", d);
        stor.setItem(this.date_verName, this.date_version);
    },
};