import React from 'react';
import EditCreateModal from './EditCreateModal';
import {DialogContent, Grid, MenuItem, TextField, Typography} from "@mui/material";
import http from "../../../http.js";
import RegionList from "../RegionList.jsx";

const artifact_types = ["lithic","faunal","ceramic","other"];

/**
 * Create/Edit Modal configured for Materials
 */
export class MaterialModal extends EditCreateModal{

    render_fields() {
        return (
            <DialogContent>
                <TextField
                    id="name"
                    label="Material Name"
                    variant="outlined"
                    fullWidth
                    value={this.state.entity.name}
                    onChange={(e) => this.update_entity("name",e.target.value)}
                    style={{ marginBottom: "15px", marginTop: "15px" }}
                />
                <TextField
                    id="description"
                    label="Material Description"
                    variant="outlined"
                    fullWidth
                    value={this.state.entity.description}
                    onChange={(e) => this.update_entity("description",e.target.value)}
                    style={{ marginBottom: "15px" }}
                />
                <TextField
                    select
                    label="Associated Artifact Type"
                    variant="outlined"
                    fullWidth
                    value={this.state.entity.artifact_type}
                    onChange={(e) => this.update_entity("artifact_type",e.target.value)}
                    SelectProps={{
                        native: true,
                    }}
                    style={{ marginBottom: "15px" }}
                >
                    <option value=""></option>
                    {artifact_types.map((artifact_name) => (
                        <option key={artifact_name} value={artifact_name}>
                            {artifact_name}
                        </option>
                    ))}
                </TextField>
            </DialogContent>
        )
    }

    validate() {
        let material = this.state.entity;
        let name_valid = material.name.length > 0;
        let type_valid = artifact_types
            .find(artifact_type => artifact_type === material.artifact_type) !== undefined;
        return name_valid && type_valid;
    }
}

export class PeriodModal extends EditCreateModal{

    render_fields() {
        return(
            <DialogContent>
                <TextField
                    id="name"
                    label="Name"
                    variant="outlined"
                    fullWidth
                    value={this.state.entity.name}
                    onChange={(e) => this.update_entity("name",e.target.value)}
                    margin="normal"
                />
                <TextField
                    id="start_bp"
                    label="start"
                    variant="outlined"
                    type="number"
                    fullWidth
                    value={this.state.entity.start}
                    onChange={(e) => this.update_entity("start",e.target.value)}
                    margin="normal"
                />
                <TextField
                    id="end_bp"
                    label="end"
                    variant="outlined"
                    type="number"
                    fullWidth
                    value={this.state.entity.end}
                    onChange={(e) => this.update_entity("end",e.target.value)}
                />
            </DialogContent>
        )
    }

    validate() {
        let entity = this.state.entity;
        let name_vaid = entity.name.length > 0; //Has a title
        let dates_valid = entity.start >= entity.end; //Dates are in bp (before present)...
        dates_valid = dates_valid && (entity.start !== undefined && entity.end !== undefined); //Dates are there at all
        return name_vaid && dates_valid;
    }

    update_entity(key,value){
        if(key === "start" || key === "end"){
            let as_num = parseInt(value,10)
            value = isNaN(as_num) ? null:as_num
        }
        return super.update_entity(key,value)
    }
}

export class CultureModal extends EditCreateModal{

    //Specialty

    constructor(props) {
        super(props);
    }

    /**
     * Wraps the call to append_new such that it can modify the object before sending
     * it back to the host element
     * @param culture {any} the culture entity we are modifying
     */
    modify_and_append(culture){
        culture['period_name'] = this.state.periods
            .find(period => period._id === culture.period_id).name ?? "";
        this.props.append_new(culture);
    }

    /**
     * Set the configured period
     * @param period_id {String} the period to associate with this culture
     */
    set_selected_period(period_id) {
        let period = this.state.periods.find(period => period._id === period_id);
        console.log(`Setting selected to :${JSON.stringify(period)}`)
        this.setState({selected_period:period});
        this.update_entity('period_id',period_id)
        this.update_entity('period_name',period.name)
    }

    /**
     * Fetches the periods available to be configured
     */
    get_periods() {
        http.get('/periods')
            .then(resp => {
                let periods = resp.data;
                this.setState({periods:periods})
            })
            .catch(err => console.log(`Failed to fetch periods`,err));
    }

    //Overrides

    /**
     * overridden such that it can
     * 1. add the specialty state items
     * 2. bind a specialty `append_new` function
     * 3. make the call to fetch the periods
     */
    componentDidMount() {
        super.componentDidMount();

        //add additional state items
        this.setState({periods:[],selected_period:{}})
        this.update_entity("period_id","");

        //setup special append
        this.append_new = this.modify_and_append.bind(this);

        //go get the periods
        this.get_periods();
        this.set_selected_period = this.set_selected_period.bind(this);

    }


    render_fields() {
        return(
            <DialogContent>
                <TextField
                    id="name"
                    label="Name"
                    variant="outlined"
                    fullWidth
                    value={this.state.entity.name}
                    onChange={(e) => this.update_entity("name",e.target.value)}
                    margin="normal"
                />
                <TextField
                    id="start_bp"
                    label="start"
                    variant="outlined"
                    type="number"
                    fullWidth
                    value={this.state.entity.start}
                    onChange={(e) => this.update_entity("start",e.target.value)}
                    margin="normal"
                />
                <TextField
                    id="end_bp"
                    label="end"
                    variant="outlined"
                    type="number"
                    fullWidth
                    value={this.state.entity.end}
                    onChange={(e) => this.update_entity("end",e.target.value)}
                />
                <TextField
                    select
                    label="Associated Period"
                    value={this.state.entity.period_id}
                    onChange={(e) => this.set_selected_period(e.target.value)}
                    fullWidth
                    margin="dense"
                >
                    {this.state.periods !== undefined ? (
                        this.state.periods.map((period) => (
                            <MenuItem key={period._id} value={period._id}>
                                {period.name} ({period.start} - {period.end})
                            </MenuItem>
                        ))
                    ) : (
                        <Typography variant="body2" color="textSecondary">
                            No periods available. Please create a Period first through the
                            Manage Periods Tab.
                        </Typography>
                    )}
                </TextField>
            </DialogContent>
        )

    }

    validate() {
        //fetch entity to validate
        let culture = this.state.entity;
        let period = this.state.selected_period;

        //Check basics
        let name_vaid = culture.name.length > 0;
        let has_period = culture.period_id.length > 0;

        //Check dates
        let dates_internal_validity = culture.start >= culture.end; //Dates are in bp (before present)...
        let dates_external_validity = culture.end >= period.end && culture.start <= period.start;
        let dates_valid = dates_external_validity && dates_internal_validity;
        dates_valid = dates_valid && (culture.start !== null && culture.end !== null); //Dates are there at all

        //Amalgamate
        return name_vaid && dates_valid && has_period;
    }

    update_entity(key,value){
        if(key === "start" || key === "end"){
            let as_num = parseInt(value,10)
            value = isNaN(as_num) ? null:as_num
        }
        return super.update_entity(key,value)
    }
}

export class SiteModal extends EditCreateModal{

    render_fields() {
        return(
            <DialogContent style={{ minHeight: "300px" }}>
                <TextField
                    autoFocus
                    margin="dense"
                    id="siteName"
                    label="Site Name"
                    fullWidth
                    required
                    value={this.state.entity.name}
                    onChange={(e) => this.update_entity("name",e.target.value)}
                />
                <TextField
                    margin="dense"
                    id="description"
                    label="Site Description"
                    fullWidth
                    multiline
                    rows={10}
                    value={this.state.entity.description}
                    onChange={(e) => this.update_entity("description",e.target.value)}
                />
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <TextField
                            margin="dense"
                            id="location"
                            label="Location"
                            fullWidth
                            value={this.state.entity.location}
                            onChange={(e) => this.update_entity("location",e.target.value)}
                        />
                    </Grid>
                    <RegionList
                        selected_region_id={this.state.entity.region_id}
                        select_region = {(reg_id) => this.update_entity("region_id",reg_id)}
                    />
                </Grid>
            </DialogContent>
        )
    }

    validate() {
        let site = this.state.entity;

        //validate name
        let name_valid = site.name.length > 0;

        return name_valid;
    }

    componentDidMount() {
        this.update_entity("catalogue_id",this.props.catalogue_id)
        super.componentDidMount();
        console.log(this.state.entity);

        //Get region data if it exists
        if(this.props.adding_new === false){
            //Get Region
            if (this.state.entity.region_id !== undefined) {
                http.get(`/regions/${this.state.entity.region_id}`)
                    .then(reg => {
                        this.setState({region_name: reg.data.name});
                    })
                    .catch(err =>
                        console.error(`Failed to retrieve details for site ${this.state.entity._id}, region: ${this.state.entity.region_id}`, err));
            } else {
                this.setState({region_name:""});
            }
        }
    }
}