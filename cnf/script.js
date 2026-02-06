/**
 * Multi-Select Dropdown Filtering for DataTables
 *
 * This script provides a reusable FilterTable class that enhances DataTables
 * with multi-select dropdown filters for each column.
 *
 * @author Lennart Pape
 * @author Elias Kuiter
 * @date 2026-02-06
 * @version 2.0.0
 * @requires jQuery, DataTables, PapaParse, Bootstrap
 */

// Dark Mode Toggle
(function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (prefersDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
})();

document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');

    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }
});

/**
 * FilterTable - Reusable DataTable with multi-select filters
 *
 * @param {Object} config - Configuration options
 * @param {string} config.csvFile - Path to CSV file
 * @param {string} config.tableSelector - jQuery selector for table element
 * @param {string} config.filtersContainerSelector - jQuery selector for active filters container
 * @param {string} config.clearButtonSelector - jQuery selector for clear all button
 * @param {number} [config.pageLength=5] - Default number of entries to show
 * @param {string[]} [config.skipColumns=[]] - Column names to skip for filtering
 * @param {string[]} [config.exactMatchColumns=[]] - Column names that should use exact match
 * @param {string[]} [config.numericSortColumns=[]] - Column names to sort numerically descending
 * @param {string} [config.splitDelimiter=','] - Delimiter for splitting multi-value cells
 * @param {boolean} [config.scrollToTopOnDraw=true] - Whether to scroll to top on table redraw
 */
class FilterTable {
    constructor(config) {
        this.config = {
            pageLength: 5,
            skipColumns: [],
            exactMatchColumns: [],
            numericSortColumns: [],
            splitDelimiter: ',',
            scrollToTopOnDraw: false,
            ...config
        };

        this.activeFilters = {};
        this.table = null;
        this.currentlyOpenDropdown = null;
        this.isFilteringInProgress = false;
        this.instanceId = 'ft-' + Date.now() + '-' + Math.random().toString(36).slice(2, 11);

        this.init();
    }

    init() {
        Papa.parse(this.config.csvFile, {
            download: true,
            header: true,
            skipEmptyLines: true,
            complete: (results) => this.onDataLoaded(results)
        });
    }

    onDataLoaded(results) {
        // Clean up any existing dropdowns for this instance
        $(`body > .multi-select-options[data-instance="${this.instanceId}"]`).remove();

        const data = results.data;
        const columns = Object.keys(data[0]).map(key => {
            if (this.config.exactMatchColumns.includes(key) || this.config.numericSortColumns.includes(key)) {
                return {
                    title: key,
                    data: key,
                    render: {
                        _: data => data.toString(),
                    }
                };
            }
            return {
                title: key,
                data: key
            };
        });

        // Build table header
        const thead = document.querySelector(`${this.config.tableSelector} thead`);
        const headerRow = "<tr>" + columns.map(c => `<th>${c.title}</th>`).join('') + "</tr>";
        const filterRow = "<tr>" + columns.map(() => `<th></th>`).join('') + "</tr>";
        thead.innerHTML = headerRow + filterRow;

        // Initialize DataTable
        this.table = $(this.config.tableSelector).DataTable({
            data: data,
            columns: columns,
            orderCellsTop: true,
            autoWidth: false,
            scrollX: true,
            responsive: false,
            scrollCollapse: true,
            columnDefs: [{ width: '125px', targets: '_all'}],
            pageLength: this.config.pageLength,
            lengthMenu: [[5, 10, 25, 50, 100, -1], [5, 10, 25, 50, 100, "All"]],
            initComplete: () => {
                setTimeout(() => this.initFilters(columns), 100);
            },
            language: {
                search: "Search:",
                lengthMenu: "Show _MENU_ entries",
                info: "Showing _START_ to _END_ of _TOTAL_ entries",
                paginate: { previous: "Previous", next: "Next" },
                zeroRecords: "No matching entries found"
            }
        });

        // Scroll to top on table redraw
        if (this.config.scrollToTopOnDraw) {
            this.table.on('draw', () => {
                $('html, body').animate({ scrollTop: 0 }, 10);
            });
        }

        // Sync header scroll with body scroll
        setTimeout(() => this.syncHeaderScroll(), 200);

        // Setup clear all button
        this.setupClearButton();

        // Setup filter badge click handler
        this.setupFilterBadgeHandler();
    }

    initFilters(columns) {
        const api = this.table;
        const tableSelector = this.config.tableSelector;

        api.columns().every((colIdx) => {
            const column = api.column(colIdx);
            const columnTitle = columns[colIdx].title;

            // Skip certain columns for filtering
            if (this.config.skipColumns.includes(columnTitle)) return;

            // Find filter container
            const wrapper = $(tableSelector).closest('.dataTables_wrapper');
            let container = wrapper.find('.dataTables_scrollHead thead tr')
                .eq(1)
                .find('th')
                .eq(colIdx);

            if (!container.length) {
                container = $(tableSelector + ' thead tr')
                    .eq(1)
                    .find('th')
                    .eq(colIdx);
            }

            if (!container.length) return;

            // Extract unique values
            let allValues = [];
            const shouldSplit = !this.config.exactMatchColumns.includes(columnTitle) &&
                               !this.config.numericSortColumns.includes(columnTitle);

            column.data().each((d) => {
                if (d !== null && d !== undefined) {
                    const value = d.toString().trim();
                    if (shouldSplit) {
                        allValues = allValues.concat(value.split(new RegExp(`[${this.config.splitDelimiter}]\\s*`)));
                    } else {
                        allValues.push(value);
                    }
                }
            });

            // Sort values
            if (this.config.numericSortColumns.includes(columnTitle)) {
                allValues = [...new Set(allValues)]
                    .filter(val => val)
                    .sort((a, b) => parseInt(b) - parseInt(a));
            } else {
                allValues = [...new Set(allValues)]
                    .filter(val => val)
                    .sort();
            }

            this.createMultiSelect(container, allValues, columnTitle);
        });
    }

    createMultiSelect(container, options, columnTitle) {
        const multiSelect = $('<div class="multi-select">');
        const dropdown = $('<div class="multi-select-dropdown"><span class="dropdown-text">All</span></div>');
        const optionsContainer = $('<div class="multi-select-options">');

        // Unique IDs for tracking and syncing dropdown state
        const uniqueId = 'dropdown-' + Date.now() + '-' + Math.random().toString(36).slice(2, 11);
        optionsContainer.attr('data-dropdown-id', uniqueId);
        optionsContainer.attr('data-column', columnTitle);
        optionsContainer.attr('data-instance', this.instanceId);
        dropdown.attr('data-dropdown-id', uniqueId);
        dropdown.attr('data-column', columnTitle);
        dropdown.attr('data-instance', this.instanceId);

        // Create "All" option
        const allOption = $('<div class="multi-select-option selected" data-value="">All</div>');
        optionsContainer.append(allOption);

        // Create individual options
        options.forEach(option => {
            const optionDiv = $('<div class="multi-select-option" data-value="' + option + '">' + option + '</div>');
            optionsContainer.append(optionDiv);
        });

        multiSelect.append(dropdown);

        // Toggle dropdown visibility
        const toggleDropdown = () => {
            $(`body > .multi-select-options[data-instance="${this.instanceId}"]`).not(optionsContainer).removeClass('show').hide();
            const isVisible = optionsContainer.hasClass('show');

            if (!isVisible) {
                const rect = dropdown[0].getBoundingClientRect();
                const containerWidth = dropdown.outerWidth();

                optionsContainer.css({
                    'top': (rect.bottom + 2) + 'px',
                    'left': rect.left + 'px',
                    'width': containerWidth + 'px'
                }).addClass('show');

                this.currentlyOpenDropdown = optionsContainer;
            } else {
                optionsContainer.removeClass('show').hide();
                this.currentlyOpenDropdown = null;
            }
        };

        // Handle dropdown click
        dropdown.off('click mousedown touchstart').on('click mousedown touchstart', (e) => {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            if (e.type === 'touchstart' || e.type === 'mousedown') {
                toggleDropdown();
            }

            return false;
        });

        // Handle option selection
        optionsContainer.on('click', '.multi-select-option', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const value = String($(e.currentTarget).data('value'));

            if (value === '') {
                // "All" selected - clear filters
                optionsContainer.find('.multi-select-option').removeClass('selected');
                $(e.currentTarget).addClass('selected');
                this.activeFilters[columnTitle] = [];
                dropdown.find('.dropdown-text').text('All').removeClass('selected-values');

                this.isFilteringInProgress = true;
                this.applyFilters();
                this.updateActiveFiltersDisplay();
                this.isFilteringInProgress = false;

                optionsContainer.removeClass('show');
                this.currentlyOpenDropdown = null;
                e.stopImmediatePropagation();
            } else {
                // Individual option selected
                allOption.removeClass('selected');
                $(e.currentTarget).toggleClass('selected');

                if (!this.activeFilters[columnTitle]) {
                    this.activeFilters[columnTitle] = [];
                }

                if ($(e.currentTarget).hasClass('selected')) {
                    if (!this.activeFilters[columnTitle].includes(value)) {
                        this.activeFilters[columnTitle].push(value.toString());
                    }
                } else {
                    this.activeFilters[columnTitle] = this.activeFilters[columnTitle].filter(v => v !== value);
                }

                // Update dropdown display text
                if (this.activeFilters[columnTitle].length === 0) {
                    allOption.addClass('selected');
                }
                this.updateDropdownText(dropdown, this.activeFilters[columnTitle]);

                this.isFilteringInProgress = true;
                this.applyFilters();
                this.updateActiveFiltersDisplay();
                this.isFilteringInProgress = false;

                // Reposition after table redraw
                setTimeout(() => {
                    if (optionsContainer.hasClass('show')) {
                        const rect = dropdown[0].getBoundingClientRect();
                        optionsContainer.css({
                            'top': (rect.bottom + 2) + 'px',
                            'left': rect.left + 'px'
                        });
                    }
                }, 50);
            }
        });

        // Helper: Check if click is outside dropdown
        const isOutsideDropdown = (e) => {
            const clickedDropdown = $(e.target).closest(`.multi-select-dropdown[data-dropdown-id="${uniqueId}"]`).length > 0;
            const clickedOptions = $(e.target).closest(`.multi-select-options[data-dropdown-id="${uniqueId}"]`).length > 0;
            return !clickedDropdown && !clickedOptions;
        };

        // Helper: Close dropdown
        const closeDropdown = () => {
            optionsContainer.removeClass('show');
            if (this.currentlyOpenDropdown === optionsContainer) {
                this.currentlyOpenDropdown = null;
            }
        };

        // Close on outside click
        $(document).on('click mousedown', (e) => {
            if (isOutsideDropdown(e)) {
                closeDropdown();
            }
        });

        // Close on scroll
        const wrapper = $(this.config.tableSelector).closest('.dataTables_wrapper');
        wrapper.find('.dataTables_scrollBody').on('scroll', () => {
            if (!this.isFilteringInProgress) {
                closeDropdown();
            }
        });

        $(window).on('scroll', () => {
            if (!this.isFilteringInProgress) {
                closeDropdown();
            }
        });

        $(document).on('wheel mousewheel', (e) => {
            if (!this.isFilteringInProgress && isOutsideDropdown(e)) {
                closeDropdown();
            }
        });

        // Reposition on window resize
        $(window).on('resize', () => {
            if (optionsContainer.hasClass('show')) {
                const rect = dropdown[0].getBoundingClientRect();
                const containerWidth = dropdown.outerWidth();
                optionsContainer.css({
                    'top': (rect.bottom + 2) + 'px',
                    'left': rect.left + 'px',
                    'width': containerWidth + 'px'
                });
            }
        });

        container.empty().append(multiSelect);
        $('body').append(optionsContainer);
    }

    updateDropdownText(dropdown, filters) {
        if (filters.length === 0) {
            dropdown.find('.dropdown-text').text('All').removeClass('selected-values').removeAttr('title');
        } else {
            const firstValue = filters[0];
            const remainingCount = filters.length - 1;
            const maxLengthOneFilter = 20;
            const maxLengthMoreFilters = 3;

            let displayText;

            if (remainingCount === 0) {
                if (firstValue.length > maxLengthOneFilter) {
                    displayText = firstValue.substring(0, maxLengthOneFilter) + '...';
                } else {
                    displayText = firstValue;
                }
            } else {
                let truncatedFirst = firstValue.substring(0, maxLengthMoreFilters) + '...';
                displayText = `${truncatedFirst} (+${remainingCount} more)`;
            }

            const fullText = filters.join(', ');
            dropdown.find('.dropdown-text')
                .text(displayText)
                .addClass('selected-values')
                .attr('title', fullText);
        }
    }

    applyFilters() {
        this.table.columns().every((colIdx) => {
            const column = this.table.column(colIdx);
            const columnTitle = column.header().textContent;
            const filters = this.activeFilters[columnTitle] || [];

            if (filters.length === 0) {
                column.search('', true, false);
            } else {
                if (this.config.exactMatchColumns.includes(columnTitle)) {
                    // Exact match
                    const pattern = '^(' + filters
                        .map(f => $.fn.dataTable.util.escapeRegex(f.toString()))
                        .join('|') + ')$';
                    column.search(pattern, true, false);
                } else {
                    // Word boundaries only for alphanumeric values, otherwise match anywhere
                    const pattern = '(' + filters
                        .map(f => {
                            const escaped = $.fn.dataTable.util.escapeRegex(f);
                            const startsWithWord = /^\w/.test(f);
                            const endsWithWord = /\w$/.test(f);

                            return (startsWithWord ? '\\b' : '') + escaped + (endsWithWord ? '\\b' : '');
                        })
                        .join('|') + ')';
                    column.search(pattern, true, false);
                }
            }
        });
        this.table.draw();
    }

    updateActiveFiltersDisplay() {
        const container = $(this.config.filtersContainerSelector);
        const clearBtn = $(this.config.clearButtonSelector);

        container.empty();

        let hasFilters = false;
        for (const [column, values] of Object.entries(this.activeFilters)) {
            if (values.length > 0) {
                hasFilters = true;
                values.forEach(value => {
                    const badge = $('<span class="filter-badge">')
                        .text(`${column}: ${value}`)
                        .attr('data-column', column)
                        .attr('data-value', value)
                        .attr('data-instance', this.instanceId)
                        .append('<span class="remove">×</span>');
                    container.append(badge);
                });
            }
        }

        if (hasFilters) {
            clearBtn.show();
        } else {
            container.html('<span class="text-muted">No filters applied</span>');
            clearBtn.hide();
        }
    }

    setupFilterBadgeHandler() {
        $(document).on('click', `.filter-badge[data-instance="${this.instanceId}"]`, (e) => {
            const badge = $(e.currentTarget);
            const column = badge.data('column');
            const value = String(badge.data('value'));

            if (this.activeFilters[column]) {
                this.activeFilters[column] = this.activeFilters[column].filter(v => v !== value);
            }

            this.applyFilters();
            this.updateActiveFiltersDisplay();

            // Find and update the correct header dropdown
            const wrapper = $(this.config.tableSelector).closest('.dataTables_wrapper');
            let targetHeader = null;
            $(this.config.tableSelector + ' thead tr:first th').each((idx, th) => {
                if ($(th).text().trim() === column) {
                    targetHeader = wrapper.find('.dataTables_scrollHead thead tr:nth-child(2) th').eq(idx);
                    if (!targetHeader.length) {
                        targetHeader = $(this.config.tableSelector + ' thead tr:nth-child(2) th').eq(idx);
                    }
                }
            });

            // Update options in body-appended container
            const optionsContainer = $(`body > .multi-select-options[data-instance="${this.instanceId}"][data-column="${column}"]`);

            if (targetHeader && targetHeader.length) {
                targetHeader.find(`.multi-select-option[data-value="${value}"]`).removeClass('selected');

                if (this.activeFilters[column].length === 0) {
                    targetHeader.find('.multi-select-option[data-value=""]').addClass('selected');
                }
                this.updateDropdownText(targetHeader.find('.multi-select-dropdown'), this.activeFilters[column]);
            }

            // Update body-appended container highlighting
            if (optionsContainer.length) {
                optionsContainer.find(`.multi-select-option[data-value="${value}"]`).removeClass('selected');

                if (this.activeFilters[column].length === 0) {
                    optionsContainer.find('.multi-select-option[data-value=""]').addClass('selected');
                }
            }
        });
    }

    setupClearButton() {
        $(this.config.clearButtonSelector).on('click', () => {
            this.activeFilters = {};
            this.table.search('').columns().search('').draw();

            const wrapper = $(this.config.tableSelector).closest('.dataTables_wrapper');
            wrapper.find('.multi-select-option').removeClass('selected');
            wrapper.find('.multi-select-option[data-value=""]').addClass('selected');
            wrapper.find('.dropdown-text').text('All').removeClass('selected-values').removeAttr('title');

            $(`body > .multi-select-options[data-instance="${this.instanceId}"] .multi-select-option`).removeClass('selected');
            $(`body > .multi-select-options[data-instance="${this.instanceId}"] .multi-select-option[data-value=""]`).addClass('selected');

            this.updateActiveFiltersDisplay();
        });
    }

    syncHeaderScroll() {
        const wrapper = $(this.config.tableSelector).closest('.dataTables_wrapper');
        const scrollBody = wrapper.find('.dataTables_scrollBody');
        const scrollHeadInner = wrapper.find('.dataTables_scrollHeadInner');
        const scrollBodyTable = wrapper.find('.dataTables_scrollBody table');
        const scrollHeadTable = wrapper.find('.dataTables_scrollHead table');

        if (scrollBody.length && scrollHeadInner.length) {
            const bodyWidth = scrollBodyTable.outerWidth();
            scrollHeadTable.css('width', bodyWidth + 'px');
            scrollBody.off('scroll').on('scroll', function() {
                const scrollLeft = $(this).scrollLeft();
                scrollHeadTable.css('margin-left', -scrollLeft + 'px');
            });
            scrollBody.trigger('scroll');
        }
    }
}

// Adjust columns on window resize for all tables
$(window).on('resize', function () {
    $('.dataTable').each(function() {
        const dt = $(this).DataTable();
        if (dt) {
            dt.columns.adjust().draw(false);
        }
    });
});
