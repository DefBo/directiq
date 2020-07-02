function debounce(f, t) {
  return function (args) {
    const previousCall = this.lastCall;
    this.lastCall = Date.now();
    if (previousCall && this.lastCall - previousCall <= t) {
      clearTimeout(this.lastCallTimer);
    }
    this.lastCallTimer = setTimeout(() => f(args), t);
  };
}

const createEmptyTable = (id, tableWrapper) => {
  tableWrapper.classList.remove('loading');
  const table = $(id).DataTable({ ...DEFAULT_DATA_TABLE_CONFIG });

  generateInfoMessage(tableWrapper, 'dataTables_info-message');
  tableWrapper.classList.add('dataTables_wrapper--error');
};

const catchErrors = (fetchFunction) => {
  fetchFunction.catch();
};

const generateStatusSelect = (state) => {
  let data = '';

  if (state.id) {
    data = state.id;
  } else if (state.text) {
    return `<span class="select2-results__clear">${state.text}</span>`;
  } else {
    data = state;
  }

  if (data === data.toLowerCase()) {
    // locale keys are case-sensitive, this is done for table header
    data = data[0].toUpperCase() + data.slice(1);
  }

  return `<span class="table-status _${
    data.toLowerCase() === 'active' ? 'success' : 'danger'
  }">${locales[data]}</span>`;
};

const generateSimpleSelect = (state) => {
  let data = '';
  if (state.text) {
    data = state.text;
  } else {
    data = state;
  }

  return data;
};

const generateInfoMessage = (wrapper, className) => {
  const infoElement = document.createElement('div');
  infoElement.innerHTML = 'No data available in table';
  infoElement.classList.add(className);
  wrapper.appendChild(infoElement);
};

const generateCustomSelect = (name, state) => {
  if (SELECT_TEMPLATES[name]) return SELECT_TEMPLATES[name](state);
  return generateSimpleSelect(state);
};

let cancelController = null;

const removeSelectedRows = (url, params) => {
  if (cancelController) cancelController.abort();
  const cancel = new AbortController();
  cancelController = cancel;
  const response = fetch(url, {
    body: JSON.stringify({ ...params }),
    signal: cancel.signal,
  });
};

const TABLE_CHECKBOX_ACTIONS = {
  remove: (params) => removeSelectedRows(`${RESPONCE_URL}`, params),
};

const SELECT_TEMPLATES = {
  quality: (state) => generateQualitySelect(state),
  status: (state) => generateStatusSelect(state),
  createdDate: (state) => generateSelectWithLabel(state),
};

const createCustomDataTable = async (id, restConfig, customConfig) => {
  const { isFixedColumns, withViewButton, createFromForm } = customConfig;
  const { isList = false, listId = 0 } = customConfig;
  const { isTag = false, tagId = 0 } = customConfig;

  if (!document.querySelector(id)) return;

  const generateOuterControls = (filterCallback) => {
    const tableOuterControls = document.querySelector('.js-dataTable-control');
    if (tableOuterControls) {
      const buttons = tableOuterControls.querySelectorAll('.nav-link');
      if (buttons.length > 0) {
        buttons.forEach((button) => {
          button.addEventListener('click', (e) => {
            e.preventDefault();
            globalSearchParams = {
              ...globalSearchParams,
              [tableOuterControls.dataset.filter]: button.dataset.filterValue,
              pageNumber: 1,
            };
            filterCallback();
            buttons.forEach((button2) => {
              button2.classList.remove('active');
            });

            button.classList.add('active');
          });
        });
      }
    }
  };

  const getData = async (url) => {
    if (cancelController) cancelController.abort();
    const cancel = new AbortController();
    cancelController = cancel;
    let responsedData = null;

    let dataParams = {
      signal: cancel.signal,
    };

    if (createFromForm) {
      const formData = new FormData(
        document.querySelector(createFromForm.form)
      );

      dataParams = { ...dataParams, method: 'POST', body: formData };
    }

    await fetch(url, dataParams)
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          return response.json().then((data) => {
            responsedData = data;
          });
        }
        const error = new Error(response.statusText);
        error.response = response;
        throw error;
      })
      .catch((e) => {
        console.log(`Error: ${e.message}`);
        console.log(e.response);
      });
    return responsedData;
  };

  const getTableData = (data) => {
    if (!data) return [];
    const staticPositions = [];
    for (let i = 0; i < data.columns.length; i++) {
      if (data.columns[i].isExtra === false)
        staticPositions.push(data.columns[i].position);
    }
    // formula for retrieving correct cell per column relies like this:
    // if a column is standard (isExtra = false) then cell.position = column.position
    // otherwise, cell position is Maximum Static Position + ExtraColumn.Position.
    // reason behind this is that we want the user to be able to re-order columns
    const maxStaticPosition = Math.max(...staticPositions);
    return data.rows.map((row) => {
      const draftData = [];
      data.columns.forEach((column, index) => {
        const extraIndex = maxStaticPosition + column.position;
        const draftRow = row.cells.find((cell) =>
          !column.isExtra
            ? cell.position === index
            : cell.position === extraIndex
        );
        draftRow ? draftData.push(draftRow.value) : draftData.push('');
      });
      return draftData;
    });
  };

  const getSearchParams = (clearParams = false, withPrefix = false) => {
    const params = { ...defaultSearchParams, ...globalSearchParams };
    let sortedParams = Object.keys(params).map((keys) => {
      if (
        clearParams &&
        (params[keys] === '' ||
          params[keys] === undefined ||
          params[keys] === null ||
          keys === 'pageNumber' ||
          keys === 'pageSize' ||
          keys === 'orderBy' ||
          keys === 'orderDir')
      )
        return;
      if (
        keys === 'tags' &&
        typeof params[keys] === 'object' &&
        params[keys].length > 0
      ) {
        const tagsParams = [];
        params[keys].forEach((key, index) => {
          tagsParams.push(`${keys}=${key}`);
        });
        return tagsParams.join('&');
      }
      return `${keys}=${params[keys]}`;
    });

    if (clearParams) sortedParams = sortedParams.filter((obj) => !!obj);
    if (sortedParams.length > 0) {
      if (withPrefix) return `&${sortedParams.join('&')}`;
      return sortedParams.join('&');
    }
    return '';
  };

  const setListnerToCheckboxes = (inputs) => {
    if (inputs.length > 0) {
      inputs.forEach((input) => {
        input.addEventListener('click', () => {
          if (input.checked) {
            checkboxSelected.push(input.value);
          } else {
            checkboxSelected = checkboxSelected.filter(
              (item) => item !== input.value
            );
          }
        });
      });
    }
  };

  const getColumnTitles = (data) => {
    return data.columns.map((column) => {
      if (column.name === 'quality')
        return {
          title: column.displayName,
          render(data) {
            return generateCustomSelect(column.name, data);
          },
        };
      if (column.name === 'id') {
        return {
          title: `<div class="checkbox checkbox-single">
								<input type="checkbox" value="${data}" aria-label="Single checkbox One">
								<label></label>
							</div>
					`,
          render(data) {
            return `<div class="checkbox checkbox-single">
						<input type="checkbox" value="${data}" aria-label="Single checkbox One">
						<label></label>
					</div>`;
          },
        };
      }
      if (column.name === 'email') {
        return {
          title: column.displayName,
          render(data, type, row, meta) {
            return `<a href="${getUserPageUrl(
              row[0]
            )}" class="diriq-table__link">${data}</a>`;
          },
        };
      }
      if (column.name === 'status') {
        return {
          title: column.displayName,
          render(data) {
            return generateCustomSelect(column.name, data);
          },
        };
      }
      if (column.name === 'tags') {
        return {
          title: column.displayName,
          render(data) {
            let elements = '';
            data.forEach((tag) => {
              elements += `<span class="table-tag">${tag}</span>`;
            });
            return elements;
          },
        };
      }

      if (column.name === 'viewButton') {
        return {
          title: '',
          sorting: false,
          ordering: false,
          render(data, type, row, meta) {
            const isEnabled = row[5] === 'Active';

            return `<div class="d-flex">
            <a href="${getUserPageUrl(
              row[0]
            )}" class="btn _sm _secondary">View</a>
            <div class="dropdown _actions">
                <button type="button" class="btn _sm _primary ml-4 px-6" data-toggle="dropdown">
                    <svg width="2" height="10">
                        <use xlink:href="${absolutelyLinks}assets/images/sprite.svg#more-dots"></use>
                    </svg>
                </button>
        
                <div class="dropdown-menu dropdown-menu-right _actions mt-5" aria-labelledby="moreMenuButton">
                    <div class="dropdown-menu-inner">
                    ${
                      !isEnabled
                        ? ``
                        : `<div class="confirm__wrap"><button type="button" class="dropdown-item confirm__btn">${locales.Disable}</button>
                        <div class="confirm__modal _to-left d-none">
                            <div class="confirm__content">
                                <p class="confirm__text">
                                    You sure you want to delete this tag?
                                </p>
                            </div>
                            <div class="d-flex">
                                <button class="btn _lg _secondary">Nope</button>
                                <button data-id="${row[0]}" data-action="disable" class="btn _lg _primary btn-contact-disable">Sure</button>
                            </div>
                        </div></div>`
                    }
                    ${
                      !isList
                        ? ``
                        : `<div class="confirm__wrap"><button type="button" class="dropdown-item confirm__btn">${locales.RemoveFromList}</button>
                        <div class="confirm__modal _to-left d-none">
                            <div class="confirm__content">
                                <p class="confirm__text">
                                    You sure you want to delete this tag?
                                </p>
                            </div>
                            <div class="d-flex">
                                <button class="btn _lg _secondary">Nope</button>
                                <button class="btn _lg _primary btn-contact-remove-list" data-id="${row[0]}" data-listid="${listId}" data-action="removeFromList">Sure</button>
                            </div>
                        </div></div>`
                    }
                    ${
                      !isTag
                        ? ``
                        : `<div class="confirm__wrap"><button type="button" class="dropdown-item confirm__btn" data-action="removeFromTag">${locales.RemoveFromTag}</button>
                        <div class="confirm__modal _to-left d-none">
                            <div class="confirm__content">
                                <p class="confirm__text">
                                    You sure you want to delete this tag?
                                </p>
                            </div>
                            <div class="d-flex">
                                <button class="btn _lg _secondary">Nope</button>
                                <button class="btn _lg _primary btn-contact-remove-tag" data-id="${row[0]}" data-tagid="${tagId}">Sure</button>
                            </div>
                        </div></div>`
                    }
                    <div class="confirm__wrap">
                        <button type="button" class="dropdown-item confirm__btn">${
                          locales.Delete
                        }</button>
                        <div class="confirm__modal _to-left d-none">
                            <div class="confirm__content">
                                <p class="confirm__text">
                                    You sure you want to delete this tag?
                                </p>
                            </div>
                            <div class="d-flex">
                                <button class="btn _lg _secondary">Nope</button>
                                <button class="btn _lg _primary btn-contact-delete"  data-id="${
                                  row[0]
                                }"  data-action="delete" >Sure</button>
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </div>`;
          },
        };
      }
      return { title: column.displayName };
    });
  };

  const getUserPageUrl = (userId) => {
    let searchParams = getSearchParams(true, true);
    let userDetailsPage = LINK_TO_USER_PAGE;
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

  const setCurrentPagination = ({ pageSize, pageNumber, totalCount }) => {
    const data = {
      text: `${pageSize * pageNumber - pageSize + (totalCount > 0 && 1)} - ${
        totalCount < pageSize * pageNumber ? totalCount : pageSize * pageNumber
      } of ${totalCount}`,
      next: totalCount > pageSize * pageNumber,
      prev: pageNumber !== 1,
    };
    const paginationString = tableWrapper.querySelector('#data-table_info');
    const paginationWrapper = paginationString.parentNode;
    const clonePaginationWrapper = paginationWrapper.cloneNode(true);
    paginationWrapper.parentNode.appendChild(clonePaginationWrapper);
    paginationWrapper.remove();

    tableWrapper.querySelector('#data-table_info').innerHTML = data.text;

    const paginationButtonPrevious = tableWrapper.querySelector(
      '.paginate_button.previous'
    );

    paginationButtonPrevious.addEventListener('click', (e) => {
      e.preventDefault();
      globalSearchParams = {
        ...globalSearchParams,
        pageNumber: pageNumber - 1,
      };

      filterTable();
    });

    data.prev
      ? paginationButtonPrevious.classList.remove('disabled')
      : paginationButtonPrevious.classList.add('disabled');

    const paginationButtonNext = tableWrapper.querySelector(
      '.paginate_button.next'
    );
    paginationButtonNext.addEventListener('click', (e) => {
      e.preventDefault();
      globalSearchParams = {
        ...globalSearchParams,
        pageNumber: pageNumber + 1,
      };
      cancelController.abort();
      filterTable();
    });
    data.next
      ? paginationButtonNext.classList.remove('disabled')
      : paginationButtonNext.classList.add('disabled');
  };

  const generateSearchSelect = (
    column,
    parrent,
    isMuliple = false,
    isStatic = false
  ) => {
    const { name, displayName, options } = column;
    const select = document.createElement('select');
    select.setAttribute('required', '');
    select.name = name;
    select.id = name;
    select.dataset.placeholder = displayName;
    select.dataset.toggle = 'select2';
    select.classList.add('form-control');

    if (isMuliple) {
      select.multiple = 'multiple';
    } else {
      const defaultOption = document.createElement('option');
      defaultOption.text = `Select`;
      defaultOption.value = '';
      defaultOption.title = ' ';
      defaultOption.selected = true;
      select.options.add(defaultOption);
    }

    let draftOptions = [];

    if (isStatic) {
      draftOptions = DEFAULT_SELECT_OPTIONS[name];
    } else if (isMuliple) {
      draftOptions = options;
    }

    draftOptions.forEach((item) => {
      const option = document.createElement('option');

      if (item.value && item.label) {
        option.value = item.value;
        option.title = ' ';
        option.text = generateCustomSelect(name, item.label);
      } else {
        option.value = isMuliple ? item.id : item;
        option.title = ' ';
        option.text = generateCustomSelect(name, isMuliple ? item.text : item);
      }

      select.options.add(option);
    });
    parrent.appendChild(select);
  };

  const generateMultipleSelect = async (column, th, url) => {
    const responce = await getData(url);

    if (responce) {
      const { data } = responce;
      column = { ...column, options: data };
      generateSearchSelect(column, th, true);
    }
  };

  const addCustomColumn = (data) => {
    if (!withViewButton) return;
    data.columns.push({
      displayName: '',
      isExtra: true,
      keyId: 9,
      name: 'viewButton',
      position: 8,
      type: 1,
    });
    data.rows.forEach((cellWrap) => {
      cellWrap.cells.push({
        position: 8,
        value: '',
      });
    });
  };

  const filterDataTable = async () => {
    tableWrapper.classList.add('loading');
    draftfetchedData = await getData(`${RESPONCE_URL}?${getSearchParams()}`);

    if (createFromForm && draftfetchedData) {
      const { value } = draftfetchedData;
      if (value) {
        draftfetchedData = JSON.parse(value);
      }
    }

    if (!draftfetchedData || draftfetchedData.rows.length === 0) {
      tableWrapper.classList.add('dataTables_wrapper--empty');
      fetchedData = {
        ...fetchedData,
        rows: [],
        totalCount: 0,
        pageCount: 0,
        pageNumber: 1,
        hasNextPage: false,
      };
    } else {
      fetchedData = draftfetchedData;
      if (fetchedData.rows === []) {
        tableWrapper.classList.add('dataTables_wrapper--empty');
      } else {
        tableWrapper.classList.remove('dataTables_wrapper--empty');
      }
      tableWrapper.classList.remove('dataTables_wrapper--error');
    }

    if (fetchedData.columns) {
      addCustomColumn(fetchedData);

      const tableData = getTableData(fetchedData);

      const fixedSorts = tableWrapper.querySelectorAll('.DTFC_Cloned .sorting');

      const draftfixedSorts = [];

      fixedSorts.length > 0 &&
        fixedSorts.forEach((field) => {
          draftfixedSorts.push({
            element: field,
            classes: field.className,
          });
        });
      table.clear();
      table.rows.add(tableData).draw();

      setCurrentPagination(fetchedData);

      checkboxSelected = [];
      setListnerToCheckboxes(
        tableWrapper.querySelectorAll('.checkbox-single input')
      );

      if (draftfixedSorts) {
        draftfixedSorts.forEach((field) => {
          field.classes.split(' ').forEach((className) => {
            field.element.classList.add(className);
          });
        });
      }
    }
    tableWrapper.classList.remove('loading');

    if (createFromForm) {
      const {
        button: buttonSelector,
        buttonSave: buttonSaveSelector,
      } = createFromForm;
      const button = document.querySelector(buttonSelector);
      const buttonSave = document.querySelector(buttonSaveSelector);
      if (button && buttonSave && fetchedData) {
        buttonSave.innerHTML = buttonSave.innerHTML.replace(
          /\(.*\)/g,
          `(${fetchedData.totalCount})`
        );
      }
    }
  };

  const generateTable = async () => {
    fetchedData = await getData(RESPONCE_URL);

    if (createFromForm && fetchedData) {
      const { value } = fetchedData;
      if (value) {
        fetchedData = JSON.parse(value);
      }
    }

    if (!fetchedData) {
      return createEmptyTable(id, tableWrapper);
    }
    if (fetchedData.rows.length === 0) {
      tableWrapper.classList.add('dataTables_wrapper--empty');
    }
    tableWrapper.classList.remove('dataTables_wrapper--error');
    fetchedData && addCustomColumn(fetchedData);

    defaultSearchParams = fetchedData.columns.reduce((accumulator, column) => {
      const columnName =
        column.keyId === 0 ? column.name : `extra[${column.keyId}]`;
      return { ...accumulator, [columnName]: '' };
    }, {});

    config = {
      ...config,
      ordering: false,
      data: getTableData(fetchedData),
      columns: getColumnTitles(fetchedData),
    };

    const tFoot = document.createElement('tfoot');
    const tFootTr = document.createElement('tr');

    for (const column of fetchedData.columns) {
      const th = document.createElement('th');
      const isSearchEnabled = COLUMN_WITHOUT_SEARCH.every(
        (item) => column.name !== item
      );
      if (
        Object.keys(DEFAULT_SELECT_OPTIONS).some(
          (item) => column.name === item
        ) &&
        isSearchEnabled
      ) {
        generateSearchSelect(column, th, false, true);
      } else if (column.name === 'tags' && isSearchEnabled) {
        // eslint-disable-next-line no-await-in-loop
        await generateMultipleSelect(column, th, TAGS_API);
      } else if (isSearchEnabled) {
        const input = document.createElement('input');
        input.classList.add('filter-input');
        input.placeholder = `Search`;
        input.type = 'text';
        input.autocomplete = 'none';
        input.dataset.name =
          column.keyId === 0 ? column.name : `extra[${column.keyId}]`;
        th.appendChild(input);
      }

      tFootTr.appendChild(th);
    }

    tFoot.appendChild(tFootTr);
    tableElement.appendChild(tFoot);

    table = $(id).DataTable({ ...DEFAULT_DATA_TABLE_CONFIG, ...config });
  };

  const filterTable = debounce(() => filterDataTable(), 300);

  let config = { ...restConfig };

  if (isFixedColumns) {
    config = { ...FIXED_DATA_TABLE_CONFIG, ...config };
  }

  let defaultSearchParams = null;
  let globalSearchParams = {};
  let fetchedData = null;
  let checkboxSelected = [];

  generateOuterControls(filterTable);

  const tableElement = document.querySelector(id);
  const tableWrapper = tableElement.closest('.diriq-table__wrapper');

  let table = null;

  if (createFromForm) {
    const {
      button: buttonSelector,
      buttonSave: buttonSaveSelector,
    } = createFromForm;
    const button = document.querySelector(buttonSelector);
    const buttonSave = document.querySelector(buttonSaveSelector);
    if (button) {
      button.addEventListener('click', async () => {
        if (table) {
          filterTable();
        } else {
          if (tableWrapper) {
            tableWrapper.classList.add('loading');
          }
          await generateTable();
          if (fetchedData) {
            if (buttonSave) {
              buttonSave.innerHTML = `${buttonSave.innerHTML} (${fetchedData.totalCount})`;
            }
            addCustomSettingsToTable();
          }
        }
      });
    }
  } else {
    if (tableWrapper) {
      tableWrapper.classList.add('loading');
    }
    await generateTable();
  }

  const addCustomSettingsToTable = () => {
    generateInfoMessage(tableWrapper, 'dataTables_info-message');

    const tableCheckboxActions = tableWrapper.querySelectorAll(
      '[data-id="table-checkbox-actions"]'
    );
    const tFootInputsWrapper = tableWrapper.querySelectorAll('.diriq-table th');
    const tableHeads = tableWrapper.querySelectorAll('thead');
    const lengthSelect = tableWrapper.querySelector(
      '.dataTables_length select'
    );
    const filterButton = tableWrapper.querySelector('.diriq-table__filter-btn');
    const allSortElements = tableWrapper.querySelectorAll('.sorting_disabled');

    $(
      'thead th, .DTFC_LeftHeadWrapper th:not(.nosort), .DTFC_RightHeadWrapper th:not(.nosort)'
    ).append(
      '<svg class="sort-arrow" xmlns="http://www.w3.org/2000/svg" width="4.211" height="10" viewBox="0 0 4.211 10"><path d="M13,10.105,10.895,8V9.579H3v1.053h7.895v1.579Z" transform="translate(12.211 -3) rotate(90)" fill="#212b35"/></svg>'
    );

    setListnerToCheckboxes(
      tableWrapper.querySelectorAll('.checkbox-single input')
    );

    tableHeads.forEach((head) => {
      const thSort = head.querySelectorAll('.sorting_disabled');

      thSort.forEach((th, index) => {
        if (
          COLLUMN_WITHOUT_ORDERING_NOT_EXTRA.every(
            (item) =>
              fetchedData.columns[index].name !== item &&
              !fetchedData.columns[index].isExtra
          )
        ) {
          th.classList.remove('sorting_disabled');
          th.classList.add('sorting');
          if (fetchedData.columns[index].name === COLLUMN_DEFAULT_SORT.name) {
            th.classList.add(`sorting_${COLLUMN_DEFAULT_SORT.dir}`);
          }
          th.addEventListener('click', () => {
            if (th.classList.contains('sorting_asc')) {
              allSortElements.forEach((th2) => {
                th2.classList.remove('sorting_desc');
                th2.classList.remove('sorting_asc');
              });

              th.classList.add('sorting_desc');

              globalSearchParams = {
                ...globalSearchParams,
                orderBy: fetchedData.columns[index].name,
                orderDir: 'desc',
              };
              filterTable();
            } else if (!th.classList.contains('sorting_asc')) {
              allSortElements.forEach((th3) => {
                th3.classList.remove('sorting_desc');
                th3.classList.remove('sorting_asc');
              });

              th.classList.add('sorting_asc');

              globalSearchParams = {
                ...globalSearchParams,
                orderBy: fetchedData.columns[index].name,
                orderDir: 'asc',
              };
              filterTable();
            }
          });
        }
      });
    });

    $('.diriq-table__wrapper select[data-toggle="select2"]').each(function () {
      const select = this;
      $(select).select2({
        templateResult: (state) => generateCustomSelect(this.id, state),
        minimumResultsForSearch: -1,
        escapeMarkup(markup) {
          return markup;
        },
        placeholder: {
          id: '-1',
          text: `Select`,
        },
        allowClear: true,
      });
      $(select).on('select2:select', (e) => {
        const value = $(e.target).val();
        globalSearchParams = {
          ...globalSearchParams,
          [e.target.name]: value,
          pageNumber: 1,
        };

        filterTable();
      });
      $(select).on('select2:unselect', (e) => {
        const value = $(e.target).val();
        globalSearchParams = {
          ...globalSearchParams,
          [e.target.name]: value,
          pageNumber: 1,
        };

        filterTable();
      });
    });

    tFootInputsWrapper.forEach((inputWrapper, i) => {
      const input = inputWrapper.querySelector('input.filter-input');
      if (input) {
        let canSearch = false;

        input.dataset.id = i;

        input.addEventListener('input', () => {
          if (input.value.length > 2) {
            canSearch = true;
            globalSearchParams = {
              ...globalSearchParams,
              [input.dataset.name]: input.value,
              pageNumber: 1,
            };
            filterTable();
          } else if (canSearch) {
            globalSearchParams = {
              ...globalSearchParams,
              [input.dataset.name]: '',
              pageNumber: 1,
            };
            filterTable();
            canSearch = false;
          }
        });
      }
    });

    setCurrentPagination(fetchedData);

    lengthSelect.addEventListener('change', (e) => {
      const value = Number.parseInt(e.target.value, 10);

      globalSearchParams = {
        ...globalSearchParams,
        pageSize: value,
        pageNumber:
          value * fetchedData.pageNumber > fetchedData.totalCount
            ? Math.round(fetchedData.totalCount / value)
            : fetchedData.pageNumber,
      };

      filterTable();
    });

    if (tableCheckboxActions.length > 0) {
      tableCheckboxActions.forEach((checkBoxWrapper) => {
        const dropdownItems = checkBoxWrapper.querySelectorAll(
          '.dropdown-item'
        );
        dropdownItems.forEach((item) => {
          if (item.dataset.action) {
            item.addEventListener('click', () => {
              TABLE_CHECKBOX_ACTIONS[item.dataset.action]({
                data: checkboxSelected,
              });
            });
          }
        });
      });
    }

    if ($('.diriq-table__wrapper._with-endpoint').length > 0) {
      $('.diriq-table__wrapper._with-endpoint').each(function () {
        const tableWrapper = this;
        $(tableWrapper).addClass('loading');
      });
    }

    $('.datatable._contact-details-lists input:checkbox').change(function () {
      if ($(this).is(':checked')) {
        $(this).closest('tr').addClass('_active');
      } else {
        $(this).closest('tr').removeClass('_active');
      }
    });

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

        globalSearchParams = {
          pageNumber: 1,
          pageSize: globalSearchParams.pageSize
            ? globalSearchParams.pageSize
            : '',
          orderBy: globalSearchParams.orderBy ? globalSearchParams.orderBy : '',
          orderDir: globalSearchParams.orderDir
            ? globalSearchParams.orderDir
            : '',
        };

        filterTable();
      }
    });

    setDataTableActions(table);
    adjustDataTableColumns();
  };
  if (table) addCustomSettingsToTable();
};
