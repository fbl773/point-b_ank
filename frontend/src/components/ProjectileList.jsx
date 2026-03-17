import {useState, useEffect} from "react";
import http from "../../http.js";
import log from "../logger.js";
import {
    styled,
    Grid,
    Card,
    CardContent,
    ButtonBase,
	Button,
    Typography,
    Box,
    Paper,
	Alert,
	IconButton
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import {useContext} from "react";
import {UserContext} from "../context/userContext";
import {sortData} from "../sortUtils.js";
import ProjectileCard from "../refactor/ProjectileCard.jsx";
import ProjectileModal from "../refactor/modals/Projectile/ProjectileModal.jsx";
import CircularProgress from "@mui/material/CircularProgress";

/**
 * Create styled Item component, based on Paper MUI component
 */
const Item = styled(Paper)(({theme}) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
    minHeight: "700px !important",
}));

const ArtifactCard = (props) => (
    <Grid item xl={2}>
        {/*This section is for displaying all the found artifacts*/}
        <ProjectileCard
            item={props.item}
            site_name={props.siteName}
            onDelete={props.onDelete}
        />
    </Grid>
)

/**
 * @example
 * ```
 * {"image":"JSC_PP-3.JPG","description":"NOw what would we append exactly?","culture_id":"678e8aea9990332097d997e5","period_id":"678e8acc9990332097d997dd","material_id":"6923b4ff6240e13b50634d7c","site_id":"66e3213493f279d8e11c34e2","blade_shape":"excurvate","base_shape":"straight","hafting_shape":"basal-notched","cross_section":"fluted","location":"wat","dimensions":[2,2,2],"_id":"692b0cd875e0630994d78dac","__v":0}
 * ```
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
const ArtifactList = (props) => {
    console.log("generating an artifact list")
    // Filter data based on search query (mock)
    const filteredData = props.data?.filter((item) =>
        // eslint-disable-next-line react/prop-types
        //TODO: This line VVV makes no sense m8.
        item._id.toLowerCase().includes(props.query.toLowerCase()),
    );
    return (
        <>
            {filteredData.map((item) => (
                <ArtifactCard
                    item={item}
                    siteName={props.siteName}
                    onDelete={props.onDelete}
                    key={item._id}/>
            ))
            }
        </>
    )
}


/**
 * Displays all projectiles for a selected site
 * @param {string} query projectile name for searching
 * @param {integer} siteId ID of site to view projectiles
 * @pre Site should exist in database
 * @post Renders projectile points cards
 * @returns {JSX.Element} ProjectileList React component
 */
// eslint-disable-next-line react/prop-types
export default function ProjectileList({title,query, siteId, siteName, sortValue}) {
    const [openAdd, setOpenAdd] = useState(false);
    const [openView, setOpenView] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openError, setOpenError] = useState(false);
	const [feedback, setFeedback] = useState(null);
    const [projectilePointId, setProjectilePointId] = useState("");
    const [point, setPoint] = useState(undefined)
    const [data, setData] = useState([]);
    const {user} = useContext(UserContext);
    
	const handleDelete = (id) => {
        let updated = data.filter((item) => item._id !== id);
        setData(updated);
    }


    /**
     * Toggle view projectile modal visibility to true
     */
    const handleClick2 = (item) => () => {
        console.log(`ITEM IS ${JSON.stringify(item)}`);
        setPoint(item)
        setOpenEdit(true);
        log.info("Card clicked! ID:", item._id);
    };

    // /**
    //  * Fetch and update projectile points list/cards with latest list of projectile points
    //  * every state change of add the edit proejctile point modals
    //  */
    // useEffect(() => {
    // 	async function fetchprojectilePoints() {
    // 		try {
    // 			const response = await http.get(`sites/${siteId}/points`);
    // 			log.info("Projectile points: ", response.data);
    //
    // 			// Sort JSON
    // 			const sortedData = sortData(response.data, sortValue);
    // 			setData(sortedData);
    // 			console.log("Data from the server: ",data[0].culture_id)
    // 			console.log("sortedData",sortedData[0].culture_id)
    // 		} catch (error) {
    // 			log.error("Error fetching projectile points:", error);
    // 		}
    // 	}
    //
    // 	fetchprojectilePoints();
    // }, [openAdd, openView, sortValue,point]);

    useEffect(() => {
        if (data.length <= 0) {
            console.log("Getting the data...")
            http.get(`sites/${siteId}/points`).then((res) => {
                setData(res.data);
            }).catch(err => {
                console.error(err);
                setData([])
            });
        } 
        const sortedData = sortData(data, sortValue);
        setData(sortedData);

    }, [sortValue]);

    return (
        <Grid item xs={12}>
			<Grid item>
			<Typography variant="body1" sx={{ fontWeight: "medium" }}>
				{title}
			<IconButton onClick={() => setOpenAdd(true)} color="primary">
				<AddIcon style={{fontSize: 20}}/>
			</IconButton>
			</Typography>
			</Grid>
			<Box sx={{ flexGrow: 1, p: 3 }}>
				{feedback && (
					<Alert
						severity={feedback.type ?? "error"}
						onClose={() => setFeedback(null)}
						style={{ marginBottom: "20px" }}
					>
						{feedback.message}
					</Alert>
				)}
			 </Box>
            <Item variant="outlined" sx={{mb: "40px"}}>
                <Grid style={{padding: 30}}>
                    <Box display="flex">
				        	<Grid container spacing={5}>
                            {user && data.length ?
                                <ArtifactList
                                    query={query}
                                    data={data}
                                    siteName={siteName}
                                    onDelete={handleDelete}
                                    onClick={(p) => setPoint(p)}/>:
                                <Typography variant="body2">No Points yet...</Typography>
                            }
                        </Grid>
                    </Box>
                </Grid>
            </Item>
            <div>
                {openAdd && (
                    <ProjectileModal
                        subject={"Point"}
                        adding_new={true}
                        site_name={siteName}
                        site_id={siteId}
                        url={"points"}
                        append_new={(ent) => data.push(ent)}
                        open={openAdd}
                        on_close={() => setOpenAdd(false)}
						send_alert={(f) => setFeedback(f)}
                    />
                )}
            </div>
        </Grid>
    );
}
