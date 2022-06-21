(function ( $ ) {
    var fnTextOptionWrap = function(option) {
        return `<div class="lsp-option-wrap style-text ${option.selected ? 'active' : ''} ${option.column_start ? 'column-start' : ''} ${option.column_end ? 'column-end' : ''}" style="width:${option.btn_width}%" option-value="${option.value}">
                    <div class="lsp-option-wrap-style-text" style="height:${option.btn_height}">
                        <span class="lsp-option-wrap-style-text__text">${option.text}</span>
                    </div>
                </div>`
    }

    var fnIconOptionWrap = function(option) {
        return `<div class="lsp-option-wrap style-icon ${option.selected ? 'active' : ''} ${option.column_start ? 'column-start' : ''} ${option.column_end ? 'column-end' : ''}" style="width:${option.btn_width}%" option-value="${option.value}">
                    <div class="lsp-option-wrap-style-icon" style="height:${option.btn_height}">
                        <div class="lsp-option-wrap-style-icon-wrap">
                            <img class="svg-img" data-src="${option.icon}">
                        </div>
                    </div>
                </div>`
    }

    var fnIconTextOptionWrap = function(option) {
        return `<div class="lsp-option-wrap style-icon-text ${option.selected ? 'active' : ''} ${option.column_start ? 'column-start' : ''} ${option.column_end ? 'column-end' : ''}" style="width:${option.btn_width}%" option-value="${option.value}">
                    <div class="lsp-option-wrap-style-icon-text">
                        <div class="lsp-option-wrap-style-icon-text-icon-block"  style="height:${option.btn_height}">
                            <img class="svg-img" data-src="${option.icon}">
                        </div>
                        <div class="lsp-option-wrap-style-icon-text-text-block">
                            <span>${option.text}</span>
                        </div>
                    </div>
                </div>`
    }

    async function loadSvgImages(dom_container) {
        var svg_images = $(dom_container).find('.svg-img');
        for(var index = 0; index < svg_images.length; index++) {
            await fetch($(svg_images[index]).attr('data-src')).then(resp => resp.text()).then(resp => {
                $(svg_images[index]).after(resp);
            });
        }
    }

    function setDefaultSelect(dom_container) {
        if($(dom_container).find('.active').length == 0) {
            $(dom_container).find('.lsp-option-wrap').first().addClass('active');
        }
    }

    $.fn.lineSelectorPicker = function(options) {
        var options_default = {
            total_width: '314px',
            btn_height: '46px',
            // columns: 3,
            style: 'text', // text, icon, icon-text
        };

        var options_apply = $.extend(options_default, options);
        var html_lsp = '';
        var options = $(this).find('option');
        for(var index = 0; index < options.length; index ++) {

            var columns = options.length;

            if(options_apply.hasOwnProperty('columns')) {
                columns = options_apply['columns'];
            }

            if(options_apply.style == 'text') {
                if(columns > 3) {
                    columns = 3;
                }
            }

            if(options_apply.style == 'icon') {
                if(columns > 6) {
                    columns = 6;
                }
            }

            if(options_apply.style == 'icon-text') {
                if(columns > 2) {
                    columns = 2;
                }
            }

            console.log("columns:", columns);
            var option = {
                value: $(options[index]).attr('value'),
                text: $(options[index]).text(),
                icon: $(options[index]).attr('icon') != 'undefined' ? $(options[index]).attr('icon') : null,
                selected: typeof $(options[index]).attr('selected') != 'undefined',

                btn_height: options_apply.btn_height,
                btn_width: 100 / columns,

                column_start: (index % columns == 0),
                column_end: (index % columns == (columns - 1)) || (index == (options.length - 1)),
            };

            if(options_apply.style == 'text') {
                html_lsp += fnTextOptionWrap(option);
            }

            if(options_apply.style == 'icon') {
                html_lsp += fnIconOptionWrap(option);
            }

            if(options_apply.style == 'icon-text') {
                html_lsp += fnIconTextOptionWrap(option);
            }
        }

        var select_origin = this;
        $(select_origin).hide();
        var dom_container_id = Date.now();
        $(select_origin).after(`<div class="lsp-container" id="lsp_container_${dom_container_id}" style="width:${options_apply.total_width}" option-style="${options_apply.style}">${html_lsp}</div>`)
        
        var dom_container = $('#lsp_container_' + dom_container_id);

        // loading svg files
        loadSvgImages(dom_container);

        // set default selected
        setDefaultSelect(dom_container);

        $(select_origin).on('change', function() {
            // console.log('change...', $(this).val());
            $(dom_container).find('.lsp-option-wrap').removeClass('active');
            $(dom_container).find('.lsp-option-wrap[option-value="' + $(this).val() + '"]').addClass('active');
        })

        $(dom_container).on('click', '.lsp-option-wrap', function() {
            $(dom_container).find('.lsp-option-wrap').removeClass('active');
            $(this).addClass('active');

            $(select_origin).val($(this).attr('option-value'));

            if(options_apply.onChange != 'undefined') {
                options_apply.onChange($(this).attr('option-value'));
            }
        })
        return this;
    };
}(jQuery));