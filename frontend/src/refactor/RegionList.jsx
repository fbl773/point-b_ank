import React, {Component} from "react";
import http from "../../http.js";
import {Region} from "../entities/entities.js";
import {FormControl, Grid, InputLabel, MenuItem, Select} from "@mui/material";
import RegionListItem from "./RegionListItem.jsx";

class RegionList extends Component{
    constructor(props) {
        super(props);

        this.delete_region = this.delete_region.bind(this);
        this.state = {
            regions:[],
            selected_region:""
        }
    }

    componentDidMount() {
        http.get("/regions")
            .then(regs => {
                this.setState({regions:regs.data})
                let sel_reg = regs.data.find(reg => reg._id === this.props.selected_region_id);
                this.select_region(sel_reg)
            })
            .catch(err => console.error("Failed to fetch regions",err));
    }

    delete_region = (reg_id) => {
        let regions_updated = this.state.regions.filter(reg => reg._id !== reg_id)
        this.setState({regions:regions_updated});
    }

    select_region = (reg) => {
        console.log("sel recvs: ",reg);
        this.props.select_region(reg._id);
        this.setState({selected_region:reg.name})
    }

    /**
     *
     * @param e the select event
     * @param e.target.value {Region} the region we are selecting
     */
    handle_select_region = (e) => {
        console.log("Handle recvs: ",e.target.value);
        this.select_region(e.target.value)
    }


    render() {
        return(
            <Grid item xs={6}>
                <FormControl sx={{ mt: 1, width: "100%" }}>
                    <InputLabel id="region-label">Region</InputLabel>
                    <Select
                        id="region"
                        label="Region"
                        labelId="region-label"
                        value={this.state.selected_region}
                        onChange={(e) => this.select_region(e.target.value)}
                        renderValue={(selected) => selected}
                        >
                    {this.state.regions.map((reg) => (
                        <RegionListItem
                            region={reg}
                            on_delete={() => this.delete_region(reg._id)}
                            value={reg}
                            onClick = {this.select_region}
                        />)
                    )}
                        <MenuItem onClick={() => console.log("Would add") }>
                            + Add New Region
                        </MenuItem>
                    </Select>
                </FormControl>
            </Grid>
        )
    }
}


// import {FormControl, Grid, IconButton, InputLabel, Menu, MenuItem, Select} from "@mui/material";
// import React from "react";
//

// )}

export default RegionList;