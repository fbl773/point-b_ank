import { UserContextProvider } from "../context/userContext";
import { Route, Routes } from "react-router-dom";
import Catalogue from "./Catalogue";
import Site from "./Site";
import SettingsPage from "./SettingsPage";
import {
	ManageCultureWrapper,
	ManageMaterialsWrapper,
	ManagePeriodWrapper
} from "../refactor/management_pages/ManagementPageWrappers.jsx";

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
				<Route path="/site/:id" element={<Site />} />
				<Route path="/settings" element={<SettingsPage />} />
				<Route path="/managePeriods" element={<ManagePeriodWrapper/>} />
				<Route path="/manageCultures" element={<ManageCultureWrapper />} />
				<Route path="/manageMaterials" element={<ManageMaterialsWrapper/>} />
				{/* Add new routes here as you make new pages - use '/your_path' as path and the coresponding filename in element. */}
			</Routes>
		</UserContextProvider>
	);
}

export default App;
