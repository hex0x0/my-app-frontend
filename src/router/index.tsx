import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home/Home";
import BlogList from "@/pages/Blogs/BlogList/BlogList";
import BlogDetail from "@/pages/Blogs/BlogDetail/BlogDetail";
import About from "@/pages/About/About";
import Toolkit from "@/pages/Toolkit/Toolkit";
import MortgageCalculator from "@/pages/Toolkit/MortgageCalculator/MortgageCalculator";
import InvestmentDashboard from "@/pages/Toolkit/InvestmentDashboard/InvestmentDashboard";
import Login from "@/pages/Login/Login";
import NotFound from "@/pages/NotFound/NotFound";
// import RequireAuth from "modules/account/RequireAuth";

export default function MainRouter(): React.ReactElement {
	return (
		<Routes>
			<Route index element={<Home />} />
			<Route path="home" element={<Home />} />
			<Route path="blogs">
				<Route index element={<BlogList />} />
			</Route>
			<Route path="blog">
				<Route path=":path" element={<BlogDetail />} />
			</Route>
			<Route path="about" element={<About />} />
			<Route path="toolkit">
				<Route index element={<Toolkit />} />
				<Route path="mortgage-calculator" element={<MortgageCalculator />} />
				<Route path="investment-dashboard" element={<InvestmentDashboard />} />
			</Route>
			<Route path="login" element={<Login />} />
			<Route path="*" element={<NotFound />} />
		</Routes>
	);
}
