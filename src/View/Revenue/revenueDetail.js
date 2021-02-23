import React from 'react';
import { Table, Col, Button, Row, Divider, Collapse, Modal, message, Typography, Popconfirm, Icon, Select, Input, Checkbox, Form } from 'antd';
import CurrencyFormat from 'react-currency-format';
import Dropdown from '../../Components/Select/select';
// import EditableLabel from 'react-editable-label';
import Download from '../../Components/Download/csvDownload';
// import DatePicker from '../../Components/Datepicker/datepicker';
import Hp from '../../assets/images/Hp.png';
import Loading from '../../Components/Loading/loading';
// import moment from 'moment';
import axios from 'axios';
import './revenue.scss';


const EditableContext = React.createContext();
const { Option } = Select;
const { Search } = Input;
const { Panel } = Collapse;
const { Text } = Typography;

let Fyear = [], secondYear = [];


let dataPacket = [], revenue_flag = '';

class EditableCell extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            revenue_flag: ''
        }
    }

    check = (event) => {
        revenue_flag = event.target.checked;
    }

    getInput = () => {
        if (this.props.dataIndex === "threshold") {
            return <Input style={{ width: '7em' }}
                checked={revenue_flag !== '' ? revenue_flag : this.props.record["threshold"]}
                onChange={this.check}
            />
        }
        return <Input allowClear />;
    };

    renderCell = ({ getFieldDecorator }) => {
        const {
            editing,
            dataIndex,
            title,
            inputType,
            record,
            index,
            children,
            ...restProps
        } = this.props;
        return (
            <td {...restProps}>
                {editing ? (
                    <Form.Item style={{ margin: 0 }}>
                        {getFieldDecorator(dataIndex, {
                            rules: [
                                {
                                    required: false,
                                    message: `Please Input ${title}!`
                                }
                            ],
                            initialValue: record[dataIndex]
                        })(this.getInput())}
                    </Form.Item>
                ) : (
                        children
                    )}
            </td>
        );
    };

    render() {
        return (
            <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
        );
    }
}

class revenueDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tableData: [],
            compliaceData: [],
            selectData: [],
            year: '',
            address: '',
            account: '',
            email: '',
            tax: '',
            membershipSupplies: '',
            pcMembership: '',
            printMembership: '',
            pcStatus: '',
            hps: '',
            ops: '',
            supplies: '',
            region: '',
            state: '',
            taxId: '',
            website: '',
            zip: '',
            hpInternalName: '',
            contractNumber: '',
            addressLine: '',
            externalContactName: '',
            contractActive: '',
            mayorista: '',
            lid: '',
            commercialOrConsumer: '',
            firstYear: [],
            secondYear: [],
            thirdYear: [],
            expirationDate: null,
            externalPhoneNumber: '',
            contactNumber: '',
            dataRecevied: false,
            rValue: '',
            editingKey: '',
        }
    }

    componentDidMount() {
        // document.title = sessionStorage.getItem('accountName') + ' ' +'Revenue';
        return new Promise((resolve, reject) => {
            resolve(
                axios.get(process.env.REACT_APP_DOMAIN + '/qpp/qpp_revenue/' + sessionStorage.getItem('accountName'))//accountName
                    .then(response => {
                        if (response.status === 200) {
                            Fyear = response.data.result.Year2;
                            secondYear = response.data.result.Year1;
                            this.setState({
                                tableData: response.data.result.Year2,
                                firstYear: response.data.result.Year2,
                                secondYear: response.data.result.Year1,
                                // thirdYear: response.data.result["2018"],
                                tax: sessionStorage.getItem('taxID')
                            }, () => this.history())
                        }
                    })
                    .catch(error => {
                        this.setState({
                            dataRecevied: true,
                            tax: sessionStorage.getItem('taxID')
                        })
                        // window.location.hash = "/";
                    })
            )
        })
    }

    history = () => {
        return new Promise((resolve, reject) => {
            resolve(
                axios.get(process.env.REACT_APP_DOMAIN + '/qpp/assessment_history/' + sessionStorage.getItem('id'))
                    .then(response => {
                        if (response.status === 200) {
                            this.setState({
                                compliaceData: response.data.result,
                            }, () => this.accountSummary())
                        }
                    })
                    .catch(function (error) {
                        message.error('Server is Down. Please try Later!');
                    })
            )
        })
    }

    accountSummary = () => {
        return new Promise((resolve, reject) => {
            resolve(
                axios.get(process.env.REACT_APP_DOMAIN + '/qpp/qpp_summary/' + sessionStorage.getItem('id'))
                    .then(response => {
                        if (response.status === 200) {
                            this.setState({
                                account: response.data.result.account,
                                email: response.data.result.email,
                                membershipSupplies: response.data.result.memberShipSupply,
                                region: response.data.result.cityOrRegion,
                                state: response.data.result.state,
                                tax: response.data.result.rfcOrTaxId === undefined ? '' : response.data.result.rfcOrTaxId,
                                zip: response.data.result.zip,
                                website: response.data.result.webSiteUrl,
                                expirationDate: response.data.result.expirationDate,
                                hpInternalName: response.data.result.hpInternalName,
                                contractNumber: response.data.result.contractNumber,
                                addressLine: response.data.result.addressLine !== "#N/A" ? response.data.result.addressLine : '',
                                externalContactName: response.data.result.externalContactName,
                                contractActive: response.data.result.contractActive,
                                mayorista: response.data.result.mayorista,
                                lid: response.data.result.locationId,
                                commercialOrConsumer: response.data.result.commercialOrConsumer,
                                externalPhoneNumber: response.data.result.phoneExternalContact,
                                pcMembership: response.data.result.membershipPc,
                                printMembership: response.data.result.membershipPrint,
                                pcStatus: response.data.result.pcStatus,
                                suppliesStatus: response.data.result.suppliesStatus,
                                hpsStatus: response.data.result.hpsStatus,
                                opsStatus: response.data.result.opsStatus
                            }, () => this.getYears())
                        }
                    })
                    .catch(function (error) {
                        message.error('Server is Down. Please try Later!');
                    })
            )
        })
    }

    getUserName = () => {
        return new Promise((resolve, reject) => {
            axios.get(process.env.REACT_APP_DOMAIN + '/qpp/username')
                .then(response => {
                    this.setState({
                        userName: response.data.name,
                        dataRecevied: true
                    });
                })
                .catch(function (error) {
                    console.log(error);
                })
        })
    }

    getYears = () => {
        let years = [];
        return new Promise((resolve, reject) => {
            axios.get(process.env.REACT_APP_DOMAIN + '/qpp/current_and_last_years')
                .then(response => {
                    response.data.result.forEach(element => {
                        years.push('FY ' + element)
                    });
                    this.setState({
                        selectData: years,
                        year: years[0]
                    }, () => this.getUserName());
                })
                .catch(function (error) {
                    console.log(error);
                })
        })
    }

    audit = () => {
        this.props.history.push('/audit');
    }

    back = () => {
        this.props.history.push('/');
    }

    loadData = (value) => {
        let val = value.slice(3, 7);
        // add api
        // if (value === "FY 2018") {
        //     this.setState({
        //         tableData: [],
        //         year: value,
        //         tableData: this.state.thirdYear
        //     })
        // }
        axios.get(process.env.REACT_APP_DOMAIN + `/qpp/qpp_revenue/${sessionStorage.getItem('accountName')}/${val}`)
            .then(response => {
                if (response.status == 200) {
                    this.setState({
                        tableData: [],
                        year: value,
                        tableData: response.data.result,
                    })
                }
            })
            .catch(err => err);
        // if (value === "FY 2019") {
        //     this.setState({
        //         tableData: [],
        //         year: value,
        //         tableData: this.state.secondYear
        //     })
        // }
        // else if (value === "FY 2020") {
        //     this.setState({
        //         tableData: [],
        //         year: value,
        //         tableData: this.state.firstYear
        //     })
        // }
    }

    select = (value) => {
        this.setState({
            tableData: [],
            rValue: value,
        }, () => this.loadData(value))
    }

    taxID = (value) => {
        return new Promise((resolve, reject) => {
            axios.put(process.env.REACT_APP_DOMAIN + '/qpp/qpp_summary/' + sessionStorage.getItem('id'),
                {
                    "rfcOrTaxId": value
                })
                .then(response => {
                    if (response.status === 200) {
                        this.setState({
                            tax: value
                        })
                    }
                })
                .catch(error => {
                    message.error('Server is down! Please try again later.');
                })
        })
    }

    email = (value) => {
        return new Promise((resolve, reject) => {
            axios.put(process.env.REACT_APP_DOMAIN + '/qpp/qpp_summary/' + sessionStorage.getItem('id'),
                {
                    "email": value
                })
                .then(response => {
                    if (response.status === 200) {
                        this.setState({
                            email: value
                        })
                    }
                })
                .catch(function (error) {
                    message.error('Server is down! Please try again later.');
                })
        })
    }

    zip = (value) => {
        return new Promise((resolve, reject) => {
            axios.put(process.env.REACT_APP_DOMAIN + '/qpp/qpp_summary/' + sessionStorage.getItem('id'),
                {
                    "zip": value
                })
                .then(response => {
                    if (response.status === 200) {
                        this.setState({
                            zip: value
                        })
                    }
                })
                .catch(function (error) {
                    message.error('Server is down! Please try again later.');
                })
        })
    }

    website = (value) => {
        return new Promise((resolve, reject) => {
            axios.put(process.env.REACT_APP_DOMAIN + '/qpp/qpp_summary/' + sessionStorage.getItem('id'),
                {
                    "webSiteUrl": value
                })
                .then(response => {
                    if (response.status === 200) {
                        this.setState({
                            website: value
                        })
                    }
                })
                .catch(function (error) {
                    message.error('Server is down! Please try again later.');
                })
        })
    }

    // action = (date, dateString) => {
    //     return new Promise((resolve, reject) => {
    //         axios.put(process.env.REACT_APP_DOMAIN + '/qpp/qpp_summary/'+sessionStorage.getItem('id'),
    //             {
    //                 "account": sessionStorage.getItem('accountName'),
    //                 "commercialOrConsumer": this.state.commercialOrConsumer,
    //                 "addressLine": this.state.addressLine,
    //                 "contractActive": this.state.contractActive,
    //                 "contractNumber": this.state.contractNumber,
    //                 "emailAddress": this.state.email,
    //                 "expirationDate": dateString,
    //                 "externalContactName": this.state.externalContactName,
    //                 "externalPhoneNumber": this.state.externalPhoneNumber,
    //                 "hpInternalName": this.state.hpInternalName,
    //                 "lid": this.state.lid,
    //                 "mayorista": this.state.mayorista,
    //                 "memberShipSupply": this.state.membershipSupplies,
    //                 "memberShipPc": this.state.pcMembership,
    //                 "memberShipPrint": this.state.printMembership,
    //                 "region": this.state.region,
    //                 "state": this.state.state,
    //                 "rfcOrTaxId": this.state.tax,
    //                 "webSiteUrl": this.state.website,
    //                 "zipCode": this.state.zip
    //             })
    //             .then(response => {
    //                 if (response.status === 200) {
    //                     this.setState({
    //                         expirationDate: dateString
    //                     })
    //                 }
    //             })
    //             .catch(function (error) {
    //                 message.error('Server is down! Please try again later.');
    //             })
    //     })
    // }

    externalPhoneNumber = (value) => {
        return new Promise((resolve, reject) => {
            axios.put(process.env.REACT_APP_DOMAIN + '/qpp/qpp_summary/' + sessionStorage.getItem('id'),
                {
                    "phoneExternalContact": value
                })
                .then(response => {
                    if (response.status === 200) {
                        this.setState({
                            externalPhoneNumber: value
                        })
                    }
                })
                .catch(function (error) {
                    message.error('Server is down! Please try again later.');
                })
        })
    }

    commercialOrConsumer = (value) => {
        return new Promise((resolve, reject) => {
            axios.put(process.env.REACT_APP_DOMAIN + '/qpp/qpp_summary/' + sessionStorage.getItem('id'),
                {
                    "commercialOrConsumer": value
                })
                .then(response => {
                    if (response.status === 200) {
                        this.setState({
                            commercialOrConsumer: value
                        })
                    }
                })
                .catch(function (error) {
                    message.error('Server is down! Please try again later.');
                })
        })
    }

    lid = (value) => {
        return new Promise((resolve, reject) => {
            axios.put(process.env.REACT_APP_DOMAIN + '/qpp/qpp_summary/' + sessionStorage.getItem('id'),
                {
                    "locationId": value,
                })
                .then(response => {
                    if (response.status === 200) {
                        this.setState({
                            lid: value
                        })
                    }
                })
                .catch(function (error) {
                    message.error('Server is down! Please try again later.');
                })
        })
    }

    mayorista = (value) => {
        return new Promise((resolve, reject) => {
            axios.put(process.env.REACT_APP_DOMAIN + '/qpp/qpp_summary/' + sessionStorage.getItem('id'),
                {
                    "mayorista": value
                })
                .then(response => {
                    if (response.status === 200) {
                        this.setState({
                            mayorista: value
                        })
                    }
                })
                .catch(function (error) {
                    message.error('Server is down! Please try again later.');
                })
        })
    }

    contractActive = (value) => {
        return new Promise((resolve, reject) => {
            axios.put(process.env.REACT_APP_DOMAIN + '/qpp/qpp_summary/' + sessionStorage.getItem('id'),
                {
                    "contractActive": value
                })
                .then(response => {
                    if (response.status === 200) {
                        this.setState({
                            contractActive: value
                        })
                    }
                })
                .catch(function (error) {
                    message.error('Server is down! Please try again later.');
                })
        })
    }

    externalContactName = (value) => {
        return new Promise((resolve, reject) => {
            axios.put(process.env.REACT_APP_DOMAIN + '/qpp/qpp_summary/' + sessionStorage.getItem('id'),
                {
                    "externalContactName": value
                })
                .then(response => {
                    if (response.status === 200) {
                        this.setState({
                            externalContactName: value
                        })
                    }
                })
                .catch(function (error) {
                    message.error('Server is down! Please try again later.');
                })
        })
    }

    addressLine = (value) => {
        return new Promise((resolve, reject) => {
            axios.put(process.env.REACT_APP_DOMAIN + '/qpp/qpp_summary/' + sessionStorage.getItem('id'),
                {
                    "addressLine": value
                })
                .then(response => {
                    if (response.status === 200) {
                        this.setState({
                            addressLine: value
                        })
                    }
                })
                .catch(function (error) {
                    message.error('Server is down! Please try again later.');
                })
        })
    }

    contractNumber = (value) => {
        return new Promise((resolve, reject) => {
            axios.put(process.env.REACT_APP_DOMAIN + '/qpp/qpp_summary/' + sessionStorage.getItem('id'),
                {
                    "contractNumber": value
                })
                .then(response => {
                    if (response.status === 200) {
                        this.setState({
                            contractNumber: value
                        })
                    }
                })
                .catch(function (error) {
                    message.error('Server is down! Please try again later.');
                })
        })
    }

    internalContact = (value) => {
        return new Promise((resolve, reject) => {
            axios.put(process.env.REACT_APP_DOMAIN + '/qpp/qpp_summary/' + sessionStorage.getItem('id'),
                {
                    "hpInternalName": value
                })
                .then(response => {
                    if (response.status === 200) {
                        this.setState({
                            hpInternalName: value
                        })
                    }
                })
                .catch(function (error) {
                    message.error('Server is down! Please try again later.');
                })
        })
    }

    supplies = (value) => {
        return new Promise((resolve, reject) => {
            axios.put(process.env.REACT_APP_DOMAIN + '/qpp/qpp_summary/' + sessionStorage.getItem('id'),
                {
                    "suppliesStatus": value
                })
                .then(response => {
                    if (response.status === 200) {
                        this.setState({
                            suppliesStatus: value
                        })
                    }
                })
                .catch(function (error) {
                    message.error('Server is down! Please try again later.');
                })
        })
    }

    opsStatus = (value) => {
        return new Promise((resolve, reject) => {
            axios.put(process.env.REACT_APP_DOMAIN + '/qpp/qpp_summary/' + sessionStorage.getItem('id'),
                {
                    "opsStatus": value
                })
                .then(response => {
                    if (response.status === 200) {
                        this.setState({
                            opsStatus: value
                        })
                    }
                })
                .catch(function (error) {
                    message.error('Server is down! Please try again later.');
                })
        })
    }

    hpsStatus = (value) => {
        return new Promise((resolve, reject) => {
            axios.put(process.env.REACT_APP_DOMAIN + '/qpp/qpp_summary/' + sessionStorage.getItem('id'),
                {
                    "hpsStatus": value
                })
                .then(response => {
                    if (response.status === 200) {
                        this.setState({
                            hpsStatus: value
                        })
                    }
                })
                .catch(function (error) {
                    message.error('Server is down! Please try again later.');
                })
        })
    }

    program = (value) => {
        return new Promise((resolve, reject) => {
            axios.put(process.env.REACT_APP_DOMAIN + '/qpp/qpp_summary/' + sessionStorage.getItem('id'),
                {
                    "pcStatus": value
                })
                .then(response => {
                    if (response.status === 200) {
                        this.setState({
                            pcStatus: value
                        })
                    }
                })
                .catch(function (error) {
                    message.error('Server is down! Please try again later.');
                })
        })
    }

    printMembership = (value) => {
        return new Promise((resolve, reject) => {
            axios.put(process.env.REACT_APP_DOMAIN + '/qpp/qpp_summary/' + sessionStorage.getItem('id'),
                {
                    "membershipPrint": value
                })
                .then(response => {
                    if (response.status === 200) {
                        this.setState({
                            printMembership: value
                        })
                    }
                })
                .catch(function (error) {
                    message.error('Server is down! Please try again later.');
                })
        })
    }

    pcMembership = (value) => {
        return new Promise((resolve, reject) => {
            axios.put(process.env.REACT_APP_DOMAIN + '/qpp/qpp_summary/' + sessionStorage.getItem('id'),
                {
                    "membershipPc": value
                })
                .then(response => {
                    if (response.status === 200) {
                        this.setState({
                            pcMembership: value
                        })
                    }
                })
                .catch(function (error) {
                    message.error('Server is down! Please try again later.');
                })
        })
    }

    membershipSupplies = (value) => {
        return new Promise((resolve, reject) => {
            axios.put(process.env.REACT_APP_DOMAIN + '/qpp/qpp_summary/' + sessionStorage.getItem('id'),
                {
                    "memberShipSupply": value,
                })
                .then(response => {
                    if (response.status === 200) {
                        this.setState({
                            membershipSupplies: value
                        })
                    }
                })
                .catch(function (error) {
                    message.error('Server is down! Please try again later.');
                })
        })
    }

    city = (value, id) => {
        return new Promise((resolve, reject) => {
            axios.put(process.env.REACT_APP_DOMAIN + '/qpp/qpp_summary/' + sessionStorage.getItem('id'),
                {
                    "cityOrRegion": value,
                })
                .then(response => {
                    if (response.status === 200) {
                        this.setState({
                            region: value
                        })
                    }
                })
                .catch(function (error) {
                    message.error('Server is down! Please try again later.');
                })
        })
    }

    address = (value) => {
        return new Promise((resolve, reject) => {
            axios.put(process.env.REACT_APP_DOMAIN + '/qpp/qpp_summary/' + sessionStorage.getItem('id'),
                {
                    "state": value,
                })
                .then(response => {
                    if (response.status === 200) {
                        this.setState({
                            state: value
                        })
                    }
                })
                .catch(function (error) {
                    message.error('Server is down! Please try again later.');
                })
        })
    }

    Change = (dateString, dateFormat) => {
        this.setState({ dateEdit: dateFormat })
    }

    isEditing = record => record.key === this.state.editingKey;

    cancel = () => {
        revenue_flag = '';
        this.setState({ editingKey: "", flag: true });
    };

    save(form, key) {
        form.validateFields((error, row) => {
            if (error) {
                return;
            }
            const newData = [...this.state.tableData];
            const index = newData.findIndex(item => key === item.key);
            if (index > -1) {
                newData[index].role = this.state.dateEdit;
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row
                });
                // console.log(item.key, row, row["threshold"])
                let hpsrevenue = 0, opsrevenue = 0, pcsRevenue = 0, suppliesRevenue = 0;
                if (item.key == 11) {
                    hpsrevenue = row["threshold"];
                }
                if (item.key == 12) {
                    suppliesRevenue = row["threshold"];
                }
                if (item.key == 13) {
                    opsrevenue = row["threshold"];
                }
                if (item.key == 14) {
                    pcsRevenue = row["threshold"];
                }
                return new Promise((resolve, reject) => {
                    axios.put(process.env.REACT_APP_DOMAIN + '/qpp/target_revenue',
                        {
                            "accountName": sessionStorage.getItem('accountName'),
                            "hpsrevenue": hpsrevenue,
                            "opsrevenue": opsrevenue,
                            "pcsRevenue": pcsRevenue,
                            "suppliesRevenue": suppliesRevenue,
                        })
                        .then(response => {
                            if (response.status === 200) {
                                revenue_flag = '';
                                this.setState({
                                    editingKey: "",
                                    flag: true,
                                    show: false
                                }, () => this.componentDidMount())
                            }
                        })
                        .catch(function (error) {
                            message.error('Server is Down. Please try Later!');
                        })
                })
            } else {
                newData.push(row);
                this.setState({ tableData: newData, editingKey: "" });
            }
        });
    }

    delete(key) {
        const newData = [...this.state.tableData];
        const index = newData.findIndex(item => key === item.key);
        if (index > -1) {
            const item = newData[index];
            newData.splice(index, 1);
            this.setState({
                tableData: newData,
                editingKey: "",
                dataRecevied: false
            });

        } else {
            this.setState({ tableData: newData, editingKey: "" });
        }

    }

    edit(key) {
        this.setState({ editingKey: key, flag: false, editFlag: true });
    }

    render() {
        this.columns = [
            {
                title: 'Category',
                dataIndex: 'category',
                editable: false,
                align: 'left',
                key: 'category',
            },
            {
                title: 'Product Line',
                dataIndex: 'subcategory',
                editable: false,
                width: "10%",
                align: 'center',
                key: 'subcategory',
                render: (text) => {
                    return (
                        <strong>{text}</strong>
                    )
                }
            },
            {
                title: 'Thresholds per Quarter',
                dataIndex: 'threshold',
                editable: true,
                key: 'threshold',
                align: 'center',
                render: (text, title) => {
                    if (title.category == '2.Supplies' || title.category == '3.OPS') {
                        return (
                            <CurrencyFormat value={text} displayType={'text'} thousandSeparator={true} prefix={'$'} />
                        )
                    }
                    else {
                        return (
                            <strong>{text}</strong>
                        )
                    }
                }
            },
            {
                title: this.state.year + ' ' + 'Q1',
                dataIndex: 'revenueQ1',
                editable: false,
                align: 'center',
                key: 'revenueQ1',
                render: (text, title) => {
                    if (title.category == '2.Supplies' || title.category == '3.OPS') {
                        return (
                            <CurrencyFormat value={text} displayType={'text'} thousandSeparator={true} prefix={'$'} />
                        )
                    }
                    else {
                        return (
                            <strong>{text}</strong>
                        )
                    }
                }
            },
            {
                title: 'Threshold Difference Q1',
                dataIndex: 'thresholdDifferenceQ1',
                editable: false,
                align: 'center',
                key: 'thresholdDifferenceQ1',
                render: (text, title) => {
                    if (title.category == '2.Supplies' || title.category == '3.OPS') {
                        return (
                            <CurrencyFormat value={text} displayType={'text'} thousandSeparator={true} prefix={'$'} />
                        )
                    }
                    else {
                        return (
                            <strong>{text}</strong>
                        )
                    }
                }
            },
            {
                title: this.state.year + ' ' + 'Q2',
                dataIndex: 'revenueQ2',
                align: 'center',
                editable: false,
                key: 'revenueQ2',
                render: (text, title) => {
                    if (title.category == '2.Supplies' || title.category == '3.OPS') {
                        return (
                            <CurrencyFormat value={text} displayType={'text'} thousandSeparator={true} prefix={'$'} />
                        )
                    }
                    else {
                        return (
                            <strong>{text}</strong>
                        )
                    }
                }
            },
            {
                title: 'Threshold Difference Q2',
                dataIndex: 'thresholdDifferenceQ2',
                editable: false,
                align: 'center',
                key: 'thresholdDifferenceQ2',
                render: (text, title) => {
                    if (title.category == '2.Supplies' || title.category == '3.OPS') {
                        return (
                            <CurrencyFormat value={text} displayType={'text'} thousandSeparator={true} prefix={'$'} />
                        )
                    }
                    else {
                        return (
                            <strong>{text}</strong>
                        )
                    }
                }
            },
            {
                title: this.state.year + ' ' + 'Q3',
                dataIndex: 'revenueQ3',
                editable: false,
                align: 'center',
                key: 'revenueQ3',
                render: (text, title) => {
                    if (title.category == '2.Supplies' || title.category == '3.OPS') {
                        return (
                            <CurrencyFormat value={text} displayType={'text'} thousandSeparator={true} prefix={'$'} />
                        )
                    }
                    else {
                        return (
                            <strong>{text}</strong>
                        )
                    }
                }
            },
            {
                title: 'Threshold Difference Q3',
                dataIndex: 'thresholdDifferenceQ3',
                editable: false,
                align: 'center',
                key: 'thresholdDifferenceQ3',
                render: (text, title) => {
                    if (title.category == '2.Supplies' || title.category == '3.OPS') {
                        return (
                            <CurrencyFormat value={text} displayType={'text'} thousandSeparator={true} prefix={'$'} />
                        )
                    }
                    else {
                        return (
                            <strong>{text}</strong>
                        )
                    }
                }
            },
            {
                title: this.state.year + ' ' + 'Q4',
                dataIndex: 'revenueQ4',
                editable: false,
                align: 'center',
                key: 'revenueQ4',
                render: (text, title) => {
                    if (title.category == '2.Supplies' || title.category == '3.OPS') {
                        return (
                            <CurrencyFormat value={text} displayType={'text'} thousandSeparator={true} prefix={'$'} />
                        )
                    }
                    else {
                        return (
                            <strong>{text}</strong>
                        )
                    }
                }
            },
            {
                title: 'Threshold Difference Q4',
                dataIndex: 'thresholdDifferenceQ4',
                editable: false,
                align: 'center',
                key: 'thresholdDifferenceQ4',
                render: (text, title) => {
                    if (title.category == '2.Supplies' || title.category == '3.OPS') {
                        return (
                            <CurrencyFormat value={text} displayType={'text'} thousandSeparator={true} prefix={'$'} />
                        )
                    }
                    else {
                        return (
                            <strong>{text}</strong>
                        )
                    }
                }
            },
            {
                title: "",
                dataIndex: "operation",
                width: "10%",
                align: 'center',
                editable: false,
                render: (text, record) => {
                    const { editingKey } = this.state;
                    const editable = this.isEditing(record);
                    return editable ? (
                        <span>
                            <EditableContext.Consumer>
                                {form => (
                                    <a
                                        href="javascript:;"
                                        onClick={() => this.save(form, record.key)}
                                        style={{ marginRight: 8 }}
                                    >
                                        <Icon type="save" theme="filled" />
                            Save
                                    </a>
                                )}
                            </EditableContext.Consumer>
                            <span style={{ marginLeft: "1em" }}></span>
                            <Popconfirm
                                title="Sure to cancel?"
                                icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
                                onConfirm={() => this.cancel(record.key)}
                            >
                                <a><Icon type="close-circle" theme="filled" />Cancel</a>
                            </Popconfirm>
                        </span>
                    ) : (
                            <div>
                                {record.key == 11 || record.key == 12 || record.key == 13 || record.key == 14 ?
                                    <a disabled={editingKey !== ""} onClick={() => this.edit(record.key)}><Icon type="edit" theme="filled" />Edit</a> :
                                    null}
                            </div>
                        );
                }
            },
        ];
        const compliaceColumns = [
            {
                title: 'Note Type',
                dataIndex: 'noteType',
                key: 'noteType',
                width: "20%"
            },
            {
                title: 'Submitted By',
                dataIndex: 'submittedBy',
                key: 'submittedBy',
                width: "20%"
            },
            {
                title: 'Date Submitted',
                dataIndex: 'submittedOn',
                key: 'submittedOn',
            },
            {
                title: 'Notes',
                dataIndex: 'notes',
                key: 'notes',
            }
        ];


        const components = {
            body: {
                cell: EditableCell
            }
        };


        const columns = this.columns.map(col => {
            if (!col.editable) {
                return col;
            }
            return {
                ...col,
                onCell: record => ({
                    record,
                    inputType: col.dataIndex === "role" ? "date" : "text",
                    dataIndex: col.dataIndex,
                    title: col.title,
                    editing: this.isEditing(record)
                })
            };
        });

        return (this.state.dataRecevied === true ? (
            <div>
                <Col span={24}>
                    <Col span={1}></Col>
                    <Col span={10} style={{ marginTop: "1%", marginBottom: "1%" }}><img src={Hp} style={{ width: "4em" }} alt="Hp logo" /><span style={{ color: "#0095d9", fontWeight: 600, fontSize: "16px", marginLeft: "2%" }}>Qualified Partner Program</span></Col>
                    <Col span={1}></Col>
                    <Col span={9}></Col>
                    <Col span={3} style={{ marginTop: "2.2%", fontSize: "16px", color: "#0095d9", fontWeight: 600, marginLeft: '-0.5em' }}><label style={{ cursor: "pointer" }}>Welcome: </label><strong>{this.state.userName}</strong></Col>
                </Col>
                <Col span={24}>
                    <Col span={2}></Col>
                    <Col span={5} style={{ marginTop: "-2.5em", marginLeft: "1em" }}><span style={{ color: "#0095d9", fontSize: "12px" }}></span></Col>
                </Col>
                <Col span={24}>
                    <Col span={1}></Col>
                    <Col span={3}></Col>
                    <Col span={17}></Col>
                    <Col span={2}>
                        <Button type="primary" onClick={this.back} icon="rollback">Back</Button>
                    </Col>
                </Col>
                <Col span={24} style={{ marginTop: "0.5em" }}>
                    <Col span={1}></Col>
                    <Col span={22}>
                        <Collapse accordion>
                            <Panel header="Account Summary" key="1">
                                <Col span={24}>
                                    <Col span={2}></Col>
                                    <Col span={4}><label className="title">Homologated Name</label></Col>
                                    <Col span={6} style={{ marginLeft: '-0.5em' }}><label className="title">{sessionStorage.getItem('accountName')}</label></Col>
                                    <Col span={2}></Col>
                                    <Col span={2} style={{ marginTop: "0.3em", marginLeft: '0.4em' }}><label className="title">Website URL</label></Col>
                                    <Col span={6} style={{ marginLeft: "3.8em" }}>
                                        <label className="title" style={{ cursor: "pointer" }}>
                                            <Text editable={{ onChange: this.website }}>{this.state.website}</Text>
                                        </label>
                                    </Col>
                                </Col>
                                <Col span={24} style={{ marginTop: "0.5em" }}>
                                    <Col span={2}></Col>
                                    <Col span={4} style={{ marginTop: "0.3em" }}><label className="title">Tax ID/RFC</label></Col>
                                    <Col span={6} style={{ marginTop: "0.3em", marginLeft: '-0.5em' }}>
                                        {/* <label className="title">{sessionStorage.getItem('taxID')}</label> */}
                                        <label className="title" style={{ cursor: "pointer" }}>
                                            <Text editable={{ onChange: this.taxID }}>{this.state.tax}</Text>
                                        </label>
                                    </Col>
                                    <Col span={2}></Col>
                                    <Col span={3} style={{ marginTop: "0.3em", marginLeft: '0.5em' }}><label className="title">Email Address</label></Col>
                                    <Col span={6} style={{ marginLeft: "-0.5em" }}>
                                        <label className="title" style={{ cursor: "pointer" }}>
                                            <Text editable={{ onChange: this.email }}>{this.state.email}</Text>
                                        </label>
                                    </Col>
                                </Col>
                                <Col span={24} style={{ marginTop: "0.5em" }}>
                                    <Col span={2}></Col>
                                    <Col span={4} style={{ marginTop: "0.3em" }}><label className="title">State</label></Col>
                                    <Col span={6} style={{ marginLeft: "-0.5em" }}>
                                        <label className="title" style={{ cursor: "pointer" }}>
                                            <Text editable={{ onChange: this.address }}>{this.state.state}</Text>
                                        </label>
                                    </Col>
                                    <Col span={2}></Col>
                                    <Col span={3} style={{ marginLeft: "0.5em", marginTop: "0.3em" }}><label className="title">Region</label></Col>
                                    <Col span={6} style={{ marginLeft: "-0.5em" }}>
                                        <label className="title" style={{ cursor: "pointer" }}>
                                            <Text editable={{ onChange: this.city }} id="naren">{this.state.region}</Text>
                                        </label>
                                    </Col>
                                </Col>
                                <Col span={24} style={{ marginTop: "0.5em" }}>
                                    <Col span={2}></Col>
                                    <Col span={3} style={{ marginTop: "0.3em" }}><label className="title">External Contact Number</label></Col>
                                    <Col span={6} style={{ marginLeft: "3.2em" }}>
                                        <label className="title" style={{ cursor: "pointer" }}>
                                            <Text editable={{ onChange: this.externalPhoneNumber }}>{this.state.externalPhoneNumber}</Text>
                                        </label>
                                    </Col>
                                    <Col span={2}></Col>
                                    <Col span={3} style={{ marginLeft: "0.8em", marginTop: "0.3em" }}><label className="title">Zip Code</label></Col>
                                    <Col span={6} style={{ marginLeft: "-0.5em" }}>
                                        <label className="title" style={{ cursor: "pointer" }}>
                                            <Text editable={{ onChange: this.zip }}>{this.state.zip}</Text>
                                        </label>
                                    </Col>
                                </Col>
                                <Col span={24} style={{ marginTop: "0.5em" }}>
                                    <Col span={2}></Col>
                                    <Col span={4} style={{ marginTop: "0.3em" }}><label className="title">HP Internal Contact Name</label></Col>
                                    <Col span={6} style={{ marginLeft: "-0.5em" }}>
                                        <label className="title" style={{ cursor: "pointer" }}>
                                            <Text editable={{ onChange: this.internalContact }}>{this.state.hpInternalName}</Text>
                                        </label>
                                    </Col>
                                    <Col span={2}></Col>
                                    <Col span={3} style={{ marginLeft: "0.5em", marginTop: "0.3em" }}><label className="title">Contract Number</label></Col>
                                    <Col span={6} style={{ marginLeft: "-0.5em" }}>
                                        <label className="title" style={{ cursor: "pointer" }}>
                                            <Text editable={{ onChange: this.contractNumber }}>{this.state.contractNumber}</Text>
                                        </label>
                                    </Col>
                                </Col>
                                <Col span={24} style={{ marginTop: "0.5em" }}>
                                    <Col span={2}></Col>
                                    <Col span={4} style={{ marginTop: "0.3em" }}><label className="title">Address Line</label></Col>
                                    <Col span={6} style={{ marginLeft: "-0.5em" }}>
                                        <label className="title" style={{ cursor: "pointer" }}>
                                            <Text editable={{ onChange: this.addressLine }}>{this.state.addressLine}</Text>
                                        </label>
                                    </Col>
                                    <Col span={2}></Col>
                                    <Col span={3} style={{ marginLeft: "0.5em", marginTop: "0.3em" }}><label className="title">External Contact Name</label></Col>
                                    <Col span={6} style={{ marginLeft: "-0.5em" }}>
                                        <label className="title" style={{ cursor: "pointer" }}>
                                            <Text editable={{ onChange: this.externalContactName }}>{this.state.externalContactName}</Text>
                                        </label>
                                    </Col>
                                </Col>
                                <Col span={24} style={{ marginTop: "0.5em" }}>
                                    <Col span={2}></Col>
                                    <Col span={4} style={{ marginTop: "0.3em" }}><label className="title">Contract Active</label></Col>
                                    <Col span={6} style={{ marginLeft: "-0.5em" }}>
                                        <label className="title" style={{ cursor: "pointer" }}>
                                            <Text editable={{ onChange: this.contractActive }}>{this.state.contractActive}</Text>
                                        </label>
                                    </Col>
                                    <Col span={2}></Col>
                                    <Col span={3} style={{ marginLeft: "0.5em", marginTop: "0.3em" }}><label className="title">Mayorista</label></Col>
                                    <Col span={6} style={{ marginLeft: "-0.5em" }}>
                                        <label className="title" style={{ cursor: "pointer" }}>
                                            <Text editable={{ onChange: this.mayorista }}>{this.state.mayorista}</Text>
                                        </label>
                                    </Col>
                                </Col>
                                <Col span={24} style={{ marginTop: "0.5em" }}>
                                    <Col span={2}></Col>
                                    <Col span={4} style={{ marginTop: "0.3em" }}><label className="title">Location ID</label></Col>
                                    <Col span={6} style={{ marginLeft: "-0.5em" }}>
                                        <label className="title" style={{ cursor: "pointer" }}>
                                            <Text editable={{ onChange: this.lid }}>{this.state.lid}</Text>
                                        </label>
                                    </Col>
                                    <Col span={2}></Col>
                                    <Col span={3} style={{ marginLeft: "0.5em", marginTop: "0.3em" }}><label className="title">Commercial Or Consumer</label></Col>
                                    <Col span={6} style={{ marginLeft: "-0.5em", marginTop: '0.3em' }}>
                                        <label className="title" style={{ cursor: "pointer" }}>
                                            {/* <label>{this.state.commercialOrConsumer}</label> */}
                                            <Text editable={{ onChange: this.commercialOrConsumer }}>{this.state.commercialOrConsumer}</Text>
                                        </label>
                                    </Col>
                                </Col>
                                <Col span={24} style={{ marginTop: "0.5em" }}>
                                    <Col span={2}></Col>
                                    <Col span={4} style={{ marginTop: "0.3em" }}><label className="title">Membership Supply</label></Col>
                                    <Col span={6} style={{ marginLeft: "-0.5em" }}>
                                        <label className="title" style={{ cursor: "pointer" }}>
                                            <Text editable={{ onChange: this.membershipSupplies }}>{this.state.membershipSupplies}</Text>
                                        </label>
                                    </Col>
                                    <Col span={2}></Col>
                                    <Col span={3} style={{ marginTop: "0.3em", marginLeft: '0.4em' }}><label className="title">PC Membership</label></Col>
                                    <Col span={6} style={{ marginLeft: "-0.5em", marginTop: '0.3em' }}>
                                        <label className="title" style={{ cursor: "pointer" }}>
                                            <Text editable={{ onChange: this.pcMembership }}>{this.state.pcMembership}</Text>
                                        </label>
                                    </Col>
                                </Col>
                                <Col span={24} style={{ marginTop: "0.5em" }}>
                                    <Col span={2}></Col>
                                    <Col span={4} style={{ marginTop: "0.3em" }}><label className="title">Print Membership</label></Col>
                                    <Col span={6} style={{ marginLeft: "-0.5em" }}>
                                        <label className="title" style={{ cursor: "pointer" }}>
                                            <Text editable={{ onChange: this.printMembership }}>{this.state.printMembership}</Text>
                                        </label>
                                    </Col>
                                    <Col span={2}></Col>
                                    <Col span={3} style={{ marginTop: "0.3em", marginLeft: '0.4em' }}><label className="title">PC Status</label></Col>
                                    <Col span={6} style={{ marginLeft: "-0.5em", marginTop: '0.3em' }}>
                                        <label className="title" style={{ cursor: "pointer" }}>
                                            <Text editable={{ onChange: this.program }}>{this.state.pcStatus}</Text>
                                        </label>
                                    </Col>
                                </Col>
                                <Col span={24} style={{ marginTop: "0.5em" }}>
                                    <Col span={2}></Col>
                                    <Col span={4} style={{ marginTop: "0.3em" }}><label className="title">HPS Status</label></Col>
                                    <Col span={6} style={{ marginLeft: "-0.5em" }}>
                                        <label className="title" style={{ cursor: "pointer" }}>
                                            <Text editable={{ onChange: this.hpsStatus }}>{this.state.hpsStatus}</Text>
                                        </label>
                                    </Col>
                                    <Col span={2}></Col>
                                    <Col span={3} style={{ marginTop: "0.3em", marginLeft: '0.4em' }}><label className="title">OPS Status</label></Col>
                                    <Col span={6} style={{ marginLeft: "-0.5em", marginTop: '0.3em' }}>
                                        <label className="title" style={{ cursor: "pointer" }}>
                                            <Text editable={{ onChange: this.opsStatus }}>{this.state.opsStatus}</Text>
                                        </label>
                                    </Col>
                                </Col>
                                <Col span={24} style={{ marginTop: "0.5em" }}>
                                    <Col span={2}></Col>
                                    <Col span={4} style={{ marginTop: "0.3em" }}><label className="title">Supplies Status</label></Col>
                                    <Col span={6} style={{ marginLeft: "-0.5em" }}>
                                        <label className="title" style={{ cursor: "pointer" }}>
                                            <Text editable={{ onChange: this.supplies }}>{this.state.suppliesStatus}</Text>
                                        </label>
                                    </Col>
                                </Col>
                            </Panel>
                        </Collapse>
                    </Col>
                </Col>
                <Col span={24} style={{ marginTop: "-0.5em" }}>
                    <Col span={1}></Col>
                    <Col span={22}><Divider /></Col>
                </Col>
                <Col span={24} style={{ marginTop: "-0.8em" }}>
                    <Col span={1}></Col>
                    <Col span={14}>
                        <strong>{sessionStorage.getItem('accountName') + ' ' + 'Revenue for'}</strong><span style={{ color: "#0095d9", fontWeight: 600, marginLeft: "1em" }}><Dropdown select={this.select} data={this.state.selectData} placeholder={"-- " + 'Select FY' + " --"} value={this.state.rValue} width={150} /></span>
                    </Col>
                    <Col span={5}></Col>
                    <Col span={3} style={{ marginLeft: "0.5em" }}>
                        <Button type="primary" onClick={this.audit} icon="audit">Assesment Trail</Button>
                    </Col>
                </Col>
                <Col span={24} style={{ marginTop: "0.5em" }}>
                    <Col span={1}></Col>
                    <Col span={22} style={{ marginTop: "0.5em" }}>
                        <EditableContext.Provider value={this.props.form}>
                            <Table
                                components={components}
                                columns={columns}
                                dataSource={this.state.tableData}
                                pagination={false}
                                rowClassName={(record, index) => record.category === "Grand Total" ? 'total' : 'remain'}
                            />
                        </EditableContext.Provider>
                    </Col>
                </Col>
                <Col span={24} style={{ marginTop: "-0.5em" }}>
                    <Col span={1}></Col>
                    <Col span={22}><Divider /></Col>
                </Col>
                <Col span={24} style={{ marginTop: "-1em" }}>
                    <Col span={1}></Col>
                    <Col span={3}><strong>Assesment History</strong></Col>
                    <Col span={17}></Col>
                    <Col span={2}><Download data={this.state.compliaceData} fileName={"Assesment History.csv"} /></Col>
                </Col>
                <Col span={24} style={{ marginTop: "0.5em" }}>
                    <Col span={1}></Col>
                    <Col span={22}>
                        <Table
                            columns={compliaceColumns}
                            dataSource={this.state.compliaceData}
                            pagination={{
                                pageSize: 5
                            }}
                            rowClassName={(record, index) => record.category === "Grand Total" ? 'total' : 'remain'}
                        />
                    </Col>
                </Col>
                {/* <Col span={24} style={{ marginTop: "0.5em" }}>
                     <Col span={3} style={{ marginLeft: "4em", marginTop:"-3.5em" }}>
                        <Button type="primary" onClick={this.audit} icon="audit">Assesment Trail</Button>
                    </Col>
                    <Col span={20}></Col>
                </Col> */}
                <Col span={24} style={{ marginTop: "0.5em" }}>
                    <Col span={20}></Col>
                </Col>
            </div>
        ) : (<Loading status={this.state.dataRecevied} />)
        );
    }
}

const EditableFormTable = Form.create()(revenueDetails);

export default EditableFormTable;