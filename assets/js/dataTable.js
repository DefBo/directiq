let tableSearchParams = '';

const getUserPageUrl = (userId, url) => {
  let searchParams = tableSearchParams;
  let userDetailsPage = url;
  userDetailsPage = userDetailsPage.replace(
    '/contactdetails/0',
    `/contactdetails/${userId}`
  ); // add contact id in here
  if (searchParams) {
    // push extra params at the end
    if (userDetailsPage.indexOf('?') !== -1) {
      // means there is already a query param, other params are just appended in the end
      userDetailsPage = `${userDetailsPage}${searchParams}`;
    } else {
      // means the url has no query params, first char should be '?'
      if (searchParams.startsWith('&')) {
        // drop the first '&' if is present
        searchParams = searchParams.substring(1);
      }
      // join original url with extra params
      userDetailsPage = `${userDetailsPage}?${searchParams}`;
    }
  }
  return userDetailsPage;
};

const createDataTable = (id, restConfig, isFixedCollumns) => {
  let config = {
    ...restConfig,
    initComplete(settings, json) {
      setDropdownActions('.diriq-table__wrapper');
    },
  };
  if (!document.querySelector(id)) return;

  const tableElement = document.querySelector(id);

  const tableWrapper =
    tableElement && tableElement.closest('.diriq-table__wrapper');
  if (tableWrapper) {
    tableWrapper.classList.add('loading');
  }

  if (isFixedCollumns) {
    config = { ...FIXED_DATA_TABLE_CONFIG, ...config };
  }

  const table = $(id).DataTable({ ...DEFAULT_DATA_TABLE_CONFIG, ...config });

  const filterButton =
    tableWrapper && tableWrapper.querySelector('.diriq-table__filter-btn');
  const tFootInputsWrapper =
    tableWrapper && tableWrapper.querySelectorAll('.diriq-table th');

  $(table.table().container())
    .find('tfoot')
    .each(function () {
      $(this)
        .find('th')
        .each(function (i) {
          $(this).find('input').attr('data-index', i);
        });
    });

  if (filterButton && tableWrapper) {
    filterButton.addEventListener('click', () => {
      tableWrapper.classList.toggle('_filter-hidden');
      if (tableWrapper.classList.contains('_filter-hidden')) {
        tFootInputsWrapper.forEach((th) => {
          const input = th.querySelector('input');

          if (input) input.value = '';

          const select = th.querySelector('select');
          if (select) {
            $(select).val(null).trigger('change');
          }
        });

        filterTable();
      }
    });
  }

  let canSearch = false;

  function filterTable(element = null, value) {
    if (table.settings()[0].jqXHR) table.settings()[0].jqXHR.abort();
    if (!element) return table.search('').columns().search('').draw();
    table.column($(element).data('index')).search(value).draw();
  }

  table.on('xhr', function () {
    const data = table.ajax.params();
    const draftSearchParams = [];
    data.columns.forEach((collumn) => {
      if (collumn.search.value !== '') {
        draftSearchParams.push(`${[collumn.name]}=${collumn.search.value}`);
      }
    });

    if (draftSearchParams.length > 0) {
      tableSearchParams = draftSearchParams.join('&');
    }

    tableWrapper && tableWrapper.classList.remove('loading');

    setDropdownActions('.diriq-table__wrapper');
  });

  $(table.table().container()).on('keyup', 'tfoot input', function () {
    const input = this;

    if ($(this).val().length > 2) {
      canSearch = true;
      filterTable(input, input.value);
    } else if (canSearch) {
      filterTable(input, '');
      canSearch = false;
    }
  });

  $(table.table().container()).on('change', 'tfoot select', function () {
    const input = this;

    filterTable(input, input.value);
  });

  $(table.table().container())
    .find(
      'thead th, .DTFC_LeftHeadWrapper th:not(.nosort), .DTFC_RightHeadWrapper th:not(.nosort)'
    )
    .append(
      '<svg class="sort-arrow" xmlns="http://www.w3.org/2000/svg" width="4.211" height="10" viewBox="0 0 4.211 10"><path d="M13,10.105,10.895,8V9.579H3v1.053h7.895v1.579Z" transform="translate(12.211 -3) rotate(90)" fill="#212b35"/></svg>'
    );

  setDataTableActions(table);
  adjustDataTableColumns();
};
