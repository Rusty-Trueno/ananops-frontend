import React,{Component,} from 'react'
import { Button,Row,Col,Table,Input,Select,Popconfirm,message  } from 'antd';
import { Link } from 'react-router-dom'
import moment from 'moment';
import './index.styl'
import axios from 'axios'
const FIRST_PAGE = 0;
const PAGE_SIZE = 10;
const Search = Input.Search;

class inspectionItem extends Component{
    constructor(props){
        super(props)
        this.state={
            data:{},
            token:window.localStorage.getItem('token'),
            roleCode:window.localStorage.getItem('roleCode'),
            size: PAGE_SIZE,
            // total: 20, 
            nowCurrent:FIRST_PAGE,
            role:window.localStorage.getItem('role'),
            size: PAGE_SIZE,
            // total: 20, 
            nowCurrent:FIRST_PAGE,
            data:[],
            status:null,
            imcTaskId:null,
            display_button1:'none',
            display_button2:'none',
            display_button3:'none',
            maintainerId:window.localStorage.getItem('id'),
        }
        this.getInfo=this.getInfo.bind(this)
    }
    componentDidMount(){
      const { 
        match : { params : { imcTaskId } }
      } = this.props
      this.setState({
        imcTaskId:imcTaskId
      })
      this.getInfo(imcTaskId)
    }

    //获取工单对应的子项
    getInfo=(id)=>{
      var location = this.props.location.pathname;
      console.log(location)
      var status;
      //根据不同的url进行栏目的区分
      if(location.includes('/cbd/item/waitForMaintainer')){
        //如果当前状态是等待分配工程师
        status = 1;
        if(this.state.role && this.state.role.includes("服务商")){
          this.setState({
            display_button1:'block',
            display_button2:'none',
            display_button3:'none',
          })
        }else{
          this.setState({
            display_button1:'none',
            display_button2:'none',
            display_button3:'none',
          })
        }
        
      }
      if(location.includes('/cbd/item/waitForAccept')){
        status = 2;
        this.setState({
          display_button1:'none',
          display_button2:'none',
          display_button3:'none',
        })
      }
      if(location.includes('/cbd/item/execute')){
        status = 3;
        this.setState({
          display_button1:'none',
          display_button2:'none',
          display_button3:'none',
        })
      }
      if(location.includes('/cbd/item/finish')){
        status = 4;
        this.setState({
          display_button1:'none',
          display_button2:'none',
          display_button3:'none',
        })
      }
      if(location.includes('/cbd/item/confirmed')){
        status = 5;
        this.setState({
          display_button1:'none',
          display_button2:'none',
          display_button3:'none',
        })
      }
      if(location.includes('/cbd/inspection/waitForMaintainer'))
      {
        //如果当前是工程师账号，且处于工程师待接单状态
        this.setState({
          display_button1:'none',
          display_button2:'block',
          display_button3:'none',
        })
        const values={orderBy:'string',pageSize:100,pageNum:0,maintainerId:this.state.maintainerId,status:2};
        console.log(JSON.stringify(values));
        axios({
          method: 'POST',
          url: '/imc/inspectionItem/getItemByMaintainerIdAndStatus',
          headers: {
            'Content-Type':'application/json',
            'deviceId': this.deviceId,
            'Authorization':'Bearer '+this.state.token,
          },
          data:JSON.stringify(values)
        })
        .then((res) => {
            if(res && res.status === 200){
            console.log("任务子项列表："+JSON.stringify(res.data.result))
            var taskItemList
            res.data.result==null?taskItemList=[]:taskItemList=res.data.result
            // res.data.result==null?pageNum=0:pageNum=res.data.result.pageNum
            this.setState({
                data:taskItemList,
              //   status:status,
              //  roleCode:roleCode,
            });
            }
        })
        .catch(function (error) {
            console.log(error);
        });
        
      }else if(location.includes('/cbd/inspection/maintainerAccept')){
        //如果当前是工程师账号，且处于工程师已接单
        this.setState({
          display_button1:'none',
          display_button2:'none',
          display_button3:'block',
        })
        const values={orderBy:'string',pageSize:100,pageNum:0,maintainerId:this.state.maintainerId};
        console.log(JSON.stringify(values));
        axios({
          method: 'POST',
          url: '/imc/inspectionItem/getAllAcceptedItemByMaintainer',
          headers: {
            'Content-Type':'application/json',
            'deviceId': this.deviceId,
            'Authorization':'Bearer '+this.state.token,
          },
          data:JSON.stringify(values)
        })
        .then((res) => {
            if(res && res.status === 200){
            console.log(res.data.result)
            var taskItemList
            res.data.result==null?taskItemList=[]:taskItemList=res.data.result
            // res.data.result==null?pageNum=0:pageNum=res.data.result.pageNum
            this.setState({
                data:taskItemList,
              //   status:status,
              //  roleCode:roleCode,
            });
            }
        })
        .catch(function (error) {
            console.log(error);
        });
      }else{
        const values={orderBy: "string",pageSize:100,pageNum:0,taskId:id,status:status}
        console.log(values)
        axios({
            method: 'POST',
            url: '/imc/inspectionItem/getAllItemByTaskIdAndStatus',
            headers: {
              'deviceId': this.deviceId,
              'Authorization':'Bearer '+this.state.token,
            },
            data:values
          })
        .then((res) => {
            if(res && res.status === 200){
            // console.log(res.data.result)
            var taskItemList
            res.data.result==null?taskItemList=[]:taskItemList=res.data.result
            // res.data.result==null?pageNum=0:pageNum=res.data.result.pageNum
            this.setState({
                data:taskItemList,
              //   status:status,
              //  roleCode:roleCode,
            });
            console.log(JSON.stringify(this.state.data))
            }
        })
        .catch(function (error) {
            console.log(error);
        });
      }
    }

    //工程师接单
    acceptImcItem=(itemId)=>{
      const data = {
        itemId:itemId
      }
      console.log(JSON.stringify(data))
      axios({
          method: 'POST',
          url: '/imc/inspectionItem/acceptItemByMaintainer',
          headers: {
            'Content-Type':'application/json',
            'deviceId': this.deviceId,
            'Authorization':'Bearer '+this.state.token,
          },
          data:JSON.stringify(data)
        })
      .then((res) => {
          if(res && res.status === 200){
            alert("工程师接单成功！")
            //如果当前是维修工账号
            this.setState({
              display_button1:'none',
              display_button2:'block',
            })
            const values={orderBy:'string',pageSize:100,pageNum:0,maintainerId:this.state.maintainerId,status:2};
            console.log(JSON.stringify(values));
            axios({
              method: 'POST',
              url: '/imc/inspectionItem/getItemByMaintainerIdAndStatus',
              headers: {
                'Content-Type':'application/json',
                'deviceId': this.deviceId,
                'Authorization':'Bearer '+this.state.token,
              },
              data:JSON.stringify(values)
            })
            .then((res) => {
                if(res && res.status === 200){
                console.log(res.data.result)
                var taskItemList
                res.data.result==null?taskItemList=[]:taskItemList=res.data.result
                // res.data.result==null?pageNum=0:pageNum=res.data.result.pageNum
                this.setState({
                    data:taskItemList,
                  //   status:status,
                  //  roleCode:roleCode,
                });
                }
            })
            .catch(function (error) {
                console.log(error);
            });
          }
      })
      .catch(function (error) {
          console.log(error);
      });
    }

    //工程师完成该巡检任务子项
    finishImcItem=(itemId)=>{
      const data = {
        itemId:itemId,
        status:4
      }
      console.log(JSON.stringify(data))
      axios({
          method: 'POST',
          url: '/imc/inspectionItem/modifyItemStatusByItemId',
          headers: {
            'Content-Type':'application/json',
            'deviceId': this.deviceId,
            'Authorization':'Bearer '+this.state.token,
          },
          data:JSON.stringify(data)
        })
      .then((res) => {
          if(res && res.status === 200){
            alert("此次巡检完成！")
            this.setState({
              display_button1:'none',
              display_button2:'none',
              display_button3:'block',
            })
            const values={orderBy:'string',pageSize:100,pageNum:0,maintainerId:this.state.maintainerId};
            console.log('/imc/inspectionItem/modifyItemStatusByItemId' + JSON.stringify(values));
            axios({
              method: 'POST',
              url: '/imc/inspectionItem/getAllAcceptedItemByMaintainer',
              headers: {
                'Content-Type':'application/json',
                'deviceId': this.deviceId,
                'Authorization':'Bearer '+this.state.token,
              },
              data:JSON.stringify(values)
            })
            .then((res) => {
                if(res && res.status === 200){
                console.log('/imc/inspectionItem/modifyItemStatusByItemId' + JSON.stringify(res.data.result))
                var taskItemList
                res.data.result==null?taskItemList=[]:taskItemList=res.data.result
                // res.data.result==null?pageNum=0:pageNum=res.data.result.pageNum
                this.setState({
                    data:taskItemList,
                  //   status:status,
                  //  roleCode:roleCode,
                });
                }
            })
            .catch(function (error) {
                console.log(error);
            });
          }
      })
      .catch(function (error) {
          console.log(error);
      });
    }

    render(){
      const { 
        match : { params : { id } }
      } = this.props
      const {
        data,
        nowCurrent,
        size, 
        roleCode
        } = this.state;
        const current = nowCurrent+1
        const limit = size
        console.log(roleCode)
        console.log("巡检任务对应的Id：" + this.state.imcTaskId)
        return(
            <div>
            <div className="searchPart">
              <Row>            
                <Col span={3}>
                  <Link to='/cbd/inspection'>返回上级</Link>
                </Col>
                {/* <Col span={3}>任务子项状态：</Col> */}
              </Row> 
            </div>
            <Table
              className="group-list-module"
              bordered
              showHeader={true}
              pagination={{
                current,
               // total,
                pageSize: size,
                onChange: this.handlePageChange,
                // showTotal: () => `共${allCount} 条数据`
              }}
              rowClassName={this.setRowClassName}
              dataSource={data}
              columns={[{
                title: '巡检任务子项ID  ',
                key: 'id',
                render: (text, record) => {
                  return ((record.id && record.id) || '--')
                }   
              }, {
                title: '巡检子项的名称',
                key: 'itemName',
                render: (text, record) => {
                  return ((record.itemName && record.itemName) || '--')
                }   
              }, {
                title: '从属的巡检任务的ID',
                key: 'inspectionTaskId',
                render: (text, record) => {
                  return (record.inspectionTaskId && record.inspectionTaskId) || '--'
                }
              }, {
                title: '巡检子项对应的维修工',
                key: 'maintainerId',
                render: (text, record) => {
                  return (record.maintainerId && record.maintainerId) || '--'
                }
              },{
                title: '巡检任务子项对应的网点', 
                key: 'userId',
                render: (text, record) => {
                  return (record.location && record.location) || '--'
                }
              }, {
                title: '巡检周期（天）',
                key: 'frequency',
                render: (text, record) => {
                  return (record.frequency && record.frequency) || '--'
                }
              }, {
                title: '巡检持续时间（天）',
                key: 'days',
                render: (text, record) => {
                  return (record.days && record.days) || '--'
                }
              },
              {
                title: '实际开始时间 ',
                key: 'actualStartTime',
                render: (text, record) => {
                  return (record.actualStartTime && record.actualStartTime) || '--'
                }
              },{
                title: '实际完成时间',
                key: 'actualFinishTime',
                render: (text, record) => {
                  return (record.actualFinishTime && record.actualFinishTime) || '--'
                }
              },{
                title: '内容描述 ',
                key: 'description',
                render: (text, record) => {
                  return (record.description && record.description) || '--'
                }
              },
              {
                title: '操作',
                render: (text, record, index) => (
                  <div className="operate-btns"
                    style={{ display: 'block' }}
                  >
                    <Link
                      to={`/cbd/imcItemInfo/log/${this.state.imcTaskId}/${record.id}`}
                      style={{marginRight:'12px'}}
                    >子项日志</Link>
                    <Link
                      to={`/cbd/imcItemInfo/detail/${this.state.imcTaskId}/${record.id}`}
                      style={{marginRight:'12px'}}
                    >详情</Link>
                    <Link
                      to={`/cbd/imcItemInfo/bindEngineer/${this.state.imcTaskId}/${record.id}`}
                      style={{marginRight:'12px',display:this.state.display_button1}}
                    >绑定工程师</Link>
                    {/* <Link
                      to={`/cbd/imcItemInfo/bindEngineer/${this.state.imcTaskId}/${record.id}`}
                      style={{marginRight:'12px',display:this.state.display_button1}}
                    >发起维修维护申请</Link> */}
                    <Popconfirm
                        title="确定接单？"
                        onConfirm={()=> {this.acceptImcItem(record.id)}}
                    >
                        <Button 
                        type="simple"
                        style={{marginRight:'12px',border:'none',padding:0,color:"#357aff",background:'transparent',display:this.state.display_button2}}
                        >接单</Button>
                    </Popconfirm> 
                    <Popconfirm
                        title="确定已完成？"
                        onConfirm={()=> {this.finishImcItem(record.id)}}
                    >
                        <Button 
                        type="simple"
                        style={{marginRight:'12px',border:'none',padding:0,color:"#357aff",background:'transparent',display:this.state.display_button3}}
                        >完成巡检</Button>
                    </Popconfirm> 
                  </div>
                ),
              }
            ]}
            />
          </div>  
        )
    }
}
export default inspectionItem