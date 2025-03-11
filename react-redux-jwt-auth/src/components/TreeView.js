import React from "react";
import CheckboxTree from 'react-checkbox-tree';
import {
    MDBCardTitle,
    MDBCardBody,
    MDBBtn,
    MDBIcon,
    MDBTooltip
} from 'mdb-react-ui-kit';
const TreeView = ({
    title,
    data,
    treeCheck,
    treeExpand,
    setTreeCheck,
    setTreeExpand,
    ids
}) => {

    const getNodeIds = (nodes) => {
		let ids = [];
		nodes && nodes.forEach(({ value, children }) => {
			ids = [...ids, value, ...getNodeIds(children)];
		});
		return ids;
	}

    return <MDBCardBody>
        <MDBCardTitle>
            <span>{title}</span>
            <div className="card-actions">
                <MDBTooltip tag='span' title="Check All">
                    <MDBBtn className='mr-1' color='dark' floating onClick={() => { setTreeCheck(ids) }}>
                        <MDBIcon far icon="check-square" />
                    </MDBBtn>
                </MDBTooltip>
                <MDBTooltip tag='span' title="Uncheck All">
                    <MDBBtn className='mr-1' color='dark' floating onClick={() => { setTreeCheck([]) }}>
                        <MDBIcon fas icon="window-close" />
                    </MDBBtn>
                </MDBTooltip>
                <MDBTooltip tag='span' title="Expand All">
                    <MDBBtn className='mr-1' color='dark' floating onClick={() => { setTreeExpand(getNodeIds(data)) }}>
                        <MDBIcon fas icon="expand" />
                    </MDBBtn>
                </MDBTooltip>
                <MDBTooltip tag='span' title="Collapse All" >
                    <MDBBtn className='mr-1' color='dark' floating onClick={() => { setTreeExpand([]) }}>
                        <MDBIcon fas icon="compress-arrows-alt" />
                    </MDBBtn>
                </MDBTooltip>
            </div>
        </MDBCardTitle>
        <CheckboxTree
            nodes={data}
            checked={treeCheck}
            expanded={treeExpand}
            onCheck={checked => setTreeCheck(checked)}
            onExpand={expanded => setTreeExpand(expanded)}
        />
    </MDBCardBody>
}

export default TreeView