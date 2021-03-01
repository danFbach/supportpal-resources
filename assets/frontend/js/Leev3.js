$(document).ready(function () {

    $('.list_expand').on('click', function () { if ($(this).hasClass('active')) { $(("#ul-").concat($(this).attr('id').split('-')[1])).slideUp(); } else { $(("#ul-").concat($(this).attr('id').split('-')[1])).slideDown(); } $(this).toggleClass('active'); });

    FilterCategories($('#kb_cat_list'));

    function FilterCategories(element) {
        element.children().each(function () {
            id = "#ul-" + $(this).attr('id').split('-')[1];
            if ($(id) != undefined && $(id).find('li').length > 0) {
                $(("#expand-").concat($(this).attr('id').split('-')[1])).addClass('has_kids');
                $(id).addClass('has_kids');
                FilterCategories($(id));
            }
        });
    }
});