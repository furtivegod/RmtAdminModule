import React, { useEffect, useState } from "react";
import {
	MDBCard,
	MDBCardBody,
	MDBRow,
	MDBCol,
	MDBBtn,
	MDBRadio,
	MDBPopover,
	MDBPopoverHeader,
	MDBPopoverBody,
	MDBInput
} from 'mdb-react-ui-kit';

import UserService from "../services/user.service";
import "react-checkbox-tree/src/scss/react-checkbox-tree.scss";

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

import buildJsonTree from "../helpers/buildJsonTree";
import TreeView from "./TreeView";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Home = () => {

	const [userList, setUserList] = useState([{
		name: "neversmile"
	}, {
		name: "neverland"
	}])

	const [lang, setLang] = useState("en")

	const [curUserIdx, setCurUserIdx] = useState(0)
	const [username, setUserName] = useState("")

	const [AvailableTreeCheck, setAvailableTreeCheck] = useState([]);
	const [AvailableTreeExpand, setAvailableTreeExpand] = useState([]);

	const [AvailableTreeEngData, setATEData] = useState([])
	const [AvaiableTreeFnrData, setATFData] = useState([])

	const [LocationTreeCheck, setLocationTreeCheck] = useState([])
	const [LocationTreeExpand, setLocationTreeExpand] = useState([])

	const [LocationTreeEngData, setLTEData] = useState([])
	const [LocationTreeFnrData, setLTFData] = useState([])

	const [filters, setFilter] = useState([])

	const [type, setType] = useState("rtm")

	useEffect(() => {
		getInitialData()
	}, [type])

	useEffect(() => {
		if (userList[curUserIdx]) {	// update current location tree
			setFilter(userList[curUserIdx].access)
		}
	}, [userList, curUserIdx])

	useEffect(() => {
		filterTree()
		setAvailableTreeCheck([])
		setLocationTreeCheck([])
	}, [filters])

	const getInitialData = () => {
		UserService
			.getInitialData(type)
			.then(res => {
				if (res.data.data) {
					let { jsonEngData, jsonFNRData } = buildJsonTree(res.data.data)
					setATEData(jsonEngData)
					setATFData(jsonFNRData)
				}
				if (res.data.users)
					setUserList(res.data.users)
			})
			.catch(error => {
				setATEData([])
				setATFData([])
				setUserList([])
			})
	}

	const getChildNodeIds = (nodes) => {
		let results = []

		const extractVal = (nodes) => {
			nodes.forEach((e) => {
				if (!e.children)
					results.push((e.value).toString());
				if (e.children) {
					extractVal(e.children);
				}
			});
		};

		extractVal(nodes);
		return results
	}

	const filterTree = () => {
		const nodesFiltered = AvailableTreeEngData.reduce(filterNodes, [])
		setLTEData(nodesFiltered)
	}

	const filterNodes = (filtered, node) => {
		const children = (node.children || []).reduce(filterNodes, []);
		if (filters.indexOf(node.value + "") > -1 || filters.indexOf(node.value * 1) > -1 || children.length) {
			if (children.length > 0)
				filtered.push({ ...node, children });
			else
				filtered.push({ ...node });
		}

		return filtered;
	}

	const moveToRight = () => {
		setFilter([].concat(AvailableTreeCheck).concat(getChildNodeIds(LocationTreeEngData)))
	}

	const moveToLeft = () => {
		let locationIds = getChildNodeIds(LocationTreeEngData)
		var arr = locationIds.filter((item) => LocationTreeCheck.indexOf(item + "") === -1);
		setFilter(arr)
	}

	const handleAddUser = () => {
		if (username.trim() === "")
			return toast.error("Invalid Username")

		UserService
			.addUser({ name: username, type })
			.then(res => {
				setUserList([...userList, res.data])
			}).catch(error => {
				toast.error((error.response &&
					error.response.data) ||
					error.message ||
					error.toString())
			})
	}

	const openDeleteUserModal = () => {
		if (!userList[curUserIdx]) {
			return toast.error("Invaild User");
		}

		confirmAlert({
			customUI: ({ onClose }) => {
				const deleteUser = () => {
					if (userList[curUserIdx].access.length > 0) {
						onClose()
						return toast.info("Remove Access")
					}
					UserService
						.deleteUser({ name: userList[curUserIdx].name, type })
						.then(res => {
							setUserList(userList.filter(item => item.name !== res.data))
							setCurUserIdx(0)
							toast.info("success")
							onClose();
						}).catch(error => {
							toast.error((error.response &&
								error.response.data) ||
								error.message ||
								error.toString())
							onClose();
						})
				}

				return (
					<div className='custom-ui'>
						<h1>Are you sure?</h1>
						<p>You want to delete <i>{userList[curUserIdx].name}</i>?</p>
						<button onClick={onClose}>No</button>
						<button onClick={deleteUser}>Yes, Delete it!</button>
					</div>
				)
			}
		})
	}


	const handleSaveAccess = () => {
		let access = getChildNodeIds(LocationTreeEngData)
		UserService
			.updateAccess({ name: userList[curUserIdx].name, type, access })
			.then(() => {
				toast.success("success")
				setUserList(userList.map(item => {
					if (item.name === userList[curUserIdx].name)
						return { ...item, access }
					return item
				}))
			}).catch(error => {
				toast.error((error.response &&
					error.response.data) ||
					error.message ||
					error.toString())
			})
	}

	return <>
		<div className="langbar">
			<MDBBtn
				className="mr-2"
				color={`${lang === 'fr' ? "light" : ""}`}
				onClick={() => setLang("en")}
			>EN</MDBBtn>
			<MDBBtn
				color={`${lang === 'en' ? "light" : ""}`}
				onClick={() => setLang("fr")}
			>FR</MDBBtn>
			{/* <span className={`${lang === 'en' ? "active" : ""}`} onClick={() => setLang("en")}>EN</span>
			<span className={`${lang === 'fr' ? "active" : ""}`} onClick={() => setLang("fr")}>FR</span> */}
		</div>
		<MDBCard className="header mt-2">
			<MDBCardBody className="container">
				<h1 className="title">RMT Admin Module</h1>
			</MDBCardBody>
		</MDBCard>
		<MDBCard className="filters my-4">
			<MDBCardBody >
				<div className="user-list form-group">
					<label htmlFor="sel1">UserId:</label>
					<select
						className="form-control"
						id="sel1"
						onChange={(e) => setCurUserIdx(e.target.value)}
					>
						{
							userList.length > 0
								? userList.map((item, key) => <option key={key} value={key}>{item.name}</option>)
								: <option>No Users</option>
						}
					</select>
				</div>
				<div className="schema-list">
					<MDBRadio name='inlineRadio' id='inlineRadio1' value='rtm' label='RTM' inline checked={type === "rtm" ? true : false} onChange={e => setType(e.target.value)} />
					<MDBRadio name='inlineRadio' id='inlineRadio2' value='cor' label='RTM CORCAN' inline checked={type === "cor" ? true : false} onChange={e => setType(e.target.value)} />
					<MDBRadio name='inlineRadio' id='inlineRadio3' value='gwc' label='RTM GWC' inline checked={type === "gwc" ? true : false} onChange={e => setType(e.target.value)} />
				</div>
			</MDBCardBody>
		</MDBCard>

		<MDBRow className="home-container">
			<MDBCol className="actions" md='2'>
				{/* <MDBPopover btnChildren='Add User' placement='right' >
					<MDBPopoverHeader>Input Username</MDBPopoverHeader>
					<MDBPopoverBody className="text-center">
						<MDBInput className="mb-2" value={username} onChange={e => setUserName(e.target.value)} />
						<MDBBtn className='mr-2' color='primary' onClick={handleAddUser}>Ok</MDBBtn>
						<MDBBtn color='danger'  >Cancel</MDBBtn>
					</MDBPopoverBody>
				</MDBPopover> */}
				<MDBBtn onClick={openDeleteUserModal}>Remove User</MDBBtn>
			</MDBCol>
			<MDBCol className="main-panel" md='10'>
				<MDBRow className="treeviews">
					<MDBCol md='5'>
						<MDBCard className="available">
							<TreeView
								data={lang === "en" ? AvailableTreeEngData : AvaiableTreeFnrData}
								treeCheck={AvailableTreeCheck}
								treeExpand={AvailableTreeExpand}
								setTreeCheck={setAvailableTreeCheck}
								setTreeExpand={setAvailableTreeExpand}
								ids={getChildNodeIds(AvailableTreeEngData)}
								title="Available Locations"
							/>
						</MDBCard>
					</MDBCol>
					<MDBCol md="2" className="arrows">
						<MDBBtn className="mt-3 mx-auto d-block to-right" onClick={moveToRight}>
							<i className="fas fa-angle-double-right"></i>
						</MDBBtn>
						<MDBBtn className="mt-3 mx-auto d-block to-left" onClick={moveToLeft}>
							<i className="fas fa-angle-double-left"></i>
						</MDBBtn>
					</MDBCol>
					<MDBCol md='5'>
						<MDBCard className="location">
							<TreeView
								data={LocationTreeEngData}
								treeCheck={LocationTreeCheck}
								treeExpand={LocationTreeExpand}
								setTreeCheck={setLocationTreeCheck}
								setTreeExpand={setLocationTreeExpand}
								ids={getChildNodeIds(LocationTreeEngData)}
								title="Current Locations"
							/>
						</MDBCard>
					</MDBCol>
				</MDBRow>
				{
					userList[curUserIdx] && <MDBBtn className="mt-3 mx-auto d-block" onClick={handleSaveAccess}>Save</MDBBtn>
				}
			</MDBCol>
		</MDBRow>
		<ToastContainer theme="colored" />
	</>
}

export default Home