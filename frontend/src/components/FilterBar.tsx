// frontend/src/components/FilterBar.tsx

import { useState, useRef, useEffect } from 'react';
import { IonIcon } from '@ionic/react';
import { chevronDownOutline, filterOutline } from 'ionicons/icons';
import styles from './FilterBar.module.css';

interface FilterBarProps {
    onCategoryChange?: (category: string) => void;
    onSortChange?: (sortBy: string) => void;
}

export function FilterBar({ onCategoryChange, onSortChange }: FilterBarProps) {
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
    const [selectedSort, setSelectedSort] = useState<string>('Nome A-Z');

    const categoryRef = useRef<HTMLDivElement>(null);
    const sortRef = useRef<HTMLDivElement>(null);

    const categories = [
        'Todas',
        'Frutas e Legumes',
        'Ovos e Laticínios',
        'Grãos e Cereais',
        'Carnes',
        'Outros'
    ];

    const sortOptions = [
        { label: 'Nome A-Z', value: 'name-asc' },
        { label: 'Nome Z-A', value: 'name-desc' },
    ];

    // Fecha os dropdowns quando clicar fora
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
                setShowCategoryDropdown(false);
            }
            if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
                setShowSortDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleCategorySelect = (category: string) => {
        setSelectedCategory(category);
        setShowCategoryDropdown(false);
        onCategoryChange?.(category);
    };

    const handleSortSelect = (sortOption: { label: string; value: string }) => {
        setSelectedSort(sortOption.label);
        setShowSortDropdown(false);
        onSortChange?.(sortOption.value);
    };

    return (
        <section className={styles.filterSection}>
            <h2 className={styles.title}>Nossos Parceiros:</h2>
            <div className={styles.controlsContainer}>
                {/* Dropdown de Filtros */}
                <div className={styles.dropdownWrapper} ref={categoryRef}>
                    <button
                        className={styles.filterButton}
                        onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                    >
                        <span>Filtros: {selectedCategory}</span>
                        <IonIcon icon={chevronDownOutline} />
                    </button>
                    {showCategoryDropdown && (
                        <div className={styles.dropdown}>
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    className={`${styles.dropdownItem} ${selectedCategory === category ? styles.active : ''}`}
                                    onClick={() => handleCategorySelect(category)}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Dropdown de Ordenação */}
                <div className={styles.dropdownWrapper} ref={sortRef}>
                    <button
                        className={styles.filterButton}
                        onClick={() => setShowSortDropdown(!showSortDropdown)}
                    >
                        <span>Ordenar: {selectedSort}</span>
                        <IonIcon icon={filterOutline} />
                    </button>
                    {showSortDropdown && (
                        <div className={styles.dropdown}>
                            {sortOptions.map((option) => (
                                <button
                                    key={option.value}
                                    className={`${styles.dropdownItem} ${selectedSort === option.label ? styles.active : ''}`}
                                    onClick={() => handleSortSelect(option)}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
