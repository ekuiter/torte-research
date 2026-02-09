/**
 * Multi-Select Dropdown Filtering for DataTables
 *
 * This script provides a reusable FilterTable class that enhances DataTables
 * with multi-select dropdown filters for each column.
 *
 * @author Lennart Pape
 * @author Elias Kuiter
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

function setTextNodeContent(node, text) {
    while (node.firstChild) {
        node.removeChild(node.firstChild);
    }
    node.appendChild(document.createTextNode(text));
}

function setupCollapsibleSection(section) {
    if (!section || section.dataset.collapsibleInitialized === 'true') return;

    const heading = section.querySelector('h1, h2, h3, h4, h5, h6');
    if (!heading) return;

    const parent = heading.parentElement || section;
    const content = document.createElement('div');
    content.className = 'section-content';

    let sibling = heading.nextSibling;
    while (sibling) {
        const next = sibling.nextSibling;
        content.appendChild(sibling);
        sibling = next;
    }

    parent.appendChild(content);

    const preview = document.createElement('p');
    preview.className = 'section-preview';
    preview.setAttribute('aria-hidden', 'true');
    parent.insertBefore(preview, content);

    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'section-toggle';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', `Toggle ${heading.textContent.trim()}`);
    toggle.innerHTML = '<span class="toggle-icon"></span>';

    heading.appendChild(toggle);

    const updatePreview = () => {
        const text = extractFirstSentence(content);
        if (text) {
            preview.textContent = text;
            preview.style.display = 'block';
        } else {
            preview.textContent = '';
            preview.style.display = 'none';
        }
    };

    section.classList.add('section-collapsed');
    updatePreview();

    const toggleSection = () => {
        const isCollapsed = section.classList.toggle('section-collapsed');
        toggle.setAttribute('aria-expanded', isCollapsed ? 'false' : 'true');
        if (isCollapsed) {
            updatePreview();
            preview.style.display = '';
        } else {
            preview.style.display = 'none';
        }
    };

    preview.addEventListener('click', () => {
        if (section.classList.contains('section-collapsed')) {
            toggleSection();
        }
    });

    toggle.addEventListener('click', (event) => {
        event.stopPropagation();
        toggleSection();
    });

    heading.addEventListener('click', (event) => {
        if (event.target.closest('a.section-anchor') || event.target.closest('.section-toggle')) {
            return;
        }
        toggleSection();
    });

    section.dataset.collapsibleInitialized = 'true';
}

function setupCollapsibleSections() {
    document.querySelectorAll('section').forEach(section => {
        setupCollapsibleSection(section);
    });
}

function collapseAllSections() {
    document.querySelectorAll('section').forEach(section => {
        if (!section.classList.contains('section-collapsed')) {
            section.classList.add('section-collapsed');
            const toggle = section.querySelector('.section-toggle');
            if (toggle) {
                toggle.setAttribute('aria-expanded', 'false');
            }
            const preview = section.querySelector('.section-preview');
            if (preview) {
                preview.style.display = '';
            }
        }
    });
}

function setupCollapseAllTrigger() {
    const collapseAll = document.getElementById('collapse-all');
    if (!collapseAll) return;
    collapseAll.addEventListener('click', () => {
        if (window.location.hash) {
            const newUrl = window.location.pathname + window.location.search;
            window.history.replaceState(null, '', newUrl);
        }
        collapseAllSections();
    });
}

function expandSectionForAnchor() {
    const hash = window.location.hash;
    if (!hash) return;
    const target = document.getElementById(hash.slice(1));
    if (!target) return;

    const section = target.closest('section');
    if (!section || !section.classList.contains('section-collapsed')) return;

    section.classList.remove('section-collapsed');
    const toggle = section.querySelector('.section-toggle');
    if (toggle) {
        toggle.setAttribute('aria-expanded', 'true');
    }
    const preview = section.querySelector('.section-preview');
    if (preview) {
        preview.style.display = 'none';
    }
}

function extractFirstSentence(container) {
    if (!container) return '';
    const candidates = container.querySelectorAll('p, li, blockquote');
    let text = '';

    for (const node of candidates) {
        const candidate = node.textContent.trim();
        if (candidate) {
            text = candidate;
            break;
        }
    }

    if (!text) {
        const fallback = container.textContent.trim();
        text = fallback || '';
    }

    if (!text) return '';

    const match = text.match(/(.+?[.!?])(\s|$)/);
    if (match) {
        return match[1].trim();
    }

    return text.split(/\s+/).slice(0, 20).join(' ');
}

function resolveRelativeUrl(baseUrl, relativeUrl) {
    try {
        return new URL(relativeUrl, baseUrl).toString();
    } catch (error) {
        return relativeUrl;
    }
}

function loadMarkdownSections() {
    const markdownSections = document.querySelectorAll('[data-markdown]');
    if (!markdownSections.length) return;

    if (!window.marked || typeof window.marked.parse !== 'function') {
        markdownSections.forEach(section => {
            setTextNodeContent(section, 'Markdown renderer not available.');
        });
        return;
    }

    const renderer = new window.marked.Renderer();
    renderer.link = (href, title, text) => {
        let linkHref = href;
        let linkTitle = title;
        let linkText = text;

        if (href && typeof href === 'object') {
            linkHref = href.href;
            linkTitle = href.title;
            linkText = href.text;
        }

        const safeHref = linkHref ? String(linkHref).replace(/"/g, '&quot;') : '';
        const safeTitle = linkTitle ? String(linkTitle).replace(/"/g, '&quot;') : '';
        const safeText = linkText ? String(linkText).replace(/</g, '&lt;').replace(/>/g, '&gt;') : '';
        const titleAttr = safeTitle ? ` title="${safeTitle}"` : '';

        const isLocal = safeHref.startsWith('#') || safeHref.startsWith('mailto:') || !/^[a-z][a-z0-9+.-]*:/i.test(safeHref);
        const targetAttr = isLocal ? '' : ' target="_blank" rel="noopener noreferrer"';

        return `<a href="${safeHref}"${targetAttr}${titleAttr}>${safeText}</a>`;
    };

    markdownSections.forEach(section => {
        const markdownPath = section.getAttribute('data-markdown');
        if (!markdownPath) return;

        fetch(markdownPath, { cache: 'no-cache' })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load ${markdownPath} (${response.status})`);
                }
                return response.text();
            })
            .then(markdown => {
                const baseUrl = new URL(markdownPath, window.location.href).toString();
                const rawHtml = window.marked.parse(markdown, {
                    renderer,
                    gfm: true,
                    breaks: false,
                    headerIds: false,
                    mangle: false
                });

                const template = document.createElement('template');
                template.innerHTML = rawHtml;
                section.classList.add('markdown-content');

                const headings = template.content.querySelectorAll('h1, h2, h3, h4, h5, h6');
                headings.forEach(heading => {
                    const headingText = heading.textContent.trim();
                    const idBase = headingText
                        .toLowerCase()
                        .replace(/[^a-z0-9\s-]/g, '')
                        .replace(/\s+/g, '-');
                    if (!idBase) return;
                    let id = idBase;
                    if (section.id) {
                        id = `${section.id}-${idBase}`;
                        if (idBase === section.id) {
                            id = section.id;
                        }
                    }
                    heading.id = id;

                    const anchor = document.createElement('a');
                    anchor.href = `#${id}`;
                    anchor.className = 'section-anchor';
                    anchor.setAttribute('aria-label', `Permalink to ${headingText}`);
                    anchor.textContent = '#';
                    heading.appendChild(anchor);
                });

                template.content.querySelectorAll('a[href]').forEach(link => {
                    const href = link.getAttribute('href');
                    if (!href) return;
                    if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('http')) return;
                    link.setAttribute('href', resolveRelativeUrl(baseUrl, href));
                });

                section.replaceChildren(template.content);
                setupCollapsibleSection(section);
                expandSectionForAnchor();
            })
            .catch(error => {
                console.error(error);
                const isFile = window.location.protocol === 'file:';
                const hint = isFile
                    ? 'This page is opened via file://. Run a local web server so fetch can read markdown files.'
                    : 'Check that the file exists and the path is correct.';
                setTextNodeContent(section, `Unable to load ${markdownPath}. ${hint}`);
            });
    });
}

document.addEventListener('DOMContentLoaded', loadMarkdownSections);
document.addEventListener('DOMContentLoaded', setupCollapsibleSections);
document.addEventListener('DOMContentLoaded', setupCollapseAllTrigger);
window.addEventListener('hashchange', expandSectionForAnchor);
document.addEventListener('DOMContentLoaded', expandSectionForAnchor);

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
 * @param {string[]} [config.commaSplitColumns] - Column names where cell values should be split by comma (defaults to all non-skipped columns)
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
            commaSplitColumns: null,
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
        const renderMarkdown = (cellData) => {
            if (!cellData) return '';
            let result = cellData.toString();
            // Render markdown links [text](url)
            result = result.replace(
                /\[([^\]]+)\]\(([^)]+)\)/g,
                (_match, text, url) => {
                    const safeUrl = url.replace(/"/g, '&quot;');
                    const safeText = text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
                    return `<a href="${safeUrl}" target="_blank" rel="noopener noreferrer">${safeText}</a>`;
                }
            );
            // Render backticks as code
            result = result.replace(/`([^`]+)`/g, '<code>$1</code>');
            return result;
        };

        const columns = Object.keys(data[0]).map(key => {
            return {
                title: key,
                data: key,
                render: renderMarkdown
            };
        });

        if (!Array.isArray(this.config.commaSplitColumns) || this.config.commaSplitColumns.length === 0) {
            this.config.commaSplitColumns = columns
                .map(column => column.title)
                .filter(title => !this.config.skipColumns.includes(title));
        }

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
            lengthMenu: [[5, 10, 25, 50, 100, -1], [5, 10, 25, 50, 100, "all"]],
            initComplete: () => {
                setTimeout(() => this.initFilters(columns), 100);
            },
            language: {
                search: "",
                searchPlaceholder: "Search ...",
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

            // Helper to clean filter values: strip markdown and parenthetical content
            const cleanFilterValue = (val) => {
                let cleaned = val;
                // Remove markdown links [text](url) -> text
                cleaned = cleaned.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
                // Remove backticks
                cleaned = cleaned.replace(/`([^`]+)`/g, '$1');
                // Remove parenthetical content
                cleaned = cleaned.replace(/\s*\([^)]*\)/g, '');
                return cleaned.trim();
            };

            // Extract unique values
            let allValues = [];
            const shouldSplit = this.config.commaSplitColumns.includes(columnTitle);

            column.data().each((d) => {
                if (d !== null && d !== undefined) {
                    const value = cleanFilterValue(d.toString().trim());
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

        // Show table now that filters are ready
        $(this.config.tableSelector).closest('.dataTables_wrapper').addClass('table-ready');

        // Hide loading indicator
        $(this.config.tableSelector + 'Loading').addClass('hidden');
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

        const repositionDropdowns = () => {
            $(`body > .multi-select-options.show[data-instance="${this.instanceId}"]`).each(function() {
                const dropdownId = $(this).attr('data-dropdown-id');
                const dropdown = $(`.multi-select-dropdown[data-dropdown-id="${dropdownId}"]`);
                if (dropdown.length) {
                    const rect = dropdown[0].getBoundingClientRect();
                    $(this).css({
                        'top': (rect.bottom + 2) + 'px',
                        'left': rect.left + 'px'
                    });
                }
            });
        };

        if (hasFilters) {
            container.closest('.active-filters').slideDown({
                duration: 200,
                step: repositionDropdowns
            });
            clearBtn.show();
        } else {
            container.closest('.active-filters').slideUp({
                duration: 200,
                step: repositionDropdowns
            });
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

/**
 * Initialize multiple tables from configuration
 *
 * @param {Object[]} tables - Array of table configurations
 * @param {string} tables[].id - Section ID in HTML
 * @param {string} tables[].title - Table heading text
 * @param {string} tables[].csvFile - Path to CSV file
 * @param {string[]} [tables[].skipColumns] - Columns to skip for filtering
 * @param {string[]} [tables[].commaSplitColumns] - Columns with comma-separated values
 */
function initializeTables(tables) {
    tables.forEach(config => {
        const section = document.getElementById(config.id);
        if (!section) return;

        // Insert heading before the first paragraph
        const heading = document.createElement('h3');
        const headingText = document.createElement('span');
        headingText.textContent = config.title;
        const permalink = document.createElement('a');
        permalink.href = `#${config.id}`;
        permalink.className = 'section-anchor';
        permalink.setAttribute('aria-label', `Permalink to ${config.title}`);
        permalink.textContent = '#';
        heading.appendChild(headingText);
        heading.appendChild(permalink);
        section.insertBefore(heading, section.firstChild);

        // Create and append table elements
        const filtersHtml = `
            <div class="active-filters">
                <strong>Active Filters:</strong>
                <div id="${config.id}-filters-container" class="d-inline">
                    <span class="text-muted">No filters applied</span>
                </div>
                <button id="${config.id}-clear-filters" class="clear-all-btn" style="display: none;">Clear All</button>
            </div>
            <div class="loading" id="${config.id}TableLoading">
                <i class="fa-solid fa-spinner fa-spin"></i> Loading ...
            </div>
            <table id="${config.id}Table" class="table table-striped table-bordered" style="width:100%">
                <thead></thead>
            </table>
        `;

        // Find first h5 or end of section to insert before notes
        const notes = section.querySelector('h5');
        if (notes) {
            notes.insertAdjacentHTML('beforebegin', filtersHtml);
        } else {
            section.insertAdjacentHTML('beforeend', filtersHtml);
        }

        // Initialize FilterTable
        new FilterTable({
            csvFile: config.csvFile,
            tableSelector: `#${config.id}Table`,
            filtersContainerSelector: `#${config.id}-filters-container`,
            clearButtonSelector: `#${config.id}-clear-filters`,
            pageLength: -1,
            skipColumns: config.skipColumns || [],
            exactMatchColumns: [],
            commaSplitColumns: config.commaSplitColumns || [],
            numericSortColumns: []
        });
    });
}
