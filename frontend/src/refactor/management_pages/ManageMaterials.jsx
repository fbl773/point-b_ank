import ManagementPage from "./ManagementPage.jsx";
import http from "../../../http.js";
import MaterialModal from "../MaterialModal.jsx";
import {GridActionsCellItem} from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";


class ManageMaterials extends ManagementPage {

    constructor(props) {
        super(props);
    }

    generate_cols() {
        return [
            { field: "id", headerName: "ID", flex: 1 },
            { field: "name", headerName: "Name", flex: 1 },
            { field: "description", headerName: "Description", flex: 3 },
            {
                field: "artifact_type",
                headerName: "Artifact Type",
                width: 200,
                valueGetter: (params) =>
                    params.row.artifactType ? params.row.artifactType.id : "Indeterminate",
            }, {
                field: "actions",
                type: "actions",
                headerName: "Actions",
                flex: 1,
                getActions: (params) =>
                    this.props.context
                        ? [
                            <GridActionsCellItem
                                icon={<EditIcon />}
                                label="Edit"
                                onClick={() => {this.handleEdit(params.row)}}
                                color="inherit"
                            />,
                            <GridActionsCellItem
                                icon={<DeleteIcon />}
                                label="Delete"
                                onClick={() => this.handleDelete(params.row)}
                                color="inherit"
                            />
                        ]
                        : [],
            },
        ]
    }

    generate_editor() {
        return (this.state.dialog &&
        <MaterialModal
            open={this.state.dialog}
            adding_new={this.state.adding_new}
            append_new={(new_mat) => this.append_new(new_mat)}
            on_close={() => this.setState({dialog:false})}
            on_success={() => this.alert_success(this.state.adding_new ? "created":"edited")}
            entity={this.state.selected}
        />)
    }

    fetch_entities() {
        http.get(this.props.url)
            .then(resp => {
                let materials = resp.data;

                materials.map(material => { material["id"] = material._id });

                this.setState({rows:materials});
            })
    }

}

export default ManageMaterials;
