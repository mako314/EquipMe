import React from 'react'
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

function OwnerDisplay() {
  const [owner, setOwner] = useState([])
  const { name, location, email, phone, equipment } = owner

  const { id } = useParams()
  // const navigate = useNavigate()

  useEffect(() => {
    fetch(`/equipment_owner/${id}`)
      .then((resp) => resp.json())
      .then((data) => {
        setOwner(data)
      })
  }, [])

  const equipmentNames = equipment?.map((equipment) => {
    return equipment.name + " " + equipment.make + " " + equipment.model
  })

  // console.log(equipmentNames)



  return (
    <div>
      <div className="card__title">Product Model: {name}</div>
      <p className="card__text">Available Locations: {location}</p>
      <p className="card__text">Email: {email}</p>
      <p className="card__text">Phone: {phone}</p>
      <p className="card__text">Owned Equipment: {equipmentNames}</p>

    </div>
  )
}


export default OwnerDisplay;