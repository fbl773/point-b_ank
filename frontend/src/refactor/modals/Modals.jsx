import React from 'react';
import EditCreateModal from './EditCreateModal';
import {DialogContent, TextField} from "@mui/material";

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