
import React from 'react';
import 'antd/dist/antd.css';
import './audit.scss';
import { Steps, Button, message, Col, Input, Checkbox, Divider, DatePicker, Typography, Upload, Table, Popconfirm, Icon, Select, Form, Collapse, Modal } from 'antd';
import CurrencyFormat from 'react-currency-format';
import Dropdown from '../../Components/Select/select';
import Hp from '../../assets/images/Hp.png';
import Image from '../../assets/images/Hp.png';
import moment from 'moment';
import axios from 'axios';
import { UploadOutlined } from '@ant-design/icons';

const statusData = ["Functional", "Not Functional"];
const websiteType = ["Business", "Social", "Marketplace", "ecommerce"];
const searchData = ["Yes", "No"];
const thresholdData = ["Missed", "Not Missed"];
const accountStatus = ["Active", "Closed"];
const reviewData = ["Open", "Closed"];
const noteType = ["General", "Assesment Notes", "QP Letter Sent", "QS letter Sent"];
const memberShipSupplies = ["Partner First Business Partner", "Partner First Gold Partner", "Partner First Platinum Partner", "Partner First Silver Partner", "Not Assigned", "Not Eligible"];
const status = ["Calificado", "Certificado", "No Calificado", "TBD"];
//------
const PartnerStatus = ["Qualified", "Certified", "Distributor", "Sub-distributor"];
const PartnerType = ["Self employee", "Company"];


const states = [
    "AG | Aguascalientes",
    "BC | Baja California",
    "BS | Baja California Sur",
    "CH | Chihuahua",
    "CL | Colima",
    "CM | Campeche",
    "CO | Coahuila",
    "CS | Chiapas",
    "DF | Federal District",
    "DG | Durango",
    "GR | Guerrero",
    "GT | Guanajuato",
    "HG | Hidalgo",
    "JA | Jalisco",
    "ME | México State",
    "MI | Michoacán",
    "MO | Morelos",
    "NA | Nayarit",
    "NL | Nuevo León",
    "OA | Oaxaca",
    "PB | Puebla",
    "QE | Querétaro",
    "QR | Quintana Roo",
    "SI | Sinaloa",
    "SL | San Luis Potosí",
    "SO | Sonora",
    "TB | Tabasco",
    "TL | Tlaxcala",
    "TM | Tamaulipas",
    "VE | Veracruz",
    "YU | Yucatán",
    "ZA | Zacatecas"
];
const { Step } = Steps;
const { TextArea } = Input;

const steps = [
    {
        title: 'Assesment: Partner Information'
    },
    {
        title: 'Assesment: Website'
    },
    {
        title: 'Assesment: Brand'
    },
    {
        title: 'Assesment: Revenue'
    },
    {
        title: 'Review Status'
    },
];

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


class Audit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 0,
            website: '',
            websiteType: '',
            status: '',
            aboutUs: '',
            address: '',
            phone: '',
            skuSearchable: false,
            sku: '',
            search: '',
            picture: '',
            printStatus: '',
            suppliesStatus: '',
            reviewStatus: 'Open',
            begin: '',
            accountStatus: '',
            notes: '',
            noteType: '',
            date: '',
            thresholdData: '',
            city: '',
            memberShipSupplies: '',
            zip: '',
            enable: true,
            display: 'none',
            bpsOpsStatus: '',
            // --------
            partnerStatus: '',
            partnerType: '',
            partnerAgreement: '',
            contactInformation: '',
            productType: '',
            hpSku: '',
            correctDescription: '',
            officialPicture: '',
            advertisedPriceComply: '',
            loginRequire: '',
            evidenceField: '',
            evidenceField1: '',
            selectData: [],
            firstYear: [],
            secondYear: [],
            thirdYear: [],
            rValue: '',
            editingKey: '',
            reviewNotes: '',
            emailFor: '',
            emailNote1: '',
            emailNote2: '',
            emailNote3: '',
            emailNote4: '',
            emailNote5: '',
            hpsThreshold: '',
            suppliesThreshold: '',
            opsThreshold: '',
            pcsThreshold: '',
            year: 'FY 2021',
            dollerUnit: 'Units',
            letterDownloading: false,
            letterSending: false,
            secondModel: false,
            saveFileResponse: '',
        };
    }

    componentDidMount() {
        axios.get(process.env.REACT_APP_DOMAIN + `/qpp/audit/${sessionStorage.getItem('accountName')}`)
            .then(response => {
                if (response.status == 200) {
                    let val = response.data.result;
                    this.setState({
                        notes: val.notes,
                        printStatus: val.printStatus, //HPS Status 
                        date: val.expirationDate,
                        suppliesStatus: val.suppliesStatus,
                        noteType: val.noteType,
                        pcStatus: val.pcStatus,
                        opsStatus: val.opsStatus,
                        partnerStatus: val.partnerStatus,
                        partnerType: val.partnerType,
                        partnerAgreement: val.partnerAgreement,

                        reviewStatus: val.reviewStatus,
                        accountStatus: val.accountStatus,

                        websiteType: val.websiteType,
                        status: val.websiteStatus,//Website Status
                        website: val.partnerUrl,//Partner URL
                        address: val.state,//State
                        city: val.city,
                        phone: val.phone,
                        zip: val.zip,

                        skuSearchable: val.hpSkuSearchable, //HP SKUs not Searchable

                        sku: val.skus,
                        search: val.hpDisPlayInResult,//HP Displayed in Search Results
                        picture: val.picOfHpProduct,//Pictures of HP Product
                        begin: val.skuTitlelOfHp,//Begins Title or Description with "HP" or HP SKU-----

                        thresholdData: val.revenueThreshold,//Revenue Threshold
                        memberShipSupplies: val.memberShipSupplies, //MemberShip Supplies
                        //-------
                        contactInformation: val.contactInformation,
                        productType: val.productType,
                        hpSku: val.hpSku,
                        correctDescription: val.correctDescription,
                        officialPicture: val.officialPicture,
                        advertisedPriceComply: val.advertisePriceMapPolicy,
                        loginRequire: val.loginRequired,
                        reviewNotes: val.reviewNotes,
                        hpsThreshold: val.hpsThreshold,
                        suppliesThreshold: val.suppliesThreshold,
                        opsThreshold: val.opsThreshold,
                        pcsThreshold: val.pcsThreshold,
                    }, () => { this.getYears() })
                }
            })
            .catch(err => err);
    }


    //for table load based on year
    // loadData = (value) => {
    //     let val = value.slice(3, 7);
    //     axios.get(process.env.REACT_APP_DOMAIN + `/qpp/qpp_revenue/${sessionStorage.getItem('accountName')}/${val}`)
    //         .then(response => {
    //             if (response.status == 200) {
    //                 this.setState({
    //                     tableData: [],
    //                     year: value,
    //                     tableData: response.data.result,
    //                 })
    //             }
    //         })
    //         .catch(err => err);
    // }

    loadData = () => {
        console.log('4th')
        let year = this.state.year.slice(3, 7);
        let dollerUnit = this.state.dollerUnit;
        if (dollerUnit == 'Units') {
            dollerUnit = 'unit';
        }
        if (dollerUnit == 'USD') {
            dollerUnit = 'dollor';
        }
        axios.get(process.env.REACT_APP_DOMAIN + `/qpp/qpp_revenue/${sessionStorage.getItem('accountName')}/${year}/${dollerUnit}`)
            .then(response => {
                if (response.status == 200) {
                    console.log(response.data.result)
                    this.setState({
                        tableData: [],
                        tableData: '',
                        tableData: response.data.result,
                    })
                }
            })
            .catch(err => err);
    }

    getYears = () => {
        console.log('2nd qpp/current&lastyear')
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
                    }, () => { this.getUserName() });
                })
                .catch(function (error) {
                    console.log(error);
                })
        })
    }

    getUserName = () => {
        console.log('3rd qpp/username')
        return new Promise((resolve, reject) => {
            axios.get(process.env.REACT_APP_DOMAIN + '/qpp/username')
                .then(response => {
                    this.setState({
                        userName: response.data.name,
                        dataRecevied: true
                    }, () => { this.loadData() });
                })
                .catch(function (error) {
                    console.log(error);
                })
        })
    }

    back = () => {
        this.props.history.push('/revenue');
    }

    next() {
        const current = this.state.current + 1;
        this.setState({ current });
    }

    sentMail = () => {
        this.setState({
            modelVisible: true,
        })
    }
    done = () => {
        if (this.state.reviewStatus === 'Closed') {
            return new Promise((resolve, reject) => {
                axios.post(process.env.REACT_APP_DOMAIN + '/qpp/submit_trail',
                    {
                        "id": parseInt(sessionStorage.getItem('id')),
                        "aboutUs": "",
                        "account": sessionStorage.getItem('accountName'),
                        // "taxId": sessionStorage.getItem('taxID'),
                        //----1----
                        "accountStatus": this.state.accountStatus,
                        "expirationDate": this.state.date,
                        "noteType": this.state.noteType,
                        "hpsStatus": this.state.printStatus,
                        "reviewStatus": this.state.reviewStatus,
                        "suppliesStatus": this.state.suppliesStatus,
                        "pcStatus": this.state.pcStatus,
                        "opsStatus": this.state.opsStatus,
                        "partnerStatus": this.state.partnerStatus,
                        "partnerType": this.state.partnerType,
                        "partnerAgreement": this.state.partnerAgreement,
                        "notes": this.state.notes,
                        //----2---
                        "websiteStatus": this.state.status,
                        "hpSkusNotSearchable": this.state.skuSearchable,
                        "partnerUrl": this.state.website,
                        "phone": this.state.phone,
                        "physicalAddress": this.state.address,
                        "cityOrRegion": this.state.city,
                        "zip": this.state.zip,
                        "contactInformation": this.state.contactInformation,
                        "websiteType": this.state.websiteType,
                        //----3-------
                        "hpDisPlayInResult": this.state.search,
                        "hpProductPic": this.state.picture,
                        "skus": this.state.sku,
                        "hpSkus": this.state.hpSku,//not present
                        "correctDescription": this.state.correctDescription,
                        "officialPicture": this.state.officialPicture,
                        "advertisePriceMapPolicy": this.state.advertisedPriceComply,
                        "loginRequired": this.state.loginRequire,//not present
                        "productType": this.state.productType,
                        "titleOrDesc": this.state.begin,
                        //-----4----
                        "revenueThreshHold": this.state.thresholdData,
                        "memberShipSupplies": this.state.memberShipSupplies,
                        "hpsThreshold": this.state.hpsThreshold,
                        "suppliesThreshold": this.state.suppliesThreshold,
                        "opsThreshold": this.state.opsThreshold,
                        "pcsThreshold": this.state.pcsThreshold,
                        //---5----
                        "auditFinding": this.state.reviewNotes,
                        //----
                        "membershipPc": "",
                        "membershipPrint": "",
                        "rfcOrTaxId": "",
                        "userName": "",
                    })
                    .then(response => {
                        if (response.status === 200) {
                            setTimeout(
                                function () {
                                    this.props.history.push('/revenue');
                                }
                                    .bind(this),
                                2000
                            );
                            message.success('Processing complete!');

                        }
                    })
                    .catch(function (error) {
                        message.error('Server is Down. Please try Later!');
                    })
            })
        }
        else {
            message.error('Review Status is Open!');
        }
    }

    prev() {
        const current = this.state.current - 1;
        this.setState({ current });
    }

    select = (value, id) => {
        if (id === "status") {
            this.setState({
                status: value
            })
        }
        else if (id === "search") {
            this.setState({
                search: value
            })
        }
        else if (id === "picture") {
            this.setState({
                picture: value
            })
        }
        else if (id === "printStatus") {
            this.setState({
                printStatus: value
            })
        }
        else if (id === "suppliesStatus") {
            this.setState({
                suppliesStatus: value
            })
        }
        //----------------
        else if (id === "partnerStatus") {
            this.setState({
                partnerStatus: value
            })
        }
        else if (id === "partnerType") {
            this.setState({
                partnerType: value
            })
        }
        else if (id === "partnerAgreement") {
            this.setState({
                partnerAgreement: value
            })
        }
        else if (id === "contactInformation") {
            this.setState({
                contactInformation: value
            })
        }
        else if (id === "productType") {
            this.setState({
                productType: value
            })
        }
        else if (id === "hpSku") {
            this.setState({
                hpSku: value
            })
        }
        else if (id === "correctDescription") {
            this.setState({
                correctDescription: value
            })
        }
        else if (id === "officialPicture") {
            this.setState({
                officialPicture: value
            })
        }
        else if (id === "advertisedPriceComply") {
            this.setState({
                advertisedPriceComply: value
            })
        }
        else if (id === "loginRequire") {
            this.setState({
                loginRequire: value
            })
        }
        else if (id === 'rValue') {
            this.setState({
                tableData: [],
                rValue: value,
                year: value,
            }, () => this.loadData())
        }
        else if (id === 'dollerUnit') {
            this.setState({
                tableData: [],
                dollerUnit: value,
            }, () => this.loadData())
        }

        else if (id === "emailFor") {
            this.setState({
                emailFor: value,
            })
        }
        else if (id === "emailNote1") {
            this.setState({
                emailNote1: value,
            })
        }
        else if (id === "emailNote2") {
            this.setState({
                emailNote2: value,
            })
        }
        else if (id === "emailNote3") {
            this.setState({
                emailNote3: value,
            })
        }
        else if (id === "emailNote4") {
            this.setState({
                emailNote4: value,
            })
        }
        else if (id === "emailNote5") {
            this.setState({
                emailNote5: value,
            })
        }
        else if (id === "hpsThreshold") {
            this.setState({
                hpsThreshold: value
            })
        }
        else if (id === "suppliesThreshold") {
            this.setState({
                suppliesThreshold: value
            })
        }
        else if (id === "opsThreshold") {
            this.setState({
                opsThreshold: value
            })
        }
        else if (id === "pcsThreshold") {
            this.setState({
                pcsThreshold: value
            })
        }
        //---------------
        else if (id === "memberShipSupplies") {
            this.setState({
                memberShipSupplies: value
            })
        }
        else if (id === "reviewStatus") {
            if (value === "Closed") {
                this.setState({
                    reviewStatus: value,
                    enable: false
                })
            }
            else {
                this.setState({
                    reviewStatus: value,
                    enable: true
                })
            }

        }
        else if (id === "accountStatus") {
            this.setState({
                accountStatus: value
            })
        }
        else if (id === "thresholdData") {
            this.setState({
                thresholdData: value
            })
        }
        else if (id === "noteType") {
            this.setState({
                noteType: value,
                display: 'block'
            })
        }
        else if (id === "websiteType") {
            this.setState({
                websiteType: value
            })
        }
        else if (id === "address") {
            this.setState({
                address: value
            })
        }
        else if (id === "pcStatus") {
            this.setState({
                pcStatus: value
            })
        }
        else if (id === "opsStatus") {
            this.setState({
                opsStatus: value
            })
        }
    }

    // logout = () => {
    //     return new Promise((resolve, reject) => {
    //         axios.post(process.env.REACT_APP_DOMAIN+'/mxqpp/inspection/logout')
    //             .then(response => {
    //                 if (response.status === 200) {
    //                     this.props.history.push('/');
    //                 }
    //             })
    //             .catch(function (error) {
    //                 message.error('Server is down! Please try again later.');
    //             })
    //     })
    // }

    check = (event) => {
        this.setState({
            skuSearchable: event.target.checked
        })
    }

    change = (date, dateString) => {
        this.setState({
            date: dateString
        })
    }

    text = (event) => {
        if (event.target.id === "website") {
            this.setState({
                website: event.target.value
            })
        }
        else if (event.target.id === "zip") {
            this.setState({
                zip: event.target.value
            })
        }
        else if (event.target.id === "city") {
            this.setState({
                city: event.target.value
            })
        }
        else if (event.target.id === "phone") {
            this.setState({
                phone: event.target.value
            })
        }
        else if (event.target.id === "aboutUs") {
            this.setState({
                aboutUs: event.target.value
            })
        }
        else if (event.target.id === "address") {
            this.setState({
                address: event.target.value
            })
        }
        else if (event.target.id === "sku") {
            this.setState({
                sku: event.target.value
            })
        }
        else if (event.target.id === "notes") {
            this.setState({
                notes: event.target.value
            })
        }
        else if (event.target.id === "emailNote1") {
            this.setState({
                emailNote1: event.target.value
            })
        }
        else if (event.target.id === "emailNote2") {
            this.setState({
                emailNote2: event.target.value
            })
        }
        else if (event.target.id === "emailNote3") {
            this.setState({
                emailNote3: event.target.value
            })
        }
        else if (event.target.id === "emailNote4") {
            this.setState({
                emailNote4: event.target.value
            })
        }
        else if (event.target.id === "emailNote5") {
            this.setState({
                emailNote5: event.target.value
            })
        }
        else if (event.target.id === "reviewNotes") {
            this.setState({
                reviewNotes: event.target.value
            })
        }
        else if (event.target.id === "begin") {
            this.setState({
                begin: event.target.value
            })
        }

    }

    onFileUpload = () => {
        let image = this.state.evidenceField;

        const imageFile = new FormData();
        imageFile.append('evidence1', image);

        const config = {
            headers: { 'content-type': 'multipart/form-data' }
        }

        axios.put(process.env.REACT_APP_DOMAIN + `/qpp/upload/${sessionStorage.getItem('accountName')}`, imageFile, config)
            .then(response => {
                if (response.status === 200) {
                    message.success('upload successfully.', 2);
                }
            })
            .catch((error) => {
                if (error.response)
                    message.error(error.response.data.message, 5);
            });
    };


    onFileUpload1 = () => {
        let image = this.state.evidenceField1;

        const imageFile = new FormData();
        imageFile.append('evidence2', image);

        const config = {
            headers: { 'content-type': 'multipart/form-data' }
        }

        axios.put(process.env.REACT_APP_DOMAIN + `/qpp/upload_evidence/${sessionStorage.getItem('accountName')}`, imageFile, config)
            .then(response => {
                if (response.status === 200) {
                    message.success('upload successfully.', 2);
                }
            })
            .catch((error) => {
                if (error.response)
                    message.error(error.response.data.message, 5);
            });
    };

    handleInputChange = event => {
        this.setState({
            evidenceField: event.target.files[0],
        }, () => { this.onFileUpload() });
    }

    handleInputChange1 = event => {
        this.setState({
            evidenceField1: event.target.files[0],
        }, () => { this.onFileUpload1() });
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
            let hpsrevenue = 0, opsrevenue = 0, pcsRevenue = 0, suppliesRevenue = 0;
            if (key == 11) {
                hpsrevenue = row.threshold
            }
            if (key == 12) {
                suppliesRevenue = row.threshold
            }
            if (key == 13) {
                opsrevenue = row.threshold
            }
            if (key == 14) {
                pcsRevenue = row.threshold
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
                            }, () => this.loadData())
                        }
                    })
                    .catch(function (error) {
                        message.error('Server is Down. Please try Later!');
                    })
            })
        });
    }

    delete(key) {
        const newData = [this.state.tableData];
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

    handleOk = () => {
        this.setState({
            letterDownloading: true,
        })
        const binaryString = window.atob(this.state.saveFileResponse); // Comment this if not using base64
        const bytes = new Uint8Array(binaryString.length);
        const res = bytes.map((byte, i) => binaryString.charCodeAt(i));
        console.log('res', res)
        this.createAndDownloadBlobFile(res, 'file')
        this.setState({
            letterDownloading: false,
        })
    };

    handleCancel = () => {
        this.setState({
            modelVisible: false,
        })
    }

    createAndDownloadBlobFile = (body, filename, extension = 'doc') => {
        const blob = new Blob([body]);
        const fileName = `${filename}.${extension}`;
        if (navigator.msSaveBlob) {
            // IE 10+
            navigator.msSaveBlob(blob, fileName);
        } else {
            const link = document.createElement('a');
            // Browsers that support HTML5 download attribute
            if (link.download !== undefined) {
                const url = URL.createObjectURL(blob);
                link.setAttribute('href', url);
                link.setAttribute('download', fileName);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
    }

    sendEmail = () => {
        this.setState({
            letterSending: true,
        })
        axios.post(process.env.REACT_APP_DOMAIN + `/qpp/qpp/send_email/${this.state.emailFor}`)
            .then(response => {
                if (response.status == 200) {
                    this.setState({
                        modelVisible: false,
                        letterSending: false,
                    })
                    message.success('Letter Sent Successfully!')
                }
                else {
                    this.setState({
                        letterSending: false,
                    })
                    message.error(response.result)
                }
            })
            .catch(err => {
                message.error('Server is Down. Please try Later!');
                this.setState({
                    letterSending: false,
                })
            })
    }

    nextModal = () => {
        if (this.state.emailFor != "" && this.state.emailNote1 != "" && this.state.emailNote2 != "" && this.state.emailNote3 != "" && this.state.emailNote4 != "" && this.state.emailNote5 != "") {
            this.setState({
                nextButtonLoading: true,
            })
            axios.post(process.env.REACT_APP_DOMAIN + '/qpp/qpp/save_file', {
                "accountName": sessionStorage.getItem('accountName'),
                "cause1": this.state.emailNote1,
                "cause2": this.state.emailNote2,
                "cause3": this.state.emailNote3,
                "cause4": this.state.emailNote4,
                "cause5": this.state.emailNote5,
                "emailType": this.state.emailFor,
            })
                .then(response => {
                    if (response.status === 200) {
                        this.setState({
                            saveFileResponse: response.data.result,
                            modelVisible: false,
                            secondModel: true,
                            nextButtonLoading: false,
                        })
                    }
                    else {
                        message.error('something went wrong!')
                        this.setState({
                            nextButtonLoading: false,
                        })
                    }
                })
                .catch(err => {
                    message.error('Server is Down. Please try Later!');
                    this.setState({
                        nextButtonLoading: false,
                    })
                })
            // setTimeout(
            //     function () {
            //         this.setState({
            //             modelVisible: false,
            //             secondModel: true,
            //             nextButtonLoading: false,
            //         })
            //     }
            //         .bind(this),
            //     2000
            // );
        }
        else {
            message.error("Please fill all the fields")
        }
    }
    prevModal = () => {
        this.setState({
            modelVisible: true,
            secondModel: false,
        })
    }
    render() {
        const { current } = this.state;
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
                    if (title.category == '1.Supplies' || title.category == '2.OPS') {
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
                    if (title.category == '1.Supplies' || title.category == '2.OPS') {
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
                    if (title.category == '1.Supplies' || title.category == '2.OPS') {
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
                    if (title.category == '1.Supplies' || title.category == '2.OPS') {
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
                    if (title.category == '1.Supplies' || title.category == '2.OPS') {
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
                    if (title.category == '1.Supplies' || title.category == '2.OPS') {
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
                    if (title.category == '1.Supplies' || title.category == '2.OPS') {
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
                    if (title.category == '1.Supplies' || title.category == '2.OPS') {
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
                    if (title.category == '1.Supplies' || title.category == '2.OPS') {
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

        return (
            <div>
                <Col span={24}>
                    <Col span={1}></Col>
                    <Col span={10} style={{ marginTop: "1%", marginBottom: "1%" }}><img src={Hp} style={{ width: "4em" }} alt="Hp logo" /><span style={{ color: "#0095d9", fontWeight: 600, fontSize: "16px", marginLeft: "2%" }}>Qualified Partner Program</span></Col>
                    <Col span={1}></Col>
                    <Col span={8}></Col>
                    <Col span={4} style={{ marginTop: "2.2%", fontSize: "16px", color: "#0095d9", fontWeight: 600, marginLeft: '-0.5em' }}><label style={{ cursor: "pointer" }}>Welcome: </label><strong>{this.state.userName}</strong></Col>
                </Col>
                <Col span={24}>
                    <Col span={2}></Col>
                    <Col span={5} style={{ marginTop: "-2.5em", marginLeft: "1em" }}><span style={{ color: "#0095d9", fontSize: "12px" }}></span></Col>
                </Col>
                <Col span={24} style={{ marginTop: "1em" }}>
                    <Col span={1}></Col>
                    <Col span={8} className="header"><label>Audit Trail for: </label>{sessionStorage.getItem('accountName')}</Col>
                    <Col span={11}></Col>
                    <Col span={3} style={{ marginTop: "-1em" }}>
                        <Button type="primary" onClick={this.back} icon="rollback" style={{ marginLeft: "1.7em" }}>Back</Button>
                    </Col>
                </Col>
                <Col span={24} style={{ marginTop: "2em", overflow: 'auto' }}>
                    <Col span={1}></Col>
                    <Col span={22}>
                        <Steps current={current}>
                            {steps.map(item => (
                                <Step key={item.title} title={item.title} />
                            ))}
                        </Steps>
                        <div>
                            {/* {steps[current].content } */}
                            {current === 0 && (
                                <div className="steps-content">
                                    <Col span={24}>
                                        <Col span={7}><label className="title1" style={{ fontSize: '16px' }}>Qualification Status</label></Col>
                                        <Col span={17}></Col>
                                    </Col>
                                    <Col span={24} style={{ marginTop: "0.8em" }}>
                                        <Col span={1}></Col>
                                        <Col span={22}>
                                            <Col span={5}><label className="title" style={{ marginLeft: "-2.5em" }}>HPS Status</label></Col>
                                            <Col span={5}><Dropdown width={220} data={status} placeholder="-- Select Status --" select={this.select} id="printStatus" value={this.state.printStatus} /></Col>
                                            <Col span={1}></Col>
                                            <Col span={5} style={{ marginLeft: "-1em" }}><label className="title">Expiration Date</label></Col>
                                            <Col span={5}><DatePicker style={{ width: 220, marginLeft: '2em' }} format={'MM/DD/YYYY'} onChange={this.change} value={this.state.date !== "" ? moment(this.state.date) : null} /></Col>
                                        </Col>
                                    </Col>
                                    <Col span={24} style={{ marginTop: "0.5em" }}>
                                        <Col span={1}></Col>
                                        <Col span={22}>
                                            <Col span={5}><label className="title" style={{ marginLeft: "-0.6em" }}>Supplies Status</label></Col>
                                            <Col span={5}><Dropdown width={220} data={status} placeholder="-- Select Status --" select={this.select} id="suppliesStatus" value={this.state.suppliesStatus} /></Col>
                                            <Col span={1}></Col>
                                            <Col span={5}><label className="title" style={{ marginLeft: "-4.7em" }}>Note Type</label></Col>
                                            <Col span={5}>
                                                <Dropdown width={220} data={noteType} placeholder="-- Select Status --" select={this.select} id="noteType" value={this.state.noteType} />
                                            </Col>
                                        </Col>
                                    </Col>
                                    <Col span={24} style={{ marginTop: "0.5em" }}>
                                        <Col span={1}></Col>
                                        <Col span={5} style={{ marginLeft: '-2em' }}><label className="title">PC Status</label></Col>
                                        <Col span={5} style={{ marginLeft: '-0.5em' }}><Dropdown width={220} data={status} placeholder="-- Select Status --" select={this.select} id="pcStatus" value={this.state.pcStatus} /></Col>
                                        <Col span={1}></Col>
                                        <Col span={5} style={{ marginLeft: '-3.6em' }}><label className="title" style={{ marginLeft: "-0.8em" }}>OPS Status</label></Col>
                                        <Col span={5}><Dropdown width={220} data={status} placeholder="-- Select Status --" select={this.select} id="opsStatus" value={this.state.opsStatus} /></Col>
                                    </Col>
                                    <Col span={24} style={{ marginTop: "0.5em" }}>
                                        <Col span={1}></Col>
                                        <Col span={22}>
                                            <Col span={5}><label className="title" style={{ marginLeft: "-1em" }}>Partner Status</label></Col>
                                            <Col span={5}><Dropdown width={220} data={PartnerStatus} placeholder="-- Select Partner Status --" select={this.select} id="partnerStatus" value={this.state.partnerStatus} /></Col>
                                            <Col span={1}></Col>
                                            <Col span={5}><label className="title" style={{ marginLeft: "-3.5em" }}>Partner Type</label></Col>
                                            <Col span={5}>
                                                <Dropdown width={220} data={PartnerType} placeholder="-- Select Partner Type --" select={this.select} id="partnerType" value={this.state.partnerType} />
                                            </Col>
                                        </Col>
                                    </Col>
                                    <Col span={24} style={{ marginTop: "0.5em" }}>
                                        <Col span={1}></Col>
                                        <Col span={22}>
                                            <Col span={5}><label className="title" style={{ marginLeft: "0.7em" }}>Partner Agreement</label></Col>
                                            <Col span={5}><Dropdown width={220} data={["Yes", "No"]} placeholder="-- Select Partner Agreement --" select={this.select} id="partnerAgreement" value={this.state.partnerAgreement} /></Col>
                                        </Col>
                                    </Col>
                                    <Col span={24} style={{ marginTop: "0.5em", display: this.state.display }}>
                                        <Col span={1}></Col>
                                        <Col span={22}>
                                            <Col span={5}></Col>
                                            <Col span={5}></Col>
                                            <Col span={1}></Col>
                                            <Col span={5}><label className="title" style={{ marginLeft: "-6.5em" }}>Notes:</label></Col>
                                            <Col span={7} style={{ marginLeft: '1.2em' }}>
                                                <TextArea rows={4} onChange={this.text} id="notes" value={this.state.notes} />
                                            </Col>
                                        </Col>
                                    </Col>
                                    <Col span={24}>
                                        <Col span={1}></Col>
                                        <Col span={22}>
                                            <Divider />
                                        </Col>
                                    </Col>
                                    <Col span={24} style={{ marginTop: "0.5em", marginBottom: '1em' }}>
                                        <Col span={1}></Col>
                                        <Col span={22}>
                                            <Col span={5}><label className="title">Account Status</label></Col>
                                            <Col span={5}><Dropdown width={220} data={accountStatus} placeholder="-- Select Account Status --" select={this.select} id="accountStatus" value={this.state.accountStatus} /></Col>
                                        </Col>
                                    </Col>
                                </div>
                            )}
                            {current === 1 && (
                                <div className="steps-content">
                                    <Col span={24} style={{ marginTop: "0.5em" }}>
                                        <Col span={1}></Col>
                                        <Col span={22}>
                                            <Col span={5} style={{ marginLeft: "-4em" }}><label className="title">Website Type</label></Col>
                                            <Col span={5} style={{ marginLeft: "3.2em" }}><Dropdown width={255} mode="multiple" data={websiteType} select={this.select} id="websiteType" value={this.state.websiteType} /></Col>
                                            <Col span={1}></Col>
                                            <Col span={5}><label className="title" style={{ marginLeft: "-2.5em" }}>Website Status</label></Col>
                                            <Col span={5}><Dropdown width={250} data={statusData} placeholder=" -- Select status --" select={this.select} id="status" value={this.state.status} /></Col>
                                        </Col>
                                    </Col>
                                    <Col span={24} style={{ marginTop: "0.5em" }}>
                                        <Col span={1}></Col>
                                        <Col span={22}>
                                            <Col span={5} style={{ marginLeft: "-4.3em" }}><label className="title">Partner URL</label></Col>
                                            <Col span={5} style={{ marginLeft: "3.5em" }}><Input type="text" onChange={this.text} id="website" value={this.state.website} /></Col>
                                            <Col span={1}></Col>
                                            <Col span={5} style={{ marginLeft: '0.7em' }}><label className="title">HP SKUs not Searchable</label></Col>
                                            <Col span={5} style={{ marginLeft: "-9em" }}>
                                                {this.state.skuSearchable == true ?
                                                    <Checkbox checked={true} onChange={this.check} value={this.state.skuSearchable} /> : <Checkbox onChange={this.check} value={this.state.skuSearchable} />}</Col>
                                        </Col>
                                    </Col>

                                    <Col span={24}>
                                        <Col span={1}></Col>
                                        <Col span={22}>
                                            <Divider />
                                        </Col>
                                    </Col>

                                    <Col span={24} style={{ marginTop: "0.2em" }}>
                                        <Col span={1}></Col>
                                        <Col span={22}>
                                            <Col span={5} style={{ marginLeft: '-3em' }}><label className="title">Contact Information</label></Col>
                                            <Col span={5} style={{ marginLeft: '2.2em' }}><Dropdown width={250} data={["Yes", "No"]} placeholder=" -- Select Contact Information --" select={this.select} id="contactInformation" value={this.state.contactInformation} /></Col>
                                        </Col>
                                    </Col>
                                    <Col span={24} style={{ marginTop: "0.5em" }}>
                                        <Col span={1}></Col>
                                        <Col span={22}>
                                            <Col span={5} style={{ marginLeft: "-6em" }}><label className="title">City</label></Col>
                                            <Col span={5} style={{ marginLeft: "5.2em" }}><Input type="text" onChange={this.text} id="city" value={this.state.city} /></Col>
                                            <Col span={1}></Col>
                                            <Col span={5} style={{ marginLeft: "-2.3em" }}><label className="title">Phone</label></Col>
                                            <Col span={5} style={{ marginLeft: "2.4em" }}><Input type="number" pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}" onChange={this.text} id="phone" value={this.state.phone} /></Col>
                                            <Col span={1}></Col>
                                        </Col>
                                    </Col>
                                    <Col span={24} style={{ marginTop: "0.5em", marginBottom: '6em' }}>
                                        <Col span={1}></Col>
                                        <Col span={22}>
                                            <Col span={5} style={{ marginLeft: "-6em" }}><label className="title">Zip</label></Col>
                                            <Col span={5} style={{ marginLeft: "5.3em" }}><Input type="number" pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}" onChange={this.text} id="zip" value={this.state.zip} /></Col>
                                            <Col span={1}></Col>
                                            <Col span={5} style={{ marginLeft: "-2.5em" }}><label className="title">State</label></Col>
                                            <Col span={5} style={{ marginLeft: "2.3em" }}><Dropdown width={250} data={states} placeholder=" -- Select State --" select={this.select} id="address" value={this.state.address} /></Col>
                                        </Col>
                                    </Col>
                                </div>
                            )}
                            {current === 2 && (
                                <div className="steps-content">
                                    <Col span={24}>
                                        <Col span={7} style={{ marginLeft: "-4.5em" }}> <label className="title1">Products</label></Col>
                                        <Col span={17}></Col>
                                    </Col>
                                    <Col span={24} style={{ marginTop: "0.5em" }}>
                                        <Col span={1}></Col>
                                        <Col span={22}>
                                            <Col span={5} style={{ marginLeft: "-6.9em" }}><label className="title">SKUs</label></Col>
                                            <Col span={5} style={{ marginLeft: "7em" }}><Input style={{ width: "17.7em" }} type="text" onChange={this.text} id="sku" value={this.state.sku} /></Col>
                                            <Col span={1}></Col>
                                            <Col span={5} style={{ marginLeft: "-1.3em" }}><label className="title">HP Displayed in Search Results</label></Col>
                                            <Col span={5} style={{ marginLeft: "1em" }}><Dropdown width={220} data={searchData} placeholder=" -- Select status --" select={this.select} id="search" value={this.state.search} /></Col>
                                        </Col>
                                    </Col>
                                    <Col span={24} style={{ marginTop: "0.5em" }}>
                                        <Col span={1}></Col>
                                        <Col span={22}>
                                            <Col span={5} style={{ marginLeft: "-3.9em" }}><label className="title">Pictures of HP Product</label></Col>
                                            <Col span={5} style={{ marginLeft: "3.9em" }}><Dropdown width={250} data={searchData} placeholder=" -- Select status --" select={this.select} id="picture" value={this.state.picture} /></Col>
                                            <Col span={1}></Col>
                                            <Col span={5} style={{ marginLeft: "-5.4em" }}><label className="title">HP SKU</label></Col>
                                            <Col span={5} style={{ marginLeft: "5.3em" }}><Dropdown width={220} data={searchData} placeholder=" -- Select status --" select={this.select} id="hpSku" value={this.state.hpSku} /></Col>
                                        </Col>
                                    </Col>
                                    <Col span={24} style={{ marginTop: "0.5em" }}>
                                        <Col span={1}></Col>
                                        <Col span={22}>
                                            <Col span={5} style={{ marginLeft: "-4.6em" }}><label className="title">Correct Description</label></Col>
                                            <Col span={5} style={{ marginLeft: "4.6em" }}><Dropdown width={250} data={searchData} placeholder=" -- Select status --" select={this.select} id="correctDescription" value={this.state.correctDescription} /></Col>
                                            <Col span={1}></Col>
                                            <Col span={5} style={{ marginLeft: "-4.3em" }}><label className="title">Official Picture</label></Col>
                                            <Col span={5} style={{ marginLeft: "4.3em" }}><Dropdown width={220} data={searchData} placeholder=" -- Select status --" select={this.select} id="officialPicture" value={this.state.officialPicture} /></Col>
                                        </Col>
                                    </Col>
                                    <Col span={24} style={{ marginTop: "0.5em" }}>
                                        <Col span={1}></Col>
                                        <Col span={22}>
                                            <Col span={5} style={{ marginLeft: "-5.5em" }}><label className="title">Product Type</label></Col>
                                            <Col span={5} style={{ marginLeft: "5.5em" }}><Dropdown width={250} data={["Piracy", "Grey Market", "Compatibles", "Remanufactured"]} placeholder=" -- Select Product Type --" select={this.select} id="productType" value={this.state.productType} /></Col>
                                            <Col span={1}></Col>
                                            <Col span={5}><label className="title" style={{ marginLeft: "-1.5em" }}>Login Required to see the Product</label></Col>
                                            <Col span={5}><Dropdown width={220} data={searchData} placeholder=" -- Select status --" select={this.select} id="loginRequire" value={this.state.loginRequire} /></Col>
                                        </Col>
                                    </Col>
                                    <Col span={24} style={{ marginTop: "0.5em" }}>
                                        <Col span={1}></Col>
                                        <Col span={22}>
                                            <Col span={5}><label className="title">Advertised price comply with the MAP Policy</label></Col>
                                            <Col span={5}><Dropdown width={250} data={searchData} placeholder=" -- Select status --" select={this.select} id="advertisedPriceComply" value={this.state.advertisedPriceComply} /></Col>
                                        </Col>
                                    </Col>
                                    <Col span={24}>
                                        <Col span={1}></Col>
                                        <Col span={22}>
                                            <Divider />
                                        </Col>
                                    </Col>
                                    <Col span={24}>
                                        <Col span={7} style={{ marginLeft: "-3.3em" }}> <label className="title1">Non HP Products</label></Col>
                                        <Col span={17}></Col>
                                    </Col>
                                    <Col span={24} style={{ marginTop: "0.5em", marginBottom: "1em" }}>
                                        <Col span={1}></Col>
                                        <Col span={22}>
                                            <Col span={7} style={{ marginLeft: "-3.3em" }}><label className="title">Begins Title or Description with "HP" or HP SKU</label></Col>
                                            <Col span={5} style={{ marginLeft: "-3.8em" }}><Input style={{ marginTop: '-0.7em' }} type="text" onChange={this.text} id="begin" value={this.state.begin} /></Col>
                                            <Col span={1}></Col>
                                            <Col span={5} style={{ marginLeft: "-4.4em" }}><label className="title">Evidence</label></Col>
                                            <input style={{ marginLeft: "-3.5em", marginTop: "-0.7em" }} type="file" name="file" multiple onChange={this.handleInputChange} accept=".eml,.pdf,.rtf,.png,.jpeg,.jpg,.docx,.txt,.xlsx,.csv" />
                                        </Col>
                                    </Col>
                                </div>
                            )}
                            {current === 3 && (
                                <div>
                                    <div className="steps-content">
                                        <Col span={24} style={{ marginTop: "2em" }}>
                                            <Col span={1}></Col>
                                            <Col span={5} style={{ marginLeft: '-3.9em', marginTop: "0.5em" }}><label className="title">HPS Threshold</label></Col>
                                            <Col span={5} style={{ marginLeft: "-0.7em" }}><Dropdown width={220} data={["Missed", "Not Missed"]} placeholder=" -- Select status --" select={this.select} id="hpsThreshold" value={this.state.hpsThreshold} /></Col>
                                            <Col span={1}></Col>
                                            <Col span={5} style={{ marginLeft: "-3.8em", marginTop: "0.5em" }}><label className="title">OPS Threshold</label></Col>
                                            <Col span={5} style={{ marginLeft: "-0.8em" }}><Dropdown width={220} data={["Missed", "Not Missed"]} placeholder=" -- Select status --" select={this.select} id="opsThreshold" value={this.state.opsThreshold} /></Col>
                                        </Col>
                                        <Col span={24} style={{ marginTop: "2em", marginBottom: '1em' }}>
                                            <Col span={1}></Col>
                                            <Col span={5} style={{ marginLeft: "-3em", marginTop: "0.5em" }}><label className="title">Supplies Threshold</label></Col>
                                            <Col span={5} style={{ marginLeft: "-1.6em" }}><Dropdown width={220} data={["Missed", "Not Missed"]} placeholder=" -- Select status --" select={this.select} id="suppliesThreshold" value={this.state.suppliesThreshold} /></Col>
                                            <Col span={1}></Col>
                                            <Col span={5} style={{ marginLeft: "-3.9em", marginTop: "0.5em" }}><label className="title">PCs Threshold</label></Col>
                                            <Col span={5} style={{ marginLeft: "-0.6em" }}><Dropdown width={220} data={["Missed", "Not Missed"]} placeholder=" -- Select status --" select={this.select} id="pcsThreshold" value={this.state.pcsThreshold} /></Col>
                                        </Col>
                                        <Col span={24}>
                                            <Col span={1}></Col>
                                            <Col span={22}>
                                                <Divider />
                                            </Col>
                                        </Col>
                                        <Col span={24}>
                                            <Col span={3} style={{ marginLeft: '3.3em', marginTop: "5em" }}><label className="title">Evidence</label></Col>
                                            <Col span={7} ><input style={{ marginLeft: "2.5em", marginTop: "-0.7em", marginTop: "5em" }} type="file" multiple name="file" onChange={this.handleInputChange1} accept=".eml,.pdf,.rtf,.png,.jpeg,.jpg,.docx,.txt,.xlsx,.csv" /></Col>
                                            <Col span={1}></Col>
                                            <Col span={10} style={{ marginLeft: "-0.5em", marginTop: "1em", marginBottom: '3em' }}>
                                                <div style={{ borderStyle: "dashed", padding: "3em" }}>
                                                    <label className="title"> Revenue Threshold for Supplies: $250k</label><br />
                                                    <label className="title"> Revenue Threshold for HPS Print: $1K or 4 units </label>
                                                </div>
                                            </Col>
                                        </Col>
                                    </div>
                                    <div className="steps-content">
                                        <Col span={24} style={{ marginTop: "0.5em", marginBottom: '1.2em' }}>
                                            <Col span={4}><strong>{sessionStorage.getItem('accountName') + ' ' + '    Revenue for'}</strong></Col>
                                            <Col span={1}></Col>
                                            <Col span={4} style={{ marginLeft: '1.4em' }}><span style={{ color: "#0095d9", fontWeight: 600, width: 220 }}><Dropdown select={this.select} data={this.state.selectData} placeholder={"-- " + 'Select FY' + " --"} id="rValue" value={this.state.rValue} width={220} /></span></Col>
                                            <Col span={1}></Col>
                                            <Col span={4} style={{ marginLeft: '-1.7em' }}><strong>Type</strong></Col>
                                            <Col span={1}></Col>
                                            <Col span={4} style={{ marginLeft: '1.4em' }}><span style={{ color: "#0095d9", fontWeight: 600, width: 220 }}><Dropdown select={this.select} data={["USD", "Units"]} placeholder={"-- " + 'Select' + " --"} id="dollerUnit" value={this.state.dollerUnit} width={220} /></span></Col>
                                        </Col>

                                        <Col span={24} style={{ marginTop: "0em" }}>
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
                                    </div>
                                </div>
                            )}
                            {current === 4 && (
                                <div className="steps-content">
                                    {/* <Col span={24}>
                                        <Col span={7}><h1 className="title1" style={{ fontSize: '16px' }}>Assesment: Partner Information</h1></Col>
                                    </Col> */}
                                    <Col span={24} style={{ marginTop: '1.5em' }} >
                                        <Col span={1}></Col>
                                        <Col span={22}>
                                            <Divider orientation="left" style={{ fontSize: '18px', fontWeight: '800' }}>Assesment: Partner Information</Divider>
                                        </Col>
                                    </Col>
                                    <Col span={24} style={{ marginTop: "1em" }}>
                                        <Col span={3}></Col>
                                        <Col span={5} style={{ textAlign: 'left' }}><h1 className="title">HPS Status</h1></Col>
                                        <Col span={4} style={{ textAlign: 'left' }}>
                                            {this.state.printStatus != "" ? <h4 className="title">{this.state.printStatus}</h4> : <h4 className="title">NA</h4>}
                                        </Col>
                                        <Col span={2}></Col>
                                        <Col span={5} style={{ textAlign: 'left' }}><h1 className="title">expiration Date</h1></Col>
                                        <Col span={4} style={{ textAlign: 'left' }}>
                                            {this.state.date != "" ? <h4 className="title">{this.state.date}</h4> : <h4 className="title">NA</h4>}
                                        </Col>
                                    </Col>
                                    <Col span={24} style={{ marginTop: "1em" }}>
                                        <Col span={3}></Col>
                                        <Col span={5} style={{ textAlign: 'left' }}><h1 className="title">Supplies Status</h1></Col>
                                        <Col span={4} style={{ textAlign: 'left' }}>
                                            {this.state.suppliesStatus != "" ? <h4 className="title">{this.state.suppliesStatus}</h4> : <h4 className="title">NA</h4>}
                                        </Col>
                                        <Col span={2}></Col>
                                        <Col span={5} style={{ textAlign: 'left' }}><h1 className="title">Note Type</h1></Col>
                                        <Col span={4} style={{ textAlign: 'left' }}>
                                            {this.state.noteType != "" ? <h4 className="title">{this.state.noteType}</h4> : <h4 className="title">NA</h4>}
                                        </Col>
                                    </Col>
                                    <Col span={24} style={{ marginTop: "1em" }}>
                                        <Col span={3}></Col>
                                        <Col span={5} style={{ textAlign: 'left' }}><h1 className="title">PC Status</h1></Col>
                                        <Col span={4} style={{ textAlign: 'left' }}>
                                            {this.state.pcStatus != "" ? <h4 className="title">{this.state.pcStatus}</h4> : <h4 className="title">NA</h4>}
                                        </Col>
                                        <Col span={2}></Col>
                                        <Col span={5} style={{ textAlign: 'left' }}><h1 className="title">OPS Status</h1></Col>
                                        <Col span={4} style={{ textAlign: 'left' }}>
                                            {this.state.opsStatus != "" ? <h4 className="title">{this.state.opsStatus}</h4> : <h4 className="title">NA</h4>}
                                        </Col>
                                    </Col>
                                    <Col span={24} style={{ marginTop: "1em" }}>
                                        <Col span={3}></Col>
                                        <Col span={5} style={{ textAlign: 'left' }}><h1 className="title">Partner Status</h1></Col>
                                        <Col span={4} style={{ textAlign: 'left' }}>
                                            {this.state.partnerStatus != "" ? <h4 className="title">{this.state.partnerStatus}</h4> : <h4 className="title">NA</h4>}
                                        </Col>
                                        <Col span={2}></Col>
                                        <Col span={5} style={{ textAlign: 'left' }}><h1 className="title">Partner Type</h1></Col>
                                        <Col span={4} style={{ textAlign: 'left' }}>
                                            {this.state.partnerType != "" ? <h4 className="title">{this.state.partnerType}</h4> : <h4 className="title">NA</h4>}
                                        </Col>
                                    </Col>
                                    <Col span={24} style={{ marginTop: "1em" }}>
                                        <Col span={3}></Col>
                                        <Col span={5} style={{ textAlign: 'left' }}><h1 className="title">Partner Agreement</h1></Col>
                                        <Col span={4} style={{ textAlign: 'left' }}>
                                            {this.state.partnerAgreement != "" ? <h4 className="title">{this.state.partnerAgreement}</h4> : <h4 className="title">NA</h4>}
                                        </Col>
                                        <Col span={2}></Col>
                                        <Col span={5} style={{ textAlign: 'left' }}><h1 className="title">Notes:</h1></Col>
                                        <Col span={4} style={{ textAlign: 'left' }}>
                                            {this.state.notes != "" ? <h4 className="title">{this.state.notes}</h4> : <h4 className="title">NA</h4>}
                                        </Col>
                                    </Col>
                                    <Col span={24} style={{ marginTop: "1em" }}>
                                        <Col span={3}></Col>
                                        <Col span={5} style={{ textAlign: 'left' }}><h1 className="title">Account Status</h1></Col>
                                        <Col span={4} style={{ textAlign: 'left' }}>
                                            {this.state.accountStatus != "" ? <h4 className="title">{this.state.accountStatus}</h4> : <h4 className="title">NA</h4>}
                                        </Col>
                                    </Col>

                                    {/*  ------------------------------------------------------ */}
                                    <Col span={24} style={{ marginTop: '1.5em' }} >
                                        <Col span={1}></Col>
                                        <Col span={22}>
                                            <Divider orientation="left" style={{ fontSize: '18px', fontWeight: '800' }}>Assesment: Website</Divider>
                                        </Col>
                                    </Col>
                                    <Col span={24} style={{ marginTop: "1em" }}>
                                        <Col span={3}></Col>
                                        <Col span={5} style={{ textAlign: 'left' }}><h1 className="title">Website Type</h1></Col>
                                        <Col span={4} style={{ textAlign: 'left' }}>
                                            {this.state.websiteType != "" && this.state.websiteType != null ? <>
                                                {this.state.websiteType.map((val) => (
                                                    <h4 className="title">{val}</h4>
                                                ))} </> : <h4 className="title">NA</h4>}
                                        </Col>
                                        <Col span={2}></Col>
                                        <Col span={5} style={{ textAlign: 'left' }}><h1 className="title">Website Status</h1></Col>
                                        <Col span={4} style={{ textAlign: 'left' }}>
                                            {this.state.status != "" ? <h4 className="title">{this.state.status}</h4> : <h4 className="title">NA</h4>}
                                        </Col>
                                    </Col>
                                    <Col span={24} style={{ marginTop: "1em" }}>
                                        <Col span={3}></Col>
                                        <Col span={5} style={{ textAlign: 'left' }}><h1 className="title">Partner URL</h1></Col>
                                        <Col span={4} style={{ textAlign: 'left' }}>
                                            {this.state.website != "" ? <h4 className="title">{this.state.website}</h4> : <h4 className="title">NA</h4>}
                                        </Col>
                                        <Col span={2}></Col>
                                        <Col span={5} style={{ textAlign: 'left' }}><h1 className="title">HP SKUs not Searchable</h1></Col>
                                        <Col span={4} style={{ textAlign: 'left' }}>
                                            {this.state.skuSearchable == true ? <h4 className="title">True</h4> : <h4 className="title">False</h4>}
                                        </Col>
                                    </Col>
                                    <Col span={24}>
                                        <Col span={2}></Col>
                                        <Col span={18}>
                                            <Divider />
                                        </Col>
                                    </Col>
                                    <Col span={24} style={{ marginTop: "0em" }}>
                                        <Col span={3}></Col>
                                        <Col span={5} style={{ textAlign: 'left' }}><h1 className="title">Contact Information</h1></Col>
                                        <Col span={4} style={{ textAlign: 'left' }}>
                                            {this.state.contactInformation != "" ? <h4 className="title">{this.state.contactInformation}</h4> : <h4 className="title">NA</h4>}
                                        </Col>
                                    </Col>
                                    <Col span={24} style={{ marginTop: "1em" }}>
                                        <Col span={3}></Col>
                                        <Col span={5} style={{ textAlign: 'left' }}><h1 className="title">City</h1></Col>
                                        <Col span={4} style={{ textAlign: 'left' }}>
                                            {this.state.city != "" ? <h4 className="title">{this.state.city}</h4> : <h4 className="title">NA</h4>}
                                        </Col>
                                        <Col span={2}></Col>
                                        <Col span={5} style={{ textAlign: 'left' }}><h1 className="title">Phone</h1></Col>
                                        <Col span={4} style={{ textAlign: 'left' }}>
                                            {this.state.phone != "" ? <h4 className="title">{this.state.phone}</h4> : <h4 className="title">NA</h4>}
                                        </Col>
                                    </Col>
                                    <Col span={24} style={{ marginTop: "1em" }}>
                                        <Col span={3}></Col>
                                        <Col span={5} style={{ textAlign: 'left' }}><h1 className="title">Zip</h1></Col>
                                        <Col span={4} style={{ textAlign: 'left' }}>
                                            {this.state.zip != "" ? <h4 className="title">{this.state.zip}</h4> : <h4 className="title">NA</h4>}
                                        </Col>
                                        <Col span={2}></Col>
                                        <Col span={5} style={{ textAlign: 'left' }}><h1 className="title">State</h1></Col>
                                        <Col span={4} style={{ textAlign: 'left' }}>
                                            {this.state.address != "" ? <h4 className="title">{this.state.address}</h4> : <h4 className="title">NA</h4>}
                                        </Col>
                                    </Col>


                                    {/* ----------2---------2-------------2--------2--- */}

                                    <Col span={24} style={{ marginTop: '1.5em' }} >
                                        <Col span={1}></Col>
                                        <Col span={22}>
                                            <Divider orientation="left" style={{ fontSize: '18px', fontWeight: '800' }}>Assesment: Brand</Divider>
                                        </Col>
                                    </Col>
                                    <Col span={24} style={{ marginTop: "1em" }}>
                                        <Col span={3}></Col>
                                        <Col span={5} style={{ textAlign: 'left' }}><h1 className="title">SKUs</h1></Col>
                                        <Col span={4} style={{ textAlign: 'left' }}>
                                            {this.state.sku != "" ? <h4 className="title">{this.state.sku}</h4> : <h4 className="title">NA</h4>}
                                        </Col>
                                        <Col span={2}></Col>
                                        <Col span={5} style={{ textAlign: 'left' }}><h1 className="title">HP Displayed in Search Results</h1></Col>
                                        <Col span={4} style={{ textAlign: 'left' }}>
                                            {this.state.search != "" ? <h4 className="title">{this.state.search}</h4> : <h4 className="title">NA</h4>}
                                        </Col>
                                    </Col>
                                    <Col span={24} style={{ marginTop: "1em" }}>
                                        <Col span={3}></Col>
                                        <Col span={5} style={{ textAlign: 'left' }}><h1 className="title">Pictures of HP Product</h1></Col>
                                        <Col span={4} style={{ textAlign: 'left' }}>
                                            {this.state.picture != "" ? <h4 className="title">{this.state.picture}</h4> : <h4 className="title">NA</h4>}
                                        </Col>
                                        <Col span={2}></Col>
                                        <Col span={5} style={{ textAlign: 'left' }}><h1 className="title">HP SKU</h1></Col>
                                        <Col span={4} style={{ textAlign: 'left' }}>
                                            {this.state.hpSku != "" ? <h4 className="title">{this.state.hpSku}</h4> : <h4 className="title">NA</h4>}
                                        </Col>
                                    </Col>
                                    <Col span={24} style={{ marginTop: "1em" }}>
                                        <Col span={3}></Col>
                                        <Col span={5} style={{ textAlign: 'left' }}><h1 className="title">Correct Description</h1></Col>
                                        <Col span={4} style={{ textAlign: 'left' }}>
                                            {this.state.correctDescription != "" ? <h4 className="title">{this.state.correctDescription}</h4> : <h4 className="title">NA</h4>}
                                        </Col>
                                        <Col span={2}></Col>
                                        <Col span={5} style={{ textAlign: 'left' }}><h1 className="title">Official Picture</h1></Col>
                                        <Col span={4} style={{ textAlign: 'left' }}>
                                            {this.state.officialPicture != "" ? <h4 className="title">{this.state.officialPicture}</h4> : <h4 className="title">NA</h4>}
                                        </Col>
                                    </Col>
                                    <Col span={24} style={{ marginTop: "1em" }}>
                                        <Col span={3}></Col>
                                        <Col span={5} style={{ textAlign: 'left' }}><h1 className="title">Product Type</h1></Col>
                                        <Col span={4} style={{ textAlign: 'left' }}>
                                            {this.state.productType != "" ? <h4 className="title">{this.state.productType}</h4> : <h4 className="title">NA</h4>}
                                        </Col>
                                        <Col span={2}></Col>
                                        <Col span={5} style={{ textAlign: 'left' }}><h1 className="title">Login Required to see the Product</h1></Col>
                                        <Col span={4} style={{ textAlign: 'left' }}>
                                            {this.state.loginRequire != "" ? <h4 className="title">{this.state.loginRequire}</h4> : <h4 className="title">NA</h4>}
                                        </Col>
                                    </Col>
                                    <Col span={24} style={{ marginTop: "1em" }}>
                                        <Col span={3}></Col>
                                        <Col span={5} style={{ textAlign: 'left' }}><h1 className="title">Advertised price comply with the MAP Policy</h1></Col>
                                        <Col span={4} style={{ textAlign: 'left' }}>
                                            {this.state.advertisedPriceComply != "" ? <h4 className="title">{this.state.advertisedPriceComply}</h4> : <h4 className="title">NA</h4>}
                                        </Col>
                                    </Col>
                                    <Col span={24}>
                                        <Col span={2}></Col>
                                        <Col span={18}>
                                            <Divider />
                                        </Col>
                                    </Col>
                                    <Col span={24} style={{ marginTop: "1em" }}>
                                        <Col span={3}></Col>
                                        <Col span={5} style={{ textAlign: 'left' }}><h1 className="title">Begins Title or Description with "HP" or HP SKU</h1></Col>
                                        <Col span={4} style={{ textAlign: 'left' }}>
                                            {this.state.begin != "" ? <h4 className="title">{this.state.begin}</h4> : <h4 className="title">NA</h4>}
                                        </Col>
                                        <Col span={2}></Col>
                                        <Col span={5} style={{ textAlign: 'left' }}><h1 className="title">Evidence</h1></Col>
                                        <Col span={4} style={{ textAlign: 'left' }}>
                                            {this.state.evidenceField != "" ? <h4 className="title">Evidence Attached</h4> : <h4 className="title">NA</h4>}
                                        </Col>
                                    </Col>
                                    {/* ---------3---------------3---------3-----------3- */}
                                    <Col span={24} style={{ marginTop: '1.5em' }} >
                                        <Col span={1}></Col>
                                        <Col span={22}>
                                            <Divider orientation="left" style={{ fontSize: '18px', fontWeight: '800' }}>Assesment: Revenue</Divider>
                                        </Col>
                                    </Col>
                                    <Col span={24} style={{ marginTop: "1em" }}>
                                        <Col span={3}></Col>
                                        <Col span={5} style={{ textAlign: 'left' }}><h1 className="title">HPS Threshold</h1></Col>
                                        <Col span={4} style={{ textAlign: 'left' }}>
                                            {this.state.hpsThreshold != "" ? <h4 className="title">{this.state.hpsThreshold}</h4> : <h4 className="title">NA</h4>}
                                        </Col>
                                        <Col span={2}></Col>
                                        <Col span={5} style={{ textAlign: 'left' }}><h1 className="title">Supplies Threshold</h1></Col>
                                        <Col span={4} style={{ textAlign: 'left' }}>
                                            {this.state.suppliesThreshold != "" ? <h4 className="title">{this.state.suppliesThreshold}</h4> : <h4 className="title">NA</h4>}
                                        </Col>
                                    </Col>
                                    <Col span={24} style={{ marginTop: "1em" }}>
                                        <Col span={3}></Col>
                                        <Col span={5} style={{ textAlign: 'left' }}><h1 className="title">OPS Threshold</h1></Col>
                                        <Col span={4} style={{ textAlign: 'left' }}>
                                            {this.state.opsThreshold != "" ? <h4 className="title">{this.state.opsThreshold}</h4> : <h4 className="title">NA</h4>}
                                        </Col>
                                        <Col span={2}></Col>
                                        <Col span={5} style={{ textAlign: 'left' }}><h1 className="title">PCs Threshold</h1></Col>
                                        <Col span={4} style={{ textAlign: 'left' }}>
                                            {this.state.pcsThreshold != "" ? <h4 className="title">{this.state.pcsThreshold}</h4> : <h4 className="title">NA</h4>}
                                        </Col>
                                    </Col>
                                    <Col span={24}>
                                        <Col span={2}></Col>
                                        <Col span={18}>
                                            <Divider />
                                        </Col>
                                    </Col>
                                    <Col span={24} style={{ marginTop: "0em" }}>
                                        <Col span={3}></Col>
                                        <Col span={5} style={{ textAlign: 'left' }}><h1 className="title">Evidence</h1></Col>
                                        <Col span={4} style={{ textAlign: 'left' }}>
                                            {this.state.evidenceField1 != "" ? <h4 className="title">Evidence Attached</h4> : <h4 className="title">NA</h4>}
                                        </Col>
                                    </Col>
                                    {/* ---------4---------------4---------4-----------4- */}
                                    <Col span={24} style={{ marginTop: '1.5em' }} >
                                        <Col span={1}></Col>
                                        <Col span={22}>
                                            <Divider orientation="left" style={{ fontSize: '18px', fontWeight: '800' }}>Audit Findings</Divider>
                                        </Col>
                                    </Col>
                                    <Col span={24} style={{ marginTop: "1em", marginBottom: "2em" }}>
                                        <Col span={3}></Col>
                                        <Col span={5} style={{ textAlign: 'left' }}><h1 className="title">Notes: </h1></Col>
                                        <Col span={15} style={{ textAlign: 'left' }}>
                                            <TextArea rows={4} onChange={this.text} id="reviewNotes" value={this.state.reviewNotes} />
                                        </Col>
                                    </Col>
                                    <Col span={24} style={{ marginTop: "0.5em", marginBottom: '1em' }}>
                                        <Col span={1}></Col>
                                        <Col span={22}>
                                            <Col span={5} style={{ marginLeft: '1.2em' }}><label className="title">Reveiw Status</label></Col>
                                            <Col span={5} style={{ marginLeft: '7.2em' }}><Dropdown width={220} data={reviewData} placeholder="Open" select={this.select} id="reviewStatus" value={this.state.reviewStatus} /></Col>
                                        </Col>
                                    </Col>
                                </div>
                            )}
                        </div>
                        <div className="steps-action" style={{ marginBottom: '3em' }}>
                            {current < steps.length - 1 && (
                                <Button type="primary" onClick={() => this.next()}>
                                    Next
                                </Button>
                            )}
                            {current === steps.length - 1 && (
                                <Button style={{ backgroundColor: "#5cb85c", color: "#fff" }} onClick={this.done}>
                                    Save
                                </Button>
                            )}
                            {current > 0 && (
                                <Button style={{ marginLeft: 8, backgroundColor: "#ffba39", color: "#fff" }} onClick={() => this.prev()}>
                                    Previous
                                </Button>
                            )}
                            {current === steps.length - 1 &&  (<div style={{ marginTop: '-2.5em' }}>
                                <Button style={{ paddingTop: "-20em", marginLeft: '89em', backgroundColor: "#0086c0", color: "#fff" }} onClick={this.sentMail}>
                                    Send Letter
                                </Button>
                            </div>
                            )}
                        </div>
                    </Col>
                </Col>
                <Modal visible={this.state.modelVisible} onOk={this.handleOk} onCancel={this.handleCancel}
                    footer={[
                        <Button key="back" onClick={this.handleCancel}>
                            Close
                        </Button>,
                        <Button key="next" type='primary' loading={this.state.nextButtonLoading} onClick={this.nextModal}>
                            Next
                        </Button>
                    ]}
                    width={800}>
                    <Col span={24} style={{ marginTop: "1em" }}>
                        <Col span={20} className="header"><div><span style={{ fontSize: '1.2em' }}>Audit Trail for: </span><span>{sessionStorage.getItem('accountName')}</span></div></Col>
                    </Col>
                    <Col span={24}>
                        <Col span={22}>
                            <Divider />
                        </Col>
                    </Col>
                    <Col span={24} style={{ marginTop: "0.5em", marginBottom: '1.2em' }}>
                        <Col span={5}><h3 style={{ fontWeight: '800' }}>Type Of Letter:</h3></Col>
                        <Col span={5} style={{ marginLeft: '-2.3em' }}><span style={{ color: "#0095d9", fontWeight: 600, width: 220 }}><Dropdown select={this.select} data={["Internal", "External"]} placeholder={"-- " + 'Select type of letter' + " --"} id="emailFor" value={this.state.emailFor} width={220} /></span></Col>
                    </Col>
                    <h3 style={{ fontWeight: 'bold', marginTop: "1.5em" }}>CAUSE OF NON-COMPLIANCE</h3>
                    <Col span={24}>
                        <Col span={1}> <h2>1.</h2></Col>
                        <Col span={22}>
                            <TextArea rows={1} onChange={this.text} id="emailNote1" value={this.state.emailNote1} />
                        </Col>
                    </Col>
                    <Col span={24}>
                        <Col span={1}> <h2>2.</h2></Col>
                        <Col span={22}>
                            <TextArea rows={1} onChange={this.text} id="emailNote2" value={this.state.emailNote2} />
                        </Col>
                    </Col>
                    <Col span={24}>
                        <Col span={1}> <h2>3.</h2></Col>
                        <Col span={22}>
                            <TextArea rows={1} onChange={this.text} id="emailNote3" value={this.state.emailNote3} />
                        </Col>
                    </Col>
                    <Col span={24}>
                        <Col span={1}> <h2>4.</h2></Col>
                        <Col span={22}>
                            <TextArea rows={1} onChange={this.text} id="emailNote4" value={this.state.emailNote4} />
                        </Col>
                    </Col>
                    <Col span={24} style={{ marginBottom: '2em' }}>
                        <Col span={1}> <h2>5.</h2></Col>
                        <Col span={22}>
                            <TextArea rows={1} onChange={this.text} id="emailNote5" value={this.state.emailNote5} />
                        </Col>
                    </Col>
                </Modal>
                <Modal visible={this.state.secondModel} onOk={this.handleOk} onCancel={this.handleCancel}
                    footer={[
                        <Button key="back" onClick={this.prevModal}>
                            Back
                    </Button>,
                        <Button key="download" loading={this.state.letterDownloading} style={{ backgroundColor: "#ffba39", color: "#fff" }} onClick={this.handleOk}>
                            Download Letter
                        </Button>,
                        <Button key="submit" loading={this.state.letterSending} style={{ backgroundColor: "#5cb85c", color: "#fff" }} onClick={this.sendEmail}>
                            Send
                        </Button>
                    ]}
                    width={1000}>
                    <div className="body">
                        <Col span={24}>
                            <Col span={2}></Col>
                            <Col span={9} style={{ marginTop: '8em' }}>
                                <p id="font" className="top-left">HP México</p>
                                <p id="font" className="top-left">Avenida Javier Barros Sierra 495, Piso 11 y 10</p>
                                <p id="font" className="top-left">Col. Santa Fe, Alc. Álvaro Obregón</p>
                                <p id="font" className="top-left">C.P. 01376, Ciudad de México, México</p>
                            </Col>
                            <Col span={8}></Col>
                            <Col span={4} style={{ marginTop: '2em' }}>
                                <img src={Image} style={{ width: "8em" }} alt="Hp logo" />
                            </Col>
                        </Col>
                        <Col span={24} style={{ marginTop: '3em' }}>
                            <Col span={14}></Col>
                            <Col span={9} style={{ marginLeft: '-2em' }}>
                                <p id="font" className="text-2">NOTIFICACIÓN POR INCUMPLIMIENTO DEL</p>
                                <p id="font" className="text-2">HP QUALIFIED DISTRIBUTION</p>
                            </Col>
                        </Col>
                        <Col span={24} style={{ marginTop: '3em' }}>
                            <Col span={2}></Col>
                            <Col span={7}>
                                <p id="font" className="date">{moment().format("YYYY MMM Do")}</p>
                            </Col>
                        </Col>
                        <Col span={24} style={{ marginTop: '1em' }}>
                            <Col span={2}></Col>
                            <Col span={7}>
                                <p id="font" style={{ fontWeight: '700' }}>{sessionStorage.getItem('accountName')}</p>
                            </Col>
                        </Col>
                        <Col span={24}>
                            <Col span={2}></Col>
                            <Col span={7}>
                                <p style={{ fontWeight: '800', marginTop: '-0.5em' }} id="font">P R E S E N T E</p>
                            </Col>
                        </Col>
                        <Col span={24} style={{ marginTop: '1em' }}>
                            <Col span={2}></Col>
                            <Col span={20}>
                                <p id="font">HP desarrolló e implemento el Programa HP Qualified Distribution (QD). Este programa contempla
                                ciertos beneficios y obligaciones tanto para HP como para los Socios de Negocios que fueron
                                aceptados para ser parte de este. Uno de los mayores beneficios, es el acceso a la compra de
                        Productos Originales HP, a través de los Mayoristas autorizados.</p>
                            </Col>
                        </Col>
                        <Col span={24} style={{ marginTop: '1em' }}>
                            <Col span={2}></Col>
                            <Col span={20}>
                                <div><span id="font">Por la presente le notificamos el incumplimiento a los lineamientos establecidos en el Programa, por
                         parte de la compañía a la cual usted representa, como a continuación se detalla:</span></div>
                            </Col>
                        </Col>
                        <Col span={24} style={{ marginTop: '1.5em' }}>
                            <Col span={2}></Col>
                            <Col span={20}>
                                <p id="font">1. {this.state.emailNote1}</p>
                            </Col>
                        </Col>
                        <Col span={24}>
                            <Col span={2}></Col>
                            <Col span={20}>
                                <p id="font">2. {this.state.emailNote2}</p>
                            </Col>
                        </Col>
                        <Col span={24}>
                            <Col span={2}></Col>
                            <Col span={20}>
                                <p id="font">3. {this.state.emailNote3}</p>
                            </Col>
                        </Col>
                        <Col span={24}>
                            <Col span={2}></Col>
                            <Col span={20}>
                                <p id="font">4. {this.state.emailNote4}</p>
                            </Col>
                        </Col>
                        <Col span={24}>
                            <Col span={2}></Col>
                            <Col span={20}>
                                <p id="font">5. {this.state.emailNote5}</p>
                            </Col>
                        </Col>
                        <Col span={24} style={{ marginTop: '1em' }}>
                            <Col span={2}></Col>
                            <Col span={20}>
                                <p id="font">Por lo que le solicitamos que realice los ajustes correspondientes a fin de cumplir con los lineamientos
                                del Programa de Distribución Calificada de HP dentro de los 30 días posteriores a la recepción de este
                                aviso. En caso de no realizar los cambios antes solicitados o de reincidencia, podría causar la baja del
                        Programa.</p>
                            </Col>
                        </Col>
                        <Col span={24} style={{ marginTop: '1em' }}>
                            <Col span={2}></Col>
                            <Col span={20}>
                                <p id="font">En caso de dudas, por favor escríbanos a través de la dirección de correo electrónico
                        HPMXQualifiedPartnerPrograms@hp.com.</p>
                            </Col>
                        </Col>
                        <Col span={24} style={{ marginTop: '1em' }}>
                            <Col span={2}></Col>
                            <Col span={6}><p id="font" style={{ fontWeight: '700' }}>Atentamente,</p> </Col>
                        </Col>
                        <Col span={24} style={{ marginTop: '1em' }}>
                            <Col span={2}></Col>
                            <Col span={6}><p id="font" style={{ color: 'blue' }}>Qualified Distribution </p> </Col>
                        </Col>
                        <Col span={24}>
                            <Col span={2}></Col>
                            <Col span={6} style={{ marginTop: '-0.7em' }}><p id="font">HP Mexico</p> </Col>
                        </Col>
                        <Col span={24}>
                            <Col span={2}></Col>
                            <Col span={9} style={{ marginTop: '-0.7em' }}><p id="font">Email: HPMXQualifiedPartnerPrograms@hp.com</p> </Col>
                        </Col>
                        <Col span={24} style={{ marginTop: '9em' }}>
                            <Col span={2}></Col>
                            <Col span={20}><h5 id="font">Este documento contiene información confidencial de HP para Socios elegibles en relación con información técnica, información sobre precios,
                            planes y estrategias relacionadas con productos, promociones, listas de clientes e información técnica, financiera o comercial. La parte
                    receptora tratará dicha información como "Información confidencial" si aplica lo siguiente:</h5> </Col>
                        </Col>
                        <Col span={24} style={{ marginTop: '1em' }}>
                            <Col span={2}></Col>
                            <Col span={20}><h5 id="font">Si la parte reveladora lo proporciona de manera tangible y directa a la parte receptora, la información se marca como confidencial
                    en el momento de la divulgación,</h5> </Col>
                        </Col>
                        <Col span={24} style={{ marginTop: '1em', marginBottom: '2em' }}>
                            <Col span={2}></Col>
                            <Col span={20}><h5 id="font">Si se divulga de manera electrónica, visual u oral, la parte divulgadora declara o indica que la información es confidencial.</h5> </Col>
                        </Col>
                    </div>
                </Modal>
            </div >
        );
    }
}

const Audit1 = Form.create()(Audit);

export default Audit1;
