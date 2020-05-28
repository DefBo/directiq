/*
Template Name: Ubold - Responsive Bootstrap 4 Admin Dashboard
Author: CoderThemes
Website: https://coderthemes.com/
Contact: support@coderthemes.com
File: Layout
*/


/**
 * LeftSidebar
 * @param {*} $ 
 */
!function ($) {
    'use strict';

    var LeftSidebar = function () {
        this.body = $('body'),
        this.window = $(window)
    };

    /**
     * Reset the theme
     */
    LeftSidebar.prototype._reset = function() {
        this.body.removeAttr('data-sidebar-color');
        this.body.removeAttr('data-sidebar-size');
        this.body.removeAttr('data-sidebar-showuser');
    },

    /**
     * Changes the color of sidebar
     * @param {*} color 
     */
    LeftSidebar.prototype.changeColor = function(color) {
        this.body.attr('data-sidebar-color', color);
        this.parent.updateConfig("sidebar", { "color": color });
    },

    /**
     * Changes the size of sidebar
     * @param {*} size 
     */
    LeftSidebar.prototype.changeSize = function(size) {
        this.body.attr('data-sidebar-size', size);
        this.parent.updateConfig("sidebar", { "size": size });
    },

    /**
     * Toggle User information
     * @param {*} showUser 
     */
    LeftSidebar.prototype.showUser = function(showUser) {
        this.body.attr('data-sidebar-showuser', showUser);
        this.parent.updateConfig("sidebar", { "showuser": showUser });
    },

    /**
     * Initilizes the menu
     */
    LeftSidebar.prototype.initMenu = function() {
        var self = this;

        var layout = $.LayoutThemeApp.getConfig();
        var sidebar = $.extend({}, layout ? layout.sidebar: {});
        var defaultSidebarSize = sidebar.size ? sidebar.size : 'default';

        // resets everything
        this._reset();

        // Left menu collapse
        $('.button-menu-mobile').on('click', function (event) {
            event.preventDefault();
            var sidebarSize = self.body.attr('data-sidebar-size');
            if (self.window.width() >= 993) {
                if (sidebarSize === 'condensed') {
                    self.changeSize(defaultSidebarSize);
                } else {
                    self.changeSize('condensed');
                }
            } else {
                self.changeSize(defaultSidebarSize);
                self.body.toggleClass('sidebar-enable');
            }
        });

        // sidebar - main menu
        if ($("#side-menu").length) { 
            var navCollapse = $('#side-menu li .collapse');

            // open one menu at a time only
            navCollapse.on({
                'show.bs.collapse': function (event) {
                    var parent = $(event.target).parents('.collapse.show');
                    $('#side-menu .collapse.show').not(parent).collapse('hide');
                }
            });

            // activate the menu in left side bar (Vertical Menu) based on url
            $("#side-menu a").each(function () {
                var pageUrl = window.location.href.split(/[?#]/)[0];
                if (this.href == pageUrl) {
                    $(this).addClass("active");
                    $(this).parent().addClass("menuitem-active");
                    $(this).parent().parent().parent().addClass("show");
                    $(this).parent().parent().parent().parent().addClass("menuitem-active"); // add active to li of the current link
                    
                    var firstLevelParent = $(this).parent().parent().parent().parent().parent().parent();
                    if (firstLevelParent.attr('id') !== 'sidebar-menu')
                        firstLevelParent.addClass("show");
                    
                    $(this).parent().parent().parent().parent().parent().parent().parent().addClass("menuitem-active");
                    
                    var secondLevelParent = $(this).parent().parent().parent().parent().parent().parent().parent().parent().parent();
                    if (secondLevelParent.attr('id') !== 'wrapper')
                        secondLevelParent.addClass("show");

                    var upperLevelParent = $(this).parent().parent().parent().parent().parent().parent().parent().parent().parent().parent();
                    if (!upperLevelParent.is('body'))
                        upperLevelParent.addClass("menuitem-active");
                }
            });
        }


        // handling two columns menu if present
        var twoColSideNav = $("#two-col-sidenav-main");
        if (twoColSideNav.length) {
            var twoColSideNavItems = $("#two-col-sidenav-main .nav-link");
            var sideSubMenus = $(".twocolumn-menu-item");

            // showing/displaying tooltip based on screen size
            if (this.window.width() >= 585) {
                twoColSideNavItems.tooltip('enable');
            } else {
                twoColSideNavItems.tooltip('disable');
            }

            var nav = $('.twocolumn-menu-item .nav-second-level');
            var navCollapse = $('#two-col-menu li .collapse');

            // open one menu at a time only
            navCollapse.on({
                'show.bs.collapse': function () {
                    var nearestNav = $(this).closest(nav).closest(nav).find(navCollapse);
                    if (nearestNav.length)
                        nearestNav.not($(this)).collapse('hide');
                    else
                        navCollapse.not($(this)).collapse('hide');
                }
            });

            twoColSideNavItems.on('click', function (e) {
                var target = $($(this).attr('href'));

                if (target.length) {
                    e.preventDefault();

                    twoColSideNavItems.removeClass('active');
                    $(this).addClass('active');

                    sideSubMenus.removeClass("d-block");
                    target.addClass("d-block");

                    // showing full sidebar if menu item is clicked
                    $.LayoutThemeApp.leftSidebar.changeSize('default');
                    return false;
                }
                return true;
            });

            // activate menu with no child
            var pageUrl = window.location.href.split(/[?#]/)[0];
            twoColSideNavItems.each(function () {
                if (this.href == pageUrl) {
                    $(this).addClass('active');
                }
            });


            // activate the menu in left side bar (Two column) based on url
            $("#two-col-menu a").each(function () {
                if (this.href == pageUrl) {
                    $(this).addClass("active");
                    $(this).parent().addClass("menuitem-active");
                    $(this).parent().parent().parent().addClass("show");
                    $(this).parent().parent().parent().parent().addClass("menuitem-active"); // add active to li of the current link

                    var firstLevelParent = $(this).parent().parent().parent().parent().parent().parent();
                    if (firstLevelParent.attr('id') !== 'sidebar-menu')
                        firstLevelParent.addClass("show");

                    $(this).parent().parent().parent().parent().parent().parent().parent().addClass("menuitem-active");

                    var secondLevelParent = $(this).parent().parent().parent().parent().parent().parent().parent().parent().parent();
                    if (secondLevelParent.attr('id') !== 'wrapper')
                        secondLevelParent.addClass("show");

                    var upperLevelParent = $(this).parent().parent().parent().parent().parent().parent().parent().parent().parent().parent();
                    if (!upperLevelParent.is('body'))
                        upperLevelParent.addClass("menuitem-active");

                    // opening menu
                    var matchingItem = null;
                    var targetEl = '#' + $(this).parents('.twocolumn-menu-item').attr("id");
                    $("#two-col-sidenav-main .nav-link").each(function () {
                        if ($(this).attr('href') === targetEl) {
                            matchingItem = $(this);
                        }
                    });
                    if (matchingItem) matchingItem.trigger('click');
                }
            });
        }
    },

    /**
     * Initilize the left sidebar size based on screen size
     */
    LeftSidebar.prototype.initLayout = function() {
        // in case of small size, activate the small menu
        if ((this.window.width() >= 768 && this.window.width() <= 1028) || this.body.data('keep-enlarged')) {
            this.changeSize('condensed');
        } else {
            this.changeSize('default');
        }
    },

    /**
     * Initilizes the menu
     */
    LeftSidebar.prototype.init = function() {
        var self = this;
        this.initMenu();
        this.initLayout();

        // on window resize, make menu flipped automatically
        this.window.on('resize', function (e) {
            e.preventDefault();
            self.initLayout();
        });
    },
  
    $.LeftSidebar = new LeftSidebar, $.LeftSidebar.Constructor = LeftSidebar
}(window.jQuery),


/**
 * Topbar
 * @param {*} $ 
 */
function ($) {
    'use strict';

    var Topbar = function () {
        this.body = $('body'),
        this.window = $(window)
    };

    /**
     * Initilizes the menu
     */
    Topbar.prototype.initMenu = function() {
        // Serach Toggle
        $('#top-search').on('click', function (e) {
            $('#search-dropdown').addClass('d-block');
        });

        // hide search on opening other dropdown
        $('.topbar-dropdown').on('show.bs.dropdown', function () {
            $('#search-dropdown').removeClass('d-block');
        });

        //activate the menu in topbar(horizontal menu) based on url
        $(".navbar-nav a").each(function () {
            var pageUrl = window.location.href.split(/[?#]/)[0];
            if (this.href == pageUrl) { 
                $(this).addClass("active");
                $(this).parent().addClass("active");
                $(this).parent().parent().addClass("active");
                $(this).parent().parent().parent().addClass("active");
                $(this).parent().parent().parent().parent().addClass("active");
                var el = $(this).parent().parent().parent().parent().addClass("active").prev();
                if (el.hasClass("nav-link"))
                    el.addClass('active');
            }
        });

        // Topbar - main menu
        $('.navbar-toggle').on('click', function (event) {
            $(this).toggleClass('open');
            $('#navigation').slideToggle(400);
        });
    },

    /**
     * Changes the color of topbar
     * @param {*} color 
     */
    Topbar.prototype.changeColor = function(color) {
        this.body.attr('data-topbar-color', color);
        this.parent.updateConfig("topbar", { "color": color });
    },

    /**
     * Initilizes the menu
     */
    Topbar.prototype.init = function() {
        this.initMenu();
    },
    $.Topbar = new Topbar, $.Topbar.Constructor = Topbar
}(window.jQuery),


/**
 * RightBar
 * @param {*} $ 
 */
function ($) {
    'use strict';

    var RightBar = function () {
        this.body = $('body'),
        this.window = $(window)
    };

    /** 
     * Select the option based on saved config
    */
   RightBar.prototype.selectOptionsFromConfig = function() {
       var self = this;

        var config = self.layout.getConfig();
        
        if (config) {
            $('input[type=radio][name=color-scheme-mode][value=' + config.mode + ']').prop('checked', true);
            $('input[type=radio][name=width][value=' + config.width + ']').prop('checked', true);
            $('input[type=radio][name=menus-position][value=' + config.menuPosition + ']').prop('checked', true);

            $('input[type=radio][name=leftsidebar-color][value=' + config.sidebar.color + ']').prop('checked', true);
            $('input[type=radio][name=leftsidebar-size][value=' + config.sidebar.size + ']').prop('checked', true);
            $('input[type=checkbox][name=leftsidebar-user]').prop('checked', config.sidebar.showuser);

            $('input[type=radio][name=topbar-color][value=' + config.topbar.color + ']').prop('checked', true);
        }
    },
  
    /**
     * Toggles the right sidebar
     */
    RightBar.prototype.toggleRightSideBar = function() {
        var self = this;
        self.body.toggleClass('right-bar-enabled');
        self.selectOptionsFromConfig();
    },

    /**
     * Initilizes the right side bar
     */
    RightBar.prototype.init = function() {
        var self = this;

        // right side-bar toggle
        $(document).on('click', '.right-bar-toggle', function () {
            self.toggleRightSideBar();
        });

        $(document).on('click', 'body', function (e) {
            // hiding search bar
            if($(e.target).closest('#top-search').length !== 1) {
                $('#search-dropdown').removeClass('d-block');
            }
            if ($(e.target).closest('.right-bar-toggle, .right-bar').length > 0) {
                return;
            }

            if ($(e.target).closest('.left-side-menu, .side-nav').length > 0 || $(e.target).hasClass('button-menu-mobile')
                || $(e.target).closest('.button-menu-mobile').length > 0) {
                return;
            }

            $('body').removeClass('right-bar-enabled');
            $('body').removeClass('sidebar-enable');
            return;
        });

        // overall color scheme
        $('input[type=radio][name=color-scheme-mode]').change(function () {
            self.layout.changeMode($(this).val());
        });

        // width mode
        $('input[type=radio][name=width]').change(function () {
            self.layout.changeLayoutWidth($(this).val());
        });

        // menus-position
        $('input[type=radio][name=menus-position]').change(function () {
            self.layout.changeMenuPositions($(this).val());
        });

        // left sidebar color
        $('input[type=radio][name=leftsidebar-color]').change(function () {
            self.layout.leftSidebar.changeColor($(this).val());
        });

        // left sidebar size
        $('input[type=radio][name=leftsidebar-size]').change(function () {
            self.layout.leftSidebar.changeSize($(this).val());
        });

        // left sidebar user information
        $('input[type=checkbox][name=leftsidebar-user]').change(function (e) {
            self.layout.leftSidebar.showUser(e.target.checked);
        });

        // topbar
        $('input[type=radio][name=topbar-color]').change(function () {
            self.layout.topbar.changeColor($(this).val());
        });

        // reset
        $('#resetBtn').on('click', function (e) {
            e.preventDefault();
            // reset to default
            self.layout.reset();
            self.selectOptionsFromConfig();
        });
    },

    $.RightBar = new RightBar, $.RightBar.Constructor = RightBar
}(window.jQuery),


/**
 * Layout and theme manager
 * @param {*} $ 
 */

function ($) {
    'use strict';

    // Layout and theme manager

    var LayoutThemeApp = function () {
        this.body = $('body'),
        this.window = $(window),
        this.config = {},
        // styles
        this.defaultBSStyle = $("#bs-default-stylesheet"),
        this.defaultAppStyle = $("#app-default-stylesheet"),
        this.darkBSStyle = $("#bs-dark-stylesheet"),
        this.darkAppStyle = $("#app-dark-stylesheet");
    };

    /**
    * Preserves the config in memory
    */
    LayoutThemeApp.prototype._saveConfig = function(newConfig) {
        this.config = $.extend(this.config, newConfig);
        // NOTE: You can make ajax call here to save preference on server side or localstorage as well
    },

    /**
     * Update the config for given config
     * @param {*} param 
     * @param {*} config 
     */
    LayoutThemeApp.prototype.updateConfig = function(param, config) {
        var newObj = {};
        if (typeof config === 'object' && config !== null) {
            var originalParam = this.config[param];
            newObj[param] = $.extend(originalParam, config);
        } else {
            newObj[param] = config;
        }
        this._saveConfig(newObj);
    }

    /**
     * Loads the config - takes from body if available else uses default one
     */
    LayoutThemeApp.prototype.loadConfig = function() {
        var bodyConfig = JSON.parse(this.body.attr('data-layout') ? this.body.attr('data-layout') : '{}');
        
        var config = $.extend({}, {
            mode: "light",
            width: "fluid",
            menuPosition: 'fixed',
            sidebar: {
                color: "light",
                size: "default",
                showuser: false
            },
            topbar: {
                color: "dark"
            },
            showRightSidebarOnPageLoad: false
        });
        if (bodyConfig) {
            config = $.extend({}, config, bodyConfig);
        };
        return config;
    },

    /**
    * Apply the config
    */
    LayoutThemeApp.prototype.applyConfig = function() {
        // getting the saved config if available
        this.config = this.loadConfig();

        // activate menus
        this.leftSidebar.init();
        this.topbar.init();

        this.leftSidebar.parent = this;
        this.topbar.parent = this;


        // mode
        this.changeMode(this.config.mode);

        // width
        this.changeLayoutWidth(this.config.width);

        // menu position
        this.changeMenuPositions(this.config.menuPosition);

        // left sidebar
        var sidebarConfig = $.extend({}, this.config.sidebar);
        this.leftSidebar.changeColor(sidebarConfig.color);
        this.leftSidebar.changeSize(sidebarConfig.size);
        this.leftSidebar.showUser(sidebarConfig.showuser);

        // topbar
        var topbarConfig = $.extend({}, this.config.topbar);
        this.topbar.changeColor(topbarConfig.color);
    },

    /**
     * Toggle dark or light mode
     * @param {*} mode 
     */
    LayoutThemeApp.prototype.changeMode = function(mode) {
        // sets the theme
        switch (mode) {
            case "dark": {
                this.defaultBSStyle.attr("disabled", true);
                this.defaultAppStyle.attr("disabled", true);

                this.darkBSStyle.attr("disabled", false);
                this.darkAppStyle.attr("disabled", false);

                this.leftSidebar.changeColor("dark");
                this._saveConfig({ mode: mode, sidebar: $.extend({}, this.config.sidebar, { color: 'dark' }) });
                break;
            }
            default: {
                this.defaultBSStyle.attr("disabled", false);
                this.defaultAppStyle.attr("disabled", false);

                this.darkBSStyle.attr("disabled", true);
                this.darkAppStyle.attr("disabled", true);
                this.leftSidebar.changeColor("light");
                this._saveConfig({ mode: mode, sidebar: $.extend({}, this.config.sidebar, { color: 'light' }) });
                break;
            }
        }
        
        this.rightBar.selectOptionsFromConfig();
    }

    /**
     * Changes the width of layout
     */
    LayoutThemeApp.prototype.changeLayoutWidth = function(width) {
        switch (width) {
            case "boxed": {
                this.body.attr('data-layout-width', 'boxed');
                // automatically activating condensed
                $.LeftSidebar.changeSize("condensed");
                this._saveConfig({ width: width });
                break;
            }
            default: {
                this.body.attr('data-layout-width', 'fluid');
                // automatically activating provided size
                var bodyConfig = JSON.parse(this.body.attr('data-layout') ? this.body.attr('data-layout') : '{}');
                $.LeftSidebar.changeSize(bodyConfig && bodyConfig.sidebar ? bodyConfig.sidebar.size : "default");
                this._saveConfig({ width: width });
                break;
            }
        }
        this.rightBar.selectOptionsFromConfig();
    }

    /**
     * Changes menu positions
     */
    LayoutThemeApp.prototype.changeMenuPositions = function(position) {
        this.body.attr("data-layout-menu-position", position);
    }

    /**
     * Clear out the saved config
     */
    LayoutThemeApp.prototype.clearSavedConfig = function() {
        this.config = {};
    },

    /**
     * Gets the config
     */
    LayoutThemeApp.prototype.getConfig = function() {
        return this.config;
    },

    /**
     * Reset to default
     */
    LayoutThemeApp.prototype.reset = function() {
        this.clearSavedConfig();
        this.applyConfig();
    },

    /**
     * Init
     */
    LayoutThemeApp.prototype.init = function() {
        this.leftSidebar = $.LeftSidebar;
        this.topbar = $.Topbar;

        this.leftSidebar.parent = this;
        this.topbar.parent = this;

        // initilize the menu
        this.applyConfig();
    },

    $.LayoutThemeApp = new LayoutThemeApp, $.LayoutThemeApp.Constructor = LayoutThemeApp
}(window.jQuery);
/*
Template Name: Ubold - Responsive Bootstrap 4 Admin Dashboard
Author: CoderThemes
Website: https://coderthemes.com/
Contact: support@coderthemes.com
File: Main Js File
*/

function debounce(f, ms = 500) {
	let isCooldown = false;

	return function() {
		if (isCooldown) return;

		f.apply(this, arguments);

		isCooldown = true;

		setTimeout(() => (isCooldown = false), ms);
	};
}

const DEFAULT_SELECT_OPTIONS = {
	quality: [ 1, 2, 3, 4, 5 ],
	status: [ 'active', 'passive' ]
};

const DEFAULT_SELECT2_OPTIONS = {
	tags: [ 'tag1', 'tag2', 'tag3' ]
};

const PROXY_URL = 'https://cors-anywhere.herokuapp.com/';

const CORS_HEADER = {
	headers: {
		'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
	}
};

const TABLE_API = 'http://directiqsampledatastore-dev.us-east-1.elasticbeanstalk.com/api/custom';

const DEFAULT_DATA_TABLE_CONFIG = {
	scrollX: true,
	scrollCollapse: true,
	order: [],
	aoColumnDefs: [
		{
			bSortable: false,
			aTargets: [ 'nosort' ]
		}
	],
	sDom:
		't<"d-flex justify-content-between align-content-center diriq-table__bottom"l<"d-flex align-content-center"ip>>',
	oLanguage: {
		sLengthMenu: 'View _MENU_',
		sInfo: '_START_ – _END_ of _TOTAL_'
	},
	initComplete: function() {
		$('.diriq-table__wrapper').removeClass('loading');
	}
};

const FIXED_DATA_TABLE_CONFIG = {
	fixedColumns: {
		leftColumns: 2,
		rightColumns: 1
	}
};

const createDataTable = async (id, config, isFixedCollumns, isNewTable) => {
	const getData = async (url, options) => {
		const response = await fetch(url, options);
		return response.json();
	};
	const getTableData = (data) => {
		return data.rows.map((row) => {
			var draftData = [];
			data.columns.forEach((collumn, index) => {
				var draftRow = row.cells.find((cell) => cell.position === index);
				draftRow ? draftData.push(draftRow.value) : draftData.push('');
			});
			return draftData;
		});
	};

	const getSearchParams = () => {
		const params = { ...defaultSearchParams, ...globalSearchParams };
		return Object.keys(params)
			.map((keys) => `${keys}=${typeof params[keys] === 'object' ? '[' + params[keys] + ']' : params[keys]}`)
			.join('&');
	};

	const getCollumnTitles = (data) =>
		data.columns.map((collumn) => {
			if (collumn.name === 'quality')
				return {
					title: collumn.displayName,
					/*render: function(data, type, row, meta) {
						let renderElements = '<div class="quality__wrapper">';
						DEFAULT_SELECT_OPTIONS[collumn.name].forEach((item) => {
							renderElements += `<span class="${data >= item ? 'active ' : ''}quality__item"></span>`;
						});
						renderElements += '</div>';
						return renderElements;
					}*/
                    render: function(data, type, row, meta) {
                        let qualityIcon = '<div>';
                        let activeItemsCount = 0;
                        DEFAULT_SELECT_OPTIONS[collumn.name].forEach((item) => {
                            if (data >= item) {
                                activeItemsCount += 1;
							}
                            qualityIcon += `<span></span>`;
                        });
                        qualityIcon += '</div>';
                        qualityIcon = `<div class="quality-icon _${activeItemsCount}">` + qualityIcon + '</div>';
                        return qualityIcon;
                    }
				};
			return { title: collumn.displayName };
		});

	const setCurrentPagination = ({ pageSize, pageNumber, totalCount }) => {
		const data = {
			text: `${pageSize * pageNumber - pageSize + 1} - ${totalCount < pageSize * pageNumber
				? totalCount
				: pageSize * pageNumber} of ${totalCount}`,
			next: totalCount > pageSize * pageNumber,
			prev: pageNumber !== 1
		};

		const paginationString = tableWrapper.querySelector('#data-table_info');
		const paginationWrapper = paginationString.parentNode;
		const clonePaginationWrapper = paginationWrapper.cloneNode(true);
		paginationWrapper.parentNode.appendChild(clonePaginationWrapper);
		paginationWrapper.remove();

		tableWrapper.querySelector('#data-table_info').innerHTML = data.text;

		const paginationButtonPrevious = tableWrapper.querySelector('.paginate_button.previous');

		paginationButtonPrevious.addEventListener(
			'click',
			debounce(() => {
				globalSearchParams = {
					...globalSearchParams,
					pageNumber: pageNumber - 1
				};
				filterTable();
			})
		);

		data.prev
			? paginationButtonPrevious.classList.remove('disabled')
			: paginationButtonPrevious.classList.add('disabled');

		const paginationButtonNext = tableWrapper.querySelector('.paginate_button.next');
		paginationButtonNext.addEventListener(
			'click',
			debounce(() => {
				globalSearchParams = {
					...globalSearchParams,
					pageNumber: pageNumber + 1
				};
				filterTable();
			})
		);
		data.next ? paginationButtonNext.classList.remove('disabled') : paginationButtonNext.classList.add('disabled');
	};

	const generateSearchSelect = (collumn, parrent, isMuliple = false) => {
		const select = document.createElement('select');
		!isMuliple && select.classList.add('filter-input');
		select.setAttribute("required", "");
		select.name = collumn.name;

		if (!isMuliple) {
			const defaultOption = document.createElement('option');
			defaultOption.text = `Select ${collumn.displayName}`;
			defaultOption.value = '';
			defaultOption.selected = true;
			select.options.add(defaultOption);
		} else {
			select.multiple = 'multiple';
			select.setAttribute("data-placeholder", "Select Tags");
			select.classList.add('form-control', 'select2-hidden-accessible');
		}

		const options = isMuliple ? DEFAULT_SELECT2_OPTIONS[collumn.name] : DEFAULT_SELECT_OPTIONS[collumn.name];
		options.forEach((item) => {
			const option = document.createElement('option');
			option.value = item;
			option.text = item;
			select.options.add(option);
		});
		parrent.appendChild(select);
	};

	const filterTable = async (element = null, isDynamicTable = false) => {
		if (element) {
			const value = element.value.length > 2 ? element.value : '';

			if (!isDynamicTable) {
				table.column($(element).data('index')).search(value).draw();
				return;
			}
		}
		console.log(getSearchParams());
		fetchedData = await getData(`${PROXY_URL}${TABLE_API}?${getSearchParams()}`, {
			method: 'POST',
			...CORS_HEADER
		});

		const tableData = getTableData(fetchedData);
		table.clear();
		table.rows.add(tableData).draw();
		setCurrentPagination(fetchedData);
	};

	if (isFixedCollumns) {
		config = { ...FIXED_DATA_TABLE_CONFIG, ...config };
	}

	let defaultSearchParams = null;
	let globalSearchParams = null;
	let fetchedData = null;

	const tableElement = document.querySelector(id);
	const tableWrapper = tableElement.closest('.diriq-table__wrapper');

	if (isNewTable) {
		if (tableWrapper) {
			tableWrapper.classList.add('loading');
		}

		fetchedData = await getData(`${PROXY_URL}${TABLE_API}`, {
			...CORS_HEADER
		});

		if (!fetchedData) return;

		defaultSearchParams = fetchedData.columns.reduce((accumulator, collumn) => {
			const collumnName = collumn.keyId === 0 ? collumn.name : `extra[${collumn.keyId}]`;
			return { ...accumulator, [collumnName]: '' };
		}, {});

		config = {
			...config,
			data: getTableData(fetchedData),
			columns: getCollumnTitles(fetchedData)
		};

		// create footer in dynamic dataTable
		const tFoot = document.createElement('tfoot');
		const tFootTr = document.createElement('tr');

		fetchedData.columns.forEach((collumn, index) => {
			const th = document.createElement('th');

			if (Object.keys(DEFAULT_SELECT_OPTIONS).some((item) => collumn.name == item)) {
				generateSearchSelect(collumn, th);
			} else if (Object.keys(DEFAULT_SELECT2_OPTIONS).some((item) => collumn.name == item)) {
				generateSearchSelect(collumn, th, true);
			} else {
				const input = document.createElement('input');
				input.classList.add('filter-input');
				input.placeholder = `Search ${collumn.displayName}`;
				input.type = 'text';
				input.name = collumn.keyId === 0 ? collumn.name : `extra[${collumn.keyId}]`;
				th.appendChild(input);
			}

			tFootTr.appendChild(th);
		});

		tFoot.appendChild(tFootTr);
		tableElement.appendChild(tFoot);
	}

	var table = $(id).DataTable({ ...DEFAULT_DATA_TABLE_CONFIG, ...config });

	if (isNewTable) {
		$('.select2-hidden-accessible').select2();
		$('.select2-hidden-accessible').on(
			'select2:select',
			debounce((e) => {
				const value = $(e.target).val();
				console.log(value);

				globalSearchParams = {
					...globalSearchParams,
					[e.target.name]: value,
					pageNumber: 1
				};

				filterTable(e.target, isNewTable);
			})
		);

		const tFootInputsWrapper = tableWrapper.querySelectorAll('.dataTables_scrollFoot th');

		tFootInputsWrapper.forEach((inputWrapper, i) => {
			const input = inputWrapper.querySelector('input.filter-input');
			const select = inputWrapper.querySelector('select.filter-input');
			if (input) {
				let canSearch = false;

				input.dataset.id = i;

				input.addEventListener(
					'input',
					debounce(() => {
						if (input.value.length > 2) {
							canSearch = true;
							globalSearchParams = {
								...globalSearchParams,
								[input.name]: input.value,
								pageNumber: 1
							};
							filterTable(input, isNewTable);
						} else if (canSearch) {
							globalSearchParams = {
								...globalSearchParams,
								[input.name]: '',
								pageNumber: 1
							};
							filterTable(input, isNewTable);
							canSearch = false;
						}
					})
				);
			} else if (select) {
				select.addEventListener(
					'change',
					debounce((e) => {
						const value = e.target.value;

						globalSearchParams = {
							...globalSearchParams,
							[e.target.name]: value,
							pageNumber: 1
						};

						filterTable(e.target, isNewTable);
					})
				);
			}
		});

		setCurrentPagination(fetchedData);

		const lengthSelect = tableWrapper.querySelector('.dataTables_length select');

		lengthSelect.addEventListener(
			'change',
			debounce((e) => {
				const value = Number.parseInt(e.target.value);

				globalSearchParams = {
					...globalSearchParams,
					pageSize: value,
					pageNumber:
						value * fetchedData.pageNumber > fetchedData.totalCount
							? Math.round(fetchedData.totalCount / value)
							: fetchedData.pageNumber
				};

				filterTable(e.target, isNewTable);
			})
		);
	}

	if ($('.diriq-table__wrapper._with-endpoint').length > 0) {
		$('.diriq-table__wrapper._with-endpoint').each(function() {
			var tableWrapper = this;
			$(tableWrapper).addClass('loading');
		});
	}

	adjustDataTableColumns();

	$('.datatable._contact-details-lists input:checkbox').change(function() {
		if ($(this).is(':checked')) {
			$(this).closest('tr').addClass('_active');
		} else {
			$(this).closest('tr').removeClass('_active');
		}
	});

	$('.diriq-table__filter-btn').click(function() {
		$('body').toggleClass('_filter-visible');
	});
};

!(function($) {
	'use strict';

	var Components = function() {};

	//initializing tooltip
	(Components.prototype.initTooltipPlugin = function() {
		$.fn.tooltip && $('[data-toggle="tooltip"]').tooltip();
	}),
		//initializing popover
		(Components.prototype.initPopoverPlugin = function() {
			$.fn.popover && $('[data-toggle="popover"]').popover();
		}),
		//initializing toast
		(Components.prototype.initToastPlugin = function() {
			$.fn.toast && $('[data-toggle="toast"]').toast();
		}),
		//initializing form validation
		(Components.prototype.initFormValidation = function() {
			$('.needs-validation').on('submit', function(event) {
				$(this).addClass('was-validated');
				if ($(this)[0].checkValidity() === false) {
					event.preventDefault();
					event.stopPropagation();
					return false;
				}
				return true;
			});
		}),
		// Counterup
		(Components.prototype.initCounterUp = function() {
			var delay = $(this).attr('data-delay') ? $(this).attr('data-delay') : 100; //default is 100
			var time = $(this).attr('data-time') ? $(this).attr('data-time') : 1200; //default is 1200
			$('[data-plugin="counterup"]').each(function(idx, obj) {
				$(this).counterUp({
					delay: delay,
					time: time
				});
			});
		}),
		//peity charts
		(Components.prototype.initPeityCharts = function() {
			$('[data-plugin="peity-pie"]').each(function(idx, obj) {
				var colors = $(this).attr('data-colors') ? $(this).attr('data-colors').split(',') : [];
				var width = $(this).attr('data-width') ? $(this).attr('data-width') : 20; //default is 20
				var height = $(this).attr('data-height') ? $(this).attr('data-height') : 20; //default is 20
				$(this).peity('pie', {
					fill: colors,
					width: width,
					height: height
				});
			});
			//donut
			$('[data-plugin="peity-donut"]').each(function(idx, obj) {
				var colors = $(this).attr('data-colors') ? $(this).attr('data-colors').split(',') : [];
				var width = $(this).attr('data-width') ? $(this).attr('data-width') : 20; //default is 20
				var height = $(this).attr('data-height') ? $(this).attr('data-height') : 20; //default is 20
				$(this).peity('donut', {
					fill: colors,
					width: width,
					height: height
				});
			});

			$('[data-plugin="peity-donut-alt"]').each(function(idx, obj) {
				$(this).peity('donut');
			});

			// line
			$('[data-plugin="peity-line"]').each(function(idx, obj) {
				$(this).peity('line', $(this).data());
			});

			// bar
			$('[data-plugin="peity-bar"]').each(function(idx, obj) {
				var colors = $(this).attr('data-colors') ? $(this).attr('data-colors').split(',') : [];
				var width = $(this).attr('data-width') ? $(this).attr('data-width') : 20; //default is 20
				var height = $(this).attr('data-height') ? $(this).attr('data-height') : 20; //default is 20
				$(this).peity('bar', {
					fill: colors,
					width: width,
					height: height
				});
			});
		}),
		(Components.prototype.initKnob = function() {
			$('[data-plugin="knob"]').each(function(idx, obj) {
				$(this).knob();
			});
		}),
		(Components.prototype.initTippyTooltips = function() {
			if ($('[data-plugin="tippy"]').length > 0) tippy('[data-plugin="tippy"]');
		}),
		(Components.prototype.initShowPassword = function() {
			$('[data-password]').on('click', function() {
				if ($(this).attr('data-password') == 'false') {
					$(this).siblings('input').attr('type', 'text');
					$(this).attr('data-password', 'true');
					$(this).addClass('show-password');
				} else {
					$(this).siblings('input').attr('type', 'password');
					$(this).attr('data-password', 'false');
					$(this).removeClass('show-password');
				}
			});
		}),
		(Components.prototype.initMultiDropdown = function() {
			$('.dropdown-menu a.dropdown-toggle').on('click', function(e) {
				if (!$(this).next().hasClass('show')) {
					$(this).parents('.dropdown-menu').first().find('.show').removeClass('show');
				}
				var $subMenu = $(this).next('.dropdown-menu');
				$subMenu.toggleClass('show');

				return false;
			});
		}),
		//initilizing
		(Components.prototype.init = function() {
			this.initTooltipPlugin(),
				this.initPopoverPlugin(),
				this.initToastPlugin(),
				this.initFormValidation(),
				this.initCounterUp(),
				this.initPeityCharts(),
				this.initKnob();
			this.initTippyTooltips();
			this.initShowPassword();
			this.initMultiDropdown();
		}),
		($.Components = new Components()),
		($.Components.Constructor = Components);
})(window.jQuery),
	(function($) {
		'use strict';

		/**
    Portlet Widget
    */
		var Portlet = function() {
			(this.$body = $('body')),
				(this.$portletIdentifier = '.card'),
				(this.$portletCloser = '.card a[data-toggle="remove"]'),
				(this.$portletRefresher = '.card a[data-toggle="reload"]');
		};

		//on init
		(Portlet.prototype.init = function() {
			// Panel closest
			var $this = this;
			$(document).on('click', this.$portletCloser, function(ev) {
				ev.preventDefault();
				var $portlet = $(this).closest($this.$portletIdentifier);
				var $portlet_parent = $portlet.parent();
				$portlet.remove();
				if ($portlet_parent.children().length == 0) {
					$portlet_parent.remove();
				}
			});

			// Panel Reload
			$(document).on('click', this.$portletRefresher, function(ev) {
				ev.preventDefault();
				var $portlet = $(this).closest($this.$portletIdentifier);
				// This is just a simulation, nothing is going to be reloaded
				$portlet.append('<div class="card-disabled"><div class="card-portlets-loader"></div></div>');
				var $pd = $portlet.find('.card-disabled');
				setTimeout(function() {
					$pd.fadeOut('fast', function() {
						$pd.remove();
					});
				}, 500 + 300 * (Math.random() * 5));
			});
		}),
			//
			($.Portlet = new Portlet()),
			($.Portlet.Constructor = Portlet);
	})(window.jQuery),
	(function($) {
		'use strict';

		var App = function() {
			(this.$body = $('body')), (this.$window = $(window));
		};

		/**
         * Initlizes the controls
         */
		(App.prototype.initControls = function() {
			// Preloader
			$(window).on('load', function() {
				$('#status').fadeOut();
				$('#preloader').delay(350).fadeOut('slow');
			});

			$('[data-toggle="fullscreen"]').on('click', function(e) {
				e.preventDefault();
				$('body').toggleClass('fullscreen-enable');
				if (
					!document.fullscreenElement &&
					/* alternative standard method */ !document.mozFullScreenElement &&
					!document.webkitFullscreenElement
				) {
					// current working methods
					if (document.documentElement.requestFullscreen) {
						document.documentElement.requestFullscreen();
					} else if (document.documentElement.mozRequestFullScreen) {
						document.documentElement.mozRequestFullScreen();
					} else if (document.documentElement.webkitRequestFullscreen) {
						document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
					}
				} else {
					if (document.cancelFullScreen) {
						document.cancelFullScreen();
					} else if (document.mozCancelFullScreen) {
						document.mozCancelFullScreen();
					} else if (document.webkitCancelFullScreen) {
						document.webkitCancelFullScreen();
					}
				}
			});
			document.addEventListener('fullscreenchange', exitHandler);
			document.addEventListener('webkitfullscreenchange', exitHandler);
			document.addEventListener('mozfullscreenchange', exitHandler);
			function exitHandler() {
				if (!document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
					console.log('pressed');
					$('body').removeClass('fullscreen-enable');
				}
			}
		}),
			//initilizing
			(App.prototype.init = function() {
				$.Portlet.init();
				$.Components.init();

				this.initControls();

				// init layout
				this.layout = $.LayoutThemeApp;
				this.rightBar = $.RightBar;
				this.rightBar.layout = this.layout;
				this.layout.rightBar = this.rightBar;

				this.layout.init();
				this.rightBar.init(this.layout);

				// showing the sidebar on load if user is visiting the page first time only
				var bodyConfig = this.$body.data('layout');
				if (
					window.sessionStorage &&
					bodyConfig &&
					bodyConfig.hasOwnProperty('showRightSidebarOnPageLoad') &&
					bodyConfig['showRightSidebarOnPageLoad']
				) {
					var alreadyVisited = sessionStorage.getItem('_UBOLD_VISITED_');
					if (!alreadyVisited) {
						$.RightBar.toggleRightSideBar();
						sessionStorage.setItem('_UBOLD_VISITED_', true);
					}
				}
			}),
			($.App = new App()),
			($.App.Constructor = App);
	})(window.jQuery),
	(function($) {
		'use strict';
		$.App.init();
	})(window.jQuery);

if ($('select[data-toggle=select2]').length > 0) {
	!(function($) {
		'use strict';

		var FormAdvanced = function() {};

		//initializing tooltip
		(FormAdvanced.prototype.initSelect2 = function() {
			// Select2
			$('[data-toggle="select2"]').select2();
		}),
			//initilizing
			(FormAdvanced.prototype.init = function() {
				var $this = this;
				this.initSelect2();
			}),
			($.FormAdvanced = new FormAdvanced()),
			($.FormAdvanced.Constructor = FormAdvanced);
	})(window.jQuery),
		(function($) {
			'use strict';
			$.FormAdvanced.init();
		})(window.jQuery);
}

if ($('[data-plugin="dragula"]').length > 0) {
	!(function($) {
		'use strict';

		var Dragula = function() {
			this.$body = $('body');
		};

		/* Initializing */
		(Dragula.prototype.init = function() {
			$('[data-plugin="dragula"]').each(function() {
				var containersIds = $(this).data('containers');
				var containers = [];
				if (containersIds) {
					for (var i = 0; i < containersIds.length; i++) {
						containers.push($('#' + containersIds[i])[0]);
					}
				} else {
					containers = [ $(this)[0] ];
				}

				// if handle provided
				var handleClass = $(this).data('handleclass');

				// init dragula
				if (handleClass) {
					dragula(containers, {
						moves: function(el, container, handle) {
							return handle.classList.contains(handleClass);
						}
					});
				} else {
					dragula(containers);
				}
			});
		}),
			//init dragula
			($.Dragula = new Dragula()),
			($.Dragula.Constructor = Dragula);
	})(window.jQuery),
		//initializing Dragula
		(function($) {
			'use strict';
			$.Dragula.init();
		})(window.jQuery);
}

function adjustDataTableColumns() {
	$($.fn.dataTable.tables(true)).DataTable().columns.adjust();
}

function checkSize() {
	if ($('.hamburger').css('display') == 'none') {
		$('.nav-drill > .nav-items > .nav-item > .nav-item-link').click(function() {
			$('.nav-drill > .nav-items > .nav-item > .nav-item-link')
				.not(this)
				.closest('.nav-item')
				.removeClass('active');
		});

		if (!$('.nav-drill > .nav-items > .nav-item').hasClass('active')) {
			$('.nav-drill > .nav-items > .nav-item:nth-child(2)').addClass('active');
		}
	} else {
		if ($('.nav-drill > .nav-items > .nav-item').hasClass('active')) {
			$('.nav-drill > .nav-items > .nav-item').removeClass('active');
		}
	}
}

// Waves Effect
Waves.init();

$(document).ready(function() {
	checkSize();

	$(window).resize(function() {
		checkSize();
		if ($('.dataTable').length > 0) {
			adjustDataTableColumns();
		}
	});

	if ($('#paste-excel-textarea').length > 0) {
		TLN.append_line_numbers('paste-excel-textarea');
	}

	if ($('#data-table').length > 0) {
		$('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
			adjustDataTableColumns();
		});

		$('thead th, .DTFC_LeftHeadWrapper th:not(.nosort), .DTFC_RightHeadWrapper th:not(.nosort)').append(
			'<svg class="sort-arrow" xmlns="http://www.w3.org/2000/svg" width="4.211" height="10" viewBox="0 0 4.211 10"><path d="M13,10.105,10.895,8V9.579H3v1.053h7.895v1.579Z" transform="translate(12.211 -3) rotate(90)" fill="#212b35"/></svg>'
		);
	}

	$('.upload-list__next-step').click(function() {
		$(this).closest('.upload-list__step').addClass('d-none');
		$(this).closest('.upload-list__step').next('.upload-list__step').removeClass('d-none');
		adjustDataTableColumns();
	});

	$('.upload-list__previous-step').click(function() {
		$(this).closest('.upload-list__step').addClass('d-none');
		$(this).closest('.upload-list__step').prev('.upload-list__step').removeClass('d-none');
		adjustDataTableColumns();
	});

	$('#show-more-fields-link').click(function() {
		event.preventDefault();
		$('#show-more-fields-row').toggleClass('d-none');
		$(this).children('.show-more-text').toggleClass('d-none');
	});

	$('#add-contact-btn').click(function() {
		$('#added-contacts').toggleClass('d-none');
	});

	$('.close').click(function() {
		$(this).closest('.list-add-success').addClass('d-none');
	});

	$('.form-control._save-list').on('change keyup', function() {
		if ($(this).val().length > 0) {
			$('.card').removeClass('_chosen');
			$(this).closest('.card').addClass('_chosen');
			$('.contact__finish').removeClass('_disabled');

			if ($('.selectpicker').length > 0) {
				$('.selectpicker').val('');
				$('.selectpicker').selectpicker('refresh');
			}

			if ($('._save-list-radio').length > 0) {
				$('._save-list-radio').each(function() {
					$(this).prop('checked', false);
				});
			}
		} else {
			$(this).closest('.card').removeClass('_chosen');
			$('.contact__finish').addClass('_disabled');
		}
	});

	$('._save-list-radio').click(function() {
		$('.card').removeClass('_chosen');
		$(this).closest('.tab-pane').find('._save-list').val('');
		$(this).closest('.card').addClass('_chosen');
		$('.contact__finish').removeClass('_disabled');
	});

	$('.confirm__btn').click(function() {
		$(this).next('.confirm__modal').removeClass('d-none');
	});

	$('.confirm__modal .btn').click(function() {
		$(this).closest('.confirm__modal').addClass('d-none');
	});

	$('._add-new-list').click(function() {
		$(this).addClass('d-none');
		$(this).next('.add-new-list-input').removeClass('d-none');
	});

	$('.add-new-list-input ._check').click(function() {
		$(this).closest('.add-new-list-input').addClass('d-none');
		$('._add-new-list').removeClass('d-none');
	});

	$('#copy-api-btn').click(function() {
		var copyText = document.getElementById("copy-api-input");
		copyText.select();
		copyText.setSelectionRange(0, 99999);
		document.execCommand("copy");
	});

	// Navigation
	var navExpand = [].slice.call(document.querySelectorAll('.nav-expand'));
	var backLink = `<li class="nav-back"><a class="nav-back-link" href="javascript:;"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><path id="ic_arrow_back_24px" d="M24,12.75H8.787l6.987-6.987L14,4,4,14,14,24l1.763-1.762L8.787,15.25H24Z" transform="translate(-4 -4)" fill="#fff"/></svg></a></li>`;

	navExpand.forEach((item) => {
		item.querySelector('.nav-expand-content').insertAdjacentHTML('afterbegin', backLink);
		item.querySelector('.nav-item-link').addEventListener('click', () => item.classList.add('active'));
		item.querySelector('.nav-back-link').addEventListener('click', () => item.classList.remove('active'));
	});

	var ham = document.getElementById('ham');
	ham.addEventListener('click', function() {
		document.body.classList.toggle('nav-is-toggled');
	});

	// Stop transitions on resize
	var resizeTimer;
	window.addEventListener('resize', () => {
		document.body.classList.add('animation-stopper');
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(() => {
			document.body.classList.remove('animation-stopper');
		}, 400);
	});

	//add spinner for table
});

// Stop transitions on page load
$(window).on('load', function() {
	$('body').removeClass('animation-stopper');

	//add event for rendered select
	$('.selectpicker[data-live-search]').each(function() {
		$(this).on('changed.bs.select', function(e, clickedIndex, isSelected, previousValue) {
			$(this).closest('.tab-pane').find('.card._chosen ._save-list').val('');
			$('.card').removeClass('_chosen');
			$(this).closest('.card').addClass('_chosen');
			$('.contact__finish').removeClass('_disabled');
		});
	});
});
