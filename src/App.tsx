import { BrowserRouter } from "react-router-dom";
import MainRouter from "@/router/index";
import MainNavbar from "@/components/MainNavbar/MainNavbar";
import Footer from "@/components/Footer/Footer";
import "./App.css";

function App() {
	return (
		<BrowserRouter>
			<div className="root">
				<MainNavbar />
				<MainRouter />
			</div>
			<Footer />
		</BrowserRouter>
	);
}

export default App;
