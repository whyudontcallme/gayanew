// Catalog functionality
document.addEventListener('DOMContentLoaded', function () {
    // Filter and sort functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const sortSelect = document.getElementById('sort-select');
    const capacityRange = document.getElementById('capacity-range');
    const capacityValue = document.getElementById('capacity-value');
    const productCards = document.querySelectorAll('.product-card');
    const compareCheckboxes = document.querySelectorAll('.compare-checkbox');
    const comparePanel = document.getElementById('compare-panel');
    const compareCount = document.getElementById('compare-count');
    const compareBtn = document.getElementById('compare-btn');
    const clearCompareBtn = document.getElementById('clear-compare');

    let selectedProducts = new Set();
    let currentFilter = 'all';
    let currentSort = 'capacity';

    // Filter by energy type
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.dataset.filter;
            applyFilters();
        });
    });

    // Capacity range filter
    if (capacityRange) {
        capacityRange.addEventListener('input', function () {
            capacityValue.textContent = this.value;
            applyFilters();
        });
    }

    // Sort functionality
    if (sortSelect) {
        sortSelect.addEventListener('change', function () {
            currentSort = this.value;
            sortProducts();
        });
    }

    // Apply filters
    function applyFilters() {
        const maxCapacity = capacityRange ? parseInt(capacityRange.value) : 2000;

        productCards.forEach(card => {
            const energyType = card.dataset.energy;
            const capacity = parseInt(card.dataset.capacity);

            let show = true;

            // Filter by energy type
            if (currentFilter !== 'all' && energyType !== currentFilter) {
                show = false;
            }

            // Filter by capacity
            if (capacity > maxCapacity) {
                show = false;
            }

            // Apply visibility with animation
            if (show) {
                card.style.display = 'flex';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                }, 10);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    }

    // Sort products
    function sortProducts() {
        const containers = document.querySelectorAll('.products-grid');

        containers.forEach(container => {
            const cards = Array.from(container.querySelectorAll('.product-card'));

            cards.sort((a, b) => {
                if (currentSort === 'capacity') {
                    return parseInt(a.dataset.capacity) - parseInt(b.dataset.capacity);
                } else if (currentSort === 'capacity-desc') {
                    return parseInt(b.dataset.capacity) - parseInt(a.dataset.capacity);
                } else if (currentSort === 'name') {
                    return a.dataset.name.localeCompare(b.dataset.name);
                }
            });

            // Reorder with animation
            cards.forEach((card, index) => {
                card.style.order = index;
            });
        });
    }

    // Compare functionality
    compareCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            const productId = this.dataset.productId;

            if (this.checked) {
                if (selectedProducts.size < 3) {
                    selectedProducts.add(productId);
                } else {
                    this.checked = false;
                    alert('Вы можете сравнить максимум 3 модели');
                }
            } else {
                selectedProducts.delete(productId);
            }

            updateComparePanel();
        });
    });

    // Update compare panel
    function updateComparePanel() {
        const count = selectedProducts.size;
        compareCount.textContent = count;

        if (count > 0) {
            comparePanel.classList.add('active');
        } else {
            comparePanel.classList.remove('active');
        }

        compareBtn.disabled = count < 2;
    }

    // Clear comparison
    if (clearCompareBtn) {
        clearCompareBtn.addEventListener('click', function () {
            selectedProducts.clear();
            compareCheckboxes.forEach(cb => cb.checked = false);
            updateComparePanel();
        });
    }

    // Compare button
    if (compareBtn) {
        compareBtn.addEventListener('click', function () {
            if (selectedProducts.size >= 2) {
                openCompareModal();
            }
        });
    }

    // Open compare modal
    function openCompareModal() {
        const modal = document.getElementById('compare-modal');
        const tbody = modal.querySelector('tbody');
        tbody.innerHTML = '';

        // Get selected product data
        const products = Array.from(selectedProducts).map(id => {
            const card = document.querySelector(`[data-product-id="${id}"]`).closest('.product-card');
            return {
                name: card.dataset.name,
                capacity: card.dataset.capacity,
                energy: card.dataset.energy,
                dimensions: card.dataset.dimensions,
                power: card.dataset.power,
                noise: card.dataset.noise
            };
        });

        // Create comparison table rows
        const specs = [
            { label: 'Модель', key: 'name' },
            { label: 'Производительность', key: 'capacity', suffix: ' кг/сут' },
            { label: 'Тип энергии', key: 'energy' },
            { label: 'Габариты', key: 'dimensions' },
            { label: 'Потребление', key: 'power' },
            { label: 'Уровень шума', key: 'noise' }
        ];

        specs.forEach(spec => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>${spec.label}</strong></td>
                ${products.map(p => `<td>${p[spec.key]}${spec.suffix || ''}</td>`).join('')}
            `;
            tbody.appendChild(row);
        });

        modal.classList.add('active');
    }

    // Modal functionality
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.modal-close, .close-modal');

    closeButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            const modal = this.closest('.modal');
            modal.classList.remove('active');
        });
    });

    // Close modal on outside click
    modals.forEach(modal => {
        modal.addEventListener('click', function (e) {
            if (e.target === this) {
                this.classList.remove('active');
            }
        });
    });

    // Quick view functionality
    const quickViewButtons = document.querySelectorAll('.quick-view-btn');

    quickViewButtons.forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            const card = this.closest('.product-card');
            openQuickView(card);
        });
    });

    function openQuickView(card) {
        const modal = document.getElementById('quick-view-modal');
        const modalContent = modal.querySelector('.modal-body');

        modalContent.innerHTML = `
            <div class="quick-view-content">
                <div class="quick-view-image">
                    <img src="${card.querySelector('.product-image img').src}" alt="${card.dataset.name}">
                </div>
                <div class="quick-view-info">
                    <h2>${card.dataset.name}</h2>
                    <p class="product-capacity">${card.dataset.capacity} кг/сут</p>
                    <p class="product-energy">${card.dataset.energy === 'electric' ? 'Электрическая установка' : 'Газовая установка'}</p>
                    
                    <div class="specs-grid">
                        <div class="spec-item">
                            <i class="fas fa-ruler-combined"></i>
                            <div>
                                <strong>Габариты</strong>
                                <p>${card.dataset.dimensions}</p>
                            </div>
                        </div>
                        <div class="spec-item">
                            <i class="fas fa-bolt"></i>
                            <div>
                                <strong>Потребление</strong>
                                <p>${card.dataset.power}</p>
                            </div>
                        </div>
                        <div class="spec-item">
                            <i class="fas fa-volume-down"></i>
                            <div>
                                <strong>Уровень шума</strong>
                                <p>${card.dataset.noise}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="product-features">
                        ${card.querySelector('.product-features').innerHTML}
                    </div>
                    
                    <div class="product-actions">
                        <a href="contacts.html" class="btn btn-outline">Подробнее</a>
                        <a href="contacts.html" class="btn btn-primary">Узнать цену</a>
                    </div>
                </div>
            </div>
        `;

        modal.classList.add('active');
    }

    // Smooth scroll to categories
    const categoryLinks = document.querySelectorAll('.category-link');

    categoryLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);

            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Initialize
    applyFilters();
    sortProducts();
});
