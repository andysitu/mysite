from django.shortcuts import render
from django.core import serializers

from django.http import HttpResponse, JsonResponse

from .models import DataDate, Items, Location, filter_item_query_by_loc
from .helper_functions import get_all_location_dic

import datetime, re
from django.db import IntegrityError

import operator
from django.db.models import Q

def get_element_name(key):
    if key == "multiple_dates" or key == "multiple_locs":
        return elements_dictionary[key] + "[]"
    else:
        return elements_dictionary[key]

elements_dictionary = {
# level is handled at JS level.
    "single_date": "date-1",
    "multiple_dates": "dates",
    "multiple_locs": "locs",
    "time_period": "time-period",
    "filter_value": "filter_value",
    "filter_option": "filter_option",

    # For adv search. Has # added at end
    "adv_contain": "adv_contain_select",
    "adv_filter": "filter_value",
    "adv_foption": "filter_option",
    "quantity": "quantity",
    "quantity_modifier": "quantity-modifier",
    "quantity_item_type": "quantity-item-type",

}

def loc_inst_to_jsloccode(loc_inst):
    # Returns the loc_code used in js component
    #   (Location code, without the level implemented).
    warehouse_code = "USLA"
    area_code = ""
    aisle_code = str(loc_inst.aisle_num)
    column_code = str(loc_inst.column)

    loc = loc_inst.loc
    area = loc_inst.area
    aisle_letter = loc_inst.aisle_letter
    if loc == "P":
        area_code = "P"
    elif loc == "S":
        if area == "H" and aisle_letter == "H" or area == "S":
            area_code = "S"
        else:
            area_code = "H"
    elif loc == "VC":
        if area == "VC" or area == "VD":
            area_code = "VC"
        elif area == "VA" or area == "VB":
            area_code = "VA"
        else:
            area_code = "H"
    else:
        if area == "F":
            area_code = "F"
        else:
            area_code = "VA"
    return warehouse_code + "." + area_code + "." + aisle_code + "." + column_code

def get_dates(request):
    num_dates = int(request.GET.get("num_dates"))
    dates = DataDate.objects.order_by('-date')
    # if num_dates != 0:
    #     dates = dates[:num_dates]

    date_list = []

    for data_date_inst in dates:
        date_id = data_date_inst.id
        date_str = data_date_inst.date.astimezone().strftime("%m/%d/%y-%I:%M%p")

        date_list.append({"date_id":date_id, "date_string": date_str,})
    return JsonResponse(date_list, safe=False)

def make_item_name_for_map(item_inst):
    item_code = item_inst.item_code
    customer_code = item_inst.customer_code
    item_quantity = item_inst.avail_quantity + item_inst.ship_quantity
    return str(customer_code) + "-" + item_code


def get_item_count(request):
    """
    Gets item_count of a specific location
    :param request: request [ date_id[int] & loc [String] ]
    :return: data_dic
        {
            location Code [string]: {
                "items": {
                    item_sku [string]: item_count [ int]
                }
            }
        }
    """
    data_dic = {}

    date_id = request.GET.get("date-1")
    loc = request.GET.get("loc")
    filter_value = request.GET.get(elements_dictionary["filter_value"])
    filter_option = request.GET.get(elements_dictionary["filter_option"])

    data_date_inst = DataDate.objects.get(pk=date_id)

    item_query = get_normal_item_query(data_date_inst)
    item_query = get_item_query_filter(item_query, filter_option, filter_value)
    item_query = filter_item_query_by_loc(item_query, loc)

    for item_inst in item_query:
        js_loc_code = loc_inst_to_jsloccode(item_inst.rack_location)
        if js_loc_code not in data_dic:
            data_dic[js_loc_code] = {"items": {}}

        location = item_inst.location_code
        if location not in data_dic[js_loc_code]["items"]:
            data_dic[js_loc_code]["items"][location] = {}
        cur_item_dic = data_dic[js_loc_code]["items"][location]

        item_name = make_item_name_for_map(item_inst)
        item_quantity = item_inst.avail_quantity + item_inst.ship_quantity

        if item_name not in cur_item_dic:
            cur_item_dic[item_name] = item_quantity
        else:
            cur_item_dic[item_name] += item_quantity

    return data_dic

def get_item_weight(request):
    """
    Gets item_weight of a specific location
    :param request: request [ date_id[int] & loc [String] ]
    :return: data_dic
        {
            location Code [string]: {
                "items": {
                    item_sku [string]: item_count [ int]
                }
            }
        }
    """
    data_dic = {}

    date_id = request.GET.get("date-1")
    loc = request.GET.get("loc")
    filter_value = request.GET.get(elements_dictionary["filter_value"])
    filter_option = request.GET.get(elements_dictionary["filter_option"])

    data_date = DataDate.objects.get(pk=date_id)

    item_query = get_normal_item_query(data_date)
    item_query = get_item_query_filter(item_query, filter_option, filter_value)
    item_query = filter_item_query_by_loc(item_query, loc).iterator()

    for item_inst in item_query:
        js_loc_code = loc_inst_to_jsloccode(item_inst.rack_location)
        if js_loc_code not in data_dic:
            data_dic[js_loc_code] = {"items": {}}

        location = item_inst.location_code
        if location not in data_dic[js_loc_code]["items"]:
            data_dic[js_loc_code]["items"][location] = {}
        cur_item_dic = data_dic[js_loc_code]["items"][location]

        item_weight = item_inst.item_weight
        item_quantity = item_inst.avail_quantity + item_inst.ship_quantity
        item_name = make_item_name_for_map(item_inst)

        if item_name not in cur_item_dic:
            cur_item_dic[item_name] = item_quantity * item_weight
        else:
            cur_item_dic[item_name] += item_quantity * item_weight

    return data_dic

def get_item_added(request):
    """
    Gets items_added of a specific location
    :param request: request [ date_id[int] & loc [String] ]
    :return: data_dic
        {
            location Code [string]: {
                "items": {
                    item_sku [string]: item_count [ int]
                }
            }
        }
    """
    data_dic = {}

    date_id = request.GET.get("date-1")
    loc = request.GET.get("loc")
    filter_value = request.GET.get(elements_dictionary["filter_value"])
    filter_option = request.GET.get(elements_dictionary["filter_option"])

    data_date_inst = DataDate.objects.get(pk=date_id)

    time_period = request.GET.get(elements_dictionary["time_period"])

    t_delta = datetime.timedelta(days=int(time_period))


    if data_date_inst.date.weekday() == 0:
        monday_t_delta = datetime.timedelta(days=int(time_period) + 1)
        prev_date = data_date_inst.date - monday_t_delta
    else:
        prev_date = data_date_inst.date - t_delta

    item_query = get_normal_item_query(data_date_inst)
    item_query = get_item_query_filter(item_query, filter_option, filter_value)
    item_query = filter_item_query_by_loc(item_query, loc).iterator()


    for item_inst in item_query:
        if item_inst.get_input_date() < prev_date:
            continue

        js_loc_code = loc_inst_to_jsloccode(item_inst.rack_location)
        if js_loc_code not in data_dic:
            data_dic[js_loc_code] = {"items": {}}

        location = item_inst.location_code
        if location not in data_dic[js_loc_code]["items"]:
            data_dic[js_loc_code]["items"][location] = {}
        cur_item_dic = data_dic[js_loc_code]["items"][location]

        item_quantity = item_inst.avail_quantity + item_inst.ship_quantity
        item_name = make_item_name_for_map(item_inst)

        if item_name not in cur_item_dic:
            cur_item_dic[item_name] = item_quantity
        else:
            cur_item_dic[item_name] += item_quantity

    return data_dic

def get_item_shipped(request):
    """
    Gets shipped of a specific location
    :param request: request [ date_id[int] & loc [String] ]
    :return: data_dic
        {
            location Code [string]: {
                "items": {
                    item_sku [string]: item_count [ int]
                }
            }
        }
    """
    data_dic = {}

    loc = request.GET.get("loc")

    date_1_id = request.GET.get("date-1")
    data_date_1 = DataDate.objects.get(pk=date_1_id)
    date_1 = data_date_1.date

    date_2_id = request.GET.get("date-2")
    data_date_2 = DataDate.objects.get(pk=date_2_id)
    date_2 = data_date_2.date

    filter_value = request.GET.get(elements_dictionary["filter_value"])
    filter_option = request.GET.get(elements_dictionary["filter_option"])

    # Check whether date_1 or date_2 is older.
    if date_1 == date_2:
        return {}
    if date_1 > date_2:
        newer_datadate = data_date_1
        older_datadate = data_date_2
    else:
        newer_datadate = data_date_2
        older_datadate = data_date_1

    item_query_older = get_normal_item_query(older_datadate)
    item_query_older = get_item_query_filter(item_query_older, filter_option, filter_value)
    item_query_older = filter_item_query_by_loc(item_query, loc).iterator()

    item_query_newer = get_normal_item_query(newer_datadate)
    item_query_newer = get_item_query_filter(item_query_newer, filter_option, filter_value)
    item_query_newer = item_query_newer.filter(fifo_date__lte=older_datadate.date).iterator()

    labId_newerItem_dic = {}
    labId_olderItem_dic = {}
    labId_older_iteminst_dic = {}

    # lab_id is kept constant among items even when separated (such as when
    #   items in one location is split into two locations.
    for item_1 in item_query_newer:
        lid = item_1.lab_id
        if lid in labId_newerItem_dic:
            labId_newerItem_dic[lid] += item_1.avail_quantity + item_1.ship_quantity
        else:
            labId_newerItem_dic[lid] = item_1.avail_quantity + item_1.ship_quantity

    for item_2 in item_query_older:
        lid = item_2.lab_id
        if lid in labId_olderItem_dic:
            labId_olderItem_dic[lid] += item_2.avail_quantity + item_2.ship_quantity
        else:
            labId_olderItem_dic[lid] = item_2.avail_quantity + item_2.ship_quantity
        # New items in excel are read first, so older items will replace older
        #   ones in lab_id_loc_dic. Because older items should go first
        #   (It's actually by RCV date).

        labId_older_iteminst_dic[lid] = item_2

    for lab_id in labId_olderItem_dic:
        item_inst = labId_older_iteminst_dic[lab_id]

        js_loc_code = loc_inst_to_jsloccode(item_inst.rack_location)

        item_quantity = labId_olderItem_dic[lab_id]
        item_name = make_item_name_for_map(item_inst)

        if lab_id in labId_newerItem_dic:
            difference = item_quantity - labId_newerItem_dic[lab_id]
        else:
            difference = item_quantity
        if difference == 0:
            continue
        elif difference < 0:
            item_q = Items.objects.filter(data_date=older_datadate, lab_id=lab_id)
            total = 0
            for i in item_q:
                total += i.avail_quantity + i.ship_quantity
                difference = total - labId_newerItem_dic[lab_id]
            if difference == 0:
                continue

        if js_loc_code not in data_dic:
            data_dic[js_loc_code] = {"items": {}}

        location = item_inst.location_code
        if location not in data_dic[js_loc_code]["items"]:
            data_dic[js_loc_code]["items"][location] = {}
        cur_item_dic = data_dic[js_loc_code]["items"][location]

        if item_name not in cur_item_dic:
            cur_item_dic[item_name] = difference
        else:
            cur_item_dic[item_name] += difference

    return data_dic

def get_normal_item_query(data_date):
    query = Items.objects.select_related('rack_location').filter(data_date=data_date, )
    return query.exclude(rack_location__loc="").exclude(customer_code=900135)

def get_item_query_filter(item_query, filter_option, filter_value):
    if filter_value == None or filter_value == "":
        return item_query

    if filter_option == "customer_code":
        customer = int(filter_value)
        item_query = item_query.filter(customer_code=customer)
    elif filter_option == "item_code":
        item_query = item_query.filter(item_code__icontains=filter_value)
    elif filter_option == "rcv":
        item_query = item_query.filter(rcv__icontains=filter_value)
    elif filter_option == "description":
        item_query = item_query.filter(description__icontains=filter_value)
    elif filter_option == "item_code":
        item_query = item_query.filter(item_code__icontains=filter_value)

    return item_query

def get_total_item_info(request, num_top=20):
    date_id = request.GET.get("date-1")
    data_date = DataDate.objects.get(id=date_id)

    info_dic = {}
    customers_item_dic = {}
    customers_num = 0

    item_count = {}
    loc_item_count = {}
    loc_item_type = {}

    customers_item_count = {}
    customers_type_count = {}
    total = 0
    item_types = 0
    item_query = get_normal_item_query(data_date).iterator()
    for item in item_query:
        total_items = item.avail_quantity + item.ship_quantity
        total += total_items
        sku = item.item_code
        customer_code = item.customer_code

        loc = item.rack_location.loc

        if customer_code not in customers_item_dic:
            customers_item_dic[customer_code] = {}
            customers_item_count[customer_code] = 0
            customers_type_count[customer_code] = 0
            customers_num += 1

        customers_item_count[customer_code] += total_items

        customer_dic = customers_item_dic[customer_code]
        if sku not in customer_dic:
            item_count[sku] = total_items
            customer_dic[sku] = total_items
            customers_type_count[customer_code] += 1
            item_types += 1

            if loc not in loc_item_type:
                loc_item_type[loc] = 1
            else:
                loc_item_type[loc] += 1
        else:
            item_count[sku] += total_items
            customer_dic[sku] += total_items

        if loc not in loc_item_count:
            loc_item_count[loc] = total_items
        else:
            loc_item_count[loc] += total_items

    top_customers_items = sorted(customers_item_count.items(), key=operator.itemgetter(1))[::-1][:num_top:]
    top_customers_item_type = sorted(customers_type_count.items(), key=operator.itemgetter(1))[::-1][:num_top:]
    top_item_count = sorted(item_count.items(), key=operator.itemgetter(1))[::-1][:num_top:]
    top_loc_count = sorted(loc_item_count.items(), key=operator.itemgetter(1))[::-1][:num_top:]
    top_loc_item_type = sorted(loc_item_type.items(), key=operator.itemgetter(1))[::-1][:num_top:]

    info_dic["item-total"] = total
    info_dic["number-item-types"] = item_types
    info_dic["number-of-customers"] = customers_num

    info_dic["top-customers-by-items"] = top_customers_items
    info_dic["top-customers-by-item-type"] = top_customers_item_type
    info_dic["top-item-count"] = top_item_count
    info_dic["item-count-by-loc"] = top_loc_count
    info_dic["item-type-by-loc"] = top_loc_item_type

    return info_dic

def adv_search(request):
    date_id = request.GET.get(get_element_name("single_date"))
    locs = request.GET.getlist(get_element_name("multiple_locs"))

    filter_dic = {}

    adv_contain_str = get_element_name("adv_contain")
    adv_filter_str = get_element_name("adv_filter")
    adv_foption_str = get_element_name("adv_foption")

    # There shouldn't be more than 100 filter criteria
    for i in range(100):
        adv_contain = request.GET.get(adv_contain_str + str(i))
        adv_filter = request.GET.get(adv_filter_str + str(i))
        adv_foption = request.GET.get(adv_foption_str + str(i))

        if adv_contain == None:
            break
        if adv_filter == "":
            continue

        if adv_foption not in filter_dic:
            filter_dic[adv_foption] = {}
        if adv_contain not in filter_dic[adv_foption]:
            filter_dic[adv_foption][adv_contain] = []

        filter_dic[adv_foption][adv_contain].append(adv_filter)

    data_date = DataDate.objects.get(id=date_id)

    for filter_option in filter_dic:
        for contains in filter_dic[filter_option]:
            filter_value_list = filter_dic[filter_option][contains]

    item_query = run_adv_item_filter(data_date, filter_dic)

    # Filter for Item Quantity if present.
    try:
        quantity = int(request.GET.get(get_element_name("quantity")))
        quantity_modfier = request.GET.get(get_element_name("quantity_modifier"))
        item_type = request.GET.get(get_element_name("quantity_item_type"))

        # Filter total_items & multiple lines RCV in
        if quantity != "" and item_type != "total_item":
            # multiple items with same item_sku can add up, so need to take
            #   that into account.
            #   Needs to be filtered at the end, but will just client to do that.
            if quantity_modfier == "lte":
                if item_type == "avail_item":
                    item_query = item_query.filter(avail_quantity__lte=quantity)
                elif item_type == "ship_item":
                    item_query = item_query.filter(ship_quantity__lte=quantity)
                elif item_type == "total_item":
                    item_query = item_query.filter(avail_quantity__lte=quantity)
                    item_query = item_query.filter(ship_quantity__lte=quantity)
    except ValueError:
        pass

    data = {}

    for item in item_query:
        item_loc = str(item.rack_location)
        rcv = item.rcv
        item_code = item.item_code
        description = item.description
        avail_quantity = item.avail_quantity
        ship_quantity = item.ship_quantity
        customer_code = item.customer_code

        if item_code not in data:
            data[item_code] = {}
        d = data[item_code]

        if item_loc not in d:
            d[item_loc] = {
                "avail_quantity" : avail_quantity,
                "ship_quantity": ship_quantity,
                "description": description,
                "item_code": item_code,
                "rcv": [rcv,],
                "location": item_loc,
                "customer_code": customer_code,
            }
        else:
            d[item_loc]["avail_quantity"] += avail_quantity
            d[item_loc]["ship_quantity"] += ship_quantity
            if rcv not in d[item_loc]["rcv"]:
                d[item_loc]["rcv"].append(rcv)

    return data

def run_adv_item_filter(data_date, filter_dic):
    """
    Runs Q object query on Item models
    :param filter_dic: dictionary containing
    { [filter_option]:
        { [contains_status]:
            [filter_value_list...] } }
    :return: Item Query
    """
    item_query = get_normal_item_query(data_date)
    q_list = []
    for option in filter_dic:
        for contains in filter_dic[option]:
            q_objects = Q()
            filter_value_list = filter_dic[option][contains]
            for value in filter_value_list:
                q_object = get_q_object(option, contains, value)
                if q_object != None:
                    q_objects.add(q_object, Q.OR)

            q_list.append(q_objects)

    item_query = item_query.filter(*q_list)
    return item_query


def get_q_object(option, contains, value):
    if option == "customer_code":
        if contains == "contain":
            return Q(customer_code=int(value))
        elif contains == "nocontain":
            return ~Q(customer_code=int(value))
        elif contains == "exact":
            return Q(customer_code=int(value))
    elif option == "item_code":
        if contains == "contain":
            return Q(item_code__icontains=value)
        elif contains == "nocontain":
            return ~Q(item_code__icontains=value)
        elif contains == "exact":
            return Q(item_code__iexact=value)
    elif option == "rcv":
        if contains == "contain":
            return Q(rcv__icontains=value)
        elif contains == "nocontain":
            return ~Q(rcv__icontains=value)
        elif contains == "exact":
            return Q(rcv__iexact=value)
    elif option == "description":
        if contains == "contain":
            return Q(description__icontains=value)
        elif contains == "nocontain":
            return ~Q(description__icontains=value)
        elif contains == "exact":
            return Q(description__iexact=value)

def get_added_items_over_time(request):
    data = {}

    time_period = request.GET.get(elements_dictionary["time_period"])
    date_ids = request.GET.getlist(elements_dictionary["multiple_dates"] + "[]")
    locs = request.GET.getlist(elements_dictionary["multiple_locs"] + "[]")

    filter_value = request.GET.get(elements_dictionary["filter_value"])
    filter_option = request.GET.get(elements_dictionary["filter_option"])

    t_delta = datetime.timedelta(days=int(time_period))

    monday_t_delta = datetime.timedelta(days=int(time_period) + 1)

    if len(locs) == 0:
        locs = ["All", ]

    if "All" in locs:
        all_status = True
    else:
        all_status = False

    for i in range(len(locs)):
        loc = locs[i]
        data[loc] = {}

    for date_id in date_ids:
        data_date = DataDate.objects.get(id=date_id)

        if data_date.date.weekday() == 0:
            prev_date = data_date.date - monday_t_delta
        else:
            prev_date = data_date.date - t_delta

        date_str = data_date.date.timestamp() * 1000
        for loc in data:
            data[loc][date_str] = 0

        item_query = get_normal_item_query(data_date)
        item_query = get_item_query_filter(item_query, filter_option, filter_value)
        item_query = item_query.filter(iv_create_date__gte=prev_date).iterator()
        for item in item_query:
            item_loc = item.rack_location.loc

            if item.get_input_date() < prev_date:
                continue

            total_items = item.avail_quantity + item.ship_quantity

            if all_status:
                data["All"][date_str] += total_items
            if item_loc in data:
                data[item_loc][date_str] += total_items
    return data

def number_items_over_time(request):
    data = {}

    date_ids = request.GET.getlist(elements_dictionary["multiple_dates"] + "[]")
    locs = request.GET.getlist(elements_dictionary["multiple_locs"] + "[]")

    filter_value = request.GET.get(elements_dictionary["filter_value"])
    filter_option = request.GET.get(elements_dictionary["filter_option"])

    if len(locs) == 0:
        locs = ["All",]

    if "All" in locs:
        all_status = True
    else:
        all_status = False

    for i in range(len(locs)):
        loc = locs[i]
        data[loc] = {}

    for date_id in date_ids:
        data_date = DataDate.objects.get(id=date_id)
        date_str = data_date.date.timestamp() * 1000
        for loc in data:
            data[loc][date_str] = 0

        item_query = get_normal_item_query(data_date)
        item_query = get_item_query_filter(item_query, filter_option, filter_value)
        item_query = item_query.iterator()
        for item in item_query:
            item_loc = item.rack_location.loc
            total_items = item.avail_quantity + item.ship_quantity
            if all_status:
                data["All"][date_str] += total_items
            if item_loc in data:
                data[item_loc][date_str] += total_items
    return data

def item_type_filter(request):
    # Counts the avail_quantity in each item
    date_id = request.GET.get("date-1")
    data_date = DataDate.objects.get(id=date_id)

    num_item_types = int(request.GET.get("num-item-types"))
    num_item_type_modifier = request.GET.get("num-item-type-modifier")

    loc = request.GET.get("loc")

    data = {}
    items_q = get_normal_item_query(data_date)
    items_q = filter_item_query_by_loc(items_q, loc).iterator()

    # locations = sorted(items_in_locations.items(), key=operator.itemgetter(1))[::-1]
    locations_dic = get_all_location_dic(loc)

    for item in items_q:
        avail_quantity = item.avail_quantity
        if avail_quantity <= 0:
            continue

        location_inst = item.rack_location

        area = location_inst.area
        aisle_letter = location_inst.aisle_letter
        aisle_num = location_inst.aisle_num
        level = location_inst.level
        column = location_inst.column

        item_code = item.item_code


        # Set Area
        if area == "H" and aisle_letter == "H":
            area = "S"
        elif area == "PH" or area == "PA":
            area = "P"
        elif area == "VD":
            area = "VC"
        elif area == "VB":
            area = "VA"

        location_code = "USLA." + area + "." + str(aisle_num) + "." + str(column) + "." + str(level)
        loc_dic = locations_dic[location_code]

        if item_code not in loc_dic:
            loc_dic[item_code] = avail_quantity
        else:
            loc_dic[item_code] += avail_quantity

    data["item-type-filter_unfiltered"] = locations_dic
    return data

def item_type_over_time(request):
    item_sku_dic = {}
    data = {}

    date_ids = request.GET.getlist(elements_dictionary["multiple_dates"] + "[]")
    locs = request.GET.getlist(elements_dictionary["multiple_locs"] + "[]")
    filter_value = request.GET.get(elements_dictionary["filter_value"])
    filter_option = request.GET.get(elements_dictionary["filter_option"])

    if len(locs) == 0:
        locs = ["All", ]

    if "All" in locs:
        all_status = True
    else:
        all_status = False

    for i in range(len(locs)):
        loc = locs[i]
        item_sku_dic[loc] = {}
        data[loc] = {}

    for date_id in date_ids:
        data_date = DataDate.objects.get(id=date_id)
        date_str = data_date.date.timestamp() * 1000
        for loc in data:
            item_sku_dic[loc][date_str] = {}
            data[loc][date_str] = 0

        item_query = get_normal_item_query(data_date)
        item_query = get_item_query_filter(item_query, filter_option, filter_value)
        item_query = item_query.iterator()
        for item in item_query:
            item_loc = item.rack_location.loc
            item_sku = item.item_code
            if all_status:
                item_sku_dic["All"][date_str][item_sku] = True
            if item_loc in data:
                item_sku_dic[item_loc][date_str][item_sku] = True

    for loc in item_sku_dic:
        for date_str in item_sku_dic[loc]:
            data[loc][date_str] = len(item_sku_dic[loc][date_str])

    return data

def num_customers_over_time(request):
    item_sku_dic = {}
    data = {}

    date_ids = request.GET.getlist(elements_dictionary["multiple_dates"] + "[]")
    locs = request.GET.getlist(elements_dictionary["multiple_locs"] + "[]")

    if len(locs) == 0:
        locs = ["All", ]

    if "All" in locs:
        all_status = True
    else:
        all_status = False

    for i in range(len(locs)):
        loc = locs[i]
        item_sku_dic[loc] = {}
        data[loc] = {}

    for date_id in date_ids:
        data_date = DataDate.objects.get(id=date_id)
        date_str = data_date.date.timestamp() * 1000
        for loc in data:
            item_sku_dic[loc][date_str] = {}
            data[loc][date_str] = 0

        item_query = get_normal_item_query(data_date)
        item_query = item_query.iterator()
        for item in item_query:
            item_loc = item.rack_location.loc
            customer_code = item.customer_code
            if all_status:
                item_sku_dic["All"][date_str][customer_code] = True
            if item_loc in data:
                item_sku_dic[item_loc][date_str][customer_code] = True

    for loc in item_sku_dic:
        for date_str in item_sku_dic[loc]:
            data[loc][date_str] = len(item_sku_dic[loc][date_str])

    return data

def items_shipped_over_time(request):
    data = {}

    date_ids = request.GET.getlist(elements_dictionary["multiple_dates"] + "[]")
    locs = request.GET.getlist(elements_dictionary["multiple_locs"] + "[]")

    filter_value = request.GET.get(elements_dictionary["filter_value"])
    filter_option = request.GET.get(elements_dictionary["filter_option"])

    if len(locs) == 0:
        locs = ["All", ]

    if "All" in locs:
        all_status = True
    else:
        all_status = False

    for i in range(len(locs)):
        loc = locs[i]
        data[loc] = {}

    for date_id in date_ids:
        data_date = DataDate.objects.get(id=date_id)
        date_str = data_date.date.timestamp() * 1000
        for loc in data:
            data[loc][date_str] = 0

        item_query = get_normal_item_query(data_date)
        item_query = get_item_query_filter(item_query, filter_option, filter_value)
        item_query = item_query.iterator()
        for item in item_query:
            item_loc = item.rack_location.loc
            total_items = item.ship_quantity
            if all_status:
                data["All"][date_str] += total_items
            if item_loc in data:
                data[item_loc][date_str] += total_items
    return data