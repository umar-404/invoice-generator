import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import InvoiceItem from './InvoiceItem';
import InvoiceModal from './InvoiceModal';
import InputGroup from 'react-bootstrap/InputGroup';

class InvoiceForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      currency: '$',
      currentDate: '',
      invoiceNumber: 1,
      dateOfIssue: '',
      billTo: '',
      billToEmail: '',
      billToAddress: '',
      billFrom: '',
      billFromEmail: '',
      billFromAddress: '',
      notes: '',
      total: '0.00',
      subTotal: '0.00',
      taxRate: '',
      taxAmmount: '0.00',
      discountRate: '',
      discountAmmount: '0.00'
    };
    this.state.items = [
      {
        id: 0,
        name: '',
        description: '',
        price: '1.00',
        quantity: 1
      }
    ];
    this.editField = this.editField.bind(this);
  }
  componentDidMount(prevProps) {
    this.handleCalculateTotal()
  }
  handleRowDel(items) {
    var index = this.state.items.indexOf(items);
    this.state.items.splice(index, 1);
    this.setState(this.state.items);
  };
  handleAddEvent(evt) {
    var id = (+ new Date() + Math.floor(Math.random() * 999999)).toString(36);
    var items = {
      id: id,
      name: '',
      price: '1.00',
      description: '',
      quantity: 1
    }
    this.state.items.push(items);
    this.setState(this.state.items);
  }
  handleCalculateTotal() {
    var items = this.state.items;
    var subTotal = 0;

    items.forEach(function(item) {
      subTotal = subTotal + (parseFloat(item.price).toFixed(2) * parseInt(item.quantity));
    });

    var taxAmount = parseFloat(subTotal * (this.state.taxRate / 100)).toFixed(2);
    var discountAmount = parseFloat(subTotal * (this.state.discountRate / 100)).toFixed(2);
    var total = (subTotal - parseFloat(discountAmount)) + parseFloat(taxAmount);

    this.setState({
      subTotal: subTotal.toFixed(2),
      taxAmmount: taxAmount,
      discountAmmount: discountAmount,
      total: total.toFixed(2)
    });
  };
  onItemizedItemEdit(evt) {
    var item = {
      id: evt.target.id,
      name: evt.target.name,
      value: evt.target.value
    };
    var items = this.state.items.slice();
    var newItems = items.map(function(items) {
      for (var key in items) {
        if (key === item.name && items.id.toString() === item.id) {
          items[key] = item.value;
        }
      }
      return items;
    });
    this.setState({items: newItems});
    this.handleCalculateTotal();
  };
  editField = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
    this.handleCalculateTotal();
  };
  onCurrencyChange = (selectedOption) => {
    this.setState(selectedOption);
  };
  openModal = (event) => {
    event.preventDefault()
    this.handleCalculateTotal()
    this.setState({isOpen: true})
  };
  closeModal = (event) => this.setState({isOpen: false});
  render() {
    return (<Form onSubmit={this.openModal}>
      {/* Header Section */}
      <div className="invoice-header mb-4 p-4 rounded">
        <Row className="align-items-center">
          <Col md={4}>
            <div className="brand-text">
              <span className="fw-bold fs-4">INVOICE</span>
              <span className="brand-accent">GENERATOR</span>
            </div>
          </Col>
          <Col md={8} className="text-end">
            <div className="header-meta">
              <div className="d-inline-flex align-items-center me-4">
                <span className="text-secondary me-2 fw-semibold">Invoice</span>
                <span className="invoice-number-badge">#{this.state.invoiceNumber}</span>
              </div>
              <div className="d-inline-flex align-items-center">
                <span className="text-secondary me-2 fw-semibold">Date</span>
                <Form.Control
                  type="date"
                  value={this.state.dateOfIssue}
                  name={"dateOfIssue"}
                  onChange={(event) => this.editField(event)}
                  className="date-input d-inline-block w-auto"
                  required="required"/>
              </div>
            </div>
          </Col>
        </Row>
      </div>

      <Row>
        {/* Main Content - Left Side */}
        <Col md={8} lg={9}>
          {/* Party Details Card */}
          <Card className="p-4 mb-4">
            <div className="party-sections">
              <Row>
                <Col md={6}>
                  <div className="party-box bill-to-box">
                    <div className="party-header">
                      <span className="party-icon">→</span>
                      <span className="fw-bold">Bill To</span>
                    </div>
                    <Form.Control
                      placeholder={"Client Name"}
                      rows={1}
                      value={this.state.billTo}
                      type="text"
                      name="billTo"
                      className="party-input mb-2"
                      onChange={(event) => this.editField(event)}
                      autoComplete="name"
                      required="required"/>
                    <Form.Control
                      placeholder={"Email Address"}
                      value={this.state.billToEmail}
                      type="email"
                      name="billToEmail"
                      className="party-input mb-2"
                      onChange={(event) => this.editField(event)}
                      autoComplete="email"
                      required="required"/>
                    <Form.Control
                      placeholder={"Billing Address"}
                      value={this.state.billToAddress}
                      type="text"
                      name="billToAddress"
                      className="party-input"
                      autoComplete="address"
                      onChange={(event) => this.editField(event)}
                      required="required"/>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="party-box bill-from-box">
                    <div className="party-header">
                      <span className="party-icon">←</span>
                      <span className="fw-bold">Bill From</span>
                    </div>
                    <Form.Control
                      placeholder={"Your Name"}
                      rows={1}
                      value={this.state.billFrom}
                      type="text"
                      name="billFrom"
                      className="party-input mb-2"
                      onChange={(event) => this.editField(event)}
                      autoComplete="name"
                      required="required"/>
                    <Form.Control
                      placeholder={"Email Address"}
                      value={this.state.billFromEmail}
                      type="email"
                      name="billFromEmail"
                      className="party-input mb-2"
                      onChange={(event) => this.editField(event)}
                      autoComplete="email"
                      required="required"/>
                    <Form.Control
                      placeholder={"Your Address"}
                      value={this.state.billFromAddress}
                      type="text"
                      name="billFromAddress"
                      className="party-input"
                      autoComplete="address"
                      onChange={(event) => this.editField(event)}
                      required="required"/>
                  </div>
                </Col>
              </Row>
            </div>
          </Card>

          {/* Items Card */}
          <Card className="p-4 mb-4">
            <div className="items-header mb-3">
              <span className="fw-bold text-uppercase">Line Items</span>
            </div>
            <InvoiceItem
              onItemizedItemEdit={this.onItemizedItemEdit.bind(this)}
              onRowAdd={this.handleAddEvent.bind(this)}
              onRowDel={this.handleRowDel.bind(this)}
              currency={this.state.currency}
              items={this.state.items}/>
          </Card>

          {/* Notes Card */}
          <Card className="p-4">
            <Form.Label className="fw-bold text-uppercase">Notes</Form.Label>
            <Form.Control
              placeholder="Thanks for your business!"
              name="notes"
              value={this.state.notes}
              onChange={(event) => this.editField(event)}
              as="textarea"
              className="notes-input"
              rows={2}/>
          </Card>
        </Col>

        {/* Sidebar - Right Side */}
        <Col md={4} lg={3}>
          <div className="sticky-top pt-md-3 pt-xl-4">
            {/* Summary Card */}
            <Card className="p-3 mb-3 summary-card">
              <div className="summary-row">
                <span className="text-secondary">Subtotal</span>
                <span className="fw-semibold">{this.state.currency}{this.state.subTotal}</span>
              </div>
              <div className="summary-row">
                <span className="text-secondary">Discount</span>
                <span className="fw-semibold">
                  <span className="small percentage">({this.state.discountRate || 0}%)</span>
                  -{this.state.currency}{this.state.discountAmmount || 0}
                </span>
              </div>
              <div className="summary-row">
                <span className="text-secondary">Tax</span>
                <span className="fw-semibold">
                  <span className="small percentage">({this.state.taxRate || 0}%)</span>
                  {this.state.currency}{this.state.taxAmmount || 0}
                </span>
              </div>
              <hr className="my-2"/>
              <div className="summary-row total-row">
                <span className="fw-bold">Total</span>
                <span className="fw-bold total-amount">{this.state.currency}{this.state.total || 0}</span>
              </div>
            </Card>

            {/* Review Button */}
            <Button variant="primary" type="submit" className="d-block w-100 review-btn mb-3">
              Review Invoice
            </Button>

            <InvoiceModal
              showModal={this.state.isOpen}
              closeModal={this.closeModal}
              info={this.state}
              items={this.state.items}
              currency={this.state.currency}
              subTotal={this.state.subTotal}
              taxAmmount={this.state.taxAmmount}
              discountAmmount={this.state.discountAmmount}
              total={this.state.total}/>

            {/* Settings Card */}
            <Card className="p-3 settings-card">
              <div className="setting-group mb-3">
                <Form.Label className="fw-bold text-uppercase">Currency</Form.Label>
                <Form.Select
                  onChange={event => this.onCurrencyChange({currency: event.target.value})}
                  className="currency-select"
                  aria-label="Change Currency">
                  <option value="$">$ USD</option>
                  <option value="£">£ GBP</option>
                  <option value="¥">¥ JPY</option>
                  <option value="$">$ CAD</option>
                  <option value="$">$ AUD</option>
                  <option value="$">$ SGD</option>
                  <option value="¥">¥ CNY</option>
                  <option value="₿">₿ BTC</option>
                </Form.Select>
              </div>

              <div className="setting-group mb-3">
                <Form.Label className="fw-bold text-uppercase">Tax Rate</Form.Label>
                <InputGroup className="flex-nowrap">
                  <Form.Control
                    name="taxRate"
                    type="number"
                    value={this.state.taxRate}
                    onChange={(event) => this.editField(event)}
                    className="rate-input"
                    placeholder="0.0"
                    min="0.00"
                    step="0.01"
                    max="100.00"/>
                  <InputGroup.Text className="rate-suffix">%</InputGroup.Text>
                </InputGroup>
              </div>

              <div className="setting-group">
                <Form.Label className="fw-bold text-uppercase">Discount Rate</Form.Label>
                <InputGroup className="flex-nowrap">
                  <Form.Control
                    name="discountRate"
                    type="number"
                    value={this.state.discountRate}
                    onChange={(event) => this.editField(event)}
                    className="rate-input"
                    placeholder="0.0"
                    min="0.00"
                    step="0.01"
                    max="100.00"/>
                  <InputGroup.Text className="rate-suffix">%</InputGroup.Text>
                </InputGroup>
              </div>
            </Card>
          </div>
        </Col>
      </Row>
    </Form>)
  }
}

export default InvoiceForm;
