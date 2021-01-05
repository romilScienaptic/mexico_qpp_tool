import React from 'react';
import 'antd/dist/antd.css';
import './login.scss';
import { Form, Icon, Input, Button, Col, message } from 'antd';
import axios from "axios";
import Hp from "../../../src/assets/images/Hp.png";

axios.defaults.withCredentials = true;

class NormalLoginForm extends React.Component {
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let formData = new FormData();
                formData.append('username', values.username);   //append the values with key, value pair
                formData.append('password', values.password);
                // if(values.username === "testUser" && values.password === "blockSave2019")
                //     this.props.history.push('/home');
                // else
                //     message.error('Invalid Credentials');
                return new Promise((resolve, reject) => {
                    axios.post('https://omnihpi008.auth.hpicorp.net/inspection/login', formData)
                        .then(response => {
                            if (response.status === 200) {
                                this.props.history.push('/home');
                            }
                        })
                        .catch(function (error) {
                            message.error('Invalid Credentials');
                        })
                })
            }
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <Col span={24}>
                    {/* <Col span={1}></Col>
                    <Col span={10} style={{ marginTop: "1%", marginBottom: "1%" }}><img src={Hp} style={{ width: "4em" }} alt="Hp logo" /><span style={{ color: "#0095d9", fontWeight: 500, fontSize: "16px", marginLeft: "2%" }}></span></Col>
                    <Col span={10}></Col> */}
                     <Col span={11}></Col>
                    <Col span={10} style={{ marginTop: "6%", marginBottom: "1%" }}><img src={Hp} style={{ width: "4em" }} alt="Hp logo" /><span style={{ color: "#0095d9", fontWeight: 500, fontSize: "16px", marginLeft: "2%" }}></span></Col>
                    {/* <Col span={10}></Col> */}
                </Col>
                <Col span={24} style={{marginTop:"-3em"}}>
                    <Col span={9}></Col>
                    <Col span={9}>
                        <Form onSubmit={this.handleSubmit} className="login-form">
                            <Form.Item>
                                {getFieldDecorator('username', {
                                    rules: [{ required: true, message: 'Please enter your username!' }],
                                })(
                                    <Input
                                        prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                        placeholder="Username"
                                    />,
                                )}
                            </Form.Item>
                            <Form.Item>
                                {getFieldDecorator('password', {
                                    rules: [{ required: true, message: 'Please enter your Password!' }],
                                })(
                                    <Input.Password
                                        prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                        type="password"
                                        placeholder="Password"
                                    />,
                                )}
                            </Form.Item>
                            <Form.Item>
                                <Button htmlType="submit" className="login-form-button">
                                    Log in
                                </Button>
                            </Form.Item>
                        </Form>
                    </Col>
                    <Col span={6}></Col>
                </Col>
            </div>
        );
    }
}

const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(NormalLoginForm);

export default WrappedNormalLoginForm;
