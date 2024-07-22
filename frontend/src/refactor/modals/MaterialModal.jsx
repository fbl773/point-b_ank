import React from 'react';
import EditCreateModal from './EditCreateModal';
import {DialogContent, TextField} from "@mui/material";

const artifact_types = ["lithic","faunal","ceramic","other"];

class MaterialModal extends EditCreateModal{

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

export default MaterialModal;