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

const getUserLink = (id) => `${LINK_TO_USER_PAGE || '/'}${id}`;

const generateStatusSelect = (state) => {
	let data = '';

	if (state.id) {
		data = state.id;
	} else if (state.text) {
		return `<span class="select2-results__clear">${state.text}</span>`;
	} else {
		data = state;
	}

	return `<span class="table-status _${data.toLowerCase() === 'active' ? 'success' : 'danger'}">${data}</span>`;
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
		signal: cancel.signal
	}).catch(function(err) {
		console.warn(err);
	});
};

const TABLE_CHECKBOX_ACTIONS = {
	remove: (params) => removeSelectedRows(`${TABLE_API}/${LIST_ID}`, params)
};

const SELECT_TEMPLATES = {
	quality: (state) => generateQualitySelect(state),
	status: (state) => generateStatusSelect(state)
};

const DEFAULT_SELECT_OPTIONS = {
	quality: [ 1, 2, 3, 4, 5 ],
	status: [ 'active', 'passive' ]
};

const createCustomDataTable = async (id, config, isFixedColumns, api) => {
	const getData = async (url, options) => {
		if (cancelController) cancelController.abort();
		const cancel = new AbortController();
		cancelController = cancel;
		const response = await fetch(url, { ...options, signal: cancel.signal }).catch(function(err) {
			console.warn(err);
		});
		if (!response) return;
		return response.json();
	};

	const getTableData = (data) => {
		if (!data.errors) {
			return data.rows.map((row) => {
				var draftData = [];
				data.columns.forEach((column, index) => {
					var draftRow = row.cells.find((cell) => cell.position === index);
					draftRow ? draftData.push(draftRow.value) : draftData.push('');
				});
				return draftData;
			});
		}
	};

	const getSearchParams = () => {
		const params = { ...defaultSearchParams, ...globalSearchParams };
		return Object.keys(params)
			.map((keys) => {
				if (keys === 'tags' && typeof params[keys] === 'object' && params[keys].length > 0) {
					let tagsParams = [];
					params[keys].forEach((key, index) => {
						tagsParams.push(`${keys}=${key}`);
					});
					return tagsParams.join('&');
				}
				return `${keys}=${params[keys]}`;
			})
			.join('&');
	};

	const setListnerToCheckboxes = (inputs) => {
		if (inputs.length > 0) {
			inputs.forEach((input) => {
				input.addEventListener('click', () => {
					if (input.checked) {
						checkboxSelected.push(input.value);
					} else {
						checkboxSelected = checkboxSelected.filter((item) => item !== input.value);
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
					render: function(data) {
						return generateCustomSelect(column.name, data);
					}
				};
			if (column.name === 'id') {
				return {
					title: `<div class="dropdown">
								<a href="#" data-toggle="dropdown" class="dropdown-link-sm">
									<svg width="10.16" height="6">
										<use xlink:href="/assets/images/sprite.svg#check-col"></use>
									</svg>
								</a>
								
								<div class="dropdown-menu dropdown-menu-left _actions mt-5"
									aria-labelledby="moreMenuButton" data-id="table-checkbox-actions">
									<div class="dropdown-menu-inner">
										<a class="dropdown-item" data-action="remove" href="#">Remove</a>
										<a class="dropdown-item" href="#">Action Item 2</a>
										<a class="dropdown-item" href="#">Action Item 3</a>
									</div>
								</div>
							</div>
					`,
					render: function(data) {
						return `<div class="checkbox checkbox-single">
						<input type="checkbox" value="${data}" aria-label="Single checkbox One">
						<label></label>
					</div>`;
					}
				};
			}
			if (column.name === 'email') {
				return {
					title: column.displayName,
					render: function(data, type, row, meta) {
						return `<a href="${getUserLink(row[0])}" class="diriq-table__link">${data}</a>`;
					}
				};
			}
			if (column.name === 'status') {
				return {
					title: column.displayName,
					render: function(data) {
						return generateCustomSelect(column.name, data);
					}
				};
			}
			if (column.name === 'tags') {
				return {
					title: column.displayName,
					render: function(data) {
						let elements = '';
						data.forEach((tag) => {
							elements = `<span class="table-tag">${tag}</span>`;
						});
						return elements;
					}
				};
			}

			if (column.name === 'viewButton') {
				return {
					title: '',
					sorting: false,
					ordering: false,
					render: function(data, type, row, meta) {
						return `<div class="d-flex">
									<a href="${getUserLink(row[0])}" class="btn _sm _secondary">View</a>
									<div class="dropdown">
										<button type="button" class="btn _sm _primary ml-4 px-6" data-toggle="dropdown">
											<svg width="2" height="10">
												<use xlink:href="/assets/images/sprite.svg#more-dots"></use>
											</svg>
										</button>
										
										<div class="dropdown-menu dropdown-menu-right _actions mt-5"
											aria-labelledby="moreMenuButton">
											<div class="dropdown-menu-inner">
												<a class="dropdown-item" href="#">Action Item 1</a>
												<a class="dropdown-item" href="#">Action Item 2</a>
												<a class="dropdown-item" href="#">Action Item 3</a>
											</div>
										</div>
									</div>
								</div>`;
					}
				};
			}
			return { title: column.displayName };
		});
	};

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

		paginationButtonPrevious.addEventListener('click', (e) => {
			e.preventDefault();
			globalSearchParams = {
				...globalSearchParams,
				pageNumber: pageNumber - 1
			};

			filterTable();
		});

		data.prev
			? paginationButtonPrevious.classList.remove('disabled')
			: paginationButtonPrevious.classList.add('disabled');

		const paginationButtonNext = tableWrapper.querySelector('.paginate_button.next');
		paginationButtonNext.addEventListener('click', (e) => {
			e.preventDefault();
			globalSearchParams = {
				...globalSearchParams,
				pageNumber: pageNumber + 1
			};
			cancelController.abort();
			filterTable();
		});
		data.next ? paginationButtonNext.classList.remove('disabled') : paginationButtonNext.classList.add('disabled');
	};

	const generateSearchSelect = (column, parrent, isMuliple = false, isStatic = false) => {
		const select = document.createElement('select');
		select.setAttribute('required', '');
		select.name = column.name;
		select.id = column.name;
		select.dataset.placeholder = column.displayName;
		select.dataset.toggle = 'select2';
		select.classList.add('form-control');

		if (isMuliple) {
			select.multiple = 'multiple';
		} else {
			const defaultOption = document.createElement('option');
			defaultOption.text = `Select ${column.displayName}`;
			defaultOption.value = '';
			defaultOption.selected = true;
			select.options.add(defaultOption);
		}

		let options = [];

		if (isStatic) {
			options = DEFAULT_SELECT_OPTIONS[column.name];
		} else if (isMuliple) {
			options = column.options;
		}

		options.forEach((item) => {
			const option = document.createElement('option');

			option.value = isMuliple ? item.id : item;

			option.text = generateCustomSelect(column.name, isMuliple ? item.text : item);

			select.options.add(option);
		});
		parrent.appendChild(select);
	};

	const generateMultipleSelect = async (column, th, url) => {
		const responce = await fetch(url).catch(function(err) {
			console.error(err);
		});
		console.log(responce);
		if (responce) {
			const { data } = await responce.json();
			column = { ...column, options: data };
			generateSearchSelect(column, th, true);
		}
	};

	const addCustomColumn = (data) => {
		data.columns.push({
			displayName: '',
			isExtra: true,
			keyId: 9,
			name: 'viewButton',
			position: 8,
			type: 1
		});
		data.rows.forEach((cellWrap) => {
			cellWrap.cells.push({
				position: 8,
				value: ''
			});
		});
	};

	const filterTable = async () => {
		tableWrapper.classList.add('loading');
		draftfetchedData = await getData(`${TABLE_API}/${LIST_ID}?${getSearchParams()}`, true);

		if (!draftfetchedData) {
			tableWrapper.classList.remove('loading');
			return;
		}

		if (!draftfetchedData.errors) {
			fetchedData = draftfetchedData;
			addCustomColumn(fetchedData);
		}

		const tableData = getTableData(fetchedData);

		const fixedSorts = tableWrapper.querySelectorAll('.DTFC_Cloned .sorting');

		const draftfixedSorts = [];

		fixedSorts.length > 0 &&
			fixedSorts.forEach((field) => {
				draftfixedSorts.push({
					element: field,
					classes: field.className
				});
			});

		if (tableData) {
			table.clear();
			table.rows.add(tableData).draw();

			setCurrentPagination(fetchedData);

			checkboxSelected = [];
			setListnerToCheckboxes(tableWrapper.querySelectorAll('.checkbox-single input'));

			if (draftfixedSorts) {
				draftfixedSorts.forEach((field) => {
					field.classes.split(' ').forEach((className) => {
						field.element.classList.add(className);
					});
				});
			}
		}
		tableWrapper.classList.remove('loading');
	};

	if (isFixedColumns) {
		config = { ...FIXED_DATA_TABLE_CONFIG, ...config };
	}

	let defaultSearchParams = null;
	let globalSearchParams = {};
	let fetchedData = null;
	let checkboxSelected = [];

	const tableElement = document.querySelector(id);
	const tableWrapper = tableElement.closest('.diriq-table__wrapper');

	if (tableWrapper) {
		tableWrapper.classList.add('loading');
	}

	fetchedData = await getData(`${TABLE_API}/${LIST_ID}`);

	if (!fetchedData) return;

	addCustomColumn(fetchedData);

	defaultSearchParams = fetchedData.columns.reduce((accumulator, column) => {
		const columnName = column.keyId === 0 ? column.name : `extra[${column.keyId}]`;
		return { ...accumulator, [columnName]: '' };
	}, {});

	config = {
		...config,
		ordering: false,
		data: getTableData(fetchedData),
		columns: getColumnTitles(fetchedData)
	};

	const tFoot = document.createElement('tfoot');
	const tFootTr = document.createElement('tr');

	for (const column of fetchedData.columns) {
		const th = document.createElement('th');
		if (Object.keys(DEFAULT_SELECT_OPTIONS).some((item) => column.name === item)) {
			generateSearchSelect(column, th, false, true);
		} else if (column.name === 'tags') {
			await generateMultipleSelect(column, th, TAGS_API);
		} else if (COLUMN_WITHOUT_SEARCH.every((item) => column.name !== item)) {
			const input = document.createElement('input');
			input.classList.add('filter-input');
			input.placeholder = `Search ${column.displayName}`;
			input.type = 'text';
			input.autocomplete = 'none';
			input.dataset.name = column.keyId === 0 ? column.name : `extra[${column.keyId}]`;
			th.appendChild(input);
		}

		tFootTr.appendChild(th);
	}

	tFoot.appendChild(tFootTr);
	tableElement.appendChild(tFoot);

	var table = $(id).DataTable({ ...DEFAULT_DATA_TABLE_CONFIG, ...config });

	const tableCheckboxActions = tableWrapper.querySelectorAll('[data-id="table-checkbox-actions"]');
	const tFootInputsWrapper = tableWrapper.querySelectorAll('.diriq-table th');
	const tableHeads = tableWrapper.querySelectorAll('thead');
	const lengthSelect = tableWrapper.querySelector('.dataTables_length select');
	const filterButton = tableWrapper.querySelector('.diriq-table__filter-btn');
	const allSortElements = tableWrapper.querySelectorAll('.sorting_disabled');
	const body = document.querySelector('body');

	$('thead th, .DTFC_LeftHeadWrapper th:not(.nosort), .DTFC_RightHeadWrapper th:not(.nosort)').append(
		'<svg class="sort-arrow" xmlns="http://www.w3.org/2000/svg" width="4.211" height="10" viewBox="0 0 4.211 10"><path d="M13,10.105,10.895,8V9.579H3v1.053h7.895v1.579Z" transform="translate(12.211 -3) rotate(90)" fill="#212b35"/></svg>'
	);

	setListnerToCheckboxes(tableWrapper.querySelectorAll('.checkbox-single input'));
	tableHeads.forEach((head) => {
		const thSort = head.querySelectorAll('.sorting_disabled');

		thSort.forEach((th, index) => {
			if (
				COLLUMN_WITHOUT_ORDERING_NOT_EXTRA.every(
					(item) => fetchedData.columns[index].name !== item && !fetchedData.columns[index].isExtra
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
							orderDir: 'desc'
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
							orderDir: 'asc'
						};
						filterTable();
					}
				});
			}
		});
	});

	$('.diriq-table__wrapper select[data-toggle="select2"]').each(function() {
		const select = this;
		$(select).select2({
			templateResult: (state) => generateCustomSelect(this.id, state),
			minimumResultsForSearch: -1,
			escapeMarkup: function(markup) {
				return markup;
			},
			placeholder: {
				id: '-1',
				text: `Select ${select.dataset.placeholder}`
			},
			allowClear: true
		});
		$(select).on('select2:select', (e) => {
			const value = $(e.target).val();
			globalSearchParams = {
				...globalSearchParams,
				[e.target.name]: value,
				pageNumber: 1
			};

			filterTable();
		});
		$(select).on('select2:unselect', (e) => {
			const value = $(e.target).val();
			globalSearchParams = {
				...globalSearchParams,
				[e.target.name]: value,
				pageNumber: 1
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
						pageNumber: 1
					};
					filterTable();
				} else if (canSearch) {
					globalSearchParams = {
						...globalSearchParams,
						[input.dataset.name]: '',
						pageNumber: 1
					};
					filterTable();
					canSearch = false;
				}
			});
		}
	});

	setCurrentPagination(fetchedData);

	lengthSelect.addEventListener('change', (e) => {
		const value = Number.parseInt(e.target.value);

		globalSearchParams = {
			...globalSearchParams,
			pageSize: value,
			pageNumber:
				value * fetchedData.pageNumber > fetchedData.totalCount
					? Math.round(fetchedData.totalCount / value)
					: fetchedData.pageNumber
		};

		filterTable();
	});

	if (tableCheckboxActions.length > 0) {
		tableCheckboxActions.forEach((checkBoxWrapper) => {
			const dropdownItems = checkBoxWrapper.querySelectorAll('.dropdown-item');
			dropdownItems.forEach((item) => {
				if (item.dataset.action) {
					item.addEventListener('click', () => {
						TABLE_CHECKBOX_ACTIONS[item.dataset.action]({ data: checkboxSelected });
					});
				}
			});
		});
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

	filterButton.addEventListener('click', () => {
		body.classList.toggle('_filter-visible');
		if (!body.classList.contains('_filter-visible')) {
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
				pageSize: globalSearchParams.pageSize ? globalSearchParams.pageSize : '',
				orderBy: globalSearchParams.orderBy ? globalSearchParams.orderBy : '',
				orderDir: globalSearchParams.orderDir ? globalSearchParams.orderDir : ''
			};

			filterTable();
		}
	});
};
