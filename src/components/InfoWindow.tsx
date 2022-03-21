const InfoWindow = ({ roadAddress, address }) => {
  return (
    <div>
      <div>{`도로명주소: ${roadAddress}`}</div>
      <div>{`지번 주소: ${address}`}</div>
    </div>
  )
}

export default InfoWindow
