import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { BiTrash, BiPlus } from "react-icons/bi";
import EditableField from './EditableField';

class InvoiceItem extends React.Component {
  render() {
    var onItemizedItemEdit = this.props.onItemizedItemEdit;
    var currency = this.props.currency;
    var rowDel = this.props.onRowDel;
    var itemTable = this.props.items.map(function(item) {
      return (
        <ItemRow onItemizedItemEdit={onItemizedItemEdit} item={item} onDelEvent={rowDel.bind(this)} key={item.id} currency={currency}/>
      )
    });
    return (
      <div className="items-container">
        <Table className="items-table">
          <thead>
            <tr>
              <th className="item-col">ITEM</th>
              <th className="qty-col">QTY</th>
              <th className="price-col">PRICE/RATE</th>
              <th className="action-col">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {itemTable}
          </tbody>
        </Table>
        <Button className="add-item-btn mt-3" onClick={this.props.onRowAdd}>
          <BiPlus className="me-2" style={{width: '18px', height: '18px'}}/>
          Add Item
        </Button>
      </div>
    );

  }

}
class ItemRow extends React.Component {
  onDelEvent() {
    this.props.onDelEvent(this.props.item);
  }
  render() {
    return (
      <tr className="item-row">
        <td className="item-cell">
          <div className="item-name-wrapper">
            <EditableField
              onItemizedItemEdit={this.props.onItemizedItemEdit}
              cellData={{
              type: "text",
              name: "name",
              placeholder: "Item name",
              value: this.props.item.name,
              id: this.props.item.id,
            }}/>
          </div>
          <div className="item-desc-wrapper">
            <EditableField
              onItemizedItemEdit={this.props.onItemizedItemEdit}
              cellData={{
              type: "text",
              name: "description",
              placeholder: "Item description",
              value: this.props.item.description,
              id: this.props.item.id
            }}/>
          </div>
        </td>
        <td className="qty-cell">
          <EditableField
          onItemizedItemEdit={this.props.onItemizedItemEdit}
          cellData={{
            type: "number",
            name: "quantity",
            min: 1,
            step: "1",
            value: this.props.item.quantity,
            id: this.props.item.id,
          }}/>
        </td>
        <td className="price-cell">
          <EditableField
            onItemizedItemEdit={this.props.onItemizedItemEdit}
            cellData={{
            leading: this.props.currency,
            type: "number",
            name: "price",
            min: 1,
            step: "0.01",
            presicion: 2,
            textAlign: "text-end",
            value: this.props.item.price,
            id: this.props.item.id,
          }}/>
        </td>
        <td className="action-cell">
          <button onClick={this.onDelEvent.bind(this)} className="delete-btn" type="button">
            <BiTrash style={{width: '18px', height: '18px'}}/>
          </button>
        </td>
      </tr>
    );

  }

}

export default InvoiceItem;
