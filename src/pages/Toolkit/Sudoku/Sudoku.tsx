import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./sudoku-page.module.css";

interface SudokuCell {
	value: number;
	isFixed: boolean;
	isError: boolean;
}

function Sudoku(): React.ReactElement {
	const { t } = useTranslation();
	const [grid, setGrid] = useState<SudokuCell[][]>([]);
	const [solution, setSolution] = useState<number[][]>([]);
	const [lastRefreshTime, setLastRefreshTime] = useState<number>(0);
	const [timeUntilRefresh, setTimeUntilRefresh] = useState<number>(0);
	const [message, setMessage] = useState<string>("");
	const [puzzleStartTime, setPuzzleStartTime] = useState<number>(0);
	const [elapsedTime, setElapsedTime] = useState<number>(0);
	const [isSolved, setIsSolved] = useState<boolean>(false);

	useEffect(() => {
		document.title = t('toolkit.sudoku.title') + ' - hex0x0空间';
		generateNewPuzzle();
	}, [t]);

	// Update countdown timer and puzzle timer
	useEffect(() => {
		const interval = setInterval(() => {
			const now = Date.now();
			const elapsed = now - lastRefreshTime;
			const remaining = Math.max(0, 60000 - elapsed);
			setTimeUntilRefresh(remaining);

			// Update puzzle timer if not solved
			if (!isSolved && puzzleStartTime > 0) {
				setElapsedTime(Math.floor((now - puzzleStartTime) / 1000));
			}
		}, 100);

		return () => clearInterval(interval);
	}, [lastRefreshTime, isSolved, puzzleStartTime]);

	// Generate a complete valid Sudoku solution
	function generateSolution(): number[][] {
		const grid: number[][] = Array(9).fill(0).map(() => Array(9).fill(0));
		fillGrid(grid);
		return grid;
	}

	// Fill grid with valid numbers using backtracking
	function fillGrid(grid: number[][]): boolean {
		for (let row = 0; row < 9; row++) {
			for (let col = 0; col < 9; col++) {
				if (grid[row][col] === 0) {
					const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
					// Shuffle numbers for randomness
					for (let i = numbers.length - 1; i > 0; i--) {
						const j = Math.floor(Math.random() * (i + 1));
						[numbers[i], numbers[j]] = [numbers[j], numbers[i]];
					}

					for (const num of numbers) {
						if (isValidPlacement(grid, row, col, num)) {
							grid[row][col] = num;
							if (fillGrid(grid)) {
								return true;
							}
							grid[row][col] = 0;
						}
					}
					return false;
				}
			}
		}
		return true;
	}

	// Check if placing a number is valid
	function isValidPlacement(grid: number[][], row: number, col: number, num: number): boolean {
		// Check row
		for (let x = 0; x < 9; x++) {
			if (grid[row][x] === num) return false;
		}

		// Check column
		for (let x = 0; x < 9; x++) {
			if (grid[x][col] === num) return false;
		}

		// Check 3x3 box
		const startRow = Math.floor(row / 3) * 3;
		const startCol = Math.floor(col / 3) * 3;
		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 3; j++) {
				if (grid[startRow + i][startCol + j] === num) return false;
			}
		}

		return true;
	}

	// Remove numbers from solution to create puzzle
	function createPuzzle(solution: number[][], difficulty: number = 40): SudokuCell[][] {
		const puzzle: SudokuCell[][] = solution.map(row =>
			row.map(value => ({ value, isFixed: true, isError: false }))
		);

		let cellsToRemove = difficulty;
		while (cellsToRemove > 0) {
			const row = Math.floor(Math.random() * 9);
			const col = Math.floor(Math.random() * 9);

			if (puzzle[row][col].value !== 0) {
				puzzle[row][col].value = 0;
				puzzle[row][col].isFixed = false;
				cellsToRemove--;
			}
		}

		return puzzle;
	}

	function generateNewPuzzle(): void {
		const newSolution = generateSolution();
		const newPuzzle = createPuzzle(newSolution, 40);
		setSolution(newSolution);
		setGrid(newPuzzle);
		setLastRefreshTime(Date.now());
		setPuzzleStartTime(Date.now());
		setElapsedTime(0);
		setIsSolved(false);
		setMessage("");
	}

	function handleRefresh(): void {
		const now = Date.now();
		const elapsed = now - lastRefreshTime;

		if (elapsed < 60000) {
			const remaining = Math.ceil((60000 - elapsed) / 1000);
			setMessage(t('toolkit.sudoku.refreshCooldown', { seconds: remaining }));
			return;
		}

		generateNewPuzzle();
		setMessage(t('toolkit.sudoku.refreshSuccess'));
	}

	function handleCellChange(row: number, col: number, value: string): void {
		if (grid[row][col].isFixed) return;

		const numValue = value === "" ? 0 : parseInt(value);
		if (value !== "" && (isNaN(numValue) || numValue < 1 || numValue > 9)) {
			return;
		}

		const newGrid = grid.map((r, rIdx) =>
			r.map((cell, cIdx) =>
				rIdx === row && cIdx === col
					? { ...cell, value: numValue, isError: false }
					: cell
			)
		);
		setGrid(newGrid);
		setMessage("");
	}

	function handleSubmit(): void {
		let hasEmpty = false;
		let hasError = false;

		const newGrid = grid.map((row, rIdx) =>
			row.map((cell, cIdx) => {
				if (cell.value === 0) {
					hasEmpty = true;
					return cell;
				}

				const isCorrect = cell.value === solution[rIdx][cIdx];
				if (!isCorrect) {
					hasError = true;
				}

				return { ...cell, isError: !isCorrect };
			})
		);

		setGrid(newGrid);

		if (hasEmpty) {
			setMessage(t('toolkit.sudoku.incomplete'));
		} else if (hasError) {
			setMessage(t('toolkit.sudoku.hasErrors'));
		} else {
			setIsSolved(true);
			const finalTime = formatTime(elapsedTime);
			setMessage(t('toolkit.sudoku.successWithTime', { time: finalTime }));
		}
	}

	function handleClear(): void {
		const clearedGrid = grid.map(row =>
			row.map(cell =>
				cell.isFixed ? cell : { ...cell, value: 0, isError: false }
			)
		);
		setGrid(clearedGrid);
		setMessage("");
	}

	function formatTime(seconds: number): string {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
	}

	const canRefresh = timeUntilRefresh === 0;
	const refreshSeconds = Math.ceil(timeUntilRefresh / 1000);

	return (
		<div className={styles.pageContainer}>
			<h1 className={styles.title}>{t('toolkit.sudoku.title')}</h1>

			<div className={styles.timerContainer}>
				<span className={styles.timerLabel}>{t('toolkit.sudoku.timer')}:</span>
				<span className={styles.timerValue}>{formatTime(elapsedTime)}</span>
			</div>

			<div className={styles.sudokuGrid}>
				{grid.map((row, rowIdx) => (
					<div key={rowIdx} className={styles.sudokuRow}>
						{row.map((cell, colIdx) => (
							<input
								key={colIdx}
								type="text"
								maxLength={1}
								value={cell.value === 0 ? "" : cell.value}
								onChange={(e) => handleCellChange(rowIdx, colIdx, e.target.value)}
								className={`${styles.sudokuCell} ${cell.isFixed ? styles.fixedCell : ""
									} ${cell.isError ? styles.errorCell : ""} ${colIdx === 2 || colIdx === 5 ? styles.rightBorder : ""
									} ${rowIdx === 2 || rowIdx === 5 ? styles.bottomBorder : ""}`}
								readOnly={cell.isFixed}
							/>
						))}
					</div>
				))}
			</div>

			<div className={styles.buttonContainer}>
				<button
					type="button"
					onClick={handleRefresh}
					disabled={!canRefresh}
					className={styles.button}
				>
					{canRefresh
						? t('toolkit.sudoku.refresh')
						: `${t('toolkit.sudoku.refresh')} (${refreshSeconds}s)`}
				</button>
				<button
					type="button"
					onClick={handleSubmit}
					className={styles.button}
				>
					{t('toolkit.sudoku.submit')}
				</button>
				<button
					type="button"
					onClick={handleClear}
					className={styles.button}
				>
					{t('toolkit.sudoku.clear')}
				</button>
			</div>

			{message && (
				<div
					className={`${styles.message} ${message.includes(t('toolkit.sudoku.success')) ? styles.successMessage :
							message.includes(t('toolkit.sudoku.hasErrors')) ? styles.errorMessage :
								styles.infoMessage
						}`}
				>
					{message}
				</div>
			)}

			<div className={styles.instructions}>
				<h3>{t('toolkit.sudoku.howToPlay')}</h3>
				<ul>
					<li>{t('toolkit.sudoku.instruction1')}</li>
					<li>{t('toolkit.sudoku.instruction2')}</li>
					<li>{t('toolkit.sudoku.instruction3')}</li>
					<li>{t('toolkit.sudoku.instruction4')}</li>
				</ul>
			</div>
		</div>
	);
}

export default Sudoku;
