import { UserContextProvider } from "../context/userContext";
import { Route, Routes } from "react-router-dom";
import Catalogue from "./catalogue/Catalogue.jsx";
import Site from "./sites/Site.jsx";
import StatisticsPage from "./statistics/StatisticsPage.jsx";
import SettingsPage from "./administration/SettingsPage.jsx";
import ManagePeriods from "./management/ManagementPeriods.jsx";
import ManageCultures from "./management/ManagementCultures.jsx";
import ManageMaterials from "./management/ManagementMaterials.jsx";

/**
 * Main App component which contains the routing paths
 * @pre None
 * @post Renders main parent App component
 * @returns {JSX.Element} App React component
 */
function App() {
	return (
		<UserContextProvider>
			<Routes>
				<Route path="/" element={<Catalogue />} />
				<Route path="/site" element={<Site />} />
				<Route path="/stats" element={<StatisticsPage />} />
				<Route path="/settings" element={<SettingsPage />} />
				<Route path="/managePeriods" element={<ManagePeriods />} />
				<Route path="/manageCultures" element={<ManageCultures />} />
				<Route path="/manageMaterials" element={<ManageMaterials />} />
				{/* Add new routes here as you make new pages - use '/your_path' as path and the coresponding filename in element. */}
			</Routes>
		</UserContextProvider>
	);
}

export default App;
