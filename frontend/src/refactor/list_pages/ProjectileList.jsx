import React, {Component} from "react";
import http from "../../../http.js";
import {
    styled,
    Paper,
    Box,
    ButtonBase,
    Card,
    CardContent,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    Typography
} from "@mui/material";
import { sortData } from "../../sortUtils.js";
import AddIcon from "@mui/icons-material/Add.js";
import ProjectileCard from "../ProjectileCard.jsx";
import ProjectileModal from "../modals/Projectile/ProjectileModal.jsx";

/**
 * Create styled Item component, based on Paper MUI component
 */
const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
    minHeight: "700px !important",
}));

const DisplayData = (props) =>  {
    console.log("Mapping: ", props.data)
    return(
        <>
        {props.data.map((item) => (
            <Grid item xl={2} key={item._id}>
                <ButtonBase onClick={props.onClick}>
                    <ProjectileCard
                        item={item}
                        site_name={props.site_name}/>
                </ButtonBase>
            </Grid> ))}
        </>)
}



class ProjectileList extends Component {
    constructor(props) {
        super(props);
        this.context = props.context;
        this.state = {
            points: [],
            site_id: props.siteId,
            site_name: props.siteName,
            sortValue: props.sortValue,
            point:undefined,
            openAdd:false,
            openView:false,
            openEdit:false,
        }
    }

    componentDidMount(){
        http.get(`sites/${this.state.site_id}/points`)
            .then(points => {
                console.log("Allegedly got points", points.data)
                this.setState({points: points.data});
            }).catch(error => console.error(error));
    }

    addButton(){
        return(
            <Grid item xs={12} sm={6} md={3}>
                <ButtonBase
                    onClick={() => this.setState({openAdd:true})}>
                    <Card
                        sx={{
                            minWidth: "12rem",
                            minHeight: "12rem",
                            alignContent: "center",
                        }}
                    >
                        <CardContent style={{ textAlign: "center" }}>
                            <AddIcon style={{ fontSize: 80, color: "lightgrey" }} />
                            <Typography variant="body2">
                                Add Projectile Point
                            </Typography>
                            {/*<CreateArtifact style={{ fontSize: 80, color: "lightgrey" }} />*/}
                        </CardContent>
                    </Card>
                </ButtonBase>
            </Grid>
        )
    }

    render(){
        return(
            <>
                <Item variant="outlined" sx={{mb:"40px"}}>
                    <Grid style={{padding:30}}>
                        <Box display="flex">
                            {this.context && this.addButton()}
                            <DisplayData data={this.state.points}
                                         onClick={() => this.setState({openEdit:true})}
                                         site_name={this.state.site_name}/>
                        </Box>
                    </Grid>
                    </Item>
                <div>
                {this.state.openAdd && (
                    // <ProjectileModal openAdd={openAdd} setOpenAdd={setOpenAdd} />
                    <ProjectileModal
                        adding_new={true}
                        site_name={this.state.site_name}
                        site_id={this.state.site_id}
                        url={"points"}
                        send_alert={(msg) => console.warn(`TODO: ${JSON.stringify(msg)}`)}
                        append_new={(ent) => console.warn(`TODO: Would append ${JSON.stringify(ent)}`)}
                        open={this.state.openAdd}
                        on_close={() => this.setState({openAdd: false})}
                    />
                )}
                </div>
                <div>
                    <ProjectileModal
                        adding_new={true}
                        site_name={this.state.site_name}
                        site_id={this.state.site_id}
                        url={"points"}
                        send_alert={(msg) => console.warn(`TODO: ${JSON.stringify(msg)}`)}
                        append_new={(ent) => console.warn(`TODO: Would append ${JSON.stringify(ent)}`)}
                        open={this.state.openEdit}
                        on_close={() => this.setState({openEdit: false})}
                    />
                </div>

            </>

        )

    }
}

export default ProjectileList;
