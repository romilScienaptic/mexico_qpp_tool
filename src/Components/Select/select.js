
import React from 'react';
import 'antd/dist/antd.css';
import './select.css';
import { Select } from 'antd';

const { Option } = Select;

class Dropdown extends React.Component{
    constructor(props){
        super(props);
        if(props.value !== ""){
            this.state={
                val:props.value
            }
        }
        else{
            this.state={
                val:props.placeholder
            }
        }
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.value !== "")
         this.setState({ val: nextProps.value});
        else
         this.setState({ val: nextProps.defaultValue});
    }

    handleChange = (value) =>{
       //alert(`selected ${value}`);
       this.props.select(value,this.props.id);
    }
    render(){
        return(
            <Select mode ={this.props.mode} defaultValue= {this.props.defaultValue} style={{ width: this.props.width, border:this.props.border }} showSearch onChange={this.handleChange} placeholder={this.props.placeholder} value={this.state.val} >
                {
                    this.props.data.map((data,i)=>{
                    return(
                            <Option value={data} key={i}>{data}</Option>   
                          )
                    })
                }
            </Select>
        )
    }
}

export default Dropdown;   