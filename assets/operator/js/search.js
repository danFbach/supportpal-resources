$(document.body).ready(function() {
    var currentCategory;
    var term;

    // Creating custom function based on autocomplete
    $.widget( "custom.searchcomplete", $.ui.autocomplete, {
        _create: function() {
          this._super();
          this.widget().menu( "option", "items", "> :not(.ui-autocomplete-category)" );
        },
        _renderMenu: function(ul, items) {
            var that = this;
            currentCategory = "";
            $.each(items, function(index, item) {
                if (item.category !== currentCategory) {
                    currentCategory = item.category;
                    $("<div class='search-title ui-autocomplete-category'>")
                        .attr( "aria-label", item.category + " : " + item.label)
                        .data('ui-autocomplete-item', item)
                        .append('<strong>' + item.category + '</strong>')
                        .appendTo(ul);
                }

                that._renderItemData(ul, item);
            });
        },
        _renderItemData: function(ul, item) {
            if (item.id !== 0 && item.id !== '') {
                var $string = $("<a href=" + item.link + "><span class='result-id'></span>&nbsp; <span class='result-name'>" +
                    "</span><br><span class='result-secondary'></span></a>");
                $string.find('.result-id').html("#" + item.id.toString().replace(new RegExp("(" + term + ")", "gi"), '<strong>$1</strong>'));
                $string.find('.result-name').html(item.label.replace(new RegExp("(" + term + ")", "gi"), '<strong>$1</strong>'));
                $string.find('.result-secondary').html(item.secondary.replace(new RegExp("(" + term + ")", "gi"), '<strong>$1</strong>'));
                return $("<li class='search-option'>")
                    .data('ui-autocomplete-item', item)
                    .append($string)
                    .appendTo(ul);
            } else if (item.id === '') {
                return $("<li class='all-results'>")
                    .data('ui-autocomplete-item', item)
                    .append("<a href=" + item.link + ">" + item.label + "</a>")
                    .appendTo(ul);
            } else {
                return $("<li class='no-results'>")
                    .data('ui-autocomplete-item', item)
                    .append(item.label)
                    .appendTo(ul);
            }
        }
    });

    // Run function on search field
    $('.search').searchcomplete({
        source: function(request, response) {
            term = request.term;
            if (term.substring(0, 1) === '#') {
                // Remove # from start when searching
                term = term.substring(1);
            }
            if (term.length > 1) {
                // Only search if term is two characters or more
                $.ajax({
                    url: laroute.route('core.operator.search_preview'),
                    dataType: "json",
                    data: { query: term },
                    method: 'POST',
                    success: function(result) {
                        // In case there is no results
                        if (result.status == "error" || result.data.length === 0) {
                            result.data = [];
                            result.data.push({
                                id: 0,
                                label: Lang.get('messages.no_results'),
                                secondary: "",
                                link: "",
                                category: ""
                            });
                        }

                        // Display results
                        response(result.data);
                    }
                }).always(function() {
                    // Remove spinning circle
                    $('.search').removeClass('ui-autocomplete-loading');
                });
            } else {
                // Remove spinning circle
                $('.search').removeClass('ui-autocomplete-loading');
            }
        },
        autoFocus: true,
        minLength: 0,
        appendTo: ".headerSearch",
        select: function( event, ui ) {
            // Don't set the search input box to the selected value
            return false;
        }
    });
});