import React, { Component, } from 'react';
import { Button,Row,Col,Table,Input,Popconfirm,message,Icon } from 'antd';
import { Link } from 'react-router-dom'
import moment from 'moment';
import axios from 'axios'

const FIRST_PAGE = 0;
const PAGE_SIZE = 10;
const Search = Input.Search;

class Sub extends Component{
    constructor(props){
        super(props)
        this.state={
            current: FIRST_PAGE,
            token:window.localStorage.getItem('token'),
            data:[],
            projectDetail:{

            },
            imcTaskDetail:{

            },
            imcItemDetail:{

            },
            id:window.localStorage.getItem('id'),
        }
        this.getGroupList = this.getGroupList.bind(this);
    }
    componentDidMount(){
        const { 
            match : { params : { id } }
          } = this.props
        this.getGroupList(id);   
    }
    //获取列表信息
    getGroupList = (id) => {
        axios({
            method: 'POST',
            url: '/pmc/inspectDetail/getInspectDetailList/'+id,
            headers: {
               'deviceId': this.deviceId,
              'Authorization':'Bearer '+this.state.token,
            },
          })
        .then((res) => {
            if(res && res.status === 200){
            console.log(res)
            this.setState({
                data: res.data.result,
            }) ;
            // console.log(this.state.data)
            }
        })
        .catch(function (error) {
            console.log(error);
        });
        
    }
    deleteGroup=(record)=>{
        const { 
            match : { params : { id } }
          } = this.props
          console.log(record.id)
        axios({
            method:'POST',
            url:'/pmc/inspectDetail/deleteDetailById/'+record.id,
            headers:{
                'deviceId': this.deviceId,
                'Authorization':'Bearer '+this.state.token,
            }           
        }) 
        .then((res) => {
            if(res && res.status === 200){
            console.log(res.data.result)
            this.getGroupList(id)
            }
        })
        .catch(function (error) {
            console.log(error);
        });
    }
    // deleteGroup=(record)=>{
    //     const { 
    //         match : { params : { id } }
    //       } = this.props
    //     axios({
    //         method:'POST',
    //         url:'/pmc/inspectDetail/deleteDetailByTaskId/'+record.id,
    //         headers:{
    //             'deviceId': this.deviceId,
    //             'Authorization':'Bearer '+this.state.token,
    //         }           
    //     }) 
    //     .then((res) => {
    //         if(res && res.status === 200){
    //         console.log(res.data.result)
    //         this.getGroupList(id)
    //         }
    //     })
    //     .catch(function (error) {
    //         console.log(error);
    //     });
    // }

    //发起巡检任务
    createImcTaskAndItem= async (imcItemId) =>{
        const{
            match :{ params : {projectId,id} }
        } = this.props;
        console.log("项目Id:" + projectId)
        console.log("巡检任务Id:" + id)
        console.log("巡检任务子项Id:" + imcItemId)
        //获取发起巡检任务所需的全部信息
        //获取对应的项目信息
        const res1 = await axios({
            method: 'POST',
            url: '/pmc/project/getById/'+projectId,
            headers: {
              'deviceId': this.deviceId,
              'Authorization':'Bearer '+this.state.token,
            },
          })
        // .then((res) => {
        //     if(res && res.status === 200){     
        //     this.setState({
        //        projectDetail:res.data.result
        //     }) ;
        //     console.log("对应的项目信息：" + JSON.stringify(this.state.projectDetail))
        //     }
        // })
        // .catch(function (error) {
        //     console.log(error);
        // });
        //获取对应的巡检任务信息
        const res2 = await axios({
            method: 'POST',
            url: '/pmc/InspectDevice/getTaskById/'+id,
            headers: {
              'deviceId': this.deviceId,
              'Authorization':'Bearer '+this.state.token,
            },
          })
        // .then((res) => {
        //     if(res && res.status === 200){     
        //     this.setState({
        //        imcTaskDetail:res.data.result
        //     }) ;
        //     console.log("对应的巡检任务信息：" + JSON.stringify(this.state.imcTaskDetail))
        //     }
        // })
        // .catch(function (error) {
        //     console.log(error);
        //     message.info("您不具备该权限")
        // });
        //获取对应的巡检任务子项信息
        const res3 = await axios({
            method: 'POST',
            url: '/pmc/inspectDetail/getInspectDetailById/'+imcItemId,
            headers: {
              'deviceId': this.deviceId,
              'Authorization':'Bearer '+this.state.token,
            },
          })
        // .then((res) => {
        //     if(res && res.status === 200){     
        //     this.setState({
        //        imcItemDetail:res.data.result
        //     }) ;
        //     console.log("对应的巡检任务子项信息：" + JSON.stringify(this.state.imcItemDetail))
        //     }
        // })
        // .catch(function (error) {
        //     console.log(error);
        //     message.info("您不具备该权限")
        // });
        if(res1 && res2 && res3 && res1.status === 200 && res2.status === 200 && res3.status === 200){
            //如果发起巡检任务所需的全部信息都已经获取到了，则发起巡检
            const projectDetail = res1.data.result;
            const imcTaskDetail = res2.data.result;
            const imcItemDetail = res3.data.result;
            let createImcInfo = {
                facilitatorId:projectDetail.partyBId,
                facilitatorGroupId:projectDetail.partyBId,
                facilitatorManagerId:projectDetail.partyBId,
                frequency:imcTaskDetail.cycleTime,
                inspectionType:1,
                days:imcTaskDetail.scheduledFinishTime,
                principalId:projectDetail.aleaderId,
                projectId:imcTaskDetail.projectId,
                scheduledStartTime:imcTaskDetail.scheduledStartTime,
                taskName:imcTaskDetail.taskName,
                userId:this.state.id,
                imcAddInspectionItemDtoList:[{
                    description:imcItemDetail.description,
                    itemName:imcItemDetail.itemName,
                }]
                // imcAddInspectionTaskDto:{
                    
                // }
            };
            console.log(createImcInfo);
            axios({
                method: 'POST',
                url: '/imc/inspectionTask/save',
                headers: {
                    'Content-Type':'application/json',
                    'deviceId': this.deviceId,
                    'Authorization':'Bearer '+this.state.token,
                },
                data:JSON.stringify(createImcInfo)
            })
            .then((res) => {
                if(res && res.status === 200){     
                    console.log("巡检任务发起成功：" + JSON.stringify(res.data.result))
                }
            })
            .catch(function (error) {
                console.log(error);
                message.info("您不具备该权限")
            });
        }

    }
    render(){
        const { 
            match : { params : { id,projectId } }
          } = this.props
        const {data}=this.state
        return(
            <div>
            <div className="searchPart">
            <Row>
                {/* <Col span={2}>巡检人姓名：</Col> */}
                <Col span={5}>
                {/* <Search
                    placeholder="搜索从这里开始"
                    enterButton
                    onSearch={value => this.selectActivity(value)}
                /> */}
                <Link to={`/cbd/pro/inspection/${projectId}`}>
                    <Icon type="arrow-left" ></Icon>返回巡检任务
                </Link>
                </Col>
                <Col push={16}>
                <Link to={`/cbd/pro/sub/new/${projectId}/${id}`}>
                    <Button type="primary">
                                +新建巡检子项
                    </Button>
                </Link>
                </Col>
            </Row> 
            </div>
            <Table
            className="group-list-module"
            bordered
            showHeader={true}
            // pagination={{
            //     current,
            //     total,
            //     pageSize: size,
            //     onChange: this.handlePageChange,
               
            // }}
            rowClassName={this.setRowClassName}
            dataSource={data}
            columns={[{
                title: '巡检详情ID',
                key: 'id',
                render: (text, record) => {
                return ((record.id && record.id) || '--')
                }   
            }, {
                title: '巡检任务ID',
                key: 'inspectionTaskId',
                render: (text, record) => {
                return (record.inspectionTaskId && record.inspectionTaskId) || '--'
                }
            }, {
                title: '巡检任务名称',
                key: 'inspectionTaskName',
                render: (text, record) => {
                return (record.inspectionTaskName && record.inspectionTaskName) || '--'
                }
            },
            {
                title: '巡检详情名称', 
                key: 'name',
                render: (text, record) => {
                return (record.name && record.name) || '--'
                }
            },{
                title: '巡检内容描述',
                key: 'description',
                render: (text, record) => {
                return (record.description && record.description) || '--'
                }
            },{
                title: '巡检结果',
                key: 'result',
                render: (text, record) => {
                return (record.result && record.result) || '--'
                }
            },
            {
                title: '操作',
                render: (text, record, index) => (
                <div className="operate-btns"
                    style={{ display: 'block' }}
                >
                    <Link
                    to={`/cbd/pro/sub/detail/${projectId}/${id}/${record.id}`}
                    style={{marginRight:'12px'}}
                    >详情</Link>               
                    <Link
                    to={`/cbd/pro/sub/edit/${projectId}/${id}/${record.id}`}
                    style={{marginRight:'12px'}}
                    >修改</Link>
                    <Popconfirm
                        title="确定要删除吗？"
                        onConfirm={()=> {this.deleteGroup(record)}}
                    >
                        <Button 
                        type="simple"
                        style={{marginRight:'12px',border:'none',padding:0,color:"#357aff",background:'transparent'}}
                        >删除</Button>
                    </Popconfirm>
                    <Button
                        type="simple"
                        style={{border:'none',padding:0,color:"#357aff",background:'transparent'}}
                        onClick={()=>this.createImcTaskAndItem(record.id)}
                    >发起巡检</Button>
                </div>
                ),
            }]}
            />
     </div>
        )
    }
}
export default Sub;