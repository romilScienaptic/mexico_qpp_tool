
import React from 'react';
import 'antd/dist/antd.css';
import './audit.scss';
import { Steps, Button, message, Col, Input, Checkbox, Divider, DatePicker, } from 'antd';
import Dropdown from '../../Components/Select/select';
import Hp from '../../assets/images/Hp.png';
import moment from 'moment';
import axios from 'axios';

const statusData = ["Functional", "Not Functional"];
const websiteType = ["Business", "Social"];
const searchData = ["Yes", "No"];
const thresholdData = ["Missed", "Not Missed"];
const accounStatus = ["Active", "Closed"];
const reviewData = ["Open", "Closed"];
const noteType = ["General", "Assesment Notes", "QP Letter Sent", "QS letter Sent"];
const memberShipSupplies = ["Partner First Business Partner", "Partner First Gold Partner", "Partner First Platinum Partner", "Partner First Silver Partner", "Not Assigned", "Not Eligible"];
const status = ["Calificado", "Certificado", "No Calificado", "TBD"];
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
            accounStatus: '',
            notes: '',
            noteType: '',
            date: '',
            thresholdData: '',
            city: '',
            memberShipSupplies: '',
            zip: '',
            enable: true,
            display: 'none',
            bpsOpsStatus:''
        };
    }

    componentDidMount() {
        // document.title = 'Assesment Trail for'+ ' ' + sessionStorage.getItem('accountName');
        return new Promise((resolve, reject) => {
           axios.get(process.env.REACT_APP_DOMAIN + '/qpp/username')
                .then(response => {
                    this.setState({
                        userName: response.data.name,
                    });
                })
                .catch(function (error) {
                    // window.location.hash = "/";
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

    done = () => {
        if (this.state.reviewStatus === 'Closed') {
            return new Promise((resolve, reject) => {
                axios.post(process.env.REACT_APP_DOMAIN + '/qpp/submit_trail',
                    {
                        "id": parseInt(sessionStorage.getItem('id')),
                        "aboutUs": "",
                        "account": sessionStorage.getItem('accountName'),
                        // "taxId": sessionStorage.getItem('taxID'),
                        "accountStatus": this.state.accounStatus,
                        "expirationDate": this.state.date,
                        "hpDisplayStatus": this.state.search,
                        "hpProductPic": this.state.picture,
                        "hpSkusNotSearchable": this.state.skuSearchable,
                        "noteType": this.state.noteType,
                        "partnerUrl": this.state.website,
                        "phone": parseInt(this.state.phone),
                        "physicalAddress": this.state.address,
                        "hpsStatus": this.state.printStatus,
                        "revenueThreshHold": this.state.thresholdData,
                        "reviewStatus": this.state.reviewStatus,
                        "skus": this.state.sku,
                        "suppliesStatus": this.state.suppliesStatus,
                        "titleOrDesc": this.state.notes,
                        "notes": this.state.notes,
                        "websiteStatus": this.state.status,
                        "city": this.state.city,
                        "memberShipSupplies": this.state.memberShipSupplies,
                        "pcStatus": this.state.pcStatus,
                        "opsStatus": this.state.opsStatus,
                        "zip": this.state.zip
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
        else if (id === "accounStatus") {
            this.setState({
                accounStatus: value
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
        else if(id === "pcStatus"){
            this.setState({
                pcStatus : value
            })
        }
        else if(id === "opsStatus"){
            this.setState({
                opsStatus : value
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
        else if (event.target.id === "begin") {
            this.setState({
                begin: event.target.value
            })
        }

    }


    render() {
        const { current } = this.state;
        return (
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
                <Col span={24} style={{ marginTop: "1em" }}>
                    <Col span={1}></Col>
                    <Col span={8} className="header"><label>Audit Trail for: </label>{sessionStorage.getItem('accountName')}</Col>
                    <Col span={12}></Col>
                    <Col span={3} style={{ marginTop: "-1em" }}>
                        <Button type="primary" onClick={this.back} icon="rollback" style={{ marginLeft: "1.7em" }}>Back</Button>
                    </Col>
                </Col>
                <Col span={24} style={{ marginTop: "2em", overflow:'auto' }}>
                    <Col span={1}></Col>
                    <Col span={22}>
                        <Steps current={current}>
                            {steps.map(item => (
                                <Step key={item.title} title={item.title} />
                            ))}
                        </Steps>
                        <div className="steps-content">
                            {/* {steps[current].content } */}
                            {current === 0 && (
                                <div>
                                    <Col span={24} style={{ marginTop: "0.5em" }}>
                                        <Col span={1}></Col>
                                        <Col span={22}>
                                            <Col span={5} style={{ marginLeft: "-4em" }}><label className="title">Website Type</label></Col>
                                            <Col span={5} style={{ marginLeft: "3.2em" }}><Dropdown width={250} data={websiteType} placeholder=" -- Select Type --" select={this.select} id="websiteType" value={this.state.websiteType} /></Col>
                                            <Col span={1}></Col>
                                            <Col span={5}><label className="title" style={{ marginLeft: "-1.8em" }}>Website Status</label></Col>
                                            <Col span={5}><Dropdown width={250} data={statusData} placeholder=" -- Select status --" select={this.select} id="status" value={this.state.status} /></Col>
                                        </Col>
                                    </Col>
                                    <Col span={24} style={{ marginTop: "0.5em" }}>
                                        <Col span={1}></Col>
                                        <Col span={22}>
                                            <Col span={5} style={{ marginLeft: "-4.3em" }}><label className="title">Partner URL</label></Col>
                                            <Col span={5} style={{ marginLeft: "3.5em" }}><Input type="text" onChange={this.text} id="website" value={this.state.website} /></Col>
                                            <Col span={1}></Col>
                                            <Col span={5} style={{ marginLeft: "-2.5em" }}><label className="title">State</label></Col>
                                            <Col span={5} style={{ marginLeft: "2.5em" }}><Dropdown width={250} data={states} placeholder=" -- Select State --" select={this.select} id="address" value={this.state.address} /></Col>
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
                                    <Col span={24} style={{ marginTop: "0.5em" }}>
                                        <Col span={1}></Col>
                                        <Col span={22}>
                                            <Col span={5} style={{ marginLeft: "-6em" }}><label className="title">Zip</label></Col>
                                            <Col span={5} style={{ marginLeft: "5.3em" }}><Input type="number" pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}" onChange={this.text} id="zip" value={this.state.zip} /></Col>
                                            <Col span={1}></Col>
                                        </Col>
                                    </Col>
                                    <Col span={24} style={{ marginTop: "0.5em" }}>
                                        <Col span={1}></Col>
                                        <Col span={22}>
                                            <Col span={5} style={{ marginLeft: "-2.2em" }}><label className="title">HP SKUs not Searchable</label></Col>
                                            <Col span={5} style={{ marginLeft: "-7em" }}><Checkbox onChange={this.check} value={this.state.skuSearchable} /></Col>
                                        </Col>
                                    </Col>
                                </div>
                            )}
                            {current === 1 && (
                                <div>
                                    <Col span={24}>
                                        <Col span={7}> <label className="title1">HP Products</label></Col>
                                        <Col span={17}></Col>
                                    </Col>
                                    <Col span={24} style={{ marginTop: "0.5em" }}>
                                        <Col span={1}></Col>
                                        <Col span={22}>
                                            <Col span={5} style={{ marginLeft: "-3.4em" }}><label className="title">SKUs</label></Col>
                                            <Col span={5} style={{ marginLeft: "3.4em" }}><Input type="text" onChange={this.text} id="sku" value={this.state.sku} /></Col>
                                            <Col span={1}></Col>
                                            <Col span={5}><label className="title" style={{ marginLeft: "-1.5em" }}>HP Displayed in Search Results</label></Col>
                                            <Col span={5}><Dropdown width={220} data={searchData} placeholder=" -- Select status --" select={this.select} id="search" value={this.state.search} /></Col>
                                        </Col>
                                    </Col>
                                    <Col span={24} style={{ marginTop: "0.5em" }}>
                                        <Col span={1}></Col>
                                        <Col span={22}>
                                            <Col span={5}><label className="title">Pictures of HP Product</label></Col>
                                            <Col span={5}><Dropdown width={250} data={searchData} placeholder=" -- Select status --" select={this.select} id="picture" value={this.state.picture} /></Col>
                                            <Col span={1}></Col>
                                        </Col>
                                    </Col>
                                    <Col span={24}>
                                        <Col span={1}></Col>
                                        <Col span={22}>
                                            <Divider />
                                        </Col>
                                    </Col>
                                    <Col span={24}>
                                        <Col span={7}> <label className="title1" style={{ marginLeft: "-4em" }}>Non HP Products</label></Col>
                                        <Col span={17}></Col>
                                    </Col>
                                    <Col span={24} style={{ marginTop: "0.5em" }}>
                                        <Col span={1}></Col>
                                        <Col span={22}>
                                            <Col span={7} style={{ marginLeft: "1em" }}><label className="title">Begins Title or Description with "HP" or HP SKU</label></Col>
                                            <Col span={5} style={{ marginLeft: "1em" }}><Input type="text" onChange={this.text} id="begin" value={this.state.begin} /></Col>
                                            <Col span={1}></Col>
                                        </Col>
                                    </Col>
                                </div>
                            )}
                            {current === 2 && (
                                <div>
                                    <Col span={24} style={{ marginTop: "2em" }}>
                                        <Col span={1}></Col>
                                        <Col span={22}>
                                            <Col span={1}></Col>
                                            <Col span={5} style={{ marginLeft: "-2em", marginTop: "0.5em" }}><label className="title">Revenue Threshold</label></Col>
                                            <Col span={5} style={{ marginLeft: "-1.8em" }}><Dropdown width={220} data={thresholdData} placeholder=" -- Select status --" select={this.select} id="thresholdData" value={this.state.thresholdData} /></Col>
                                        </Col>
                                    </Col>
                                    <Col span={24} style={{ marginTop: "2em" }}>
                                        <Col span={5} style={{ marginLeft: "4.5em", marginTop: "0.5em" }}><label className="title">MemberShip Supplies</label></Col>
                                        <Col span={5} style={{ marginLeft: "-3.2em" }}><Dropdown width={220} data={memberShipSupplies} placeholder=" -- Select status --" select={this.select} id="memberShipSupplies" value={this.state.memberShipSupplies} /></Col>
                                        <Col span={1}></Col>
                                    </Col>
                                    <Col span={24}>
                                        <Col span={11}></Col>
                                        <Col span={10} style={{ marginLeft: "3em", marginTop: "-7em" }}>
                                            <div style={{ borderStyle: "dashed", padding: "3em" }}>
                                                <label className="title"> Revenue Threshold for Supplies: $250k</label><br />
                                                <label className="title"> Revenue Threshold for HPS Print: $1K or 4 units </label>
                                            </div>
                                        </Col>
                                    </Col>
                                </div>
                            )}
                            {current === 3 && (
                                <div>
                                    <Col span={24}>
                                        <Col span={7}><label className="title1" style={{ fontSize:'16px' }}>Qualification Status</label></Col>
                                        <Col span={17}></Col>
                                    </Col>
                                    <Col span={24} style={{ marginTop: "0.8em" }}>
                                        <Col span={1}></Col>
                                        <Col span={22}>
                                            <Col span={5}><label className="title" style={{ marginLeft: "-2em" }}>HPS Status</label></Col>
                                            <Col span={5}><Dropdown width={220} data={status} placeholder="-- Select Status --" select={this.select} id="printStatus" value={this.state.printStatus} /></Col>
                                            <Col span={1}></Col>
                                            <Col span={5} style={{ marginLeft: "-1em" }}><label className="title">Expiration Date</label></Col>
                                            <Col span={5}><DatePicker style={{width:220, marginLeft:'2em'}} format={'MM/DD/YYYY'} onChange={this.change} value={this.state.date !== "" ? moment(this.state.date) : null} /></Col>
                                        </Col>
                                    </Col>
                                    <Col span={24} style={{ marginTop: "0.5em" }}>
                                        <Col span={1}></Col>
                                        <Col span={22}>
                                            <Col span={5}><label className="title">Supplies Status</label></Col>
                                            <Col span={5}><Dropdown width={220} data={status} placeholder="-- Select Status --" select={this.select} id="suppliesStatus" value={this.state.suppliesStatus} /></Col>
                                            <Col span={1}></Col>
                                            <Col span={5}><label className="title" style={{ marginLeft: "-4.5em" }}>Note Type</label></Col>
                                            <Col span={5}>
                                                <Dropdown width={220} data={noteType} placeholder="-- Select Status --" select={this.select} id="noteType" value={this.state.noteType} />
                                            </Col>
                                        </Col>
                                    </Col>
                                    <Col span={24} style={{ marginTop: "0.5em" }}>
                                           <Col span={1}></Col>
                                           <Col span={5} style={{marginLeft:'-2em'}}><label className="title">PC Status</label></Col>
                                           <Col span={5} style={{marginLeft:'-0.5em'}}><Dropdown width={220} data={status} placeholder="-- Select Status --" select={this.select} id="pcStatus" value={this.state.pcStatus} /></Col>
                                           <Col span={1}></Col>
                                           <Col span={5} style={{marginLeft:'-3.6em'}}><label className="title">OPS Status</label></Col>
                                           <Col span={5}><Dropdown width={220} data={status} placeholder="-- Select Status --" select={this.select} id="opsStatus" value={this.state.opsStatus} /></Col>
                                    </Col>
                                    <Col span={24} style={{ marginTop: "0.5em", display: this.state.display }}>
                                        <Col span={1}></Col>
                                        <Col span={22}>
                                            <Col span={5}></Col>
                                            <Col span={5}></Col>
                                            <Col span={1}></Col>
                                            <Col span={5}><label className="title" style={{ marginLeft: "-6.5em" }}>Notes:</label></Col>
                                            <Col span={7} style={{marginLeft:'1.2em'}}>
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
                                    <Col span={24} style={{ marginTop: "0.5em" }}>
                                        <Col span={1}></Col>
                                        <Col span={22}>
                                            <Col span={5}><label className="title">Reveiw Status</label></Col>
                                            <Col span={5}><Dropdown width={220} data={reviewData} placeholder="Open" select={this.select} id="reviewStatus" value={this.state.reviewStatus} /></Col>
                                            <Col span={1}></Col>
                                            <Col span={5}><label className="title" style={{ marginLeft: "-2.5em" }}>Account Status</label></Col>
                                            <Col span={5}><Dropdown width={220} data={accounStatus} placeholder="-- Select Account Status --" select={this.select} id="accounStatus" value={this.state.accounStatus} /></Col>
                                        </Col>
                                    </Col>
                                </div>
                            )}
                        </div>
                        <div className="steps-action">
                            {current < steps.length - 1 && (
                                <Button type="primary" onClick={() => this.next()}>
                                    Next
                                </Button>
                            )}
                            {current === steps.length - 1 && (
                                <Button style={{ backgroundColor: "#5cb85c", color: "#fff" }} onClick={this.done}>
                                    Submit
                                </Button>
                            )}
                            {current > 0 && (
                                <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
                                    Previous
                                </Button>
                            )}
                        </div>
                    </Col>
                </Col>
            </div>
        );
    }
}

export default Audit;
