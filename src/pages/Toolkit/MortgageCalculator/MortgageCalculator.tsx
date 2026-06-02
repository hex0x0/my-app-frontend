import React, { useEffect, useState } from "react";
import styles from "./mortgage-calculator-page.module.css";

interface RepaymentData {
	idx: number;
	month: string;
	repayment: string;
	principal: number;
	interest: number;
}

interface CalculateResult {
	before: RepaymentData[];
	after: RepaymentData[];
}

function RepaymentCalculator(): React.ReactElement {
	useEffect(() => {
		document.title = "Mortgage Calculator - hex0x0空间";
	}, []);

	const currentDate = new Date();
	const repaymentDate = new Date(
		new Date().setMonth(new Date().getMonth() + 2),
	);
	const [loanAmount, setLoanAmount] = useState<string>("");
	const [loanTerm, setLoanTerm] = useState<string>("");
	const [interestRate, setInterestRate] = useState<string>("");
	const [repaymentOption, setRepaymentOption] =
		useState<string>("fixedPrincipal"); // fixed principal | fixed payment
	const [repaymentYear, setRepaymentYear] = useState<number>(
		repaymentDate.getFullYear(),
	);
	const [repaymentMonth, setRepaymentMonth] = useState<number>(
		repaymentDate.getMonth(),
	);
	const [repaymentAmount, setRepaymentAmount] = useState<string>("");
	const [newInterestRate, setNewInterestRate] = useState<string>("");
	const [beforeRepaymentData, setBeforeRepaymentData] = useState<
		RepaymentData[]
	>([]);
	const [afterRepaymentData, setAfterRepaymentData] = useState<RepaymentData[]>(
		[],
	);
	const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

	function selectLoanType(event: React.ChangeEvent<HTMLInputElement>): void {
		setRepaymentOption(event.target.value);
	}

	function submitHandler(event: React.MouseEvent<HTMLButtonElement>): void {
		event.preventDefault();

		if (loanAmount === "" || loanTerm === "" || interestRate === "") {
			alert("输入不合法");
			return;
		}

		if (
			Number(repaymentYear) < currentDate.getFullYear() ||
			(Number(repaymentYear) === currentDate.getFullYear() &&
				Number(repaymentMonth) <= currentDate.getMonth() + 1)
		) {
			alert("提前还贷时间不能早于下月");
			return;
		}

		const data = calculate();
		if (data) {
			setBeforeRepaymentData(data.before);
			setAfterRepaymentData(data.after);
			setIsSubmitted(true);
		}
	}

	function calculate(): CalculateResult | undefined {
		if (repaymentOption === "fixedPrincipal") {
			let remaingAmount = Number(loanAmount);
			let remaingMonths = Number(loanTerm);
			let repaymentMonthsPartA =
				(repaymentYear - currentDate.getFullYear()) * 12 +
				(repaymentMonth - currentDate.getMonth() - 1);
			let rate = interestRate;
			const before = fixedPrincipal(
				remaingAmount,
				remaingMonths,
				rate,
				new Date(currentDate),
				repaymentMonthsPartA,
			);

			remaingAmount -=
				(Number(loanAmount) / Number(loanTerm)) * repaymentMonthsPartA;
			remaingAmount -= Number(repaymentAmount);
			remaingMonths = Number(loanTerm) - repaymentMonthsPartA;
			let repaymentMonthsPartB = remaingMonths;
			if (newInterestRate !== "") {
				rate = newInterestRate;
			}
			const after = fixedPrincipal(
				remaingAmount,
				remaingMonths,
				rate,
				new Date(repaymentDate.setMonth(repaymentDate.getMonth() + 1)),
				repaymentMonthsPartB,
			);

			return {
				before: before,
				after: after,
			};
		} else if (repaymentOption === "fixedPayment") {
			let remaingAmount = Number(loanAmount);
			let remaingMonths = Number(loanTerm);
			let repaymentMonthsPartA =
				(repaymentYear - currentDate.getFullYear()) * 12 +
				(repaymentMonth - currentDate.getMonth() - 1);
			let rate = interestRate;
			const before = fixedPayment(
				remaingAmount,
				remaingMonths,
				rate,
				new Date(currentDate),
				repaymentMonthsPartA,
			);

			remaingAmount -=
				(Number(loanAmount) / Number(loanTerm)) * repaymentMonthsPartA;
			remaingAmount -= Number(repaymentAmount);
			remaingMonths = Number(loanTerm) - repaymentMonthsPartA;
			let repaymentMonthsPartB = remaingMonths;
			if (newInterestRate !== "") {
				rate = newInterestRate;
			}
			const after = fixedPayment(
				remaingAmount,
				remaingMonths,
				rate,
				new Date(currentDate),
				repaymentMonthsPartB,
			);

			return {
				before: before,
				after: after,
			};
		}
		return undefined;
	}

	function fixedPrincipal(
		remaingAmount: number,
		remaingMonths: number,
		rate: string,
		currentDate: Date,
		repaymentMonths: number,
	): RepaymentData[] {
		console.log(
			`remaingAmount=${remaingAmount} remaingMonths=${remaingMonths} currentDate=${currentDate}`,
		);

		let res: RepaymentData[] = [];

		for (let i = 0; i < repaymentMonths; i++) {
			currentDate.setMonth(currentDate.getMonth() + 1);
			const year = currentDate.getFullYear();
			const month = String(currentDate.getMonth() + 1).padStart(2, "0");

			const principalPerMonth = Number(
				(remaingAmount / remaingMonths).toFixed(2),
			);
			const interestPerMonth = Number(
				((remaingAmount * (Number(rate) / 100)) / 12).toFixed(2),
			);

			res.push({
				idx: i + 1,
				month: `${year}-${month}`,
				repayment: (
					Number(principalPerMonth) + Number(interestPerMonth)
				).toFixed(2),
				principal: principalPerMonth,
				interest: interestPerMonth,
			});

			remaingAmount -= principalPerMonth;
			remaingMonths -= 1;
		}

		return res;
	}

	function fixedPayment(
		remaingAmount: number,
		remaingMonths: number,
		rate: string,
		currentDate: Date,
		repaymentMonths: number,
	): RepaymentData[] {
		let res: RepaymentData[] = [];
		let monthlyRate = Number(rate) / 100 / 12;
		let monthlyPayment =
			(remaingAmount * monthlyRate) /
			(1 - Math.pow(1 + monthlyRate, -remaingMonths));
		for (let i = 0; i < repaymentMonths; i++) {
			currentDate.setMonth(currentDate.getMonth() + 1);
			const year = currentDate.getFullYear();
			const month = String(currentDate.getMonth() + 1).padStart(2, "0");
			const interest = Number((remaingAmount * monthlyRate).toFixed(2));
			const principal = Number((monthlyPayment - interest).toFixed(2));
			res.push({
				idx: i + 1,
				month: `${year}-${month}`,
				repayment: monthlyPayment.toFixed(2),
				principal: principal,
				interest: interest,
			});
			remaingAmount -= principal;
		}
		return res;
	}

	function clearHandler(event: React.MouseEvent<HTMLButtonElement>): void {
		event.preventDefault();

		setLoanAmount("");
		setLoanTerm("");
		setInterestRate("");
		setBeforeRepaymentData([]);
		setAfterRepaymentData([]);
		setIsSubmitted(false);
	}

	return (
		<div className={styles.pageContainer}>
			<h1 className={styles.title}>提前还贷计算器</h1>

			<form className={styles.calculatorForm}>
				<div className={styles.container}>
					<div className={styles.left}>贷款金额</div>
					<div className={styles.input}>
						<input
							className={styles.inputText}
							type="text"
							value={loanAmount}
							onChange={(e) => setLoanAmount(e.target.value)}
						></input>
					</div>
					<div className={styles.right}>元</div>
				</div>
				<div className={styles.container}>
					<div className={styles.left}>贷款月数</div>
					<div className={styles.input}>
						<input
							className={styles.inputText}
							type="text"
							value={loanTerm}
							onChange={(e) => setLoanTerm(e.target.value)}
						></input>
					</div>
					<div className={styles.right}>月</div>
				</div>
				<div className={styles.container}>
					<div className={styles.left}>贷款利率</div>
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
					<div className={styles.left}>还贷方式</div>
					<div className={styles.selection}>
						<label>
							<input
								type="radio"
								value="fixedPrincipal"
								checked={repaymentOption === "fixedPrincipal"}
								onChange={selectLoanType}
							/>
							等额本金
						</label>
						<label>
							<input
								type="radio"
								value="fixedPayment"
								checked={repaymentOption === "fixedPayment"}
								onChange={selectLoanType}
							/>
							等额本息
						</label>
					</div>
				</div>
				<div className={styles.container}>
					<div className={styles.left}>提前还贷时间</div>
					<div className={styles.input}>
						<input
							className={styles.inputText}
							type="text"
							value={repaymentYear}
							onChange={(e) => setRepaymentYear(Number(e.target.value))}
						></input>
					</div>
					<div className={styles.right}>年</div>
					<div className={styles.input}>
						<input
							className={styles.inputText}
							type="text"
							value={repaymentMonth}
							onChange={(e) => setRepaymentMonth(Number(e.target.value))}
						></input>
					</div>
					<div className={styles.right}>月</div>
				</div>
				<div className={styles.container}>
					<div className={styles.left}>提前还贷金额</div>
					<div className={styles.input}>
						<input
							placeholder="不填为0"
							className={styles.inputText}
							type="text"
							value={repaymentAmount}
							onChange={(e) => setRepaymentAmount(e.target.value)}
						></input>
					</div>
					<div className={styles.right}>元</div>
				</div>
				<div className={styles.container}>
					<div className={styles.left}>新的贷款利率</div>
					<div className={styles.input}>
						<input
							placeholder="不填利率不变"
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
							计算
						</button>
					</div>
					<div className={styles.button}>
						<button type="button" onClick={clearHandler}>
							清空
						</button>
					</div>
				</div>
			</form>

			{isSubmitted && (
				<div className={styles.details}>
					<h2 className={styles.detailTitle}>还款明细</h2>
					<div>
						<table className={styles.detailTable}>
							<thead>
								<tr>
									<th>序号</th>
									<th>还款月份</th>
									<th>还款金额</th>
									<th>本金</th>
									<th>利息</th>
								</tr>
							</thead>
							<tbody>
								{beforeRepaymentData.map((data, index) => (
									<tr key={index}>
										<td>{data.idx}</td>
										<td>{data.month}</td>
										<td>{data.repayment}</td>
										<td>{data.principal}</td>
										<td>{data.interest}</td>
									</tr>
								))}
							</tbody>
							{afterRepaymentData.length > 0 ? (
								<tbody>
									<tr>
										<td colSpan={5}>&emsp;&emsp;⬇️提前还贷后新的还款计划⬇️</td>
									</tr>
								</tbody>
							) : (
								<></>
							)}
							<tbody>
								{afterRepaymentData.map((data, index) => (
									<tr key={index}>
										<td>{data.idx}</td>
										<td>{data.month}</td>
										<td>{data.repayment}</td>
										<td>{data.principal}</td>
										<td>{data.interest}</td>
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

export default RepaymentCalculator;
