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
!(function ($) {
  const LeftSidebar = function () {
    (this.body = $('body')), (this.window = $(window));
  };

  /**
   * Reset the theme
   */
  (LeftSidebar.prototype._reset = function () {
    this.body.removeAttr('data-sidebar-color');
    this.body.removeAttr('data-sidebar-size');
    this.body.removeAttr('data-sidebar-showuser');
  }),
    /**
     * Changes the color of sidebar
     * @param {*} color
     */
    (LeftSidebar.prototype.changeColor = function (color) {
      this.body.attr('data-sidebar-color', color);
      this.parent.updateConfig('sidebar', { color });
    }),
    /**
     * Changes the size of sidebar
     * @param {*} size
     */
    (LeftSidebar.prototype.changeSize = function (size) {
      this.body.attr('data-sidebar-size', size);
      this.parent.updateConfig('sidebar', { size });
    }),
    /**
     * Toggle User information
     * @param {*} showUser
     */
    (LeftSidebar.prototype.showUser = function (showUser) {
      this.body.attr('data-sidebar-showuser', showUser);
      this.parent.updateConfig('sidebar', { showuser: showUser });
    }),
    /**
     * Initilizes the menu
     */
    (LeftSidebar.prototype.initMenu = function () {
      const self = this;

      const layout = $.LayoutThemeApp.getConfig();
      const sidebar = $.extend({}, layout ? layout.sidebar : {});
      const defaultSidebarSize = sidebar.size ? sidebar.size : 'default';

      // resets everything
      this._reset();

      // Left menu collapse
      $('.button-menu-mobile').on('click', function (event) {
        event.preventDefault();
        const sidebarSize = self.body.attr('data-sidebar-size');
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
      if ($('#side-menu').length) {
        var navCollapse = $('#side-menu li .collapse');

        // open one menu at a time only
        navCollapse.on({
          'show.bs.collapse': function (event) {
            const parent = $(event.target).parents('.collapse.show');
            $('#side-menu .collapse.show').not(parent).collapse('hide');
          },
        });

        // activate the menu in left side bar (Vertical Menu) based on url
        $('#side-menu a').each(function () {
          const pageUrl = window.location.href.split(/[?#]/)[0];
          if (this.href == pageUrl) {
            $(this).addClass('active');
            $(this).parent().addClass('menuitem-active');
            $(this).parent().parent().parent().addClass('show');
            $(this)
              .parent()
              .parent()
              .parent()
              .parent()
              .addClass('menuitem-active'); // add active to li of the current link

            const firstLevelParent = $(this)
              .parent()
              .parent()
              .parent()
              .parent()
              .parent()
              .parent();
            if (firstLevelParent.attr('id') !== 'sidebar-menu')
              firstLevelParent.addClass('show');

            $(this)
              .parent()
              .parent()
              .parent()
              .parent()
              .parent()
              .parent()
              .parent()
              .addClass('menuitem-active');

            const secondLevelParent = $(this)
              .parent()
              .parent()
              .parent()
              .parent()
              .parent()
              .parent()
              .parent()
              .parent()
              .parent();
            if (secondLevelParent.attr('id') !== 'wrapper')
              secondLevelParent.addClass('show');

            const upperLevelParent = $(this)
              .parent()
              .parent()
              .parent()
              .parent()
              .parent()
              .parent()
              .parent()
              .parent()
              .parent()
              .parent();
            if (!upperLevelParent.is('body'))
              upperLevelParent.addClass('menuitem-active');
          }
        });
      }

      // handling two columns menu if present
      const twoColSideNav = $('#two-col-sidenav-main');
      if (twoColSideNav.length) {
        const twoColSideNavItems = $('#two-col-sidenav-main .nav-link');
        const sideSubMenus = $('.twocolumn-menu-item');

        // showing/displaying tooltip based on screen size
        if (this.window.width() >= 585) {
          twoColSideNavItems.tooltip('enable');
        } else {
          twoColSideNavItems.tooltip('disable');
        }

        const nav = $('.twocolumn-menu-item .nav-second-level');
        var navCollapse = $('#two-col-menu li .collapse');

        // open one menu at a time only
        navCollapse.on({
          'show.bs.collapse': function () {
            const nearestNav = $(this)
              .closest(nav)
              .closest(nav)
              .find(navCollapse);
            if (nearestNav.length) nearestNav.not($(this)).collapse('hide');
            else navCollapse.not($(this)).collapse('hide');
          },
        });

        twoColSideNavItems.on('click', function (e) {
          const target = $($(this).attr('href'));

          if (target.length) {
            e.preventDefault();

            twoColSideNavItems.removeClass('active');
            $(this).addClass('active');

            sideSubMenus.removeClass('d-block');
            target.addClass('d-block');

            // showing full sidebar if menu item is clicked
            $.LayoutThemeApp.leftSidebar.changeSize('default');
            return false;
          }
          return true;
        });

        // activate menu with no child
        const pageUrl = window.location.href.split(/[?#]/)[0];
        twoColSideNavItems.each(function () {
          if (this.href == pageUrl) {
            $(this).addClass('active');
          }
        });

        // activate the menu in left side bar (Two column) based on url
        $('#two-col-menu a').each(function () {
          if (this.href == pageUrl) {
            $(this).addClass('active');
            $(this).parent().addClass('menuitem-active');
            $(this).parent().parent().parent().addClass('show');
            $(this)
              .parent()
              .parent()
              .parent()
              .parent()
              .addClass('menuitem-active'); // add active to li of the current link

            const firstLevelParent = $(this)
              .parent()
              .parent()
              .parent()
              .parent()
              .parent()
              .parent();
            if (firstLevelParent.attr('id') !== 'sidebar-menu')
              firstLevelParent.addClass('show');

            $(this)
              .parent()
              .parent()
              .parent()
              .parent()
              .parent()
              .parent()
              .parent()
              .addClass('menuitem-active');

            const secondLevelParent = $(this)
              .parent()
              .parent()
              .parent()
              .parent()
              .parent()
              .parent()
              .parent()
              .parent()
              .parent();
            if (secondLevelParent.attr('id') !== 'wrapper')
              secondLevelParent.addClass('show');

            const upperLevelParent = $(this)
              .parent()
              .parent()
              .parent()
              .parent()
              .parent()
              .parent()
              .parent()
              .parent()
              .parent()
              .parent();
            if (!upperLevelParent.is('body'))
              upperLevelParent.addClass('menuitem-active');

            // opening menu
            let matchingItem = null;
            const targetEl = `#${$(this)
              .parents('.twocolumn-menu-item')
              .attr('id')}`;
            $('#two-col-sidenav-main .nav-link').each(function () {
              if ($(this).attr('href') === targetEl) {
                matchingItem = $(this);
              }
            });
            if (matchingItem) matchingItem.trigger('click');
          }
        });
      }
    }),
    /**
     * Initilize the left sidebar size based on screen size
     */
    (LeftSidebar.prototype.initLayout = function () {
      // in case of small size, activate the small menu
      if (
        (this.window.width() >= 768 && this.window.width() <= 1028) ||
        this.body.data('keep-enlarged')
      ) {
        this.changeSize('condensed');
      } else {
        this.changeSize('default');
      }
    }),
    /**
     * Initilizes the menu
     */
    (LeftSidebar.prototype.init = function () {
      const self = this;
      this.initMenu();
      this.initLayout();

      // on window resize, make menu flipped automatically
      this.window.on('resize', function (e) {
        e.preventDefault();
        self.initLayout();
      });
    }),
    ($.LeftSidebar = new LeftSidebar()),
    ($.LeftSidebar.Constructor = LeftSidebar);
})(window.jQuery),
  /**
   * Topbar
   * @param {*} $
   */
  (function ($) {
    const Topbar = function () {
      (this.body = $('body')), (this.window = $(window));
    };

    /**
     * Initilizes the menu
     */
    (Topbar.prototype.initMenu = function () {
      // Serach Toggle
      $('#top-search').on('click', function (e) {
        $('#search-dropdown').addClass('d-block');
      });

      // hide search on opening other dropdown
      $('.topbar-dropdown').on('show.bs.dropdown', function () {
        $('#search-dropdown').removeClass('d-block');
      });

      // activate the menu in topbar(horizontal menu) based on url
      $('.navbar-nav a').each(function () {
        const pageUrl = window.location.href.split(/[?#]/)[0];
        if (this.href == pageUrl) {
          $(this).addClass('active');
          $(this).parent().addClass('active');
          $(this).parent().parent().addClass('active');
          $(this).parent().parent().parent().addClass('active');
          $(this).parent().parent().parent().parent().addClass('active');
          const el = $(this)
            .parent()
            .parent()
            .parent()
            .parent()
            .addClass('active')
            .prev();
          if (el.hasClass('nav-link')) el.addClass('active');
        }
      });

      // Topbar - main menu
      $('.navbar-toggle').on('click', function (event) {
        $(this).toggleClass('open');
        $('#navigation').slideToggle(400);
      });
    }),
      /**
       * Changes the color of topbar
       * @param {*} color
       */
      (Topbar.prototype.changeColor = function (color) {
        this.body.attr('data-topbar-color', color);
        this.parent.updateConfig('topbar', { color });
      }),
      /**
       * Initilizes the menu
       */
      (Topbar.prototype.init = function () {
        this.initMenu();
      }),
      ($.Topbar = new Topbar()),
      ($.Topbar.Constructor = Topbar);
  })(window.jQuery),
  /**
   * RightBar
   * @param {*} $
   */
  (function ($) {
    const RightBar = function () {
      (this.body = $('body')), (this.window = $(window));
    };

    /**
     * Select the option based on saved config
     */
    (RightBar.prototype.selectOptionsFromConfig = function () {
      const self = this;

      const config = self.layout.getConfig();

      if (config) {
        $(
          `input[type=radio][name=color-scheme-mode][value=${config.mode}]`
        ).prop('checked', true);
        $(`input[type=radio][name=width][value=${config.width}]`).prop(
          'checked',
          true
        );
        $(
          `input[type=radio][name=menus-position][value=${config.menuPosition}]`
        ).prop('checked', true);

        $(
          `input[type=radio][name=leftsidebar-color][value=${config.sidebar.color}]`
        ).prop('checked', true);
        $(
          `input[type=radio][name=leftsidebar-size][value=${config.sidebar.size}]`
        ).prop('checked', true);
        $('input[type=checkbox][name=leftsidebar-user]').prop(
          'checked',
          config.sidebar.showuser
        );

        $(
          `input[type=radio][name=topbar-color][value=${config.topbar.color}]`
        ).prop('checked', true);
      }
    }),
      /**
       * Toggles the right sidebar
       */
      (RightBar.prototype.toggleRightSideBar = function () {
        const self = this;
        self.body.toggleClass('right-bar-enabled');
        self.selectOptionsFromConfig();
      }),
      /**
       * Initilizes the right side bar
       */
      (RightBar.prototype.init = function () {
        const self = this;

        // right side-bar toggle
        $(document).on('click', '.right-bar-toggle', function () {
          self.toggleRightSideBar();
        });

        $(document).on('click', 'body', function (e) {
          // hiding search bar
          if ($(e.target).closest('#top-search').length !== 1) {
            $('#search-dropdown').removeClass('d-block');
          }
          if ($(e.target).closest('.right-bar-toggle, .right-bar').length > 0) {
            return;
          }

          if (
            $(e.target).closest('.left-side-menu, .side-nav').length > 0 ||
            $(e.target).hasClass('button-menu-mobile') ||
            $(e.target).closest('.button-menu-mobile').length > 0
          ) {
            return;
          }

          $('body').removeClass('right-bar-enabled');
          $('body').removeClass('sidebar-enable');
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
      }),
      ($.RightBar = new RightBar()),
      ($.RightBar.Constructor = RightBar);
  })(window.jQuery),
  /**
   * Layout and theme manager
   * @param {*} $
   */

  (function ($) {
    // Layout and theme manager

    const LayoutThemeApp = function () {
      (this.body = $('body')),
        (this.window = $(window)),
        (this.config = {}),
        // styles
        (this.defaultBSStyle = $('#bs-default-stylesheet')),
        (this.defaultAppStyle = $('#app-default-stylesheet')),
        (this.darkBSStyle = $('#bs-dark-stylesheet')),
        (this.darkAppStyle = $('#app-dark-stylesheet'));
    };

    /**
     * Preserves the config in memory
     */
    (LayoutThemeApp.prototype._saveConfig = function (newConfig) {
      this.config = $.extend(this.config, newConfig);
      // NOTE: You can make ajax call here to save preference on server side or localstorage as well
    }),
      /**
       * Update the config for given config
       * @param {*} param
       * @param {*} config
       */
      (LayoutThemeApp.prototype.updateConfig = function (param, config) {
        const newObj = {};
        if (typeof config === 'object' && config !== null) {
          const originalParam = this.config[param];
          newObj[param] = $.extend(originalParam, config);
        } else {
          newObj[param] = config;
        }
        this._saveConfig(newObj);
      });

    /**
     * Loads the config - takes from body if available else uses default one
     */
    (LayoutThemeApp.prototype.loadConfig = function () {
      const bodyConfig = JSON.parse(
        this.body.attr('data-layout') ? this.body.attr('data-layout') : '{}'
      );

      let config = $.extend(
        {},
        {
          mode: 'light',
          width: 'fluid',
          menuPosition: 'fixed',
          sidebar: {
            color: 'light',
            size: 'default',
            showuser: false,
          },
          topbar: {
            color: 'dark',
          },
          showRightSidebarOnPageLoad: false,
        }
      );
      if (bodyConfig) {
        config = $.extend({}, config, bodyConfig);
      }
      return config;
    }),
      /**
       * Apply the config
       */
      (LayoutThemeApp.prototype.applyConfig = function () {
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
        const sidebarConfig = $.extend({}, this.config.sidebar);
        this.leftSidebar.changeColor(sidebarConfig.color);
        this.leftSidebar.changeSize(sidebarConfig.size);
        this.leftSidebar.showUser(sidebarConfig.showuser);

        // topbar
        const topbarConfig = $.extend({}, this.config.topbar);
        this.topbar.changeColor(topbarConfig.color);
      }),
      /**
       * Toggle dark or light mode
       * @param {*} mode
       */
      (LayoutThemeApp.prototype.changeMode = function (mode) {
        // sets the theme
        switch (mode) {
          case 'dark': {
            this.defaultBSStyle.attr('disabled', true);
            this.defaultAppStyle.attr('disabled', true);

            this.darkBSStyle.attr('disabled', false);
            this.darkAppStyle.attr('disabled', false);

            this.leftSidebar.changeColor('dark');
            this._saveConfig({
              mode,
              sidebar: $.extend({}, this.config.sidebar, { color: 'dark' }),
            });
            break;
          }
          default: {
            this.defaultBSStyle.attr('disabled', false);
            this.defaultAppStyle.attr('disabled', false);

            this.darkBSStyle.attr('disabled', true);
            this.darkAppStyle.attr('disabled', true);
            this.leftSidebar.changeColor('light');
            this._saveConfig({
              mode,
              sidebar: $.extend({}, this.config.sidebar, { color: 'light' }),
            });
            break;
          }
        }

        this.rightBar.selectOptionsFromConfig();
      });

    /**
     * Changes the width of layout
     */
    LayoutThemeApp.prototype.changeLayoutWidth = function (width) {
      switch (width) {
        case 'boxed': {
          this.body.attr('data-layout-width', 'boxed');
          // automatically activating condensed
          $.LeftSidebar.changeSize('condensed');
          this._saveConfig({ width });
          break;
        }
        default: {
          this.body.attr('data-layout-width', 'fluid');
          // automatically activating provided size
          const bodyConfig = JSON.parse(
            this.body.attr('data-layout') ? this.body.attr('data-layout') : '{}'
          );
          $.LeftSidebar.changeSize(
            bodyConfig && bodyConfig.sidebar
              ? bodyConfig.sidebar.size
              : 'default'
          );
          this._saveConfig({ width });
          break;
        }
      }
      this.rightBar.selectOptionsFromConfig();
    };

    /**
     * Changes menu positions
     */
    LayoutThemeApp.prototype.changeMenuPositions = function (position) {
      this.body.attr('data-layout-menu-position', position);
    };

    /**
     * Clear out the saved config
     */
    (LayoutThemeApp.prototype.clearSavedConfig = function () {
      this.config = {};
    }),
      /**
       * Gets the config
       */
      (LayoutThemeApp.prototype.getConfig = function () {
        return this.config;
      }),
      /**
       * Reset to default
       */
      (LayoutThemeApp.prototype.reset = function () {
        this.clearSavedConfig();
        this.applyConfig();
      }),
      /**
       * Init
       */
      (LayoutThemeApp.prototype.init = function () {
        this.leftSidebar = $.LeftSidebar;
        this.topbar = $.Topbar;

        this.leftSidebar.parent = this;
        this.topbar.parent = this;

        // initilize the menu
        this.applyConfig();
      }),
      ($.LayoutThemeApp = new LayoutThemeApp()),
      ($.LayoutThemeApp.Constructor = LayoutThemeApp);
  })(window.jQuery);

/*
Template Name: Ubold - Responsive Bootstrap 4 Admin Dashboard
Author: CoderThemes
Website: https://coderthemes.com/
Contact: support@coderthemes.com
File: Main Js File
*/

!(function ($) {
  const Components = function () {};

  // initializing tooltip
  (Components.prototype.initTooltipPlugin = function () {
    $.fn.tooltip && $('[data-toggle="tooltip"]').tooltip();
  }),
    // initializing popover
    (Components.prototype.initPopoverPlugin = function () {
      $.fn.popover && $('[data-toggle="popover"]').popover();
    }),
    // initializing toast
    (Components.prototype.initToastPlugin = function () {
      $.fn.toast && $('[data-toggle="toast"]').toast();
    }),
    // initializing form validation
    (Components.prototype.initFormValidation = function () {
      $('.needs-validation').on('submit', function (event) {
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
    (Components.prototype.initCounterUp = function () {
      const delay = $(this).attr('data-delay')
        ? $(this).attr('data-delay')
        : 100; // default is 100
      const time = $(this).attr('data-time') ? $(this).attr('data-time') : 1200; // default is 1200
      $('[data-plugin="counterup"]').each(function (idx, obj) {
        $(this).counterUp({
          delay,
          time,
        });
      });
    }),
    // peity charts
    (Components.prototype.initPeityCharts = function () {
      $('[data-plugin="peity-pie"]').each(function (idx, obj) {
        const colors = $(this).attr('data-colors')
          ? $(this).attr('data-colors').split(',')
          : [];
        const width = $(this).attr('data-width')
          ? $(this).attr('data-width')
          : 20; // default is 20
        const height = $(this).attr('data-height')
          ? $(this).attr('data-height')
          : 20; // default is 20
        $(this).peity('pie', {
          fill: colors,
          width,
          height,
        });
      });
      // donut
      $('[data-plugin="peity-donut"]').each(function (idx, obj) {
        const colors = $(this).attr('data-colors')
          ? $(this).attr('data-colors').split(',')
          : [];
        const width = $(this).attr('data-width')
          ? $(this).attr('data-width')
          : 20; // default is 20
        const height = $(this).attr('data-height')
          ? $(this).attr('data-height')
          : 20; // default is 20
        $(this).peity('donut', {
          fill: colors,
          width,
          height,
        });
      });

      $('[data-plugin="peity-donut-alt"]').each(function (idx, obj) {
        $(this).peity('donut');
      });

      // line
      $('[data-plugin="peity-line"]').each(function (idx, obj) {
        $(this).peity('line', $(this).data());
      });

      // bar
      $('[data-plugin="peity-bar"]').each(function (idx, obj) {
        const colors = $(this).attr('data-colors')
          ? $(this).attr('data-colors').split(',')
          : [];
        const width = $(this).attr('data-width')
          ? $(this).attr('data-width')
          : 20; // default is 20
        const height = $(this).attr('data-height')
          ? $(this).attr('data-height')
          : 20; // default is 20
        $(this).peity('bar', {
          fill: colors,
          width,
          height,
        });
      });
    }),
    (Components.prototype.initKnob = function () {
      $('[data-plugin="knob"]').each(function (idx, obj) {
        $(this).knob();
      });
    }),
    (Components.prototype.initTippyTooltips = function () {
      if ($('[data-plugin="tippy"]').length > 0) tippy('[data-plugin="tippy"]');
    }),
    (Components.prototype.initShowPassword = function () {
      $('[data-password]').on('click', function () {
        if ($(this).attr('data-password') === 'false') {
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
    (Components.prototype.initMultiDropdown = function () {
      $('.dropdown-menu a.dropdown-toggle').on('click', function (e) {
        if (!$(this).next().hasClass('show')) {
          $(this)
            .parents('.dropdown-menu')
            .first()
            .find('.show')
            .removeClass('show');
        }
        const $subMenu = $(this).next('.dropdown-menu');
        $subMenu.toggleClass('show');

        return false;
      });
    }),
    // initilizing
    (Components.prototype.init = function () {
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
  (function ($) {
    /**
  Portlet Widget
  */
    const Portlet = function () {
      (this.$body = $('body')),
        (this.$portletIdentifier = '.card'),
        (this.$portletCloser = '.card a[data-toggle="remove"]'),
        (this.$portletRefresher = '.card a[data-toggle="reload"]');
    };

    // on init
    (Portlet.prototype.init = function () {
      // Panel closest
      const $this = this;
      $(document).on('click', this.$portletCloser, function (ev) {
        ev.preventDefault();
        const $portlet = $(this).closest($this.$portletIdentifier);
        const $portletParent = $portlet.parent();
        $portlet.remove();
        if ($portletParent.children().length === 0) {
          $portletParent.remove();
        }
      });

      // Panel Reload
      $(document).on('click', this.$portletRefresher, function (ev) {
        ev.preventDefault();
        const $portlet = $(this).closest($this.$portletIdentifier);
        // This is just a simulation, nothing is going to be reloaded
        $portlet.append(
          '<div class="card-disabled"><div class="card-portlets-loader"></div></div>'
        );
        const $pd = $portlet.find('.card-disabled');
        setTimeout(function () {
          $pd.fadeOut('fast', function () {
            $pd.remove();
          });
        }, 500 + 300 * (Math.random() * 5));
      });
    }),
      //
      ($.Portlet = new Portlet()),
      ($.Portlet.Constructor = Portlet);
  })(window.jQuery),
  (function ($) {
    const App = function () {
      (this.$body = $('body')), (this.$window = $(window));
    };

    /**
     * Initlizes the controls
     */
    (App.prototype.initControls = function () {
      // Preloader
      $(window).on('load', function () {
        $('#status').fadeOut();
        $('#preloader').delay(350).fadeOut('slow');
      });

      $('[data-toggle="fullscreen"]').on('click', function (e) {
        e.preventDefault();
        $('body').toggleClass('fullscreen-enable');
        if (
          !document.fullscreenElement &&
          /* alternative standard method */
          !document.mozFullScreenElement &&
          !document.webkitFullscreenElement
        ) {
          // current working methods
          if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
          } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
          } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen(
              Element.ALLOW_KEYBOARD_INPUT
            );
          }
        } else if (document.cancelFullScreen) {
          document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        }
      });
      document.addEventListener('fullscreenchange', exitHandler);
      document.addEventListener('webkitfullscreenchange', exitHandler);
      document.addEventListener('mozfullscreenchange', exitHandler);

      function exitHandler() {
        if (
          !document.webkitIsFullScreen &&
          !document.mozFullScreen &&
          !document.msFullscreenElement
        ) {
          $('body').removeClass('fullscreen-enable');
        }
      }
    }),
      // initilizing
      (App.prototype.init = function () {
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
        const bodyConfig = this.$body.data('layout');
        if (
          window.sessionStorage &&
          bodyConfig &&
          Object.prototype.hasOwnProperty.call(
            bodyConfig,
            'showRightSidebarOnPageLoad'
          ) &&
          bodyConfig.showRightSidebarOnPageLoad
        ) {
          const alreadyVisited = sessionStorage.getItem('_UBOLD_VISITED_');
          if (!alreadyVisited) {
            $.RightBar.toggleRightSideBar();
            sessionStorage.setItem('_UBOLD_VISITED_', true);
          }
        }
      }),
      ($.App = new App()),
      ($.App.Constructor = App);
  })(window.jQuery),
  (function ($) {
    $.App.init();
  })(window.jQuery);

if ($('select[data-toggle=select2]').length > 0) {
  !(function ($) {
    const FormAdvanced = function () {};

    // initializing tooltip
    (FormAdvanced.prototype.initSelect2 = function () {
      // Select2
      $('[data-toggle="select2"]').select2({
        minimumResultsForSearch: -1,
      });
    }),
      // initilizing
      (FormAdvanced.prototype.init = function () {
        const $this = this;
        this.initSelect2();
      }),
      ($.FormAdvanced = new FormAdvanced()),
      ($.FormAdvanced.Constructor = FormAdvanced);
  })(window.jQuery),
    (function ($) {
      $.FormAdvanced.init();
    })(window.jQuery);
}

if ($('[data-plugin="dragula"]').length > 0) {
  !(function ($) {
    const Dragula = function () {
      this.$body = $('body');
    };

    /* Initializing */
    (Dragula.prototype.init = function () {
      $('[data-plugin="dragula"]').each(function () {
        const containersIds = $(this).data('containers');
        let containers = [];
        if (containersIds) {
          for (let i = 0; i < containersIds.length; i++) {
            containers.push($(`#${containersIds[i]}`)[0]);
          }
        } else {
          containers = [$(this)[0]];
        }

        // if handle provided
        const handleClass = $(this).data('handleclass');

        // init dragula
        if (handleClass) {
          dragula(containers, {
            moves(el, container, handle) {
              return handle.classList.contains(handleClass);
            },
          });
        } else {
          dragula(containers);
        }
      });
    }),
      // init dragula
      ($.Dragula = new Dragula()),
      ($.Dragula.Constructor = Dragula);
  })(window.jQuery),
    // initializing Dragula
    (function ($) {
      $.Dragula.init();
    })(window.jQuery);
}

function addWithScrollTable() {
  if ($($.fn.dataTable.tables()).length > 0) {
    $('.diriq-table__wrapper').each(function () {
      if (
        $(this).find('.dataTables_scrollBody').width() <
        $(this).find('.dataTables_scrollBody>table').width()
      ) {
        $(this).addClass('with-scroll');
      } else {
        $(this).removeClass('with-scroll');
      }
    });
  }
}

function adjustDataTableColumns() {
  if ($($.fn.dataTable.tables()).length > 0) {
    $(
      $.fn.dataTable.tables({
        visible: true,
      })
    )
      .DataTable()
      .columns.adjust();
    addWithScrollTable();
    // setTimeout(function () {
    //   const tableWithNewScroll = document.querySelector('.new-scroll');
    //   if (tableWithNewScroll) {
    //     $(
    //       '.dataTables_scrollBody td:first-child, .dataTables_scrollBody td:nth-child(2), .dataTables_scrollBody td:last-child, .dataTables_scrollBody th:first-child, .dataTables_scrollBody th:nth-child(2), .dataTables_scrollBody th:last-child'
    //     ).css('display', 'table-cell');
    //   }
    //   $($.fn.dataTable.tables({ visible: true }))
    //     .DataTable()
    //     .columns.adjust();
    //   if (tableWithNewScroll) {
    //     $(
    //       '.dataTables_scrollBody td:first-child, .dataTables_scrollBody td:nth-child(2), .dataTables_scrollBody td:last-child, .dataTables_scrollBody th:first-child, .dataTables_scrollBody th:nth-child(2), .dataTables_scrollBody th:last-child'
    //     ).css('display', 'none');
    //     const scrollBody = tableWithNewScroll.querySelector(
    //       '.dataTables_scrollBody'
    //     );
    //     const leftFixed = tableWithNewScroll.querySelector(
    //       '.DTFC_LeftBodyWrapper table'
    //     );
    //     const rightFixed = tableWithNewScroll.querySelector(
    //       '.DTFC_RightBodyWrapper table'
    //     );
    //     scrollBody.style.width = `calc(100% - ${
    //       rightFixed.clientWidth + leftFixed.clientWidth
    //     }px)`;
    //     scrollBody.style.marginLeft = `${leftFixed.clientWidth}px`;
    //   }
    //   addWithScrollTable();
    // }, 250);
  }
}

function checkSize() {
  if ($('.hamburger').css('display') === 'none') {
    $('.nav-drill > .nav-items > .nav-item > .nav-item-link').click(
      function () {
        $('.nav-drill > .nav-items > .nav-item > .nav-item-link')
          .not(this)
          .closest('.nav-item')
          .removeClass('active');
      }
    );

    if (!$('.nav-drill > .nav-items > .nav-item').hasClass('active')) {
      $('.nav-drill > .nav-items > .nav-item:nth-child(2)').addClass('active');
    }
  } else if ($('.nav-drill > .nav-items > .nav-item').hasClass('active')) {
    $('.nav-drill > .nav-items > .nav-item').removeClass('active');
  }
}

/* eslint-disable */
function Utils() {}

Utils.prototype = {
  constructor: Utils,
  isElementInView(element, fullyInView) {
    const pageTop = $(window).scrollTop();
    const pageBottom = pageTop + $(window).height();
    const elementTop = $(element).offset().top;
    const elementBottom = elementTop + $(element).height();

    if (fullyInView === true) {
      return pageTop < elementTop && pageBottom > elementBottom;
    }
    return elementTop <= pageBottom && elementBottom >= pageTop;
  },
};
Utils = new Utils();
/* eslint-enable */
// Waves Effect
Waves.init();

const isHaveDataTable = () => {
  let checkDataTable = false;

  $('table').each(function () {
    if ($(this).attr('id') && $.fn.dataTable.isDataTable($(this))) {
      checkDataTable = true;
    }
  });
  return checkDataTable;
};

$(document).ready(function () {
  checkSize();
  /* setMenuWidth(); */
  $(window).resize(function () {
    checkSize();
    /* setMenuWidth(); */

    if (isHaveDataTable()) {
      adjustDataTableColumns();
    }
  });

  if ($('#paste-excel-textarea').length > 0) {
    TLN.append_line_numbers('paste-excel-textarea');
  }

  if (isHaveDataTable()) {
    addWithScrollTable();
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
      adjustDataTableColumns();
    });
  }

  $('.upload-list__next-step').click(function () {
    $(this).closest('.upload-list__step').addClass('d-none');
    $(this)
      .closest('.upload-list__step')
      .next('.upload-list__step')
      .removeClass('d-none');
    adjustDataTableColumns();
  });

  $('#apply-conditions-btn').click(function () {
    adjustDataTableColumns();
  });

  $('.upload-list__previous-step').click(function () {
    $(this).closest('.upload-list__step').addClass('d-none');
    $(this)
      .closest('.upload-list__step')
      .prev('.upload-list__step')
      .removeClass('d-none');
    adjustDataTableColumns();
  });

  $('#show-more-fields-link').click(function () {
    event.preventDefault();
    $('#show-more-fields-row').toggleClass('d-none');
    $(this).children('.show-more-text').toggleClass('d-none');
  });

  $('#add-contact-btn').click(function () {
    $('#added-contacts').toggleClass('d-none');
  });

  $('.confirmation .close').click(function () {
    $(this).closest('.confirmation').addClass('d-none');
  });

  $('.confirmation .close-no-css').click(function () {
    $(this).closest('.confirmation').addClass('d-none');
  });

  $('.form-control._save-list').on('change keyup', function () {
    if ($(this).val().length > 0) {
      $('.card').removeClass('_chosen');
      $(this).closest('.card').addClass('_chosen');
      $('.contact__finish').removeClass('_disabled');

      if ($('.selectpicker').length > 0) {
        $('.selectpicker').val('');
        $('.selectpicker').selectpicker('refresh');
      }

      if ($('._save-list-radio').length > 0) {
        $('._save-list-radio').each(function () {
          $(this).prop('checked', false);
        });
      }
    } else {
      $(this).closest('.card').removeClass('_chosen');
      $('.contact__finish').addClass('_disabled');
    }
  });

  $('._save-list-radio').click(function () {
    $('.card').removeClass('_chosen');
    $(this).closest('.tab-pane').find('._save-list').val('');
    $(this).closest('.card').addClass('_chosen');
    $('.contact__finish').removeClass('_disabled');
  });

  $(document).on('click', '.confirm__btn', function (e) {
    e.stopPropagation();

    const modal = $(this).next('.confirm__modal');
    const isElementInView = Utils.isElementInView(modal, true);
    const modalParentTable = $(this).closest('.dataTables_scrollBody');
    modal.removeClass('d-none');

    if (!isElementInView && modalParentTable.length === 0) {
      $(this)[0].nextElementSibling.scrollIntoView({
        block: 'end',
        behavior: 'smooth',
      });
    }

    if (modalParentTable.length > 0) {
      $(this).closest('td').addClass('table-confirm-show');
    }
  });

  $(document).on('click', '.confirm__modal .btn', function (e) {
    $('body').removeClass('actions-visible');
    $(this).closest('.confirm__modal').addClass('d-none');
    $(this).closest('td').removeClass('table-confirm-show');
  });

  $(document).on('click', '.confirm__modal', function (e) {
    if (e.target.classList.contains('confirm__modal')) {
      $(this).closest('.confirm__modal').addClass('d-none');
    }
  });

  $('._add-new-list').click(function () {
    $(this).addClass('d-none');
    $(this).next('.add-new-list-input').removeClass('d-none');
  });

  $('.add-new-list-input ._check').click(function () {
    $(this).closest('.add-new-list-input').addClass('d-none');
    $('._add-new-list').removeClass('d-none');
  });

  $('#copy-api-btn').click(function () {
    const copyText = document.getElementById('copy-api-input');
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    document.execCommand('copy');
  });

  $('#user-profile-btn-mobile').click(function () {
    $('body').removeClass('nav-is-toggled');
    $('.dropdown._user').addClass('show');
    $('.profile-dropdown').addClass('show');
    $('.hamburger').addClass('_with-overlay');
  });

  $('.btn_icon._fav').click(function () {
    $(this).toggleClass('active');
  });

  $(document).click(function (event) {
    $target = $(event.target);

    if (
      !$target.closest(
        '.profile-dropdown, #user-profile-btn-mobile, .select2-container--user-profile'
      ).length
    ) {
      $('.dropdown._user').removeClass('show');
      $('.profile-dropdown').removeClass('show');
      $('.hamburger').removeClass('_with-overlay');
    }
  });

  $('.profile-dropdown .close').click(function () {
    $('.dropdown._user').removeClass('show');
    $('.profile-dropdown').removeClass('show');
    $('.hamburger').removeClass('_with-overlay');
  });

  if ($('.create-campaign__timing-col-radio').length > 0) {
    $('.create-campaign__timing-col-radio input:checked')
      .closest('.create-campaign__timing-col')
      .addClass('_active');
    $('.create-campaign__timing-col-radio input').change(function () {
      $('.create-campaign__timing-col').removeClass('_active');
      $(this).closest('.create-campaign__timing-col').addClass('_active');
    });
  }

  $('.nav-drill>.nav-items>.nav-item').hover(
    function () {
      $('body').addClass('navigation-hovered');
    },
    function () {
      $('body').removeClass('navigation-hovered');
    }
  );

  // Navigation
  const navExpand = [].slice.call(document.querySelectorAll('.nav-expand'));
  const backLink = `<li class="nav-back"><a class="nav-back-link" href="javascript:;"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><path id="ic_arrow_back_24px" d="M24,12.75H8.787l6.987-6.987L14,4,4,14,14,24l1.763-1.762L8.787,15.25H24Z" transform="translate(-4 -4)" fill="#fff"/></svg></a></li>`;

  navExpand.forEach((item) => {
    item
      .querySelector('.nav-expand-content')
      .insertAdjacentHTML('afterbegin', backLink);
    item
      .querySelector('.nav-item-link')
      .addEventListener('click', () => item.classList.add('active'));
    item
      .querySelector('.nav-back-link')
      .addEventListener('click', () => item.classList.remove('active'));
  });

  const ham = document.getElementById('ham');

  if (ham) {
    ham.addEventListener('click', function () {
      document.body.classList.toggle('nav-is-toggled');
    });
  }

  // Stop transitions on resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    document.body.classList.add('animation-stopper');
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      document.body.classList.remove('animation-stopper');
    }, 400);
  });

  $('.dropdown._actions, .dropdown._more, .dropdown.dropdown-with-overlay').on(
    'show.bs.dropdown',
    function () {
      $('body').addClass('actions-visible');
    }
  );
  $('.dropdown._actions, .dropdown._more, .dropdown.dropdown-with-overlay').on(
    'hide.bs.dropdown',
    function () {
      $('body').removeClass('actions-visible');
      $(
        '.dropdown._actions .confirm__modal, .dropdown._more .confirm__modal'
      ).addClass('d-none');
    }
  );
  $('.dropdown._actions, .dropdown._more').addClass('js-withShowListner');
  // add spinner for table

  $(document).on('click', '.dropdown._user .dropdown-menu', function (e) {
    e.stopPropagation();
  });
});

// Stop transitions on page load
$(window).on('load', function () {
  $('body').removeClass('animation-stopper');

  // add event for rendered select
  $('.selectpicker[data-live-search]').each(function () {
    $(this).on(
      'changed.bs.select',
      function (e, clickedIndex, isSelected, previousValue) {
        $(this).closest('.tab-pane').find('.card._chosen ._save-list').val('');
        $('.card').removeClass('_chosen');
        $(this).closest('.card').addClass('_chosen');
        $('.contact__finish').removeClass('_disabled');
      }
    );
  });
});

const DEFAULT_DATA_TABLE_CONFIG = {
  scrollX: true,
  scrollCollapse: true,
  order: [],
  aoColumnDefs: [
    {
      bSortable: false,
      aTargets: ['nosort'],
    },
  ],
  sDom:
    't<"d-flex justify-content-between align-content-center diriq-table__bottom"l<"d-flex align-content-center"ip>>',
  oLanguage: {
    sLengthMenu: 'View _MENU_',
    sInfo: '_START_ – _END_ of _TOTAL_',
  },
  initComplete() {
    $('.diriq-table__wrapper').removeClass('loading');
  },
};

const FIXED_DATA_TABLE_CONFIG = {
  fixedColumns: {
    leftColumns: 2,
    rightColumns: 1,
  },
  colReorder: {
    fixedColumnsLeft: 2,
  },
};

// Open appropriate tab with hash link
const url = document.location.toString();
if (url.match('#')) {
  $(`.nav-tabs a[href="#${url.split('#')[1]}"]`).tab('show');
  if (location.hash) {
    setTimeout(function () {
      window.scrollTo(0, 0);
    }, 1);
  }
}

$('.nav-tabs a').on('shown.bs.tab', function (e) {
  if (history.pushState) {
    history.pushState(null, null, e.target.hash);
  } else {
    window.location.hash = e.target.hash; // Polyfill for old browsers
  }
});

const setDropdownActions = (tableWrapper) => {
  $(tableWrapper)
    .find('.dropdown._actions, .dropdown._more')
    .each(function () {
      if (!$(this).hasClass('js-withShowListner')) {
        $(this).on('show.bs.dropdown', function (e) {
          $('body').addClass('actions-visible');
        });
        $(this).on('hide.bs.dropdown', function () {
          $('body').removeClass('actions-visible');
        });
        $(this).addClass('js-withShowListner');
      }
    });
};

const setDataTableActions = (table) => {
  const tableWrapper = table
    .table()
    .container()
    .closest('.diriq-table__wrapper');

  setDropdownActions(tableWrapper);

  $(tableWrapper)
    .find('th input[type=checkbox]')
    .click(function () {
      if ($(this).is(':checked')) {
        $(tableWrapper).find('td input[type=checkbox]').prop('checked', true);
      } else {
        $(tableWrapper).find('td input[type=checkbox]').prop('checked', false);
      }
    });
};

const createSelect2ByClass = (
  className,
  selectOptions,
  selectType = 'simple',
  selectData
) => {
  const selectTypeMap = [
    {
      type: 'quality',
      generator: (className, selectOptions, selectData) =>
        qualitySelect(className, selectOptions, selectData),
    },
    {
      type: 'simple',
      generator: (className, selectOptions) =>
        simpleSelect(className, selectOptions),
    },
    {
      type: 'date',
      generator: (className, selectOptions, selectData) =>
        dateSelect(className, selectOptions, selectData),
    },
  ];

  selectTypeMap.forEach((item) => {
    if (item.type === selectType && $(className).length > 0) {
      item.generator(className, selectOptions, selectData);
    }
  });

  if ($(className).length > 0) {
    $(className).each(function () {
      $(this).data('select2').$dropdown.addClass('select2-container--lg');
    });
    $(className).on('change', function () {
      $(this)
        .closest('.condition-col')
        .next('.condition-col')
        .removeClass('d-none');
    });
  }

  if ($('.dropdown._user').find(className).length > 0) {
    $('.dropdown._user')
      .find(className)
      .each(function () {
        $(this)
          .data('select2')
          .$dropdown.addClass('select2-container--user-profile');
      });
  }

  if ($('#reset-conditions-btn').length > 0) {
    $('#reset-conditions-btn').click(function () {
      $(className).val('').trigger('change');
    });
  }
};

$(document).on(
  {
    mouseenter(event) {
      const table = $(event.target)
        .parents('.dataTables_wrapper')
        .find('table.dataTable');

      trIndex = $(this).index();
      table.find(`tbody tr:eq(${trIndex})`).addClass('hover');
    },
    mouseleave(event) {
      const table = $(event.target)
        .parents('.dataTables_wrapper')
        .find('table.dataTable');

      trIndex = $(this).index();
      table.find(`tbody tr:eq(${trIndex})`).removeClass('hover');
    },
  },
  '.dataTables_wrapper tbody tr'
);

const getUserLink = (id, url, searchParams = '') => {
  return `/${url}/${id}${searchParams}`;
};

const dateSelect = (className, selectOptions, selectData) => {
  const OPTIONS = selectData;

  let selectedIndex = null;

  if ($(className).find('option').length > 0) {
    $(className)
      .find('option')
      .each(function (index, value) {
        if ($(this).is(':selected')) selectedIndex = index;
        this.remove();
      });
  }

  const selects = document.querySelectorAll(className);

  selects.forEach((select) => {
    if (selectOptions.placeholder) {
      const defaultOption = document.createElement('option');
      defaultOption.text = selectOptions.placeholder.text;
      defaultOption.value = '';
      defaultOption.selected = true;
      select.options.add(defaultOption);
    }
    OPTIONS.forEach((item, index) => {
      const option = document.createElement('option');

      if (item.value && item.label) {
        option.value = item.value;
        option.title = ' ';
        if (index === selectedIndex) option.selected = true;
        option.text = generateSelectWithLabel(item.label);
      }

      select.options.add(option);
    });
  });

  $(className).select2({
    ...selectOptions,
    templateResult: (state) => generateSelectWithLabel(state),
    escapeMarkup(markup) {
      return markup;
    },
  });
};

const qualitySelect = (className, selectOptions, selectData = null) => {
  let QUALITY_OPTIONS = selectData;
  let selectedIndex = null;
  if ($(className).find('option').length > 0) {
    if (!selectData) QUALITY_OPTIONS = [];
    $(className)
      .find('option')
      .each(function (index) {
        if (typeof QUALITY_OPTIONS === 'object' && !selectData)
          QUALITY_OPTIONS.push(this.value);
        if ($(this).is(':selected')) selectedIndex = index;
        this.remove();
      });
  }

  const qualitySelect = document.querySelectorAll(className);

  qualitySelect.forEach((select) => {
    if (selectOptions.placeholder) {
      const defaultOption = document.createElement('option');
      defaultOption.text = selectOptions.placeholder.text;
      defaultOption.value = '';
      defaultOption.selected = true;
      select.options.add(defaultOption);
    }
    QUALITY_OPTIONS.forEach((item, index) => {
      const option = document.createElement('option');

      option.value = item;
      if (index === selectedIndex) option.selected = true;
      option.text = generateQualitySelect(item);

      select.options.add(option);
    });
  });

  $(className).select2({
    ...selectOptions,
    templateResult: (state) => generateQualitySelect(state),
    escapeMarkup(markup) {
      return markup;
    },
  });
};

const generateQualitySelect = (state) => {
  let data = '';
  if (state.id) {
    data = state.id;
  } else if (state.text) {
    return `<span class="select2-results__clear">${state.text}</span>`;
  } else {
    data = state;
  }
  let qualityIcon = '';
  DEFAULT_SELECT_OPTIONS.quality.forEach((item) => {
    qualityIcon += `<span></span>`;
  });

  return `<div class="quality-icon _${data}">${qualityIcon}</div>`;
};

const generateSelectWithLabel = (state) => {
  let data = '';

  if (state.id) {
    data = state.id;
  } else if (state.text) {
    return `<span class="select2-results__clear">${state.text}</span>`;
  } else {
    data = state;
  }

  const currentItem = DEFAULT_SELECT_OPTIONS.createdDate.find(
    (item) => item.value === data
  );

  if (currentItem) {
    return currentItem.label;
  }

  return data;
};

const simpleSelect = (className, selectOptions) => {
  $(className).each(function () {
    $(this).select2(selectOptions);
    if ($(this).val() === '' || $(this).val().length === 0) {
      $(this).next().addClass('select2-container--empty');
    }
    $(this).on(
      ('select2:unselect', 'select2:select', 'select2:clear', 'select2:close'),
      function (e) {
        if ($(this).val() === '' || $(this).val().length === 0) {
          $(this).next().addClass('select2-container--empty');
        } else {
          $(this).next().removeClass('select2-container--empty');
        }
      }
    );
  });
};

const disabledBtn = document.querySelector('.locked button');

const checkbox = document.querySelector('.locked .switcher');
if (checkbox) {
  checkbox.addEventListener('change', functionname, false);
}

function functionname() {
  const isChecked = checkbox.checked;
  if (isChecked) {
    disabledBtn.classList.remove('_disabled');
  } else {
    disabledBtn.classList.add('_disabled');
  }
}

const createInputsWithShortcode = (dataShortcodeKey, params) => {
  const elements = document.querySelectorAll(
    `input[data-shortcode="${dataShortcodeKey}"]`
  );

  const createDropdown = (elWrapper, dropdownItems, input) => {
    input.classList.add('form-control__shortcode');

    const dropdownToggle = document.createElement('div');
    dropdownToggle.classList.add('dropdown-toggle');
    dropdownToggle.dataset.toggle = 'dropdown';
    dropdownToggle.innerHTML = '<span>Shortcode</span>';

    const dropdownMenu = document.createElement('div');
    dropdownMenu.classList.add(
      'dropdown-menu',
      'dropdown-menu-right',
      '_actions'
    );

    const dropdownMenuInner = document.createElement('div');
    dropdownMenuInner.classList.add('dropdown-menu-inner');
    dropdownMenu.appendChild(dropdownMenuInner);

    dropdownItems.forEach((item) => {
      const dropdownMenuItem = document.createElement('div');
      dropdownMenuItem.dataset.value = item.value;
      dropdownMenuItem.innerText = item.label;
      dropdownMenuItem.classList.add('dropdown-item');

      dropdownMenuItem.addEventListener('click', () => {
        const emojiInput = elWrapper.querySelector('.emoji-wysiwyg-editor');
        emojiInput.innerHTML += dropdownMenuItem.dataset.value;
        input.value += dropdownMenuItem.dataset.value;
      });
      dropdownMenuInner.appendChild(dropdownMenuItem);
    });

    const dropdownWrapper = document.createElement('div');
    dropdownWrapper.classList.add('dropdown', 'dropdown-shortcode', '_user');
    dropdownWrapper.appendChild(dropdownToggle);
    dropdownWrapper.appendChild(dropdownMenu);
    elWrapper.appendChild(dropdownWrapper);
  };

  elements.forEach((element) => {
    const elWrapper = element.parentElement;

    createDropdown(elWrapper, params, element);
  });
};
