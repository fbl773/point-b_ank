import ManagementPage from "./ManagementPage.jsx";
import http from "../../http";
import {GridActionsCellItem} from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import PeriodModal from "./PeriodModal.jsx";

class ManagePeriod extends ManagementPage{
    constructor(props) {
        super(props);
    }

    async fetch_entities() {
        http.get(this.props.url)
            .then(resp => {
                let periods = resp.data;
                periods.map(period => period["id"] = period._id);
                this.setState({rows:periods});
            })
            .catch(err => console.log(`Error to fetch periods`,err));
    }

    async delete_entity(entity_id) {
        return super.delete_entity(entity_id)
            .then(() => {
                this.remove(entity_id)
                this.alert_success("delete");
            })
            .catch(err => {
                console.error(`failed to delete Period: ${JSON.stringify(entity_id)}`,err);
                this.alert_failure("delete");
            })
    }

    generate_editor() {
        return (this.state.dialog &&
            <PeriodModal
                open={this.state.dialog}
                adding_new={this.state.adding_new}
                append_period={(new_period) => this.append_new(new_period)}
                on_close={() => this.setState({dialog:false})}
                on_success={() => this.alert_success(this.state.adding_new ? "created":"edited")}
                selected_period={this.state.selected}
            />
        )
    }

    generate_cols() {
        return [
            { field: "id", headerName: "ID", flex: 1, editable: false },
            { field: "name", headerName: "Name", flex: 2, editable: false },
            {
                field: "start",
                headerName: "Start Year",
                type: "number",
                flex: 1,
                editable: false,
            },
            {
                field: "end",
                headerName: "End Year",
                type: "number",
                flex: 1,
                editable: false,
            },
            {
                field: "actions",
                type: "actions",
                headerName: "Actions",
                flex: 1,
                cellClassName: "actions",
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
}

export default ManagePeriod;