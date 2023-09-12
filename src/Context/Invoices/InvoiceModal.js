import React from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table'
import Modal from 'react-bootstrap/Modal'
import { BiPaperPlane, BiCloudDownload } from 'react-icons/bi'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import axios from 'axios'

function GenerateInvoice(name, opt, payload) {
  html2canvas(document.querySelector('#invoiceCapture')).then((canvas) => {
    const imgData = canvas.toDataURL('image/png', 1.0)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: [612, 792],
    })
    pdf.internal.scaleFactor = 1
    const imgProps = pdf.getImageProperties(imgData)
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
    if (opt === 1) {
      const file = new File([pdf.output('blob')], `Invoice - ${name}.pdf`)
      axios
        .get('https://api.rexpresstrucks.com/auth/csrf/', {
          withCredentials: true,
        })
        .then((res) => {
          const _csrfToken = res.data.csrfToken
          const uploadData = new FormData()
          uploadData.append('id_factura', payload)
          uploadData.append('invoice', file)
          fetch('https://api.rexpresstrucks.com/reportes/send_mail/', {
            method: 'POST',
            body: uploadData,
            credentials: 'include',
            headers: { 'X-CSRFToken': _csrfToken },
          })
            .then((res) => {
              if (res.status >= 200 && res.status <= 299) {
                return res.json()
              } else {
                throw Error(res.statusText)
              }
            })
            .then((response) => {
              //console.log('Success:', response)
              alert('Mail sent successfully')
            })
            .catch((err) => {
              /* for (const [key, value] of uploadData) {
                console.log(`${key}: ${value}`)
              } */
              console.log(err)
              //console.log(name)
              alert(`Error sending mail.\n${err}`)
            })
        })
        .catch((err) => {
          console.log(err)
          alert(`Error getting token.\n${err}`)
        })
    } else {
      pdf.save(`Invoice - ${name}.pdf`)
    }
  })
}

class InvoiceModal extends React.Component {
  render() {
    return (
      <div>
        <Modal
          show={this.props.showModal}
          onHide={this.props.closeModal}
          size="lg"
          centered
        >
          <div id="invoiceCapture">
            <div className="d-flex flex-row justify-content-between align-items-start bg-light w-100 p-4">
              <div className="w-100">
                <h4 className="fw-bold my-2">Rodriguez Express, LLC</h4>
                <h6 className="fw-bold text-secondary mb-1">
                  Invoice #: {this.props.num_invoice || ''}
                </h6>
              </div>
              <div className="text-end ms-4">
                <h6 className="fw-bold mt-1 mb-2">Amount&nbsp;Due:</h6>
                <h5 className="fw-bold text-secondary">
                  {' '}
                  $ {this.props.total}
                </h5>
              </div>
            </div>
            <div className="p-4">
              <Row className="mb-4">
                <Col md={4}>
                  <div className="fw-bold">Bill to:</div>
                  <div>{this.props.customName || ''}</div>
                  <div>{this.props.custom.direccion || ''}</div>
                  <div>{this.props.custom.email || ''}</div>
                </Col>
                <Col md={4}>
                  <div className="fw-bold">Bill From:</div>
                  <div>Rodriguez Express, LLC</div>
                  <div>8515 SW 102 PLACE, MIAMI, FL 33173 US</div>
                  <div>rodriguezexpressllc@gmail.com</div>
                </Col>
                <Col md={4}>
                  <div className="fw-bold mt-2">Service Date:</div>
                  <div>{this.props.fecha_servicio || ''}</div>
                  <div className="fw-bold mt-2">Creation Date:</div>
                  <div>{this.props.fecha_factura || ''}</div>
                </Col>
              </Row>
              <Table className="mb-0">
                <thead>
                  <tr>
                    <th>QTY</th>
                    <th>ACTIVITY</th>
                    <th className="text-end">RATE</th>
                    <th className="text-end">AMOUNT</th>
                  </tr>
                </thead>
                <tbody>
                  {this.props.items.map((item, i) => {
                    return (
                      <tr id={i} key={i}>
                        <td style={{ width: '70px' }}>{item.cantidad}</td>
                        <td>{item.tipo_actividad}</td>
                        <td className="text-end" style={{ width: '100px' }}>
                          $ {item.rate}
                        </td>
                        <td className="text-end" style={{ width: '100px' }}>
                          $ {item.amount}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </Table>
              <Table>
                <tbody>
                  <tr>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                  </tr>
                  <tr className="text-end">
                    <td></td>
                    <td className="fw-bold" style={{ width: '100px' }}>
                      TOTAL
                    </td>
                    <td className="text-end" style={{ width: '100px' }}>
                      $ {this.props.total}
                    </td>
                  </tr>
                  {/* {this.props.taxAmmount != 0.0 && (
                    <tr className="text-end">
                      <td></td>
                      <td className="fw-bold" style={{ width: '100px' }}>
                        TAX
                      </td>
                      <td className="text-end" style={{ width: '100px' }}>
                        {this.props.currency} {this.props.taxAmmount}
                      </td>
                    </tr>
                  )}
                  {this.props.discountAmmount != 0.0 && (
                    <tr className="text-end">
                      <td></td>
                      <td className="fw-bold" style={{ width: '100px' }}>
                        DISCOUNT
                      </td>
                      <td className="text-end" style={{ width: '100px' }}>
                        {this.props.currency} {this.props.discountAmmount}
                      </td>
                    </tr>
                  )} */}
                  {/* <tr className="text-end">
                    <td></td>
                    <td className="fw-bold" style={{ width: '100px' }}>
                      TOTAL
                    </td>
                    <td className="text-end" style={{ width: '100px' }}>
                      $ {this.props.total}
                    </td>
                  </tr> */}
                </tbody>
              </Table>
              {/* {this.props.info.notes && (
                <div className="bg-light py-3 px-4 rounded">
                  {this.props.info.notes}
                </div>
              )} */}
            </div>
            <div className="pb-4 px-4">
              <label>
                Thank you for your business. Please submit via Direct Deposit,
                Check or EFS Check. For billing information please contact us.
              </label>
            </div>
          </div>
          <div className="pb-4 px-4">
            <Row>
              <Col md={6}>
                <Button
                  variant="primary"
                  className="d-block w-100"
                  onClick={() =>
                    GenerateInvoice(
                      this.props.num_invoice.toString(),
                      1,
                      this.props.id_invoice
                    )
                  }
                >
                  <BiPaperPlane
                    style={{ width: '15px', height: '15px', marginTop: '-3px' }}
                    className="me-2"
                  />
                  Send Invoice
                </Button>
              </Col>
              <Col md={6}>
                <Button
                  variant="outline-primary"
                  className="d-block w-100 mt-3 mt-md-0"
                  onClick={() =>
                    GenerateInvoice(this.props.num_invoice.toString(), 2, '')
                  }
                >
                  <BiCloudDownload
                    style={{ width: '16px', height: '16px', marginTop: '-3px' }}
                    className="me-2"
                  />
                  Download Copy
                </Button>
              </Col>
            </Row>
          </div>
        </Modal>
        <hr className="mt-4 mb-3" />
      </div>
    )
  }
}

export default InvoiceModal
