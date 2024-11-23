import EditCreateModal from "../EditCreateModal.jsx";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Typography
} from "@mui/material";
import React from "react";
import {
    ArtifactImage,
    BladeDetails,
    DimensionDetails,
    LocationDetails,
    MaterialSelector, NoteArea,
    PeriodCultureSelector
} from "./ProjectileAttributes.jsx";

class ProjectileModal extends EditCreateModal{

    constructor(props) {
        super(props);
        this.state.entity = {
            image:"",
            description:"",
            culture_id:"",
            period_id:"",
            material_id:"",
            site_id:"",
            blade_shape:"",
            base_shape:"",
            hafting_shape:"",
            cross_section:"",
            location:"",
            dimensions:[0,0,0]
        }

        //Prefilled values
        this.state.periods = [];
        this.state.cultures = [];
        this.state.base_shapes = [];

        //Selector Name holders
        this.state.selected_period = "";
        this.state.selected_culture = "";
    }

    componentDidMount(){
        super.componentDidMount();

        //Set title
        this.setState({title:`${this.props.site_name}/${this.state.entity._id ?? "*New*"}`})

    }


    /**
     * Generates the region containing
     * - Dimensions
     * - Material
     */
    specs_area(){
        return(
                <Grid item s={5}>
                    <Typography sx={{mt: 2}} varient="h6">
                        Dimensions: {this.state.entity.dimensions.filter(x => x > 0).join("mm X ")}
                    </Typography>
                    <Typography sx={{mt: 2}}
                                varient="h6">Material: {this.state.entity.material_id}</Typography>
                </Grid>
            )
    }

    render_fields() {
        return(
            <Grid container spacing={2}>
                <ArtifactImage/>
                {/*{this.title_area()}*/}
                <PeriodCultureSelector
                    update_entity={(k,v) => this.update_entity(k,v)}
                    culture_id={this.state.entity.culture_id}
                    period_id={this.state.entity.period_id}
                />
                <Grid item s={5}>
                    <DimensionDetails
                        update_entity={(k,v) => this.update_entity(k,v)}
                        value={this.state.entity.dimensions}/>
                    <MaterialSelector
                        value = {this.state.selected_material}
                        update_entity = {(k,v) => this.update_entity(k,v)}
                    />
                </Grid>
                <BladeDetails
                    base_shape={this.state.entity.base}
                    blade_shape={this.state.entity.blade_shape}
                    hafting_shape={this.state.entity.hafting_shape}
                    cross_section={this.state.entity.cross_section}
                    update_entity = {(k,v) => this.update_entity(k,v)}
                />
                <NoteArea
                    update_entity={(k,v) => this.update_entity(k,v)}
                    value={this.state.entity.description}/>
                <LocationDetails update_entity={(k,v) => this.update_entity(k,v)}/>
            </Grid>
        )
    }

    validate() {
    }

    render() {
        return(
            <div>
            <Dialog
                open={this.props.open}
                onClose={this.props.onClose}
                maxWidth="md"
                >
                <DialogTitle>{this.state.title} {this.props.subject}: {this.state.entity.name}</DialogTitle>
                <DialogContent>
                    {this.render_fields()}
                <DialogActions>
                    <Button onClick={this.props.on_close} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={this.handle_submit} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </DialogContent>
            </Dialog>
            </div>
        )
    }
}
export default ProjectileModal;