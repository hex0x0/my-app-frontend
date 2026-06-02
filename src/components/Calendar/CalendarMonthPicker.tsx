import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import styles from "./calendar-month-picker.module.css";

interface CalendarMonthPickerProps {
	value: string; // Format: "YYYY-MM"
	onChange: (value: string) => void;
	minDate?: Date;
	placeholder?: string;
	className?: string;
}

function CalendarMonthPicker({
	value,
	onChange,
	minDate,
	placeholder = "Select month",
	className = "",
}: CalendarMonthPickerProps): React.ReactElement {
	const { t } = useTranslation();
	const [isOpen, setIsOpen] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);

	const currentYear = new Date().getFullYear();

	// Derive year and month from value prop
	const selectedYear = value ? parseInt(value.split("-")[0]) : new Date().getFullYear();
	const selectedMonth = value ? parseInt(value.split("-")[1]) : new Date().getMonth() + 1;

	// Display year for navigation (can be different from selected year while browsing)
	const [displayYear, setDisplayYear] = useState<number>(selectedYear);

	const months = [
		{ value: 1, key: "january", label: t("calendarSelect.january") },
		{ value: 2, key: "february", label: t("calendarSelect.february") },
		{ value: 3, key: "march", label: t("calendarSelect.march") },
		{ value: 4, key: "april", label: t("calendarSelect.april") },
		{ value: 5, key: "may", label: t("calendarSelect.may") },
		{ value: 6, key: "june", label: t("calendarSelect.june") },
		{ value: 7, key: "july", label: t("calendarSelect.july") },
		{ value: 8, key: "august", label: t("calendarSelect.august") },
		{ value: 9, key: "september", label: t("calendarSelect.september") },
		{ value: 10, key: "october", label: t("calendarSelect.october") },
		{ value: 11, key: "november", label: t("calendarSelect.november") },
		{ value: 12, key: "december", label: t("calendarSelect.december") },
	];

	// Close dropdown when clicking outside
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		}

		if (isOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isOpen]);

	const handleMonthSelect = (month: number) => {
		const formattedValue = `${displayYear}-${String(month).padStart(2, "0")}`;
		onChange(formattedValue);
		setIsOpen(false);
	};

	const handleYearChange = (year: number) => {
		setDisplayYear(year);
	};

	const isMonthDisabled = (year: number, month: number): boolean => {
		if (!minDate) return false;
		const selectedDate = new Date(year, month - 1);
		const minDateTime = new Date(minDate.getFullYear(), minDate.getMonth());
		return selectedDate < minDateTime;
	};

	const getDisplayValue = (): string => {
		if (!value) return placeholder;
		const month = months.find((m) => m.value === selectedMonth);
		return `${month?.label} ${selectedYear}`;
	};

	const handleToggleDropdown = () => {
		if (!isOpen) {
			// Sync display year with selected year when opening
			setDisplayYear(selectedYear);
		}
		setIsOpen(!isOpen);
	};

	return (
		<div className={`${styles.calendarSelectContainer} ${className}`} ref={containerRef}>
			<button
				type="button"
				className={styles.selectButton}
				onClick={handleToggleDropdown}
			>
				<span className={styles.selectValue}>{getDisplayValue()}</span>
				<span className={styles.selectArrow}>{isOpen ? "▲" : "▼"}</span>
			</button>

			{isOpen && (
				<div className={styles.dropdown}>
					<div className={styles.yearSelector}>
						<button
							type="button"
							className={styles.yearArrow}
							onClick={() => handleYearChange(displayYear - 1)}
							disabled={displayYear <= currentYear}
						>
							◀
						</button>
						<span className={styles.yearDisplay}>{displayYear}</span>
						<button
							type="button"
							className={styles.yearArrow}
							onClick={() => handleYearChange(displayYear + 1)}
							disabled={displayYear >= currentYear + 29}
						>
							▶
						</button>
					</div>

					<div className={styles.monthGrid}>
						{months.map((month) => {
							const disabled = isMonthDisabled(displayYear, month.value);
							const isSelected = selectedMonth === month.value && selectedYear === displayYear;

							return (
								<button
									key={month.value}
									type="button"
									className={`${styles.monthButton} ${isSelected ? styles.selected : ""
										} ${disabled ? styles.disabled : ""}`}
									onClick={() => !disabled && handleMonthSelect(month.value)}
									disabled={disabled}
								>
									{month.label.substring(0, 3)}
								</button>
							);
						})}
					</div>
				</div>
			)}
		</div>
	);
}

export default CalendarMonthPicker;
