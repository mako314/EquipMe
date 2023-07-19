import React from 'react'
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

function EquipmentDisplay(){
    const [oneEquipment, SetOneEquipment] = useState([])
    const { model, name, make, location, email, phone} = oneEquipment

    const { id } = useParams()
    const navigate = useNavigate()
    
    useEffect(() => {
        fetch(`http://127.0.0.1:5555/equipment/${id}`)
          .then((resp) => resp.json())
          .then((data) => {
            SetOneEquipment(data)
          })
      }, [])

      console.log(oneEquipment)



    return(
        <div>
           <div className="card__title">Product Model: {model}</div>
                <p className="card__text">Name: {name}</p>
                <p className="card__text">Manufacturer: {make}</p>
                <p className="card__text">Available Locations: {location}</p>
                <p className="card__text">Email: {email}</p>
                <p className="card__text">Phone: {phone}</p>
        </div>
    )
}


export default EquipmentDisplay;