import axios from "axios"
import { useState, useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setAddressList, selectedAddress } from "../redux/maps"
import Map from "./components/Map"

function App() {
  const dispatch = useDispatch()
  const [userDeliveryData, setUserDeliveryData] = useState({})
  const [location, setLocation] = useState({ lat: 0, lng: 0 })
  const [address, setAddress] = useState("전북 삼성동 100")
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setUserDeliveryData({
      ...userDeliveryData,
      [name]: value,
    })
  }
  const request = async () => {
    const response = await axios.get(
      "https://dapi.kakao.com/v2/local/search/address.json",
      {
        params: { query: address },

        headers: {
          Authorization: `KakaoAK ${import.meta.env.VITE_REST_API_KEY}`,
        },
      }
    )
    // 주소 리스트를 보여주고 그 리스트 중에서 클릭하면 하단 맵을 실행시켜서 보여주는거구나...
    if (response.status === 200) {
      dispatch(setAddressList(response.data.documents))
      // geocoder.addressSearch(address, (res, status) => {
      //   console.log(res)
      //   if (status === kakao.maps.services.Status.OK) {
      //     showDetailAddrFromCoords(res, null)
      //   }
      // })
    }
  }

  return (
    <>
      <div className="user-info-container" onChange={handleInputChange}>
        별칭:
        <input type="text" name="nickName" />
        <br />
        주소:
        {/* 주소 입력받을 때 주소를 유저에게 보여주며 입력받음 맞는 주소 선택시
      지도에 해당 좌표를 찍고 확인
      지도에서 해당 좌표의 주소를 유저에게 보여주면서 입력받는다는건 지도에서 선택하면 주소를 보여준다는 의미인듯
    */}
        <input type="text" name="address" />
        <br />
        상세주소:
        <input
          // onChange={(e) => setAddress(e.target.value)}
          type="text"
          name="addressDetail"
        />
        <br />
        배송시 유의사항:
        <input type="text" name="deliveryMessage" />
        <br />
        {/* 저장을 누르면 local storage에 저장하도록 편집은?
      이미 데이터가 있으면 input 창은 disabled되고 연필 svg가 나타남
      연필 svg를 누르면 해당 svg는 사라지고 disabled는 false로 바뀜
      저장은 하단의 저장버튼을 동일하게 누름
    */}
        <button onClick={request}>저장</button>
        <Map />
      </div>
    </>
  )
}

export default App
