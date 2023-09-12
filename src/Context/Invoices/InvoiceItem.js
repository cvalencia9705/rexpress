import { useState } from 'react'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'

const ItemRow = ({ onDelete, onChange, item, index }) => {
  const history = useHistory()

  const [tipo, setTipo] = useState('')
  const [cant, setCant] = useState('')
  const [rate, setRate] = useState('')

  return (
    <>
      <input
        type="text"
        className="form-control"
        value={item.tipo_actividad}
        placeholder="Activity"
        style={{ marginBottom: '8px' }}
        readOnly={
          history.location.pathname.includes('editInvoice') ? true : false
        }
        onChange={(e) => {
          onChange(index, 'tipo_actividad', e.target.value)
          setTipo(e.target.value)
        }}
        required
      />
      <input
        type="number"
        className="form-control"
        value={item.cantidad}
        placeholder="Qty"
        style={{ marginBottom: '8px' }}
        readOnly={
          history.location.pathname.includes('editInvoice') ? true : false
        }
        onChange={(e) => {
          onChange(index, 'cantidad', e.target.value)
          setCant(e.target.value)
        }}
        required
      />
      <input
        type="number"
        className="form-control"
        value={item.rate}
        placeholder="Price"
        style={{ marginBottom: '8px' }}
        readOnly={
          history.location.pathname.includes('editInvoice') ? true : false
        }
        onChange={(e) => {
          onChange(index, 'rate', e.target.value)
          setRate(e.target.value)
        }}
        required
      />
      {history.location.pathname.includes('CreateInvoice') ? (
        <button
          type="button"
          className="btn btn-danger"
          onClick={() => onDelete(index)}
          style={{
            marginBottom: '8px',
            fontSize: '0.82rem',
          }}
        >
          Delete Service
        </button>
      ) : null}
      <hr className="" />
    </>
  )
}

export default ItemRow
