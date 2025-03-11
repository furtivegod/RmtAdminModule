export default (data) => {
    let jsonEngData = [], jsonFNRData = [];
    for (let i = 0; i < data.length; i++) {
        let rootFind = false;
        for (let j = 0; j < jsonEngData.length; j++) {
            let subFind = false;
            if (jsonEngData[j].label === data[i].REGION_ENG_NM) {
                rootFind = true;
                for (let k = 0; k < jsonEngData[j].children.length; k++) {
                    if (jsonEngData[j].children[k].label === data[i].RESP_ENG_NM.trim()) {
                        subFind = true;
                        let grandFind = false
                        for (let l = 0; l < jsonEngData[j].children[k].children.length; l++) {
                            if (jsonEngData[j].children[k].children[l] === data[i].SUBRESP_ENG_NM.trim())
                                grandFind = true;
                        }
                        if (!grandFind) {
                            jsonEngData[j].children[k].children.push({
                                value: Math.random(),
                                label: data[i].SUBRESP_ENG_NM.trim(),
                                treeId: data[i].SUBRESP_ENG_NM.trim().substr(0, 5)
                            })
                            jsonFNRData[j].children[k].children.push({
                                value: Math.random(),
                                label: data[i].SUBRESP_FNR_NM.trim(),
                                treeId: data[i].SUBRESP_FNR_NM.trim().substr(0, 5)
                            })
                        }
                    }
                }
                if (!subFind) {
                    jsonEngData[j].children.push({
                        value: Math.random(),
                        label: data[i].RESP_ENG_NM.trim(),
                        children: [{
                            value: Math.random(),
                            label: data[i].SUBRESP_ENG_NM.trim(),
                            treeId: data[i].SUBRESP_ENG_NM.trim().substr(0, 5)
                        }]
                    })
                    jsonFNRData[j].children.push({
                        value: Math.random(),
                        label: data[i].RESP_FNR_NM.trim(),
                        children: [{
                            value: Math.random(),
                            label: data[i].SUBRESP_FNR_NM.trim(),
                            treeId: data[i].SUBRESP_FNR_NM.trim().substr(0, 5)
                        }]
                    })
                }
            }
        }
        if (!rootFind) {
            jsonEngData.push({
                value: Math.random(),
                label: data[i].REGION_ENG_NM,
                children: [{
                    value: Math.random(),
                    label: data[i].RESP_ENG_NM.trim(),
                    children: [{
                        value: Math.random(),
                        label: data[i].SUBRESP_ENG_NM.trim(),
                        treeId: data[i].SUBRESP_ENG_NM.trim().substr(0, 5)
                    }]
                }]
            })

            jsonFNRData.push({
                value: Math.random(),
                label: data[i].REGION_FNR_NM,
                children: [{
                    value: Math.random(),
                    label: data[i].RESP_FNR_NM.trim(),
                    children: [{
                        value: Math.random(),
                        label: data[i].SUBRESP_FNR_NM.trim(),
                        treeId: data[i].SUBRESP_FNR_NM.trim().substr(0, 5)
                    }]
                }]
            })
        }
    }
    return {
        jsonEngData,
        jsonFNRData
    }
}