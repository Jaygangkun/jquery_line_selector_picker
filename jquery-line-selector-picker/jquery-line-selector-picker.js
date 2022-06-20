(function ( $ ) {
    var lsp_icons = {
        // small icons
        'arrow_circle_right' : {
            normal: '/small/arrow_circle_right.svg',
            hover: '/small/arrow_circle_right_hover.svg'
        },
        'arrow_forward' : {
            normal: '/small/arrow_forward.svg',
            hover: '/small/arrow_forward_hover.svg'
        },
        'arrow_forward2' : {
            normal: '/small/arrow_forward2.svg',
            hover: '/small/arrow_forward2_hover.svg'
        },
        'desktop' : {
            normal: '/small/desktop.svg',
            hover: '/small/desktop_hover.svg'
        },
        'icon' : {
            normal: '/small/icon.svg',
            hover: '/small/icon_hover.svg'
        },
        'mobiledesktop' : {
            normal: '/small/mobiledesktop.svg',
            hover: '/small/mobiledesktop_hover.svg'
        },
        'none' : {
            normal: '/small/none.svg',
            hover: '/small/none_hover.svg'
        },

        // big icons
        'dots' : {
            normal: '/big/dots.svg',
            hover: '/big/dots_hover.svg'
        },
        'dots-to-number' : {
            normal: '/big/dots-to-number.svg',
            hover: '/big/dots-to-number_hover.svg'
        },
        'fill' : {
            normal: '/big/fill.svg',
            hover: '/big/fill_hover.svg'
        },
        'fit' : {
            normal: '/big/fit.svg',
            hover: '/big/fit_hover.svg'
        },
        'good-looking' : {
            normal: '/big/good-looking.svg',
            hover: '/big/good-looking_hover.svg'
        },
        'line' : {
            normal: '/big/line.svg',
            hover: '/big/line_hover.svg'
        },
        'nope' : {
            normal: '/big/nope.svg',
            hover: '/big/nope_hover.svg'
        },
        'number' : {
            normal: '/big/number.svg',
            hover: '/big/number_hover.svg'
        },
        'stories' : {
            normal: '/big/stories.svg',
            hover: '/big/stories_hover.svg'
        },
    }

    var fnTextOptionWrap = function(option) {
        return `<div class="lsp-option-wrap ${option.selected ? 'active' : ''} ${option.column_start ? 'column-start' : ''} ${option.column_end ? 'column-end' : ''}" style="width:${option.btn_width}%" option-value="${option.value}">
                    <div class="lsp-option-wrap-style-text" style="height:${option.btn_height}">
                        <span class="lsp-option-wrap-style-text__text">${option.text}</span>
                    </div>
                </div>`
    }

    var fnIconOptionWrap = function(option) {
        return `<div class="lsp-option-wrap ${option.selected ? 'active' : ''} ${option.column_start ? 'column-start' : ''} ${option.column_end ? 'column-end' : ''}" style="width:${option.btn_width}%" option-value="${option.value}">
                    <div class="lsp-option-wrap-style-icon" style="height:${option.btn_height}">
                        <div class="lsp-option-wrap-style-icon-wrap">
                            <img class="svg-img" data-src="${option.icon}">
                        </div>
                    </div>
                </div>`
    }

    var fnIconTextOptionWrap = function(option) {
        return `<div class="lsp-option-wrap ${option.selected ? 'active' : ''} ${option.column_start ? 'column-start' : ''} ${option.column_end ? 'column-end' : ''}" style="width:${option.btn_width}%" option-value="${option.value}">
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
            columns: 3,
            style: 'text', // text, icon, icon-text
        };

        var options_apply = $.extend(options_default, options);
        var html_lsp = '';
        var options = $(this).find('option');
        for(var index = 0; index < options.length; index ++) {

            var columns = options.length;

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

            var option = {
                value: $(options[index]).attr('value'),
                text: $(options[index]).text(),
                icon: $(options[index]).attr('icon') != 'undefined' ? $(options[index]).attr('icon') : null,
                selected: typeof $(options[index]).attr('selected') != 'undefined',

                btn_height: options_apply.btn_height,
                btn_width: 100 / columns,

                column_start: (index % columns == 0),
                column_end: (index % columns == (columns - 1)),
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