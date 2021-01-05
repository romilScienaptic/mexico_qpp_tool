import React from "react";
import "./home.scss";
import "antd/dist/antd.css";
import { Table, Input, Col, Popconfirm, Form, Button, Icon, Select, Row, Tooltip, message, Checkbox, Divider } from "antd";
import Dropdown from '../../Components/Select/select';
import Download from '../../Components/Download/csvDownload';
import axios from "axios";
import Highlighter from 'react-highlight-words';
import Loading from '../../Components/Loading/loading';
import Hp from '../../assets/images/Hp.png';

const printStatus = ["Calificado", "Certificado", "No Calificado", "TBD"];

const EditableContext = React.createContext();
const { Option } = Select;
const { Search } = Input;

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
    if (this.props.dataIndex === "HPS Status" ||
      this.props.dataIndex === "Supplies Status" ||
      this.props.dataIndex === "PC Status" ||
      this.props.dataIndex === "OPS Status") {
      return <Select style={{ width: 140 }}>
        <Option value="Calificado">Calificado</Option>
        <Option value="Certificado">Certificado</Option>
        <Option value="No Calificado">No Calificado</Option>
        <Option value="TBD">TBD</Option>
      </Select>
    }
    if (this.props.dataIndex === "Revenue Monitoring Flag") {
      return <Checkbox
        checked={revenue_flag !== '' ? revenue_flag : this.props.record["Revenue Monitoring Flag"]}
        onChange={this.check}
      />
    }
    if (this.props.dataIndex === "Persona Fisica/Moral") {
      return <Select style={{ width: 140 }}>
        <Option value="Persona Fisica">Persona Fisica</Option>
        <Option value="Persona Moral">Persona Moral</Option>
        <Option value="None">None</Option>
      </Select>
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

class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      policy: [],
      rfc: sessionStorage.getItem('rfc') !== null ? sessionStorage.getItem('rfc') : '',
      account: sessionStorage.getItem('account') !== null ? sessionStorage.getItem('account') : '',
      editingKey: "",
      flag: true,
      dateEdit: '',
      visible: false,
      dataRecevied: true,
      location: sessionStorage.getItem('lid') !== null ? sessionStorage.getItem('lid') : '',
      legal: sessionStorage.getItem('legalName') !== null ? sessionStorage.getItem('legalName') : '',
      category: sessionStorage.getItem('category') !== null ? sessionStorage.getItem('category') : '',
      printStatusValue: sessionStorage.getItem('printStatusValue') !== null ? sessionStorage.getItem('printStatusValue') : '',
      suppliesStatusValue: sessionStorage.getItem('suppliesStatusValue') !== null ? sessionStorage.getItem('suppliesStatusValue') : '',
      show: false,
      email: '',
      backupData: [],
      downloadData: [],
      selectedRowKeys: [],
      loading: false,
      downloadData: [],
      load: true,
      productCategory: 'Total Revenue',
      search: sessionStorage.getItem('search') !== null ? sessionStorage.getItem('search') : ''
    };

  }

  account = (event) => {
    sessionStorage.setItem('accountName', event.target.id);
    this.props.history.push('/revenue');
  }

  handleSearch = (selectedKeys, confirm) => {
    confirm();
    this.setState({ searchText: selectedKeys[0] });
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: '' });
  };

  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
          Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: text => (
      <Highlighter
        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
        searchWords={[this.state.searchText]}
        autoEscape
      // textToHighlight={text.toString()}
      />
    ),
  });

  componentDidMount() {
    // document.title = 'Qualified Partner Program';
    if (sessionStorage.getItem('category') !== null ||
      sessionStorage.getItem('printStatusValue') !== null ||
      sessionStorage.getItem('suppliesStatusValue') !== null ||
      sessionStorage.getItem('legal') !== null ||
      sessionStorage.getItem('lid') !== null ||
      sessionStorage.getItem('account') !== null ||
      sessionStorage.getItem('rfc') !== null) {
      this.download();
      this.filter();
    }
    else if (sessionStorage.getItem('search') !== null) {
      this.download();
      this.onsearch(sessionStorage.getItem('search'));
    }
    else {
      dataPacket = [];
      return new Promise((resolve, reject) => {
        axios.get(process.env.REACT_APP_DOMAIN + '/qpp/get/all/qpp')
          .then(response => {
            response.data.result.map((data, i) => {
              dataPacket.push({
                key: data.id,
                account: data.account !== undefined ? data.account : '',
                location_id: data.hpiLocationId !== undefined ? data.hpiLocationId : '',
                "RFC/Tax ID": data.rfcOrTaxId !== null ? data.rfcOrTaxId : '',
                "HPS Status": data.hpsStatus !== undefined ? data.hpsStatus : '',
                "Supplies Status": data.suppliesStatus !== undefined ? data.suppliesStatus : '',
                totalRevenue: data.totalRevenue !== undefined ? data.totalRevenue : '',
                rfc: data.rfc !== undefined ? data.rfc : '',
                legalBusinessName: data.legalBusinessName !== undefined ? data.legalBusinessName : '',
                locationId: data.locationId !== undefined ? data.locationId : '',
                commercialConsumer: data.commercialConsumer !== undefined ? data.commercialConsumer : '',
                relantionship: data.relationShip !== undefined ? data.relationShip : '',
                comment: data.comment !== undefined ? data.comment : '',
                existingAccount: data.account !== undefined ? data.account : '',
                "Persona Fisica/Moral": data.personaFisicaOrMoral !== undefined ? data.personaFisicaOrMoral : '',
                "PC Status": data.pcStatus !== undefined ? data.pcStatus : '',
                "OPS Status": data.opsStatus !== undefined ? data.opsStatus : '',
                "Revenue Monitoring Flag": data.revenueMonitoringFlag === 1 ? true : false
              })
            })
            this.setState({
              data: dataPacket,
              backupData: dataPacket,
              load: false
            }, () => this.download())
            // , ()=> this.download()
          })
          .catch(error => {
            this.setState({
              dataRecevied: true,
              load: false
            })
            window.location.hash = "/";
          })
      })
    }

  }

  download = () => {
    return new Promise((resolve, reject) => {
      axios.get(process.env.REACT_APP_DOMAIN + '/qpp/download/all/details')
        .then(response => {
          this.setState({
            downloadData: response.data.result,
            backupDownload: response.data.result,
          }, () => this.getUserName())
        })
        .catch(function (error) {
          window.location.hash = "/";
        })
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
        .catch(error => {
          this.setState({
            dataRecevied: true
          })
          window.location.hash = "/";
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
      const newData = [...this.state.data];
      const index = newData.findIndex(item => key === item.key);
      if (index > -1) {
        newData[index].role = this.state.dateEdit;
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row
        });
        return new Promise((resolve, reject) => {
          axios.put(process.env.REACT_APP_DOMAIN + '/qpp/update/account_status/' + item.key,
            {
              // "id": item.key,
              "account": row.account,
              "hpsStatus": row["HPS Status"],
              "suppliesStatus": row["Supplies Status"],
              "comment": row.comment,
              "legalName": row.legalBusinessName,
              "existingAccount": item.account,
              "personaFisicaOrMoral": row["Persona Fisica/Moral"],
              "pcStatus": row["PC Status"],
              "opsStatus": row["OPS Status"],
              "revenueMonitoringFlag": row["Revenue Monitoring Flag"] === true ? 1 : 0
            })
            .then(response => {
              if (response.status === 200) {
                revenue_flag = '';
                this.setState({
                  data: newData,
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
        this.setState({ data: newData, editingKey: "" });
      }
    });
  }

  delete(key) {
    const newData = [...this.state.data];
    const index = newData.findIndex(item => key === item.key);
    if (index > -1) {
      const item = newData[index];
      newData.splice(index, 1);
      this.setState({
        data: newData,
        editingKey: "",
        dataRecevied: false
      });

    } else {
      this.setState({ data: newData, editingKey: "" });
    }

  }

  edit(key) {
    this.setState({ editingKey: key, flag: false, editFlag: true });
  }

  select = (value, id) => {
    if (id === "printStatusValue") {
      this.setState({
        printStatusValue: value
      })
    }
    else if (id === 'suppliesStatusValue') {
      this.setState({
        suppliesStatusValue: value
      })
    }
    else if (id === 'category') {
      this.setState({
        category: value,
        productCategory: ''
      })
    }
  }

  text = (event) => {
    if (event.target.id === 'rfc') {
      this.setState({
        rfc: event.target.value
      })
    }
    else if (event.target.id === 'account') {
      this.setState({
        account: event.target.value
      })
    }
    else if (event.target.id === 'legal') {
      this.setState({
        legal: event.target.value
      })
    }
    else if (event.target.id === 'location') {
      this.setState({
        location: event.target.value
      })
    }
    else if (event.target.id === 'search') {
      this.setState({
        search: event.target.value
      })
    }
  }

  multipleSelectfilter = (selectedItems, event) => {
    this.setState({
      masterlife: selectedItems
    })
  }

  multipleSelect = (selectedItems, event) => {
    this.setState({
      accountValue: selectedItems
    })
  }

  pickDate = (date, dateString, id) => {
    if (id === "embargo_date") {
      this.setState({
        embargo_date: dateString
      })
    }
    else if (id === "ad_date") {
      this.setState({
        ad_date: dateString
      })
    }
  }

  refresh = () => {
    sessionStorage.clear();
    this.setState({
      load: true,
      rfc: '',
      account: '',
      suppliesStatusValue: '',
      printStatusValue: '',
      category: '',
      location: '',
      legal: '',
      search: '',
      productCategory: 'Total Revenue'
    })
    dataPacket = [];
    return new Promise((resolve, reject) => {
      axios.get(process.env.REACT_APP_DOMAIN + '/qpp/get/all/qpp')
        .then(response => {
          response.data.result.map((data, i) => {
            dataPacket.push({
              key: data.id,
              account: data.account !== undefined ? data.account : '',
              location_id: data.hpiLocationId !== undefined ? data.hpiLocationId : '',
              "RFC/Tax ID": data.rfcOrTaxId !== null ? data.rfcOrTaxId : '',
              "HPS Status": data.hpsStatus !== undefined ? data.hpsStatus : '',
              "Supplies Status": data.suppliesStatus !== undefined ? data.suppliesStatus : '',
              totalRevenue: data.totalRevenue !== undefined ? data.totalRevenue : '',
              rfc: data.rfc !== undefined ? data.rfc : '',
              legalBusinessName: data.legalBusinessName !== undefined ? data.legalBusinessName : '',
              locationId: data.locationId !== undefined ? data.locationId : '',
              commercialConsumer: data.commercialConsumer !== undefined ? data.commercialConsumer : '',
              relantionship: data.relationShip !== undefined ? data.relationShip : '',
              comment: data.comment !== undefined ? data.comment : '',
              existingAccount: data.account !== undefined ? data.account : '',
              "Persona Fisica/Moral": data.personaFisicaOrMoral !== undefined ? data.personaFisicaOrMoral : '',
              "PC Status": data.pcStatus !== undefined ? data.pcStatus : '',
              "OPS Status": data.opsStatus !== undefined ? data.opsStatus : '',
              "Revenue Monitoring Flag": data.revenueMonitoringFlag === 1 ? true : false
            })
          })
          this.setState({
            data: dataPacket,
            load: false,
          })
        })
        .catch(error => {
          window.location.hash = "/";
        })
    })
  }

  onsearch = (value) => {
    sessionStorage.setItem('search', value);
    dataPacket = [];
    this.setState({
      load: true,
      account: '',
      suppliesStatusValue: '',
      printStatusValue: '',
      location: '',
      legal: '',
      category: '',
      rfc: ''
    })
    return new Promise((resolve, reject) => {
      axios.get(process.env.REACT_APP_DOMAIN + '/qpp/account/' + value)
        .then(response => {
          response.data.result.map((data, i) => {
            dataPacket.push({
              key: data.id,
              account: data.account !== undefined ? data.account : '',
              location_id: data.hpiLocationId !== undefined ? data.hpiLocationId : '',
              "RFC/Tax ID": data.rfcOrTaxId !== null ? data.rfcOrTaxId : '',
              "HPS Status": data.hpsStatus !== undefined ? data.hpsStatus : '',
              "Supplies Status": data.suppliesStatus !== undefined ? data.suppliesStatus : '',
              totalRevenue: data.totalRevenue !== undefined ? data.totalRevenue : '',
              rfc: data.rfc !== undefined ? data.rfc : '',
              legalBusinessName: data.legalBusinessName !== undefined ? data.legalBusinessName : '',
              locationId: data.locationId !== undefined ? data.locationId : '',
              commercialConsumer: data.commercialConsumer !== undefined ? data.commercialConsumer : '',
              relantionship: data.relationShip !== undefined ? data.relationShip : '',
              comment: data.comment !== undefined ? data.comment : '',
              existingAccount: data.account !== undefined ? data.account : '',
              "Persona Fisica/Moral": data.personaFisicaOrMoral !== undefined ? data.personaFisicaOrMoral : '',
              "PC Status": data.pcStatus !== undefined ? data.pcStatus : '',
              "OPS Status": data.opsStatus !== undefined ? data.opsStatus : '',
              "Revenue Monitoring Flag": data.revenueMonitoringFlag === 1 ? true : false
            })
          })
          this.setState({
            data: dataPacket,
            backupData: dataPacket,
            load: false
          })
        })
        .catch(function (error) {
          message.error('Server is down! Please try again later.');
        })
    })
  }

  filter = () => {
    dataPacket = [];
    sessionStorage.setItem('printStatusValue', this.state.printStatusValue);
    sessionStorage.setItem('suppliesStatusValue', this.state.suppliesStatusValue);
    sessionStorage.setItem('category', this.state.category);
    sessionStorage.setItem('account', this.state.account);
    sessionStorage.setItem('legalName', this.state.legal);
    sessionStorage.setItem('rfc', this.state.rfc);
    sessionStorage.setItem('lid', this.state.location);
    this.setState({
      load: true,
      search: ''
    })
    return new Promise((resolve, reject) => {
      axios.post(process.env.REACT_APP_DOMAIN + '/qpp/search_by_fields',
        {
          "account": this.state.account,
          "legalName": this.state.legal,
          "lid": this.state.location,
          "printStatus": this.state.printStatusValue,
          "productCategory": this.state.category,
          "rfc": this.state.rfc,
          "supplyStatus": this.state.suppliesStatusValue
        })
        .then(response => {
          response.data.result.map((data, i) => {
            dataPacket.push({
              key: data.id,
              account: data.account !== undefined ? data.account : '',
              location_id: data.hpiLocationId !== undefined ? data.hpiLocationId : '',
              "RFC/Tax ID": data.rfcOrTaxId !== null ? data.rfcOrTaxId : '',
              "HPS Status": data.hpsStatus !== undefined ? data.hpsStatus : '',
              "Supplies Status": data.suppliesStatus !== undefined ? data.suppliesStatus : '',
              totalRevenue: data.totalRevenue !== undefined ? data.totalRevenue : '',
              rfc: data.rfc !== undefined ? data.rfc : '',
              legalBusinessName: data.legalBusinessName !== undefined ? data.legalBusinessName : '',
              locationId: data.locationId !== undefined ? data.locationId : '',
              commercialConsumer: data.commercialConsumer !== undefined ? data.commercialConsumer : '',
              relantionship: data.relationShip !== undefined ? data.relationShip : '',
              comment: data.comment !== undefined ? data.comment : '',
              existingAccount: data.account !== undefined ? data.account : '',
              "Persona Fisica/Moral": data.personaFisicaOrMoral !== undefined ? data.personaFisicaOrMoral : '',
              "PC Status": data.pcStatus !== undefined ? data.pcStatus : '',
              "OPS Status": data.opsStatus !== undefined ? data.opsStatus : '',
              "Revenue Monitoring Flag": data.revenueMonitoringFlag === 1 ? true : false
            })
          })
          this.setState({
            data: dataPacket,
            backupData: dataPacket,
            load: false,
            dataRecevied: true
          })
        })
        .catch(function (error) {
          message.error('Server is Down. Please try Later!');
        })
    })
  }

  render() {
    this.columns = [
      {
        title: "Homologated Name ",
        dataIndex: "account",
        editable: true,
        render: (text) => {
          return (
            <span style={{ cursor: "pointer !important" }}><label id={text} onClick={this.account} style={{ color: '#0095d9', fontWeight: '600', cursor: 'pointer' }}>{text}</label></span>
          )
        }

      },
      {
        title: "Legal Name",
        dataIndex: "legalBusinessName",
        editable: true,
        width: 300,
        render: text => <label style={{ cursor: 'pointer !important' }}>{text}</label>
      },
      {
        title: "RFC",
        dataIndex: "RFC/Tax ID",
        editable: false,
        align: 'center'
      },
      {
        title: "Location ID",
        dataIndex: "locationId",
        editable: false,
        align: 'center'
      },
      {
        title: "Commercial/Consumer",
        dataIndex: "commercialConsumer",
        editable: false,
        align: 'center'
      },
      {
        title: "Relationship",
        dataIndex: "relantionship",
        editable: false,
        align: 'center'
      },
      {
        title: this.state.productCategory === 'Total Revenue' ? 'Total Revenue' : 'Revenue (' + this.state.category + ')',
        dataIndex: "totalRevenue",
        editable: false,
        align: 'center',
        render: (text) => {
          return {
            children: <label style={{ cursor: "pointer", border: "none", backgroundColor: "#fff" }}>{text}</label>,
          };
        },
      },
      {
        title: "HPS Status",
        dataIndex: "HPS Status",
        editable: true,
        align: 'center'
      },
      {
        title: "Supplies Status",
        dataIndex: "Supplies Status",
        editable: true,
        align: 'center'
      },
      {
        title: "PC Status",
        dataIndex: "PC Status",
        editable: true,
        align: 'center'
      },
      {
        title: "OPS Status",
        dataIndex: "OPS Status",
        editable: true,
        align: 'center'
      },
      {
        title: "Persona Fisica/Moral",
        dataIndex: "Persona Fisica/Moral",
        editable: true,
        align: 'center'
      },
      {
        title: "Revenue Monitoring Flag",
        dataIndex: "Revenue Monitoring Flag",
        editable: true,
        align: 'center',
        //  render: text => <label>{text}</label>
        render: text => <Checkbox checked={text} />
      },
      {
        title: "Comments/Notes",
        dataIndex: "comment",
        editable: true
      },
      {
        title: "",
        dataIndex: "operation",
        width: "10%",
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
                <a
                  disabled={editingKey !== ""}
                  onClick={() => this.edit(record.key)}
                ><Icon type="edit" theme="filled" />
                  Edit
              </a>
                {/* <span style={{ marginLeft: "2em" }}></span>
                <Popconfirm
                  title="Sure to Delete?"
                  icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
                  onConfirm={() => this.delete(record.key)}
                >
                  <a
                  // onClick={() => this.delete(record.key)}
                  ><Icon type="close-circle" theme="filled" />
                    Delete
              </a>
                </Popconfirm> */}
              </div>
            );
        }
      },
    ];

    let rowIndex = (record) => {
      sessionStorage.setItem('taxID', record["RFC/Tax ID"]);
      sessionStorage.setItem('id', record["key"]);
    }

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
          <Col span={10}></Col>
          <Col span={3} style={{ marginTop: "2.2%", fontSize: "16px", color: "#0095d9", fontWeight: 600 }}><label style={{ cursor: "pointer" }}>Welcome: </label><strong>{this.state.userName}</strong></Col>
        </Col>
        <Col span={24}>
          <Col span={1}></Col>
          <Col span={17}></Col>
          <Col span={5}><Search placeholder="Enter Keyword here" onSearch={this.onsearch} value={this.state.search} onChange={this.text} id="search" /></Col>
        </Col>
        <Col span={24} style={{ marginTop: "0sem" }}>
          <Col span={1}></Col>
          <Col span={22}><Divider /></Col>
        </Col>
        <Col span={24}>
          <Col span={2}></Col>
          <Col span={5} style={{ marginTop: "-2.5em", marginLeft: "1em" }}><span style={{ color: "#0095d9", fontSize: "12px" }}></span></Col>
        </Col>
        <Button style={{ color: "#0095d9", marginLeft: "85%", fontWeight: 600 }} onClick={this.addNew}></Button>
        <div>
          <Row style={{ marginTop: "-1.5em" }}>
            <Col span={24} style={{ marginTop: '-1em' }}>
              <Col span={1}></Col>
              <Col span={1} style={{ marginTop: '-0.5em' }}><label>Homologated Name</label></Col>
              <Col span={3} style={{ marginLeft: "2em" }}><Input style={{ marginTop: "-1em" }} allowClear id="account" onChange={this.text} value={this.state.account} /></Col>
              <Col span={1}></Col>
              <Col span={1} style={{ marginLeft: "-2em" }}><label>RFC</label></Col>
              <Col span={3}><Input style={{ marginTop: "-1em", marginLeft: "-1em" }} allowClear id="rfc" onChange={this.text} value={this.state.rfc}></Input></Col>
              <Col span={1}></Col>
              <Col span={3} style={{ marginLeft: "1.5em" }}><label>HPS Status</label></Col>
              <Col span={3} style={{ marginTop: "-0.5em", marginLeft: "-7em" }}><Dropdown allowClear data={printStatus} placeholder={"--Select Status--"} width={210} id="printStatusValue" value={this.state.printStatusValue} select={this.select} /></Col>
              <Col span={1}></Col>
              <Col span={3} style={{ marginLeft: "2em" }}><label>Supplies Status</label></Col>
              <Col span={3} style={{ marginTop: "-2.1em", marginLeft: "14em" }}><Dropdown allowClear data={printStatus} placeholder={"--Select Status--"} width={210} id="suppliesStatusValue" value={this.state.suppliesStatusValue} select={this.select} /></Col>
            </Col>
          </Row>
          <Row style={{ marginTop: "1em" }}>
            <Col span={24}>
              <Col span={1}></Col>
              <Col span={1} style={{ width: "10.5em" }}><label>Legal Name</label></Col>
              <Col span={3}><Input style={{ marginTop: "-1em", marginLeft: "-4.1em" }} allowClear id="legal" onChange={this.text} value={this.state.legal} /></Col>
              <Col span={1}></Col>
              <Col span={2} style={{ marginLeft: "-8em" }}><label>Location ID</label></Col>
              <Col span={3}><Input style={{ marginTop: "-1em", marginLeft: "-3.5em" }} allowClear id="location" onChange={this.text} value={this.state.location}></Input></Col>
              <Col span={1}></Col>
              <Col span={3} style={{ marginLeft: "-3em" }}><label>Product Category</label></Col>
              <Col span={3} style={{ marginTop: "-0.5em", marginLeft: "-5em" }}><Dropdown allowClear data={["HPS", "Supplies", "PC", "OPS"]} placeholder={"--Select Category--"} width={210} id="category" value={this.state.category} select={this.select} /></Col>
              <Col span={1}></Col>
              <Col span={1} style={{ marginTop: "-0.6em" }}><Button type="primary" onClick={this.filter} style={{ marginLeft: "2em" }} icon="search">Search</Button></Col>
              <Col span={1}></Col>
              <Col span={2} style={{ marginTop: "-0.3em", marginLeft: '1em' }}><Tooltip placement="top" title="Refresh"><span style={{ color: "#0095d9", fontSize: "16px", cursor: "pointer" }} onClick={this.refresh}>Clear All</span></Tooltip></Col>
            </Col>
          </Row>
        </div><br />
        <Col span={24} style={{ marginTop: "-2em" }}>
          <Col span={1}></Col>
          <Col span={22}><Divider /></Col>
        </Col>
        <Col span={24} style={{ marginTop: "-1em" }}>
          <Col span={21}></Col>
          <Col span={2}>
            <Download data={this.state.downloadData} fileName={"Qualified Partner List.csv"} />
          </Col>
        </Col>
        <div style={{ margin: "3em", marginTop: "2.5em", backgroundColor: "#fff" }}>
          <EditableContext.Provider value={this.props.form}>
            <Table
              components={components}
              bordered
              dataSource={this.state.data}
              columns={columns}
              loading={this.state.load}
              // rowClassName="editable-row"
              className="table-striped-rows"
              pagination={{
                pageSize: 50
              }}
              onRow={(record) => ({ onClick: () => { rowIndex(record); } })}
              rowClassName={(record, index) => index % 2 === 0 ? 'table-row-light' : 'table-row-dark'}
              scroll={{ x: 'max-content' }}
            />
          </EditableContext.Provider>
          <Col span={24}>
            <Col span={21}></Col>
          </Col>
        </div>
      </div>
    ) : (<Loading status={this.state.dataRecevied} />)
    );
  }
}

const EditableFormTable = Form.create()(EditableTable);

export default EditableFormTable;
