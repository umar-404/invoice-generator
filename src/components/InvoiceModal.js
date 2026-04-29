import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import { BiPaperPlane, BiCloudDownload } from "react-icons/bi";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf'

function GenerateInvoice() {
  html2canvas(document.querySelector("#invoiceCapture")).then((canvas) => {
    const imgData = canvas.toDataURL('image/png', 1.0);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: [612, 792]
    });
    pdf.internal.scaleFactor = 1;
    const imgProps= pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('invoice-001.pdf');
  });
}

class InvoiceModal extends React.Component {
  render() {
    return(
      <div>
        <Modal show={this.props.showModal} onHide={this.props.closeModal} size="lg" centered className="invoice-modal">
          <div id="invoiceCapture">
            {/* Invoice Header */}
            <div className="invoice-preview">
              <div className="invoice-header-section">
                <div className="invoice-brand">
                  <h2 className="fw-bold mb-0">{this.props.info.billFrom||'Umar Akram'}</h2>
                  <span className="invoice-tag">INVOICE</span>
                </div>
                <div className="invoice-meta">
                  <div className="meta-item">
                    <span className="meta-label">Invoice Number</span>
                    <span className="meta-value">{this.props.info.invoiceNumber||''}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Date</span>
                    <span className="meta-value">{this.props.info.dateOfIssue||''}</span>
                  </div>
                  <div className="meta-item total-due">
                    <span className="meta-label">Amount Due</span>
                    <span className="meta-value fw-bold">{this.props.currency} {this.props.total}</span>
                  </div>
                </div>
              </div>

              {/* Billing Info */}
              <Row className="billing-section">
                <Col md={4}>
                  <div className="billing-box">
                    <span className="billing-label">Billed To</span>
                    <div className="billing-detail">{this.props.info.billTo||''}</div>
                    <div className="billing-detail">{this.props.info.billToAddress||''}</div>
                    <div className="billing-detail email">{this.props.info.billToEmail||''}</div>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="billing-box">
                    <span className="billing-label">Billed From</span>
                    <div className="billing-detail">{this.props.info.billFrom||''}</div>
                    <div className="billing-detail">{this.props.info.billFromAddress||''}</div>
                    <div className="billing-detail email">{this.props.info.billFromEmail||''}</div>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="billing-box">
                    <span className="billing-label">Date Of Issue</span>
                    <div className="billing-detail">{this.props.info.dateOfIssue||''}</div>
                  </div>
                </Col>
              </Row>

              {/* Items Table */}
              <Table className="invoice-table">
                <thead>
                  <tr>
                    <th>QTY</th>
                    <th>DESCRIPTION</th>
                    <th className="text-end">PRICE</th>
                    <th className="text-end">AMOUNT</th>
                  </tr>
                </thead>
                <tbody>
                  {this.props.items.map((item, i) => {
                    return (
                      <tr id={i} key={i}>
                        <td style={{width: '70px'}}>
                          {item.quantity}
                        </td>
                        <td>
                          {item.name} {item.description ? `- ${item.description}` : ''}
                        </td>
                        <td className="text-end" style={{width: '100px'}}>{this.props.currency} {item.price}</td>
                        <td className="text-end" style={{width: '100px'}}>{this.props.currency} {(item.price * item.quantity).toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>

              {/* Totals Section */}
              <div className="totals-section">
                <Table className="totals-table">
                  <tbody>
                    <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr className="subtotal-row">
                      <td></td>
                      <td className="fw-bold text-end">SUBTOTAL</td>
                      <td className="text-end">{this.props.currency} {this.props.subTotal}</td>
                    </tr>
                    {this.props.taxAmmount !== 0.00 &&
                      <tr className="tax-row">
                        <td></td>
                        <td className="fw-bold text-end">TAX</td>
                        <td className="text-end">{this.props.currency} {this.props.taxAmmount}</td>
                      </tr>
                    }
                    {this.props.discountAmmount !== 0.00 &&
                      <tr className="discount-row">
                        <td></td>
                        <td className="fw-bold text-end">DISCOUNT</td>
                        <td className="text-end">-{this.props.currency} {this.props.discountAmmount}</td>
                      </tr>
                    }
                    <tr className="total-row">
                      <td></td>
                      <td className="fw-bold text-end">TOTAL</td>
                      <td className="text-end fw-bold">{this.props.currency} {this.props.total}</td>
                    </tr>
                  </tbody>
                </Table>
              </div>

              {/* Notes */}
              {this.props.info.notes &&
                <div className="notes-section">
                  <span className="notes-label">Notes</span>
                  <p className="notes-text">{this.props.info.notes}</p>
                </div>}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="modal-actions">
            <Row>
              <Col md={6}>
                <Button variant="primary" className="action-btn send-btn" onClick={GenerateInvoice}>
                  <BiPaperPlane className="me-2"/>
                  Send Invoice
                </Button>
              </Col>
              <Col md={6}>
                <Button variant="outline-primary" className="action-btn download-btn" onClick={GenerateInvoice}>
                  <BiCloudDownload className="me-2"/>
                  Download Copy
                </Button>
              </Col>
            </Row>
          </div>
        </Modal>
      </div>
    )
  }
}

export default InvoiceModal;
