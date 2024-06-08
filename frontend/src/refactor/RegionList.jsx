import React, {Component} from "react";
import http from "../../http.js";
import {Region} from "../entities/entities.js";
import {FormControl, Grid, InputLabel, MenuItem, Select} from "@mui/material";
import RegionListItem from "./RegionListItem.jsx";
import {Delete} from "@mui/icons-material";
import DeleteConfirmDialog from "./DeleteConfirmDialog.jsx";

class RegionList extends Component{
    constructor(props) {
        super(props);

        this.delete_region = this.delete_region.bind(this);
        this.state = {
            regions:[],
            selected_region:"",
            del_region:{},
            show_del:false
        }
    }

    componentDidMount() {
        http.get("/regions")
            .then(regs => {
                this.setState({regions: regs.data})
                if (this.props.selected_region_id) {
                    let sel_reg = regs.data.find(reg => reg._id === this.props.selected_region_id);
                    this.select_region(sel_reg)
                }
            })
            .catch(err => console.error("Failed to fetch regions",err));
    }

    confirm_reg_delete = (reg) => {
        this.setState({del_region:reg,show_del:true})
    }
    delete_region = (reg_id) => {
        http.delete(`/regions/${reg_id}`)
            .then(() => {
                let region_id = reg_id;
                console.log(`Successfully deleted region: ${region_id} `)
                let regions_updated = this.state.regions.filter(reg => reg._id !== reg_id)
                this.setState({regions:regions_updated,
                    del_reg:{},
                    show_del:false,
                    selected_region:""//todo this blanks the set region, even if the deleted one is not the set one...
                });
            })
            .catch(err => console.error(`Failed to delete region: ${this.state.region._id}`,err));
    }

    select_region = (reg) => {
        this.props.select_region(reg._id);
        this.setState({selected_region:reg.name})
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
                        value={this.state.selected_region ?? ""}
                        onChange={(e) => this.select_region(e.target.value)}
                        renderValue={(selected) => selected}
                        >
                    {this.state.regions.map((reg) => (
                        <RegionListItem
                            region={reg}
                            on_delete={() => this.confirm_reg_delete(reg)}
                            value={reg}
                            onClick = {this.select_region}
                        />)
                    )}
                    </Select>
                </FormControl>
                <div>
                    <DeleteConfirmDialog
                        open_condition={this.state.show_del}
                        title={`Delete Region ${this.state.del_region.name ?? ""}`}
                        text={`Are you sure you want to delete ${this.state.del_region.name ?? ""}? This will unset it for all related sites.`}
                        on_cancel={() => this.setState({del_region:{},show_del:false})}
                        on_proceed={() => this.delete_region(this.state.del_region._id ?? "")}/>
                </div>
            </Grid>
        )
    }
}


// import {FormControl, Grid, IconButton, InputLabel, Menu, MenuItem, Select} from "@mui/material";
// import React from "react";
//

// )}

export default RegionList;