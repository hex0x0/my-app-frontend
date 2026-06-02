import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import CalendarMonthPicker from "@/components/Calendar/CalendarMonthPicker";
import styles from "./mortgage-calculator-page.module.css";

interface MonthlyInstalment {
	idx: number;
	date: string;
	totalAmount: number;
	principalPaid: number;
	interestPaid: number;
}

interface RepaymentSchedule {
	before: MonthlyInstalment[];
	after: MonthlyInstalment[];
}

function MortgageCalculator(): React.ReactElement {
	const { t } = useTranslation();

	useEffect(() => {
		document.title = t('toolkit.mortgageCalculator.title') + ' - hex0x0空间';
	}, [t]);

	const currentDate = new Date();
	const defaultExtraPaymentDate = new Date(
		new Date().setMonth(new Date().getMonth() + 1),
	);
	const [mortgageAmount, setMortgageAmount] = useState<string>("");
	const [mortgageTerm, setMortgageTerm] = useState<string>("");
	const [interestRate, setInterestRate] = useState<string>("");
	const [mortgageType, setMortgageType] =
		useState<string>("equalPrincipal");
	const [extraPaymentDateInput, setExtraPaymentDateInput] = useState<string>(
		`${defaultExtraPaymentDate.getFullYear()}-${String(defaultExtraPaymentDate.getMonth() + 1).padStart(2, "0")}`,
	);
	const [extraPaymentAmount, setExtraPaymentAmount] = useState<string>("");
	const [newInterestRate, setNewInterestRate] = useState<string>("");
	const [currentRepaymentSchedule, setCurrentRepaymentSchedule] = useState<
		MonthlyInstalment[]
	>([]);
	const [newRepaymentSchedule, setNewRepaymentSchedule] = useState<MonthlyInstalment[]>(
		[],
	);
	const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

	function selectMortgageType(event: React.ChangeEvent<HTMLInputElement>): void {
		setMortgageType(event.target.value);
	}

	function submitHandler(event: React.MouseEvent<HTMLButtonElement>): void {
		event.preventDefault();

		if (mortgageAmount === "" || mortgageTerm === "" || interestRate === "") {
			alert("输入不合法");
			return;
		}

		const [year, month] = extraPaymentDateInput.split("-").map(Number);
		if (
			year < currentDate.getFullYear() ||
			(year === currentDate.getFullYear() &&
				month <= currentDate.getMonth() + 1)
		) {
			alert("提前还贷时间不能早于下月");
			return;
		}

		const data = calculate();
		if (data) {
			setCurrentRepaymentSchedule(data.before);
			setNewRepaymentSchedule(data.after);
			setIsSubmitted(true);
		}
	}

	function calculate(): RepaymentSchedule {
		const [extraPaymentYear, extraPaymentMonth] = extraPaymentDateInput.split("-").map(Number);

		if (mortgageType === "equalPrincipal") {
			// before extra payment
			const mortgageAmountNum = Number(mortgageAmount);

			const mortgageTermNum = Number(mortgageTerm);

			const repaymentMonthsBeforeExtraPay =
				(extraPaymentYear - currentDate.getFullYear()) * 12 +
				(extraPaymentMonth - currentDate.getMonth() - 1);

			let actualRate = Number(interestRate);

			const before = equalPrincipal(
				mortgageAmountNum,
				mortgageTermNum,
				actualRate,
				repaymentMonthsBeforeExtraPay,
				new Date(currentDate),
			);

			// after extra payment
			const newMortgageAmountNum = mortgageAmountNum -
				mortgageAmountNum / mortgageTermNum * repaymentMonthsBeforeExtraPay -
				Number(extraPaymentAmount);

			const newMortgageTermNum = mortgageTermNum - repaymentMonthsBeforeExtraPay;

			if (newInterestRate !== "") {
				actualRate = Number(newInterestRate);
			}

			const extraPaymentDate = new Date(extraPaymentYear, extraPaymentMonth - 1);

			const after = equalPrincipal(
				newMortgageAmountNum,
				newMortgageTermNum,
				actualRate,
				newMortgageTermNum,
				new Date(extraPaymentDate.setMonth(extraPaymentDate.getMonth())),
			);

			return {
				before: before,
				after: after,
			};
		}
		return { before: [], after: [] };
	}

	function equalPrincipal(
		mortgageAmount: number,
		mortgageTerms: number,
		rate: number,
		visibleScheduleMonths: number,
		currentDate: Date,
	): MonthlyInstalment[] {
		console.log(`mortgageAmount=${mortgageAmount} mortgageTerms=${mortgageTerms} currentDate=${currentDate}`);

		const res: MonthlyInstalment[] = [];

		for (let i = 0; i < visibleScheduleMonths; i++) {
			currentDate.setMonth(currentDate.getMonth() + 1);
			const year = currentDate.getFullYear();
			const month = String(currentDate.getMonth() + 1).padStart(2, "0");

			const principalPaid = Number((mortgageAmount / mortgageTerms).toFixed(2));
			const interestPaid = Number(((mortgageAmount * (Number(rate) / 100)) / 12).toFixed(2));

			res.push({
				idx: i + 1,
				date: `${year}-${month}`,
				totalAmount: Number((principalPaid + interestPaid).toFixed(2)),
				principalPaid: principalPaid,
				interestPaid: interestPaid,
			});

			mortgageAmount -= principalPaid;
			mortgageTerms -= 1;
		}

		return res;
	}

	function clearHandler(event: React.MouseEvent<HTMLButtonElement>): void {
		event.preventDefault();

		setMortgageAmount("");
		setMortgageTerm("");
		setInterestRate("");
		setCurrentRepaymentSchedule([]);
		setNewRepaymentSchedule([]);
		setIsSubmitted(false);
	}

	return (
		<div className={styles.pageContainer}>
			<h1 className={styles.title}>{t('toolkit.mortgageCalculator.title')}</h1>

			<form className={styles.calculatorForm}>
				<div className={styles.container}>
					<div className={styles.left}>{t('toolkit.mortgageCalculator.mortgageAmount')}</div>
					<div className={styles.input}>
						<input
							className={styles.inputText}
							type="text"
							value={mortgageAmount}
							onChange={(e) => setMortgageAmount(e.target.value)}
						></input>
					</div>
					<div className={styles.right}>{t('toolkit.mortgageCalculator.cny')}</div>
				</div>
				<div className={styles.container}>
					<div className={styles.left}>{t('toolkit.mortgageCalculator.mortgageTerm')}</div>
					<div className={styles.input}>
						<input
							className={styles.inputText}
							type="text"
							value={mortgageTerm}
							onChange={(e) => setMortgageTerm(e.target.value)}
						></input>
					</div>
					<div className={styles.right}>{t('toolkit.mortgageCalculator.months')}</div>
				</div>
				<div className={styles.container}>
					<div className={styles.left}>{t('toolkit.mortgageCalculator.interestRate')}</div>
					<div className={styles.input}>
						<input
							className={styles.inputText}
							type="text"
							value={interestRate}
							onChange={(e) => setInterestRate(e.target.value)}
						></input>
					</div>
					<div className={styles.right}>%</div>
				</div>
				<div className={styles.container}>
					<div className={styles.left}>{t('toolkit.mortgageCalculator.mortgageType')}</div>
					<div className={styles.selection}>
						<label>
							<input
								type="radio"
								value="equalPrincipal"
								checked={mortgageType === "equalPrincipal"}
								onChange={selectMortgageType}
							/>
							{t('toolkit.mortgageCalculator.equalPrincipal')}
						</label>
						<label>
							<input
								type="radio"
								value="fixedPayment"
								checked={mortgageType === "amortization"}
								onChange={selectMortgageType}
							/>
							{t('toolkit.mortgageCalculator.amortization')}
						</label>
					</div>
				</div>
				<div className={styles.container}>
					<div className={styles.left}>{t('toolkit.mortgageCalculator.extraPaymentDate')}</div>
					<div className={styles.input}>
						<CalendarMonthPicker
							value={extraPaymentDateInput}
							onChange={(value) => setExtraPaymentDateInput(value)}
							minDate={new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)}
							placeholder={t('toolkit.mortgageCalculator.selectMonth') || 'Select month'}
						/>
					</div>
				</div>
				<div className={styles.container}>
					<div className={styles.left}>{t('toolkit.mortgageCalculator.extraPaymentAmount')}</div>
					<div className={styles.input}>
						<input
							placeholder={t('toolkit.mortgageCalculator.extraPaymentAmountHint')}
							className={styles.inputText}
							type="text"
							value={extraPaymentAmount}
							onChange={(e) => setExtraPaymentAmount(e.target.value)}
						></input>
					</div>
					<div className={styles.right}>{t('toolkit.mortgageCalculator.cny')}</div>
				</div>
				<div className={styles.container}>
					<div className={styles.left}>{t('toolkit.mortgageCalculator.newInterestRate')}</div>
					<div className={styles.input}>
						<input
							placeholder={t('toolkit.mortgageCalculator.newInterestRateHint')}
							className={styles.inputText}
							type="text"
							value={newInterestRate}
							onChange={(e) => setNewInterestRate(e.target.value)}
						></input>
					</div>
					<div className={styles.right}>%</div>
				</div>
				<div className={styles.container}>
					<div className={styles.button}>
						<button type="button" onClick={submitHandler}>
							{t('toolkit.mortgageCalculator.calculate')}
						</button>
					</div>
					<div className={styles.button}>
						<button type="button" onClick={clearHandler}>
							{t('toolkit.mortgageCalculator.clear')}
						</button>
					</div>
				</div>
			</form>

			{isSubmitted && (
				<div className={styles.details}>
					<h2 className={styles.detailTitle}>{t('toolkit.mortgageCalculator.repaymentSchedule')}</h2>
					<div>
						<table className={styles.detailTable}>
							<thead>
								<tr>
									<th>{t('toolkit.mortgageCalculator.idx')}</th>
									<th>{t('toolkit.mortgageCalculator.date')}</th>
									<th>{t('toolkit.mortgageCalculator.monthlyInstalment')}</th>
									<th>{t('toolkit.mortgageCalculator.principalPaid')}</th>
									<th>{t('toolkit.mortgageCalculator.interestPaid')}</th>
								</tr>
							</thead>
							<tbody>
								{currentRepaymentSchedule.map((data, index) => (
									<tr key={index}>
										<td>{data.idx}</td>
										<td>{data.date}</td>
										<td>{data.totalAmount}</td>
										<td>{data.principalPaid}</td>
										<td>{data.interestPaid}</td>
									</tr>
								))}
							</tbody>
							{newRepaymentSchedule.length > 0 ? (
								<tbody>
									<tr>
										<td colSpan={5}>&emsp;&emsp;⬇️提前还贷后新的还款计划⬇️</td>
									</tr>
								</tbody>
							) : (
								<></>
							)}
							<tbody>
								{newRepaymentSchedule.map((data, index) => (
									<tr key={index}>
										<td>{data.idx}</td>
										<td>{data.date}</td>
										<td>{data.totalAmount}</td>
										<td>{data.principalPaid}</td>
										<td>{data.interestPaid}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			)}
		</div>
	);
}

export default MortgageCalculator;
